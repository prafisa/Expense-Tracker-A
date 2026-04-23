using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.API.Data;
using System.Text.RegularExpressions;


namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BudgetController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/budget
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Budget>>> GetBudgets()
        {
            var budgets = await _context.Budgets
                .Include(b => b.Category)
                .OrderBy(b => b.Month)
                .ThenBy(b => b.Category.Name)
                .ToListAsync();
            
            return Ok(budgets);
        }

        // GET: api/budget/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Budget>> GetBudget(int id)
        {
            var budget = await _context.Budgets
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (budget == null)
            {
                return NotFound(new { message = $"Budget with ID {id} not found." });
            }

            return Ok(budget);
        }

        // GET: api/budget/category/{categoryId}
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<Budget>>> GetBudgetsByCategory(int categoryId)
        {
            // Check if category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == categoryId);
            if (!categoryExists)
            {
                return NotFound(new { message = $"Category with ID {categoryId} not found." });
            }

            var budgets = await _context.Budgets
                .Include(b => b.Category)
                .Where(b => b.CategoryId == categoryId)
                .OrderBy(b => b.Month)
                .ToListAsync();

            return Ok(budgets);
        }

        // GET: api/budget/month/{month}
        [HttpGet("month/{month}")]
        public async Task<ActionResult<IEnumerable<Budget>>> GetBudgetsByMonth(string month)
        {
            // Validate month format
            if (!IsValidMonthFormat(month))
            {
                return BadRequest(new { message = "Month must be in YYYY-MM format (e.g., 2026-04)." });
            }

            var budgets = await _context.Budgets
                .Include(b => b.Category)
                .Where(b => b.Month == month)
                .OrderBy(b => b.Category.Name)
                .ToListAsync();

            return Ok(budgets);
        }

        // GET: api/budget/category/{categoryId}/month/{month}
        [HttpGet("category/{categoryId}/month/{month}")]
        public async Task<ActionResult<Budget>> GetBudgetByCategoryAndMonth(int categoryId, string month)
        {
            // Validate month format
            if (!IsValidMonthFormat(month))
            {
                return BadRequest(new { message = "Month must be in YYYY-MM format (e.g., 2026-04)." });
            }

            var budget = await _context.Budgets
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.CategoryId == categoryId && b.Month == month);

            if (budget == null)
            {
                return NotFound(new { message = $"Budget for Category ID {categoryId} in month {month} not found." });
            }

            return Ok(budget);
        }

        // GET: api/budget/year/{year}
        [HttpGet("year/{year}")]
        public async Task<ActionResult<IEnumerable<Budget>>> GetBudgetsByYear(int year)
        {
            if (year < 2000 || year > 2100)
            {
                return BadRequest(new { message = "Year must be between 2000 and 2100." });
            }

            var budgets = await _context.Budgets
                .Include(b => b.Category)
                .Where(b => b.Month.StartsWith($"{year}-"))
                .OrderBy(b => b.Month)
                .ThenBy(b => b.Category.Name)
                .ToListAsync();

            return Ok(budgets);
        }

        // POST: api/budget
        [HttpPost]
        public async Task<ActionResult<Budget>> CreateBudget([FromBody] Budget budget)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate allocated amount
            if (budget.Allocated < 0)
            {
                return BadRequest(new { message = "Allocated amount cannot be negative." });
            }

            // Validate month format
            if (!IsValidMonthFormat(budget.Month))
            {
                return BadRequest(new { message = "Month must be in YYYY-MM format (e.g., 2026-04)." });
            }

            // Check if category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == budget.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = $"Category with ID {budget.CategoryId} does not exist." });
            }

            // Check if budget already exists for this category and month
            var existingBudget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.CategoryId == budget.CategoryId && b.Month == budget.Month);

            if (existingBudget != null)
            {
                return Conflict(new { message = $"Budget already exists for Category ID {budget.CategoryId} in month {budget.Month}." });
            }

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();

            // Load the category for the response
            await _context.Entry(budget)
                .Reference(b => b.Category)
                .LoadAsync();

            return CreatedAtAction(nameof(GetBudget), new { id = budget.Id }, budget);
        }

        // POST: api/budget/batch
        [HttpPost("batch")]
        public async Task<ActionResult<IEnumerable<Budget>>> CreateBudgetsBatch([FromBody] List<Budget> budgets)
        {
            if (budgets == null || !budgets.Any())
            {
                return BadRequest(new { message = "No budgets provided." });
            }

            var errors = new List<string>();
            var validBudgets = new List<Budget>();

            foreach (var budget in budgets)
            {
                // Validate month format
                if (!IsValidMonthFormat(budget.Month))
                {
                    errors.Add($"Budget for Category ID {budget.CategoryId}: Month must be in YYYY-MM format.");
                    continue;
                }

                // Validate allocated amount
                if (budget.Allocated < 0)
                {
                    errors.Add($"Budget for Category ID {budget.CategoryId}: Allocated amount cannot be negative.");
                    continue;
                }

                // Check if category exists
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == budget.CategoryId);
                if (!categoryExists)
                {
                    errors.Add($"Budget: Category with ID {budget.CategoryId} does not exist.");
                    continue;
                }

                // Check for duplicates
                var existingBudget = await _context.Budgets
                    .FirstOrDefaultAsync(b => b.CategoryId == budget.CategoryId && b.Month == budget.Month);
                
                if (existingBudget != null)
                {
                    errors.Add($"Budget for Category ID {budget.CategoryId} in month {budget.Month} already exists.");
                    continue;
                }

                validBudgets.Add(budget);
            }

            if (errors.Any())
            {
                return BadRequest(new { errors });
            }

            await _context.Budgets.AddRangeAsync(validBudgets);
            await _context.SaveChangesAsync();

            foreach (var budget in validBudgets)
            {
                await _context.Entry(budget)
                    .Reference(b => b.Category)
                    .LoadAsync();
            }

            return CreatedAtAction(nameof(GetBudgets), validBudgets);
        }

        // PUT: api/budget/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBudget(int id, [FromBody] Budget budget)
        {
            if (id != budget.Id)
            {
                return BadRequest(new { message = "ID in URL does not match ID in request body." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingBudget = await _context.Budgets.FindAsync(id);
            if (existingBudget == null)
            {
                return NotFound(new { message = $"Budget with ID {id} not found." });
            }

            // Validate allocated amount
            if (budget.Allocated < 0)
            {
                return BadRequest(new { message = "Allocated amount cannot be negative." });
            }

            // Validate month format
            if (!IsValidMonthFormat(budget.Month))
            {
                return BadRequest(new { message = "Month must be in YYYY-MM format (e.g., 2026-04)." });
            }

            // Check if category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == budget.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = $"Category with ID {budget.CategoryId} does not exist." });
            }

            // Check if another budget exists with same category and month (excluding current)
            var duplicateBudget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.CategoryId == budget.CategoryId 
                    && b.Month == budget.Month 
                    && b.Id != id);

            if (duplicateBudget != null)
            {
                return Conflict(new { message = $"Another budget already exists for Category ID {budget.CategoryId} in month {budget.Month}." });
            }

            // Update properties
            existingBudget.Allocated = budget.Allocated;
            existingBudget.Month = budget.Month;
            existingBudget.CategoryId = budget.CategoryId;

            _context.Entry(existingBudget).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/budget/{id}/allocated
        [HttpPatch("{id}/allocated")]
        public async Task<IActionResult> UpdateBudgetAllocated(int id, [FromBody] decimal allocated)
        {
            var budget = await _context.Budgets.FindAsync(id);
            if (budget == null)
            {
                return NotFound(new { message = $"Budget with ID {id} not found." });
            }

            if (allocated < 0)
            {
                return BadRequest(new { message = "Allocated amount cannot be negative." });
            }

            budget.Allocated = allocated;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/budget/{id}/month
        [HttpPatch("{id}/month")]
        public async Task<IActionResult> UpdateBudgetMonth(int id, [FromBody] string month)
        {
            var budget = await _context.Budgets.FindAsync(id);
            if (budget == null)
            {
                return NotFound(new { message = $"Budget with ID {id} not found." });
            }

            if (!IsValidMonthFormat(month))
            {
                return BadRequest(new { message = "Month must be in YYYY-MM format (e.g., 2026-04)." });
            }

            // Check if budget already exists for this category and new month
            var existingBudget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.CategoryId == budget.CategoryId && b.Month == month && b.Id != id);

            if (existingBudget != null)
            {
                return Conflict(new { message = $"Budget already exists for this category in month {month}." });
            }

            budget.Month = month;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/budget/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            var budget = await _context.Budgets.FindAsync(id);
            if (budget == null)
            {
                return NotFound(new { message = $"Budget with ID {id} not found." });
            }

            _context.Budgets.Remove(budget);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/budget/category/{categoryId}/month/{month}
        [HttpDelete("category/{categoryId}/month/{month}")]
        public async Task<IActionResult> DeleteBudgetByCategoryAndMonth(int categoryId, string month)
        {
            if (!IsValidMonthFormat(month))
            {
                return BadRequest(new { message = "Month must be in YYYY-MM format (e.g., 2026-04)." });
            }

            var budget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.CategoryId == categoryId && b.Month == month);

            if (budget == null)
            {
                return NotFound(new { message = $"Budget for Category ID {categoryId} in month {month} not found." });
            }

            _context.Budgets.Remove(budget);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/budget/month/{month}
        [HttpDelete("month/{month}")]
        public async Task<IActionResult> DeleteBudgetsByMonth(string month)
        {
            if (!IsValidMonthFormat(month))
            {
                return BadRequest(new { message = "Month must be in YYYY-MM format (e.g., 2026-04)." });
            }

            var budgets = await _context.Budgets
                .Where(b => b.Month == month)
                .ToListAsync();

            if (!budgets.Any())
            {
                return NotFound(new { message = $"No budgets found for month {month}." });
            }

            _context.Budgets.RemoveRange(budgets);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Deleted {budgets.Count} budget(s) for month {month}." });
        }

        // GET: api/budget/summary/{month}
        [HttpGet("summary/{month}")]
        public async Task<ActionResult<object>> GetBudgetSummary(string month)
        {
            if (!IsValidMonthFormat(month))
            {
                return BadRequest(new { message = "Month must be in YYYY-MM format (e.g., 2026-04)." });
            }

            var budgets = await _context.Budgets
                .Include(b => b.Category)
                .Where(b => b.Month == month)
                .ToListAsync();

            if (!budgets.Any())
            {
                return Ok(new { message = $"No budgets found for month {month}.", data = new List<object>() });
            }

            // Parse month for date filtering
            var year = int.Parse(month.Split('-')[0]);
            var monthNum = int.Parse(month.Split('-')[1]);
            var startDate = new DateTime(year, monthNum, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            // Get actual expenses for the month
            var expenses = await _context.Expenses
                .Include(e => e.Category)
                .Where(e => e.Date >= startDate && e.Date <= endDate)
                .ToListAsync();

            var summary = budgets.Select(b => new
            {
                CategoryId = b.CategoryId,
                CategoryName = b.Category.Name,
                CategoryIcon = b.Category.Icon,
                CategoryColor = b.Category.Color,
                Allocated = b.Allocated,
                Actual = expenses.Where(e => e.CategoryId == b.CategoryId).Sum(e => e.Amount),
                Remaining = b.Allocated - expenses.Where(e => e.CategoryId == b.CategoryId).Sum(e => e.Amount),
                PercentageUsed = expenses.Where(e => e.CategoryId == b.CategoryId).Sum(e => e.Amount) / (b.Allocated > 0 ? b.Allocated : 1) * 100,
                Status = GetBudgetStatus(b.Allocated, expenses.Where(e => e.CategoryId == b.CategoryId).Sum(e => e.Amount))
            }).OrderBy(s => s.CategoryName);

            // Calculate overall summary
            var overallSummary = new
            {
                Month = month,
                TotalAllocated = budgets.Sum(b => b.Allocated),
                TotalActual = expenses.Sum(e => e.Amount),
                TotalRemaining = budgets.Sum(b => b.Allocated) - expenses.Sum(e => e.Amount),
                OverallPercentage = expenses.Sum(e => e.Amount) / (budgets.Sum(b => b.Allocated) > 0 ? budgets.Sum(b => b.Allocated) : 1) * 100,
                Categories = summary
            };

            return Ok(overallSummary);
        }

        // GET: api/budget/analytics/year/{year}
        [HttpGet("analytics/year/{year}")]
        public async Task<ActionResult<object>> GetYearlyBudgetAnalytics(int year)
        {
            if (year < 2000 || year > 2100)
            {
                return BadRequest(new { message = "Year must be between 2000 and 2100." });
            }

            var budgets = await _context.Budgets
                .Include(b => b.Category)
                .Where(b => b.Month.StartsWith($"{year}-"))
                .ToListAsync();

            if (!budgets.Any())
            {
                return Ok(new { message = $"No budgets found for year {year}.", data = new List<object>() });
            }

            var monthlyAnalytics = new List<object>();
            for (int month = 1; month <= 12; month++)
            {
                var monthStr = $"{year}-{month:D2}";
                var monthBudgets = budgets.Where(b => b.Month == monthStr).ToList();
                
                var startDate = new DateTime(year, month, 1);
                var endDate = startDate.AddMonths(1).AddDays(-1);
                
                var expenses = await _context.Expenses
                    .Where(e => e.Date >= startDate && e.Date <= endDate)
                    .SumAsync(e => e.Amount);

                monthlyAnalytics.Add(new
                {
                    Month = monthStr,
                    MonthName = startDate.ToString("MMMM"),
                    TotalAllocated = monthBudgets.Sum(b => b.Allocated),
                    TotalActual = expenses,
                    Variance = monthBudgets.Sum(b => b.Allocated) - expenses
                });
            }

            return Ok(monthlyAnalytics);
        }

        // Helper method to validate month format
        private bool IsValidMonthFormat(string month)
        {
            if (string.IsNullOrWhiteSpace(month))
                return false;
            
            var regex = new Regex(@"^\d{4}-(0[1-9]|1[0-2])$");
            return regex.IsMatch(month);
        }

        // Helper method to get budget status
        private string GetBudgetStatus(decimal allocated, decimal actual)
        {
            if (actual == 0) return "No Activity";
            if (actual <= allocated) return "On Track";
            if (actual <= allocated * 1.1m) return "Warning";
            return "Overspent";
        }
    }
}