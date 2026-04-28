using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.DTOs.Category
{
    public class CategoryResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public TransactionType Type { get; set; }
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public string? Color { get; set; }
    }
}