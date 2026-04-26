using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.DTOs.Expense
{
    public class ExpenseDto
    {
        public int Id { get; set; }
        public PaymentMethod Method { get; set; }
        public string? Reason { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
}