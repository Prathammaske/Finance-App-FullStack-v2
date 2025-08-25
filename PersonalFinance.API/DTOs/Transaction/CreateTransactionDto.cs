using PersonalFinance.API.Models;
using System.ComponentModel.DataAnnotations;

namespace PersonalFinance.API.DTOs.Transaction
{
    public class CreateTransactionDto
    {
        [Required]
        public TransactionType Type { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0.")]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public TransactionStatus Status { get; set; }

        // We receive the IDs from the client
        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int AccountId { get; set; }
    }
}