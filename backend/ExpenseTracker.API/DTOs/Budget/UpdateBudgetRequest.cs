using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.API.DTOs.Budget
{
    public class UpdateBudgetRequest
    {
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Allocated must be greater than 0")]
        public decimal Allocated { get; set; }

        [Required]
        [RegularExpression(@"^\d{4}-\d{2}$", ErrorMessage = "Month must be in format YYYY-MM")]
        public string Month { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }
    }
}