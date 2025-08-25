using System.ComponentModel.DataAnnotations;

namespace PersonalFinance.API.DTOs.Category
{
    public class CreateCategoryDto
    {
        [Required]
        [MaxLength(50, ErrorMessage = "Name cannot be over 50 characters")]
        public string Name { get; set; } = string.Empty;
    }
}