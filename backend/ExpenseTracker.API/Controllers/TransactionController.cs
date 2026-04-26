using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs.Transaction;
using ExpenseTracker.API.Enums;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
        public async Task<ActionResult<TransactionResponse>> GetAll(
            [FromQuery] DateOnly? from,
            [FromQuery] DateOnly? to,
            [FromQuery] TransactionType? type,
            [FromQuery] int? categoryId,
            [FromQuery] string? search)
        {
            var expenses = await _context.Expenses
                .Include(e => e.Category)
                .ToListAsync();

            var incomes = await _context.Incomes
                .Include(i => i.Category)
                .ToListAsync();

            var expenseTransactions = expenses.Select(e => new TransactionResponse
            {
                Id = e.Id,
                Name = e.Reason ?? "Expense",
                Type = TransactionType.EXPENSE,
                Method = e.Method,
                Source = e.Reason,
                Amount = e.Amount,
                Date = e.Date,
                CategoryName = e.Category.Name,
                CategoryId = e.CategoryId
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
                CategoryName = i.Category.Name,
                CategoryId = i.CategoryId
            });

            var transactions = expenseTransactions
                .Concat(incomeTransactions)
                .AsQueryable();

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

            var result = transactions
                .OrderByDescending(t => t.Date)
                .ToList();

            // Calculate summary from the same filtered data
            var totalIncome = result.Where(t => t.Type == TransactionType.INCOME).Sum(t => t.Amount);
            var totalExpenses = result.Where(t => t.Type == TransactionType.EXPENSE).Sum(t => t.Amount);

            return Ok(new
            {
                items = result,
                 totalIncome,
              totalExpenses,
                balance = totalIncome - totalExpenses,
                transactionCount = result.Count
            });
        }

        
    }
}