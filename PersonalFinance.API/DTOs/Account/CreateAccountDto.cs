using System.ComponentModel.DataAnnotations;

namespace PersonalFinance.API.DTOs.Account
{
    public class CreateAccountDto
    {
        [Required]
        [MaxLength(50, ErrorMessage = "Name cannot be over 50 characters")]
        public string Name { get; set; } = string.Empty;
    }
}