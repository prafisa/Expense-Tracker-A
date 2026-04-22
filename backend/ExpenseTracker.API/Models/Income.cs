using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.Models
{
    public class Income
    {
        public int Id { get; set; }
        public PaymentSource Source { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }

        // Foreign key
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
    }
}