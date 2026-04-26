using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.API.DTOs.Category
{
    public class UpdateCategoryRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Description { get; set; }

        [MaxLength(100)]
        public string? Icon { get; set; }

        [MaxLength(20)]
        public string? Color { get; set; }
    }
}