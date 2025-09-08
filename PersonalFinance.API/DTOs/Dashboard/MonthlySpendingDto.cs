namespace PersonalFinance.API.DTOs.Dashboard
{
    public class MonthlySpendingDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal TotalAmount { get; set; }
    }
}