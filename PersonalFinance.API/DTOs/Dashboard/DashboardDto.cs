namespace PersonalFinance.API.DTOs.Dashboard
{
    public class DashboardDto
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal NetBalance { get; set; }
        public int PendingTransactionsCount { get; set; }
        public IEnumerable<CategorySpending> TopSpendingCategories { get; set; } = new List<CategorySpending>();
        public BudgetUtilizationSummary BudgetSummary { get; set; } = new BudgetUtilizationSummary();
    }

    public class CategorySpending
    {
        public string CategoryName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
    }

    public class BudgetUtilizationSummary
    {
        public int OverBudget { get; set; }
        public int NearBudget { get; set; }
        public int UnderBudget { get; set; }
    }
}