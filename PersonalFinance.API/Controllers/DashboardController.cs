using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalFinance.API.Data;
using PersonalFinance.API.DTOs.Dashboard;
using PersonalFinance.API.Extensions; // <-- Import our extension methods
using PersonalFinance.API.Models;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboardSummary([FromQuery] int? month, [FromQuery] int? year)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var queryDate = (month.HasValue && year.HasValue)
            ? new DateTime(year.Value, month.Value, 1)
            : DateTime.UtcNow;

        var startDate = queryDate.StartOfMonth();
        var endDate = queryDate.EndOfMonth();

        // 1. Basic Stats
        var totalIncome = await _context.Transactions
            .Where(t => t.UserId == userId && t.Date >= startDate && t.Date <= endDate && t.Type == TransactionType.Income && t.Status == TransactionStatus.Cleared)
            .SumAsync(t => t.Amount);

        var totalExpenses = await _context.Transactions
            .Where(t => t.UserId == userId && t.Date >= startDate && t.Date <= endDate && t.Type == TransactionType.Expense && t.Status == TransactionStatus.Cleared)
            .SumAsync(t => t.Amount);

        var pendingCount = await _context.Transactions
            .CountAsync(t => t.UserId == userId && t.Status == TransactionStatus.Pending);

        // 2. Top 5 Spending Categories
        var topSpendingCategories = await _context.Transactions
            .Where(t => t.UserId == userId && t.Date >= startDate && t.Date <= endDate && t.Type == TransactionType.Expense && t.Status == TransactionStatus.Cleared)
            .Include(t => t.Category)
            .GroupBy(t => t.Category!.Name)
            .Select(g => new CategorySpending
            {
                CategoryName = g.Key,
                TotalAmount = g.Sum(t => t.Amount)
            })
            .OrderByDescending(s => s.TotalAmount)
            .Take(5)
            .ToListAsync();

        // 3. Budget Utilization
        var budgets = await _context.Budgets
            .Where(b => b.UserId == userId && b.Year == startDate.Year && b.Month == startDate.Month)
            .ToListAsync();

        var expensesByCategory = (await _context.Transactions
            .Where(t => t.UserId == userId && t.Date >= startDate && t.Date <= endDate && t.Type == TransactionType.Expense && t.Status == TransactionStatus.Cleared)
            .GroupBy(t => t.CategoryId)
            .Select(g => new { CategoryId = g.Key, TotalSpent = g.Sum(t => t.Amount) })
            .ToListAsync()).ToDictionary(x => x.CategoryId, x => x.TotalSpent);

        var budgetSummary = new BudgetUtilizationSummary();
        foreach (var budget in budgets)
        {
            decimal spent = expensesByCategory.GetValueOrDefault(budget.CategoryId, 0m);
            if (spent > budget.Amount) budgetSummary.OverBudget++;
            else if (spent >= budget.Amount * 0.8m) budgetSummary.NearBudget++;
            else budgetSummary.UnderBudget++;
        }

        // 4. Assemble the DTO
        var dashboardDto = new DashboardDto
        {
            TotalIncome = totalIncome,
            TotalExpenses = totalExpenses,
            NetBalance = totalIncome - totalExpenses,
            PendingTransactionsCount = pendingCount,
            TopSpendingCategories = topSpendingCategories,
            BudgetSummary = budgetSummary
        };

        return Ok(dashboardDto);
    }
}