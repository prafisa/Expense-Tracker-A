using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public TransactionType Type { get; set; }
        public PaymentSource Source { get; set; }
        public string? Reason { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }

        // Foreign key
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
    }
}