using System.ComponentModel.DataAnnotations;
using System.Transactions;

namespace PersonalFinance.API.Models
{
    public class Category
    {
        public int Id { get; set; } //Primary Key

        [Required]
        [MaxLength(50)]
        public string? Name { get; set; }

        public string? UserId {get; set; } //Foreign key to application user

        public ApplicationUser? User { get; set; }

        public ICollection<Transaction>? Transactions { get; set; } // category can have many transactions one-to-many relationship
    }
}
