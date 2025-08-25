using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalFinance.API.Data;
using PersonalFinance.API.DTOs.Budget;
using PersonalFinance.API.Models;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class BudgetsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;

    public BudgetsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IMapper mapper)
    {
        _context = context;
        _userManager = userManager;
        _mapper = mapper;
    }

    // GET: api/budgets
    [HttpGet]
    public async Task<IActionResult> GetBudgets([FromQuery] int? month, [FromQuery] int? year) // Query Filtering
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // Start building the query
        var query = _context.Budgets
            .Include(b => b.Category) // Join with Category to get the name
            .Where(b => b.UserId == userId);

        // Optional filtering by month and year
        if (month.HasValue)
        {
            query = query.Where(b => b.Month == month.Value);
        }
        if (year.HasValue)
        {
            query = query.Where(b => b.Year == year.Value);
        }

        var budgets = await query.ToListAsync();

        var budgetsDto = _mapper.Map<IEnumerable<BudgetDto>>(budgets);
        return Ok(budgetsDto);
    }

    // POST: api/budgets
    [HttpPost]
    public async Task<IActionResult> CreateBudget([FromBody] CreateBudgetDto budgetDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // Validation 1: Check if the category exists and belongs to the user
        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == budgetDto.CategoryId && c.UserId == userId);
        if (!categoryExists)
        {
            return BadRequest("Invalid Category ID.");
        }

        // Validation 2: Check for duplicate budget (same user, category, month, year)
        var budgetExists = await _context.Budgets.AnyAsync(b =>
            b.UserId == userId &&
            b.CategoryId == budgetDto.CategoryId &&
            b.Month == budgetDto.Month &&
            b.Year == budgetDto.Year);
        if (budgetExists)
        {
            return BadRequest("A budget for this category already exists for the selected month and year.");
        }

        var budget = new Budget
        {
            Amount = budgetDto.Amount,
            Month = budgetDto.Month,
            Year = budgetDto.Year,
            CategoryId = budgetDto.CategoryId,
            UserId = userId
        };

        await _context.Budgets.AddAsync(budget);
        await _context.SaveChangesAsync();

        // Load the related category to return the full DTO
        await _context.Entry(budget).Reference(b => b.Category).LoadAsync();
        var budgetToReturn = _mapper.Map<BudgetDto>(budget);

        return CreatedAtAction(nameof(GetBudgets), new { id = budget.Id }, budgetToReturn);
    }

    // PUT: api/budgets/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBudget(int id, [FromBody] CreateBudgetDto budgetDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var budget = await _context.Budgets
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

        if (budget == null)
        {
            return NotFound();
        }

        // You might want to prevent changing the Category/Month/Year of a budget.
        // For simplicity here, we'll just update the amount.
        // If they could be changed, you'd need the same duplicate check as in the Create method.
        budget.Amount = budgetDto.Amount;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/budgets/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBudget(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var budget = await _context.Budgets
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

        if (budget == null)
        {
            return NotFound();
        }

        _context.Budgets.Remove(budget);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}