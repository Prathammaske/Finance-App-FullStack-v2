using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace PersonalFinance.API.Models
{
    public enum TransactionType { Income, Expense }
    public enum TransactionStatus { Cleared, Pending }

    public class Transaction
    {
        public int Id { get; set; }

        [Required]
        public TransactionType Type { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")] 
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(100)]
        public string? Title { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public TransactionStatus Status { get; set; }

        //  Relationships 

        // Link to the user who owns this transaction
        public string? UserId { get; set; }
        public ApplicationUser? User { get; set; }

        // Link to a Category
        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        // Link to an Account
        public int AccountId { get; set; }
        public Account? Account { get; set; }
    }
}
