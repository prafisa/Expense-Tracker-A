using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.DTOs.Income
{
    public class IncomeResponse
    {
        public int Id { get; set; }
        public PaymentMethod Method { get; set; } 
        public string? Source { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string CategoryIcon { get; set; } = string.Empty;
        public string CategoryColor { get; set; } = string.Empty;
    }
}
