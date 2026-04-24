using ExpenseTracker.API.DTOs.Transaction;
using ExpenseTracker.API.Enums;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.API.Data;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransactionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/transaction
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetTransactions()
        {
            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .OrderByDescending(t => t.Date)
                .Select(t => MapToResponse(t))
                .ToListAsync();

            return Ok(transactions);
        }

        // GET: api/transaction/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionResponse>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Category)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transaction == null)
                return NotFound(new { message = $"Transaction with ID {id} not found." });

            return Ok(MapToResponse(transaction));
        }

        // GET: api/transaction/category/{categoryId}
        
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetTransactionsByCategory(int categoryId)
        {
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == categoryId);
            if (!categoryExists)
                return NotFound(new { message = $"Category with ID {categoryId} not found." });

            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.CategoryId == categoryId)
                .OrderByDescending(t => t.Date)
                .Select(t => MapToResponse(t))
                .ToListAsync();

            return Ok(transactions);
        }

        // GET: api/transaction/type/{type}
        [HttpGet("type/{type}")]
        public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetTransactionsByType(TransactionType type)
        {
            if (!Enum.IsDefined(typeof(TransactionType), type))
                return BadRequest(new { message = "Invalid transaction type." });

            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.Type == type)
                .OrderByDescending(t => t.Date)
                .Select(t => MapToResponse(t))
                .ToListAsync();

            return Ok(transactions);
        }

        // GET: api/transaction/method/{method}
        [HttpGet("method/{method}")]
        public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetTransactionsByMethod(PaymentMethod method)
        {
            if (!Enum.IsDefined(typeof(PaymentMethod), method))
                return BadRequest(new { message = "Invalid payment method." });

            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.Method == method)
                .OrderByDescending(t => t.Date)
                .Select(t => MapToResponse(t))
                .ToListAsync();

            return Ok(transactions);
        }

        // GET: api/transaction/month/{month}
        [HttpGet("month/{month}")]
        public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetTransactionsByMonth(string month)
        {
            if (!IsValidMonthFormat(month))
                return BadRequest(new { message = "Month must be in YYYY-MM format (e.g., 2026-04)." });

            var (startDate, endDate) = GetMonthRange(month);

            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.Date >= startDate && t.Date <= endDate)
                .OrderByDescending(t => t.Date)
                .Select(t => MapToResponse(t))
                .ToListAsync();

            return Ok(transactions);
        }

        // GET: api/transaction/year/{year}
        [HttpGet("year/{year}")]
        public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetTransactionsByYear(int year)
        {
            if (year < 2000 || year > 2100)
                return BadRequest(new { message = "Year must be between 2000 and 2100." });

            var startDate = new DateTime(year, 1, 1);
            var endDate = new DateTime(year, 12, 31);

            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.Date >= startDate && t.Date <= endDate)
                .OrderByDescending(t => t.Date)
                .Select(t => MapToResponse(t))
                .ToListAsync();

            return Ok(transactions);
        }

        // GET: api/transaction/summary/{month}
        [HttpGet("summary/{month}")]
        public async Task<ActionResult<object>> GetMonthlySummary(string month)
        {
            if (!IsValidMonthFormat(month))
                return BadRequest(new { message = "Month must be in YYYY-MM format (e.g., 2026-04)." });

            var (startDate, endDate) = GetMonthRange(month);

            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.Date >= startDate && t.Date <= endDate)
                .ToListAsync();

            if (!transactions.Any())
                return Ok(new { message = $"No transactions found for month {month}.", data = new List<object>() });

            var totalIncome = transactions.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount);
            var totalExpense = transactions.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount);

            var byCategory = transactions
                .GroupBy(t => new { t.CategoryId, t.Category.Name })
                .Select(g => new
                {
                    CategoryId = g.Key.CategoryId,
                    CategoryName = g.Key.Name,
                    TotalAmount = g.Sum(t => t.Amount),
                    Count = g.Count()
                })
                .OrderByDescending(g => g.TotalAmount);

            var byMethod = transactions
                .GroupBy(t => t.Method)
                .Select(g => new
                {
                    Method = g.Key.ToString(),
                    TotalAmount = g.Sum(t => t.Amount),
                    Count = g.Count()
                });

            var summary = new
            {
                Month = month,
                TotalIncome = totalIncome,
                TotalExpense = totalExpense,
                NetBalance = totalIncome - totalExpense,
                TransactionCount = transactions.Count,
                ByCategory = byCategory,
                ByMethod = byMethod
            };

            return Ok(summary);
        }

        // POST: api/transaction
        [HttpPost]
        public async Task<ActionResult<TransactionResponse>> CreateTransaction([FromBody] Transaction transaction)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (transaction.Amount <= 0)
                return BadRequest(new { message = "Amount must be greater than zero." });

            if (!Enum.IsDefined(typeof(TransactionType), transaction.Type))
                return BadRequest(new { message = "Invalid transaction type." });

            if (!Enum.IsDefined(typeof(PaymentMethod), transaction.Method))
                return BadRequest(new { message = "Invalid payment method." });

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == transaction.CategoryId);
            if (!categoryExists)
                return BadRequest(new { message = $"Category with ID {transaction.CategoryId} does not exist." });

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            await _context.Entry(transaction).Reference(t => t.Category).LoadAsync();

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, MapToResponse(transaction));
        }

        // POST: api/transaction/batch
        [HttpPost("batch")]
        public async Task<ActionResult<IEnumerable<TransactionResponse>>> CreateTransactionsBatch([FromBody] List<Transaction> transactions)
        {
            if (transactions == null || !transactions.Any())
                return BadRequest(new { message = "No transactions provided." });

            var errors = new List<string>();
            var validTransactions = new List<Transaction>();

            foreach (var transaction in transactions)
            {
                if (transaction.Amount <= 0)
                {
                    errors.Add($"Transaction '{transaction.Name}': Amount must be greater than zero.");
                    continue;
                }

                if (!Enum.IsDefined(typeof(TransactionType), transaction.Type))
                {
                    errors.Add($"Transaction '{transaction.Name}': Invalid transaction type.");
                    continue;
                }

                if (!Enum.IsDefined(typeof(PaymentMethod), transaction.Method))
                {
                    errors.Add($"Transaction '{transaction.Name}': Invalid payment method.");
                    continue;
                }

                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == transaction.CategoryId);
                if (!categoryExists)
                {
                    errors.Add($"Transaction '{transaction.Name}': Category with ID {transaction.CategoryId} does not exist.");
                    continue;
                }

                validTransactions.Add(transaction);
            }

            if (errors.Any())
                return BadRequest(new { errors });

            await _context.Transactions.AddRangeAsync(validTransactions);
            await _context.SaveChangesAsync();

            foreach (var transaction in validTransactions)
                await _context.Entry(transaction).Reference(t => t.Category).LoadAsync();

            return CreatedAtAction(nameof(GetTransactions), validTransactions.Select(t => MapToResponse(t)));
        }

        // PUT: api/transaction/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, [FromBody] Transaction transaction)
        {
            if (id != transaction.Id)
                return BadRequest(new { message = "ID in URL does not match ID in request body." });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existing = await _context.Transactions.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = $"Transaction with ID {id} not found." });

            if (transaction.Amount <= 0)
                return BadRequest(new { message = "Amount must be greater than zero." });

            if (!Enum.IsDefined(typeof(TransactionType), transaction.Type))
                return BadRequest(new { message = "Invalid transaction type." });

            if (!Enum.IsDefined(typeof(PaymentMethod), transaction.Method))
                return BadRequest(new { message = "Invalid payment method." });

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == transaction.CategoryId);
            if (!categoryExists)
                return BadRequest(new { message = $"Category with ID {transaction.CategoryId} does not exist." });

            existing.Name = transaction.Name;
            existing.Type = transaction.Type;
            existing.Method = transaction.Method;
            existing.Source = transaction.Source;
            existing.Amount = transaction.Amount;
            existing.Date = transaction.Date;
            existing.CategoryId = transaction.CategoryId;

            _context.Entry(existing).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/transaction/{id}/amount
        [HttpPatch("{id}/amount")]
        public async Task<IActionResult> UpdateTransactionAmount(int id, [FromBody] decimal amount)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound(new { message = $"Transaction with ID {id} not found." });

            if (amount <= 0)
                return BadRequest(new { message = "Amount must be greater than zero." });

            transaction.Amount = amount;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/transaction/{id}/category
        [HttpPatch("{id}/category")]
        public async Task<IActionResult> UpdateTransactionCategory(int id, [FromBody] int categoryId)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound(new { message = $"Transaction with ID {id} not found." });

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == categoryId);
            if (!categoryExists)
                return BadRequest(new { message = $"Category with ID {categoryId} does not exist." });

            transaction.CategoryId = categoryId;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/transaction/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
                return NotFound(new { message = $"Transaction with ID {id} not found." });

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/transaction/month/{month}
        [HttpDelete("month/{month}")]
        public async Task<IActionResult> DeleteTransactionsByMonth(string month)
        {
            if (!IsValidMonthFormat(month))
                return BadRequest(new { message = "Month must be in YYYY-MM format (e.g., 2026-04)." });

            var (startDate, endDate) = GetMonthRange(month);

            var transactions = await _context.Transactions
                .Where(t => t.Date >= startDate && t.Date <= endDate)
                .ToListAsync();

            if (!transactions.Any())
                return NotFound(new { message = $"No transactions found for month {month}." });

            _context.Transactions.RemoveRange(transactions);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Deleted {transactions.Count} transaction(s) for month {month}." });
        }

        // --- Helpers ---

        private static TransactionResponse MapToResponse(Transaction t) => new()
        {
            Id = t.Id,
            Name = t.Name,
            Type = t.Type,
            Method = t.Method,
            Source = t.Source,
            Amount = t.Amount,
            Date = t.Date,
            CategoryId = t.CategoryId,
            CategoryName = t.Category?.Name ?? string.Empty
        };

        private bool IsValidMonthFormat(string month)
        {
            if (string.IsNullOrWhiteSpace(month)) return false;
            var regex = new System.Text.RegularExpressions.Regex(@"^\d{4}-(0[1-9]|1[0-2])$");
            return regex.IsMatch(month);
        }

        private (DateTime startDate, DateTime endDate) GetMonthRange(string month)
        {
            var year = int.Parse(month.Split('-')[0]);
            var monthNum = int.Parse(month.Split('-')[1]);
            var startDate = new DateTime(year, monthNum, 1);
            return (startDate, startDate.AddMonths(1).AddDays(-1));
        }
    }
}