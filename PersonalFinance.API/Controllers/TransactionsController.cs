using AutoMapper; // <-- Add this
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // <-- Add this
using PersonalFinance.API.Data;
using PersonalFinance.API.DTOs.Transaction;
using PersonalFinance.API.Models;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper; // <-- Inject IMapper

    public TransactionsController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        IMapper mapper) // <-- Add IMapper to constructor
    {
        _context = context;
        _userManager = userManager;
        _mapper = mapper;
    }

    // GET: api/transactions
    [HttpGet]
    public async Task<IActionResult> GetTransactions()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // This is our most complex query yet
        var transactionsFromDb = await _context.Transactions
            .Include(t => t.Category) // <-- Eager Loading (EF Core Join)
            .Include(t => t.Account)  // <-- Eager Loading (EF Core Join)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date) // Show newest first
            .ToListAsync();

        // Use AutoMapper to convert the list of database models to a list of DTOs
        var transactionsDto = _mapper.Map<IEnumerable<TransactionDto>>(transactionsFromDb);

        return Ok(transactionsDto);
    }

    // GET: api/transactions/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTransactionById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var transactionFromDb = await _context.Transactions
            .Include(t => t.Category)
            .Include(t => t.Account)
            // Securely find by Id AND UserId
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transactionFromDb == null)
        {
            return NotFound();
        }

        var transactionDto = _mapper.Map<TransactionDto>(transactionFromDb);

        return Ok(transactionDto);
    }
    [HttpPost]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionDto transactionDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // --- Crucial Validation Step ---
        // Check if the provided Category and Account exist AND belong to the user
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == transactionDto.CategoryId && c.UserId == userId);
        var accountExists = await _context.Accounts.AnyAsync(a => a.Id == transactionDto.AccountId && a.UserId == userId);

        if (!categoryExists || !accountExists)
        {
            return BadRequest("Invalid Category or Account ID.");
        }
        // --- End Validation ---

        var transaction = new Transaction
        {
            Type = transactionDto.Type,
            Amount = transactionDto.Amount,
            Title = transactionDto.Title,
            Description = transactionDto.Description,
            Date = transactionDto.Date.ToUniversalTime(),
            Status = transactionDto.Status,
            CategoryId = transactionDto.CategoryId,
            AccountId = transactionDto.AccountId,
            UserId = userId
        };

        await _context.Transactions.AddAsync(transaction);
        await _context.SaveChangesAsync();

        // We can't use AutoMapper here easily because the created object doesn't have Category/Account loaded.
        // The simplest way is to return the result of the GetTransactionById endpoint.
        return CreatedAtAction(nameof(GetTransactionById), new { id = transaction.Id }, transaction);
    }

    // PUT: api/transactions/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTransaction(int id, [FromBody] CreateTransactionDto transactionDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transaction == null)
        {
            return NotFound();
        }

        // --- Re-validate Category and Account ownership ---
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == transactionDto.CategoryId && c.UserId == userId);
        var accountExists = await _context.Accounts.AnyAsync(a => a.Id == transactionDto.AccountId && a.UserId == userId);

        if (!categoryExists || !accountExists)
        {
            return BadRequest("Invalid Category or Account ID.");
        }
        // --- End Validation ---

        // Update properties
        transaction.Type = transactionDto.Type;
        transaction.Amount = transactionDto.Amount;
        transaction.Title = transactionDto.Title;
        transaction.Description = transactionDto.Description;
        transaction.Date = transactionDto.Date.ToUniversalTime();
        transaction.Status = transactionDto.Status;
        transaction.CategoryId = transactionDto.CategoryId;
        transaction.AccountId = transactionDto.AccountId;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/transactions/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transaction == null)
        {
            return NotFound();
        }

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}