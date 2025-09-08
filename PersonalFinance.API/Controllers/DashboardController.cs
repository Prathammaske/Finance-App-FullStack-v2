using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalFinance.API.Data;
using PersonalFinance.API.DTOs.Dashboard;
using PersonalFinance.API.Extensions; 
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
            .Where(t => t.Category != null)
            .GroupBy(t => t.Category!.Name)
            .Select(g => new CategorySpending
            {
                CategoryName = g.Key,
                TotalAmount = g.Sum(t => t.Amount)
            })
            .OrderByDescending(s => s.TotalAmount)
            .Take(5)
            .ToListAsync();

        
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
    [HttpGet("spending-trend")]
    public async Task<IActionResult> GetSpendingTrend()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // Define the date range: from the start of 5 months ago to the end of this month
        var sixMonthsAgo = DateTime.UtcNow.AddMonths(-5).StartOfMonth();
        var thisMonthEnd = DateTime.UtcNow.EndOfMonth();

        // Perform the LINQ query to group and sum expenses by month
        var spendingTrend = await _context.Transactions
            .Where(t =>
                t.UserId == userId &&
                t.Type == TransactionType.Expense &&
                t.Status == TransactionStatus.Cleared &&
                t.Date >= sixMonthsAgo &&
                t.Date <= thisMonthEnd)
            .GroupBy(t => new { t.Date.Year, t.Date.Month }) // Group by both year and month
            .Select(g => new MonthlySpendingDto
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                TotalAmount = g.Sum(t => t.Amount)
            })
            .OrderBy(s => s.Year)
            .ThenBy(s => s.Month)
            .ToListAsync();

        return Ok(spendingTrend);
    }
}