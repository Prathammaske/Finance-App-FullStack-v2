using System.ComponentModel.DataAnnotations;
using System.Transactions;

namespace PersonalFinance.API.Models
{
    public class Account
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public string? UserId { get; set; } // Foreign Key to the ApplicationUser

        public ApplicationUser? User { get; set; }// Navigation property

        public ICollection<Transaction>? Transactions { get; set; } //  An account can have many transactions
    }
}
