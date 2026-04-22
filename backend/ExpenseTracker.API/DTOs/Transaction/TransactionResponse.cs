namespace ExpenseTracker.API.DTOs.Transaction
{
    public class TransactionResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string? Reason { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
}