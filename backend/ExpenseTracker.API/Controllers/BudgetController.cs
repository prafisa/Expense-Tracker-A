using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.API.DTOs.Budget;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<BudgetController> _logger;

        public BudgetController(AppDbContext context, ILogger<BudgetController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ── GET /api/budget ───────────────────────────────────────────────────
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetResponse>>> GetAllBudgets(
            [FromQuery] int? year = null,
            [FromQuery] int? month = null)
        {
            try
            {
                var query = _context.Budgets
                    .Include(b => b.Category)
                    .AsQueryable();

                if (year.HasValue && month.HasValue)
                {
                    var exactMonth = $"{year}-{month:D2}";
                    query = query.Where(b => b.Month == exactMonth);
                }
                else if (year.HasValue)
                {
                    query = query.Where(b => EF.Functions.Like(b.Month, $"{year}-%"));
                }

                var budgets = await query.ToListAsync();

                var responses = new List<BudgetResponse>();
                foreach (var b in budgets)
                    responses.Add(await ToResponseAsync(b));

                return Ok(responses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all budgets");
                return StatusCode(500, new { message = "An error occurred while retrieving budgets" });
            }
        }

        // ── GET /api/budget/{id} ──────────────────────────────────────────────
        [HttpGet("{id}")]
        public async Task<ActionResult<BudgetResponse>> GetBudgetById(int id)
        {
            try
            {
                var budget = await _context.Budgets
                    .Include(b => b.Category)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (budget == null)
                    return NotFound(new { message = $"Budget with ID {id} not found" });

                return Ok(await ToResponseAsync(budget));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting budget {Id}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the budget" });
            }
        }

        // ── GET /api/budget/month/{month} ─────────────────────────────────────
        [HttpGet("month/{month}")]
        public async Task<ActionResult<IEnumerable<BudgetResponse>>> GetBudgetsByMonth(string month)
        {
            try
            {
                if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
                    return BadRequest(new { message = "Month must be in format YYYY-MM" });

                var budgets = await _context.Budgets
                    .Include(b => b.Category)
                    .Where(b => b.Month == month)
                    .ToListAsync();

                var responses = new List<BudgetResponse>();
                foreach (var b in budgets)
                    responses.Add(await ToResponseAsync(b));

                return Ok(responses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting budgets for month {Month}", month);
                return StatusCode(500, new { message = "An error occurred while retrieving budgets" });
            }
        }

        // ── GET /api/budget/by-category ───────────────────────────────────────
        [HttpGet("by-category")]
        public async Task<ActionResult<BudgetResponse>> GetBudgetByCategoryAndMonth(
            [FromQuery] int categoryId,
            [FromQuery] string month)
        {
            try
            {
                if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
                    return BadRequest(new { message = "Month must be in format YYYY-MM" });

                var budget = await _context.Budgets
                    .Include(b => b.Category)
                    .FirstOrDefaultAsync(b => b.CategoryId == categoryId && b.Month == month);

                if (budget == null)
                    return NotFound(new { message = $"Budget not found for category {categoryId} in {month}" });

                return Ok(await ToResponseAsync(budget));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting budget for category {CategoryId} month {Month}", categoryId, month);
                return StatusCode(500, new { message = "An error occurred while retrieving the budget" });
            }
        }

        // ── POST /api/budget ──────────────────────────────────────────────────
        [HttpPost]
        public async Task<ActionResult<BudgetResponse>> CreateBudget([FromBody] CreateBudgetRequest request)
        {
            try
            {
                var category = await _context.Categories.FindAsync(request.CategoryId);

                if (category == null)
                    return BadRequest(new { message = "Category not found" });

                if (category.Type != TransactionType.EXPENSE)
                    return BadRequest(new { message = "Budgets can only be created for EXPENSE categories" });

                var existing = await _context.Budgets
                    .FirstOrDefaultAsync(b => b.CategoryId == request.CategoryId && b.Month == request.Month);

                if (existing != null)
                    return Conflict(new { message = $"Budget already exists for this category in {request.Month}" });

                var budget = new Budget
                {
                    Allocated  = request.Allocated,
                    Month      = request.Month,
                    CategoryId = request.CategoryId
                };

                _context.Budgets.Add(budget);
                await _context.SaveChangesAsync();

                await _context.Entry(budget).Reference(b => b.Category).LoadAsync();

                return CreatedAtAction(nameof(GetBudgetById), new { id = budget.Id }, await ToResponseAsync(budget));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating budget");
                return StatusCode(500, new { message = "An error occurred while creating the budget" });
            }
        }

        // ── PUT /api/budget/{id} ──────────────────────────────────────────────
        [HttpPut("{id}")]
        public async Task<ActionResult<BudgetResponse>> UpdateBudget(int id, [FromBody] UpdateBudgetRequest request)
        {
            try
            {
                var budget = await _context.Budgets
                    .Include(b => b.Category)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (budget == null)
                    return NotFound(new { message = $"Budget with ID {id} not found" });

                var category = await _context.Categories.FindAsync(request.CategoryId);

                if (category == null)
                    return BadRequest(new { message = "Category not found" });

                if (category.Type != TransactionType.EXPENSE)
                    return BadRequest(new { message = "Budgets can only be assigned to EXPENSE categories" });

                var duplicate = await _context.Budgets
                    .FirstOrDefaultAsync(b => b.Id != id && b.CategoryId == request.CategoryId && b.Month == request.Month);

                if (duplicate != null)
                    return Conflict(new { message = $"Another budget already exists for this category in {request.Month}" });

                budget.Allocated  = request.Allocated;
                budget.Month      = request.Month;
                budget.CategoryId = request.CategoryId;
                budget.Category   = category;

                await _context.SaveChangesAsync();

                return Ok(await ToResponseAsync(budget));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating budget {Id}", id);
                return StatusCode(500, new { message = "An error occurred while updating the budget" });
            }
        }

        // ── DELETE /api/budget/{id} ───────────────────────────────────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            try
            {
                var budget = await _context.Budgets.FindAsync(id);

                if (budget == null)
                    return NotFound(new { message = $"Budget with ID {id} not found" });

                _context.Budgets.Remove(budget);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting budget {Id}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the budget" });
            }
        }

        // ── DELETE /api/budget/month/{month} ──────────────────────────────────
        [HttpDelete("month/{month}")]
        public async Task<IActionResult> DeleteBudgetsByMonth(string month)
        {
            try
            {
                if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
                    return BadRequest(new { message = "Month must be in format YYYY-MM" });

                var budgets = await _context.Budgets
                    .Where(b => b.Month == month)
                    .ToListAsync();

                _context.Budgets.RemoveRange(budgets);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Deleted {budgets.Count} budget(s) for {month}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting budgets for month {Month}", month);
                return StatusCode(500, new { message = "An error occurred while deleting budgets" });
            }
        }

        // ── GET /api/budget/summary/{month} ───────────────────────────────────
        [HttpGet("summary/{month}")]
        public async Task<ActionResult<BudgetSummaryResponse>> GetBudgetSummary(string month)
        {
            try
            {
                if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
                    return BadRequest(new { message = "Month must be in format YYYY-MM" });

                var budgets = await _context.Budgets
                    .Include(b => b.Category)
                    .Where(b => b.Month == month)
                    .ToListAsync();

                var budgetResponses = new List<BudgetResponse>();
                foreach (var b in budgets)
                    budgetResponses.Add(await ToResponseAsync(b));

                return Ok(new BudgetSummaryResponse
                {
                    Month          = month,
                    TotalAllocated = budgetResponses.Sum(b => b.Allocated),
                    TotalSpent     = budgetResponses.Sum(b => b.Spent),
                    TotalRemaining = budgetResponses.Sum(b => b.Remaining),
                    CategoryCount  = budgetResponses.Count,
                    Budgets        = budgetResponses
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting budget summary for {Month}", month);
                return StatusCode(500, new { message = "An error occurred while retrieving the summary" });
            }
        }

        // ── GET /api/budget/available-dates ───────────────────────────────────
        [HttpGet("available-dates")]
        public async Task<ActionResult<object>> GetAvailableDates()
        {
            try
            {
                var years = await _context.Budgets
                    .Select(b => b.Month.Substring(0, 4))
                    .Distinct()
                    .OrderBy(y => y)
                    .Select(y => int.Parse(y))
                    .ToListAsync();

                return Ok(new { years });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available dates");
                return StatusCode(500, new { message = "An error occurred while retrieving available dates" });
            }
        }

        // ── Private helper ────────────────────────────────────────────────────
        private async Task<BudgetResponse> ToResponseAsync(Budget b)
        {
            var parts = b.Month.Split('-');
            int year  = int.Parse(parts[0]);
            int month = int.Parse(parts[1]);

            var spent = await _context.Expenses
                .Where(e => e.CategoryId == b.CategoryId
                         && e.Date.Year  == year
                         && e.Date.Month == month)
                .SumAsync(e => e.Amount);

            return new BudgetResponse
            {
                Id           = b.Id,
                Allocated    = b.Allocated,
                Spent        = spent,
                Remaining    = b.Allocated - spent,
                Month        = b.Month,
                CategoryId   = b.CategoryId,
                CategoryName = b.Category?.Name ?? $"Category {b.CategoryId}"
            };
        }
    }
}