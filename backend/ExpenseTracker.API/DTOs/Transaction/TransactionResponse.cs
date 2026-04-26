using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.DTOs.Transaction
{
    public class TransactionResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public TransactionType Type { get; set; }
        public PaymentMethod Method { get; set; }
        public string? Source { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }
}



// DTOs/Transaction/TransactionResponse.cs
//using ExpenseTracker.API.Enums;

//namespace ExpenseTracker.API.DTOs.Transaction
//{
//    public class TransactionResponse
//    {
//        public int Id { get; set; }
//        public string Name { get; set; } = string.Empty;
//        public TransactionType Type { get; set; }       // "Income" | "Expense"
//        public PaymentMethod Method { get; set; }
//        public string? Source { get; set; }
//        public decimal Amount { get; set; }
//        public DateTime Date { get; set; }
//        public string Category { get; set; } = string.Empty;
//        public int CategoryId { get; set; }
//    }
//}


