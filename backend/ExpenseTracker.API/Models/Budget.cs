namespace ExpenseTracker.API.Models
{
    public class Budget
    {
        public int Id { get; set; }
        public decimal Allocated { get; set; }
        public string Month { get; set; } = string.Empty; 

        // Foreign key
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
    }
}