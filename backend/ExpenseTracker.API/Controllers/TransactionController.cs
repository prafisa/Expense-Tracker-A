using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs.Transaction;
using ExpenseTracker.API.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/transaction
        [HttpGet]
        public async Task<IActionResult> GetAll(
            DateOnly? from,
            DateOnly? to,
            TransactionType? type,
            int? categoryId,
            string? search)
        {
            // 1. Load income + expense separately
            var expenses = await _context.Expenses
                .Include(e => e.Category)
                .ToListAsync();

            var incomes = await _context.Incomes
                .Include(i => i.Category)
                .ToListAsync();

            // 2. Convert to common DTO
            var expenseTransactions = expenses.Select(e => new TransactionResponse
            {
                Id = e.Id,
                Name = e.Reason ?? "Expense",
                Type = TransactionType.EXPENSE,
                Method = e.Method,
                Source = e.Reason,
                Amount = e.Amount,
                Date = e.Date,
                CategoryId = e.CategoryId,
                CategoryName = e.Category.Name
            });

            var incomeTransactions = incomes.Select(i => new TransactionResponse
            {
                Id = i.Id,
                Name = i.Source ?? "Income",
                Type = TransactionType.INCOME,
                Method = i.Method,
                Source = i.Source,
                Amount = i.Amount,
                Date = i.Date,
                CategoryId = i.CategoryId,
                CategoryName = i.Category.Name
            });

            // 3. Merge both lists
            var transactions = expenseTransactions
                .Concat(incomeTransactions)
                .AsQueryable();

            // 4. Filters
            if (from.HasValue)
                transactions = transactions.Where(t => DateOnly.FromDateTime(t.Date) >= from.Value);

            if (to.HasValue)
                transactions = transactions.Where(t => DateOnly.FromDateTime(t.Date) <= to.Value);

            if (type.HasValue)
                transactions = transactions.Where(t => t.Type == type.Value);

            if (categoryId.HasValue)
                transactions = transactions.Where(t => t.CategoryId == categoryId.Value);

            if (!string.IsNullOrEmpty(search))
                transactions = transactions.Where(t => t.Name.Contains(search));

            // 5. Final list
            var result = transactions
                .OrderByDescending(t => t.Date)
                .ToList();

            // 6. Summary (IMPORTANT FIX: use result)
            var totalIncome = result
                .Where(t => t.Type == TransactionType.INCOME)
                .Sum(t => t.Amount);

            var totalExpense = result
                .Where(t => t.Type == TransactionType.EXPENSE)
                .Sum(t => t.Amount);

            return Ok(new
            {
                transactions = result,   // 👈 IMPORTANT (frontend must use this)
                totalIncome,
                totalExpense,
                balance = totalIncome - totalExpense,
                transactionCount = result.Count
            });
        }
    }
}