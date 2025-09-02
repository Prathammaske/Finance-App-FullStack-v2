using PersonalFinance.API.Models;

namespace PersonalFinance.API.DTOs.Transaction
{
    public class TransactionDto
    {
        public int Id { get; set; }
        public TransactionType Type { get; set; }
        public decimal Amount { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime Date { get; set; }
        public TransactionStatus Status { get; set; }

        
        public string CategoryName { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;

        public int CategoryId { get; set; }
        public int AccountId { get; set; }
    }
}