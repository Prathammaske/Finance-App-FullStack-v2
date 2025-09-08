using AutoMapper; 
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using PersonalFinance.API.Data;
using PersonalFinance.API.DTOs.Transaction;
using PersonalFinance.API.Models;
using System.Security.Claims;
namespace PersonalFinance.API.Controllers;

using CsvHelper;
using System.Formats.Asn1;
using System.Globalization;
using System.IO;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper; 

    public TransactionsController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        IMapper mapper) 
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

        
        var transactionsFromDb = await _context.Transactions
            .Include(t => t.Category) 
            .Include(t => t.Account)  
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date)
            .ToListAsync();

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
            // find by Id AND UserId
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

       
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == transactionDto.CategoryId && c.UserId == userId);
        var accountExists = await _context.Accounts.AnyAsync(a => a.Id == transactionDto.AccountId && a.UserId == userId);

        if (!categoryExists || !accountExists)
        {
            return BadRequest("Invalid Category or Account ID.");
        }
        

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

        
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == transactionDto.CategoryId && c.UserId == userId);
        var accountExists = await _context.Accounts.AnyAsync(a => a.Id == transactionDto.AccountId && a.UserId == userId);

        if (!categoryExists || !accountExists)
        {
            return BadRequest("Invalid Category or Account ID.");
        }
       

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
    [HttpGet("export")]
    public async Task<IActionResult> ExportTransactions()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var transactionsFromDb = await _context.Transactions
            .Include(t => t.Category)
            .Include(t => t.Account)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date)
            .ToListAsync();

        var records = _mapper.Map<List<TransactionCsvDto>>(transactionsFromDb);

        using (var memoryStream = new MemoryStream())
        using (var writer = new StreamWriter(memoryStream))
        using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
        {
            csv.WriteRecords(records);
            writer.Flush();
            memoryStream.Position = 0;

            return File(memoryStream.ToArray(), "text/csv", $"Transactions_{DateTime.UtcNow:yyyyMMdd}.csv");
        }
    }
}