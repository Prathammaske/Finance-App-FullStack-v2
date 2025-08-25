using System.ComponentModel.DataAnnotations;

namespace PersonalFinance.API.DTOs.Budget
{
    public class CreateBudgetDto
    {
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        [Range(1, 12)]
        public int Month { get; set; }

        [Required]
        [Range(2000, 2100)]
        public int Year { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}