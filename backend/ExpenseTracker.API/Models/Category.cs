using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public TransactionType Type { get; set; } 
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public string? Color { get; set; }

        // Navigation properties
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
        public ICollection<Income> Incomes { get; set; } = new List<Income>();
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
    }
}