using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.Models
{
    public class Expense
    {
        public int Id { get; set; }
        public PaymentMethod Method { get; set; }
        public string? Reason { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }

        // Foreign key
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
    }
}