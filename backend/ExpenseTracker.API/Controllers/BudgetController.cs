using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.API.DTOs.Budget;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;

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

        /// <summary>
        /// Get all budgets with optional year and month filters
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BudgetResponse>>> GetAllBudgets([FromQuery] int? year = null, [FromQuery] int? month = null)
        {
            try
            {
                var query = _context.Budgets
                    .Include(b => b.Category)
                    .AsQueryable();

                if (year.HasValue)
                {
                    // Fixed: Use EF.Functions.Like instead of StartsWith
                    var yearPrefix = $"{year}-";
                    query = query.Where(b => EF.Functions.Like(b.Month, $"{yearPrefix}%"));
                }

                if (month.HasValue && year.HasValue)
                {
                    var exactMonth = $"{year}-{month:D2}";
                    query = query.Where(b => b.Month == exactMonth);
                }

                var budgets = await query.ToListAsync();

                var response = budgets.Select(b => new BudgetResponse
                {
                    Id = b.Id,
                    Allocated = b.Allocated,
                    Month = b.Month,
                    CategoryId = b.CategoryId,
                    CategoryName = b.Category?.Name ?? $"Category {b.CategoryId}"
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all budgets");
                return StatusCode(500, new { message = "An error occurred while retrieving budgets" });
            }
        }

        /// <summary>
        /// Get budget by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<BudgetResponse>> GetBudgetById(int id)
        {
            try
            {
                var budget = await _context.Budgets
                    .Include(b => b.Category)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (budget == null)
                {
                    return NotFound(new { message = $"Budget with ID {id} not found" });
                }

                var response = new BudgetResponse
                {
                    Id = budget.Id,
                    Allocated = budget.Allocated,
                    Month = budget.Month,
                    CategoryId = budget.CategoryId,
                    CategoryName = budget.Category?.Name ?? $"Category {budget.CategoryId}"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting budget by ID");
                return StatusCode(500, new { message = "An error occurred while retrieving the budget" });
            }
        }

        /// <summary>
        /// Get budgets by month
        /// </summary>
        [HttpGet("month/{month}")]
        public async Task<ActionResult<IEnumerable<BudgetResponse>>> GetBudgetsByMonth(string month)
        {
            try
            {
                if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
                {
                    return BadRequest(new { message = "Month must be in format YYYY-MM" });
                }

                var budgets = await _context.Budgets
                    .Include(b => b.Category)
                    .Where(b => b.Month == month)
                    .ToListAsync();

                var response = budgets.Select(b => new BudgetResponse
                {
                    Id = b.Id,
                    Allocated = b.Allocated,
                    Month = b.Month,
                    CategoryId = b.CategoryId,
                    CategoryName = b.Category?.Name ?? $"Category {b.CategoryId}"
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting budgets by month");
                return StatusCode(500, new { message = "An error occurred while retrieving budgets" });
            }
        }

        /// <summary>
        /// Get budget by category and month
        /// </summary>
        [HttpGet("by-category")]
        public async Task<ActionResult<BudgetResponse>> GetBudgetByCategoryAndMonth(
            [FromQuery] int categoryId,
            [FromQuery] string month)
        {
            try
            {
                if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
                {
                    return BadRequest(new { message = "Month must be in format YYYY-MM" });
                }

                var budget = await _context.Budgets
                    .Include(b => b.Category)
                    .FirstOrDefaultAsync(b => b.CategoryId == categoryId && b.Month == month);

                if (budget == null)
                {
                    return NotFound(new { message = $"Budget not found for Category ID {categoryId} in {month}" });
                }

                var response = new BudgetResponse
                {
                    Id = budget.Id,
                    Allocated = budget.Allocated,
                    Month = budget.Month,
                    CategoryId = budget.CategoryId,
                    CategoryName = budget.Category?.Name ?? $"Category {budget.CategoryId}"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting budget by category and month");
                return StatusCode(500, new { message = "An error occurred while retrieving the budget" });
            }
        }

        /// <summary>
        /// Create a new budget
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<BudgetResponse>> CreateBudget([FromBody] CreateBudgetRequest request)
        {
            try
            {
                // Check if budget already exists for this category and month
                var existingBudget = await _context.Budgets
                    .FirstOrDefaultAsync(b => b.CategoryId == request.CategoryId && b.Month == request.Month);

                if (existingBudget != null)
                {
                    return Conflict(new
                    {
                        message = $"Budget already exists for Category ID {request.CategoryId} in {request.Month}"
                    });
                }

                // Create new budget
                var budget = new Budget
                {
                    Allocated = request.Allocated,
                    Month = request.Month,
                    CategoryId = request.CategoryId
                };

                _context.Budgets.Add(budget);
                await _context.SaveChangesAsync();

                // Load the category for the response
                await _context.Entry(budget).Reference(b => b.Category).LoadAsync();

                var response = new BudgetResponse
                {
                    Id = budget.Id,
                    Allocated = budget.Allocated,
                    Month = budget.Month,
                    CategoryId = budget.CategoryId,
                    CategoryName = budget.Category?.Name ?? $"Category {budget.CategoryId}"
                };

                return CreatedAtAction(nameof(GetBudgetById), new { id = response.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating budget");
                return StatusCode(500, new { message = "An error occurred while creating the budget" });
            }
        }

        /// <summary>
        /// Update an existing budget
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<BudgetResponse>> UpdateBudget(int id, [FromBody] UpdateBudgetRequest request)
        {
            try
            {
                var budget = await _context.Budgets
                    .Include(b => b.Category)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (budget == null)
                {
                    return NotFound(new { message = $"Budget with ID {id} not found" });
                }

                // Check if another budget exists with same category and month (excluding current)
                var duplicateBudget = await _context.Budgets
                    .FirstOrDefaultAsync(b => b.Id != id && b.CategoryId == request.CategoryId && b.Month == request.Month);

                if (duplicateBudget != null)
                {
                    return Conflict(new
                    {
                        message = $"Another budget already exists for Category ID {request.CategoryId} in {request.Month}"
                    });
                }

                // Update budget
                budget.Allocated = request.Allocated;
                budget.Month = request.Month;
                budget.CategoryId = request.CategoryId;

                await _context.SaveChangesAsync();

                var response = new BudgetResponse
                {
                    Id = budget.Id,
                    Allocated = budget.Allocated,
                    Month = budget.Month,
                    CategoryId = budget.CategoryId,
                    CategoryName = budget.Category?.Name ?? $"Category {budget.CategoryId}"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating budget");
                return StatusCode(500, new { message = "An error occurred while updating the budget" });
            }
        }

        /// <summary>
        /// Delete a budget
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            try
            {
                var budget = await _context.Budgets.FindAsync(id);
                if (budget == null)
                {
                    return NotFound(new { message = $"Budget with ID {id} not found" });
                }

                _context.Budgets.Remove(budget);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting budget");
                return StatusCode(500, new { message = "An error occurred while deleting the budget" });
            }
        }

        /// <summary>
        /// Delete budgets by month
        /// </summary>
        [HttpDelete("month/{month}")]
        public async Task<IActionResult> DeleteBudgetsByMonth(string month)
        {
            try
            {
                if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
                {
                    return BadRequest(new { message = "Month must be in format YYYY-MM" });
                }

                var budgetsToDelete = await _context.Budgets
                    .Where(b => b.Month == month)
                    .ToListAsync();

                int deletedCount = budgetsToDelete.Count;

                _context.Budgets.RemoveRange(budgetsToDelete);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Deleted {deletedCount} budget(s) for month {month}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting budgets by month");
                return StatusCode(500, new { message = "An error occurred while deleting budgets" });
            }
        }

        /// <summary>
        /// Get budget summary for a month
        /// </summary>
        [HttpGet("summary/{month}")]
        public async Task<ActionResult<object>> GetBudgetSummary(string month)
        {
            try
            {
                if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
                {
                    return BadRequest(new { message = "Month must be in format YYYY-MM" });
                }

                var monthlyBudgets = await _context.Budgets
                    .Include(b => b.Category)
                    .Where(b => b.Month == month)
                    .ToListAsync();

                if (!monthlyBudgets.Any())
                {
                    return Ok(new
                    {
                        Month = month,
                        TotalBudget = 0,
                        CategoryCount = 0,
                        Budgets = new List<BudgetResponse>()
                    });
                }

                var summary = new
                {
                    Month = month,
                    TotalBudget = monthlyBudgets.Sum(b => b.Allocated),
                    CategoryCount = monthlyBudgets.Count,
                    Budgets = monthlyBudgets.Select(b => new BudgetResponse
                    {
                        Id = b.Id,
                        Allocated = b.Allocated,
                        Month = b.Month,
                        CategoryId = b.CategoryId,
                        CategoryName = b.Category?.Name ?? $"Category {b.CategoryId}"
                    })
                };

                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting budget summary");
                return StatusCode(500, new { message = "An error occurred while retrieving the summary" });
            }
        }

        /// <summary>
        /// Get available years
        /// </summary>
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
    }
}