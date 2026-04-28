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
        private readonly ILogger<TransactionController> _logger;

        public TransactionController(AppDbContext context, ILogger<TransactionController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ── GET /api/transaction ──────────────────────────────────────────────
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] DateOnly? from = null,
            [FromQuery] DateOnly? to = null,
            [FromQuery] TransactionType? type = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] string? search = null)
        {
            try
            {
                // push type + categoryId filters to DB, load the rest in memory
                var expenseQuery = _context.Expenses.Include(e => e.Category).AsQueryable();
                var incomeQuery  = _context.Incomes.Include(i => i.Category).AsQueryable();

                if (type == TransactionType.EXPENSE)
                    incomeQuery = incomeQuery.Where(i => false);
                else if (type == TransactionType.INCOME)
                    expenseQuery = expenseQuery.Where(e => false);

                if (categoryId.HasValue)
                {
                    expenseQuery = expenseQuery.Where(e => e.CategoryId == categoryId.Value);
                    incomeQuery  = incomeQuery.Where(i => i.CategoryId == categoryId.Value);
                }

                var expenses = await expenseQuery.ToListAsync();
                var incomes  = await incomeQuery.ToListAsync();

                var transactions = expenses.Select(e => new TransactionResponse
                {
                    Id            = e.Id,
                    Name          = e.Reason ?? e.Category?.Name ?? "Expense",
                    Type          = TransactionType.EXPENSE,
                    Method        = e.Method,
                    Source        = e.Reason,
                    Amount        = e.Amount,
                    Date          = e.Date,
                    CategoryId    = e.CategoryId,
                    CategoryName  = e.Category?.Name  ?? string.Empty,
                    CategoryIcon  = e.Category?.Icon  ?? string.Empty,
                    CategoryColor = e.Category?.Color ?? string.Empty
                })
                .Concat(incomes.Select(i => new TransactionResponse
                {
                    Id            = i.Id,
                    Name          = i.Source ?? i.Category?.Name ?? "Income",
                    Type          = TransactionType.INCOME,
                    Method        = i.Method,
                    Source        = i.Source,
                    Amount        = i.Amount,
                    Date          = i.Date,
                    CategoryId    = i.CategoryId,
                    CategoryName  = i.Category?.Name  ?? string.Empty,
                    CategoryIcon  = i.Category?.Icon  ?? string.Empty,
                    CategoryColor = i.Category?.Color ?? string.Empty
                }))
                .AsQueryable();

                if (from.HasValue)
                    transactions = transactions.Where(t => DateOnly.FromDateTime(t.Date) >= from.Value);

                if (to.HasValue)
                    transactions = transactions.Where(t => DateOnly.FromDateTime(t.Date) <= to.Value);

                if (!string.IsNullOrEmpty(search))
                    transactions = transactions.Where(t =>
                        t.Name.Contains(search, StringComparison.OrdinalIgnoreCase));

                var result = transactions.OrderByDescending(t => t.Date).ToList();

                var totalIncome  = result.Where(t => t.Type == TransactionType.INCOME).Sum(t => t.Amount);
                var totalExpense = result.Where(t => t.Type == TransactionType.EXPENSE).Sum(t => t.Amount);

                return Ok(new
                {
                    transactions     = result,
                    totalIncome,
                    totalExpense,
                    balance          = totalIncome - totalExpense,
                    transactionCount = result.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting transactions");
                return StatusCode(500, new { message = "Error retrieving transactions" });
            }
        }
    }
}