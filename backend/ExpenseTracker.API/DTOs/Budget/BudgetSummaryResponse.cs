namespace ExpenseTracker.API.DTOs.Budget
{
    public class BudgetSummaryResponse
    {
        public string Month { get; set; } = string.Empty;
        public decimal TotalAllocated { get; set; }
        public decimal TotalSpent { get; set; }
        public decimal TotalRemaining { get; set; }
        public int CategoryCount { get; set; }
        public IEnumerable<BudgetResponse> Budgets { get; set; } = new List<BudgetResponse>();
    }
}