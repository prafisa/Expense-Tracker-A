// CreateCategoryRequest.cs
using System.ComponentModel.DataAnnotations;
using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.DTOs.Category
{
    public class CreateCategoryRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public TransactionType Type { get; set; }      // ← was string

        [MaxLength(255)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(100)]
        public string? Icon { get; set; }

        [MaxLength(20)]
        public string? Color { get; set; }
    }
}