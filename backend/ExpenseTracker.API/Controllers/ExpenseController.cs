using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.DTOs.Expense;
using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ExpenseController> _logger;

        public ExpenseController(AppDbContext context, ILogger<ExpenseController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ── GET /api/expense ──────────────────────────────────────────────────
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetAll(
            [FromQuery] int? categoryId = null,
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null)
        {
            try
            {
                var query = _context.Expenses
                    .Include(e => e.Category)
                    .AsQueryable();

                if (categoryId.HasValue)
                    query = query.Where(e => e.CategoryId == categoryId.Value);

                if (from.HasValue)
                    query = query.Where(e => e.Date >= from.Value);

                if (to.HasValue)
                    query = query.Where(e => e.Date <= to.Value);

                var expenses = await query
                    .OrderByDescending(e => e.Date)
                    .Select(e => ToResponse(e))
                    .ToListAsync();

                return Ok(expenses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting expenses");
                return StatusCode(500, new { message = "Error retrieving expenses" });
            }
        }

        // ── GET /api/expense/{id} ─────────────────────────────────────────────
        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseDto>> GetById(int id)
        {
            try
            {
                var expense = await _context.Expenses
                    .Include(e => e.Category)
                    .FirstOrDefaultAsync(e => e.Id == id);

                if (expense == null)
                    return NotFound(new { message = "Expense not found" });

                return Ok(ToResponse(expense));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting expense {Id}", id);
                return StatusCode(500, new { message = "Error retrieving expense" });
            }
        }

        // ── POST /api/expense ─────────────────────────────────────────────────
        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> Create(CreateExpenseRequest request)
        {
            try
            {
                var category = await _context.Categories.FindAsync(request.CategoryId);

                if (category == null)
                    return BadRequest(new { message = "Category not found" });

                if (category.Type != TransactionType.EXPENSE)
                    return BadRequest(new { message = "Category must be of type EXPENSE" });

                // budget check — a budget must exist for this category+month
                var month = request.Date.ToString("yyyy-MM");
                var budget = await _context.Budgets
                    .FirstOrDefaultAsync(b => b.CategoryId == request.CategoryId
                                           && b.Month == month);

                if (budget == null)
                    return BadRequest(new { message = $"No budget found for this category in {month}. Please allocate a budget first." });

                var expense = new Expense
                {
                    Method     = request.Method,
                    Reason     = request.Reason,
                    Amount     = request.Amount,
                    Date       = request.Date,
                    CategoryId = request.CategoryId
                };

                _context.Expenses.Add(expense);

                var transaction = new Transaction
                {
                    Name       = request.Reason ?? category.Name,
                    Type       = TransactionType.EXPENSE,
                    Method     = request.Method,
                    Source     = request.Reason,
                    Amount     = request.Amount,
                    Date       = request.Date,
                    CategoryId = request.CategoryId
                };

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = expense.Id }, ToResponse(expense));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating expense");
                return StatusCode(500, new { message = "Error creating expense" });
            }
        }

        // ── DELETE /api/expense/{id} ──────────────────────────────────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var expense = await _context.Expenses
                    .Include(e => e.Category)
                    .FirstOrDefaultAsync(e => e.Id == id);

                if (expense == null)
                    return NotFound(new { message = "Expense not found" });

                // remove mirror Transaction
                var transaction = await _context.Transactions
                    .FirstOrDefaultAsync(t =>
                        t.CategoryId == expense.CategoryId &&
                        t.Type       == TransactionType.EXPENSE &&
                        t.Date       == expense.Date &&
                        t.Amount     == expense.Amount);

                if (transaction != null)
                    _context.Transactions.Remove(transaction);

                _context.Expenses.Remove(expense);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting expense {Id}", id);
                return StatusCode(500, new { message = "Error deleting expense" });
            }
        }

        // ── Private helper ────────────────────────────────────────────────────
        private static ExpenseDto ToResponse(Expense e) => new()
        {
            Id            = e.Id,
            Method        = e.Method,
            Reason        = e.Reason,
            Amount        = e.Amount,
            Date          = e.Date,
            CategoryId    = e.CategoryId,
            CategoryName  = e.Category?.Name  ?? string.Empty,
            CategoryIcon  = e.Category?.Icon  ?? string.Empty,
            CategoryColor = e.Category?.Color ?? string.Empty
        };
    }
}