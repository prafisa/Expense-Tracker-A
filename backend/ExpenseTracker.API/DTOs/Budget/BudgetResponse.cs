namespace ExpenseTracker.API.DTOs.Budget
{
    public class BudgetResponse
    {
        public int Id { get; set; }
        public decimal Allocated { get; set; }
        public decimal Spent { get; set; }
        public decimal Remaining { get; set; }
        public string Month { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
}