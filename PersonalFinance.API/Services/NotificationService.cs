using Microsoft.EntityFrameworkCore;
using PersonalFinance.API.Data;
using PersonalFinance.API.Extensions; // For our StartOfMonth/EndOfMonth helpers
using PersonalFinance.API.Models;

namespace PersonalFinance.API.Services
{
    public class NotificationService
    {
        private readonly ApplicationDbContext _context;

        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Method to check for upcoming bills
        public async Task<List<string>> CheckUpcomingBills(string userId)
        {
            var notifications = new List<string>();
            var today = DateTime.UtcNow;
            var sevenDaysFromNow = today.AddDays(7);

            var upcomingBills = await _context.Transactions
                .Where(t =>
                    t.UserId == userId &&
                    t.Status == TransactionStatus.Pending &&
                    t.Date >= today &&
                    t.Date <= sevenDaysFromNow)
                .ToListAsync();

            foreach (var bill in upcomingBills)
            {
                var message = $"REMINDER: Upcoming bill '{bill.Title}' of {bill.Amount:C} is due on {bill.Date:yyyy-MM-dd}.";
                Console.WriteLine(message); // Log to console
                notifications.Add(message);
            }
            return notifications;
        }

        // Method to check budget thresholds
        public async Task<List<string>> CheckBudgetThresholds(string userId)
        {
            var notifications = new List<string>();
            var startDate = DateTime.UtcNow.StartOfMonth();
            var endDate = DateTime.UtcNow.EndOfMonth();

            var budgets = await _context.Budgets
                .Include(b => b.Category) // We need the category name
                .Where(b => b.UserId == userId && b.Year == startDate.Year && b.Month == startDate.Month)
                .ToListAsync();

            var expensesByCategory = (await _context.Transactions
                .Where(t => t.UserId == userId && t.Date >= startDate && t.Date <= endDate && t.Type == TransactionType.Expense && t.Status == TransactionStatus.Cleared)
                .GroupBy(t => t.CategoryId)
                .Select(g => new { CategoryId = g.Key, TotalSpent = g.Sum(t => t.Amount) })
                .ToListAsync()).ToDictionary(x => x.CategoryId, x => x.TotalSpent);

            foreach (var budget in budgets)
            {
                decimal spent = expensesByCategory.GetValueOrDefault(budget.CategoryId, 0m);
                string? alertMessage = null;

                if (spent > budget.Amount)
                {
                    alertMessage = $"ALERT: You are OVER budget for '{budget.Category!.Name}'. Spent {spent:C} of {budget.Amount:C}.";
                }
                else if (spent >= budget.Amount * 0.8m)
                {
                    alertMessage = $"WARNING: You are NEAR budget for '{budget.Category!.Name}'. Spent {spent:C} of {budget.Amount:C}.";
                }

                if (alertMessage != null)
                {
                    Console.WriteLine(alertMessage); // Log to console
                    notifications.Add(alertMessage);
                }
            }
            return notifications;
        }
    }
}