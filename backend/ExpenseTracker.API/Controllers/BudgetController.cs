using Microsoft.AspNetCore.Mvc;
using ExpenseTracker.API.DTOs.Budget;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        // In-memory storage for demo purposes
        // In production, inject your service/repository
        private static List<BudgetResponse> _budgets = new();
        private static int _nextId = 1;

        public BudgetController()
        {
            // Optional: Add some sample data
            if (!_budgets.Any())
            {
                SeedSampleData();
            }
        }

        /// <summary>
        /// Get all budgets
        /// </summary>
        [HttpGet]
        public ActionResult<IEnumerable<BudgetResponse>> GetAllBudgets()
        {
            return Ok(_budgets);
        }

        /// <summary>
        /// Get budget by ID
        /// </summary>
        [HttpGet("{id}")]
        public ActionResult<BudgetResponse> GetBudgetById(int id)
        {
            var budget = _budgets.FirstOrDefault(b => b.Id == id);

            if (budget == null)
            {
                return NotFound(new { message = $"Budget with ID {id} not found" });
            }

            return Ok(budget);
        }

        /// <summary>
        /// Get budgets by month
        /// </summary>
        [HttpGet("month/{month}")]
        public ActionResult<IEnumerable<BudgetResponse>> GetBudgetsByMonth(string month)
        {
            // Validate month format
            if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
            {
                return BadRequest(new { message = "Month must be in format YYYY-MM" });
            }

            var budgets = _budgets.Where(b => b.Month == month).ToList();
            return Ok(budgets);
        }

        /// <summary>
        /// Get budget by category and month
        /// </summary>
        [HttpGet("by-category")]
        public ActionResult<BudgetResponse> GetBudgetByCategoryAndMonth(
            [FromQuery] int categoryId,
            [FromQuery] string month)
        {
            // Validate month format
            if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
            {
                return BadRequest(new { message = "Month must be in format YYYY-MM" });
            }

            var budget = _budgets.FirstOrDefault(b => b.CategoryId == categoryId && b.Month == month);

            if (budget == null)
            {
                return NotFound(new { message = $"Budget not found for Category ID {categoryId} in {month}" });
            }

            return Ok(budget);
        }

        /// <summary>
        /// Create a new budget
        /// </summary>
        [HttpPost]
        public ActionResult<BudgetResponse> CreateBudget([FromBody] CreateBudgetRequest request)
        {
            // Check if budget already exists for this category and month
            var existingBudget = _budgets.FirstOrDefault(b =>
                b.CategoryId == request.CategoryId && b.Month == request.Month);

            if (existingBudget != null)
            {
                return Conflict(new
                {
                    message = $"Budget already exists for Category ID {request.CategoryId} in {request.Month}"
                });
            }

            // Create new budget
            var newBudget = new BudgetResponse
            {
                Id = _nextId++,
                Allocated = request.Allocated,
                Month = request.Month,
                CategoryId = request.CategoryId,
                CategoryName = GetCategoryName(request.CategoryId) // You'll need to implement this
            };

            _budgets.Add(newBudget);

            return CreatedAtAction(nameof(GetBudgetById), new { id = newBudget.Id }, newBudget);
        }

        /// <summary>
        /// Update an existing budget
        /// </summary>
        [HttpPut("{id}")]
        public ActionResult<BudgetResponse> UpdateBudget(int id, [FromBody] UpdateBudgetRequest request)
        {
            var existingBudget = _budgets.FirstOrDefault(b => b.Id == id);

            if (existingBudget == null)
            {
                return NotFound(new { message = $"Budget with ID {id} not found" });
            }

            // Check if another budget exists with same category and month (excluding current)
            var duplicateBudget = _budgets.FirstOrDefault(b =>
                b.Id != id &&
                b.CategoryId == request.CategoryId &&
                b.Month == request.Month);

            if (duplicateBudget != null)
            {
                return Conflict(new
                {
                    message = $"Another budget already exists for Category ID {request.CategoryId} in {request.Month}"
                });
            }

            // Update budget
            existingBudget.Allocated = request.Allocated;
            existingBudget.Month = request.Month;
            existingBudget.CategoryId = request.CategoryId;
            existingBudget.CategoryName = GetCategoryName(request.CategoryId);

            return Ok(existingBudget);
        }

        /// <summary>
        /// Partially update a budget (PATCH)
        /// </summary>
        [HttpPatch("{id}")]
        public ActionResult<BudgetResponse> PatchBudget(int id, [FromBody] UpdateBudgetRequest request)
        {
            // Same as PUT for simplicity, can be customized for partial updates
            return UpdateBudget(id, request);
        }

        /// <summary>
        /// Delete a budget
        /// </summary>
        [HttpDelete("{id}")]
        public IActionResult DeleteBudget(int id)
        {
            var budget = _budgets.FirstOrDefault(b => b.Id == id);

            if (budget == null)
            {
                return NotFound(new { message = $"Budget with ID {id} not found" });
            }

            _budgets.Remove(budget);
            return NoContent();
        }

        /// <summary>
        /// Delete budgets by month
        /// </summary>
        [HttpDelete("month/{month}")]
        public IActionResult DeleteBudgetsByMonth(string month)
        {
            // Validate month format
            if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
            {
                return BadRequest(new { message = "Month must be in format YYYY-MM" });
            }

            var budgetsToDelete = _budgets.Where(b => b.Month == month).ToList();
            int deletedCount = budgetsToDelete.Count;

            foreach (var budget in budgetsToDelete)
            {
                _budgets.Remove(budget);
            }

            return Ok(new { message = $"Deleted {deletedCount} budget(s) for month {month}" });
        }

        /// <summary>
        /// Check if budget exists (HEAD request)
        /// </summary>
        [HttpHead("{id}")]
        public IActionResult CheckBudgetExists(int id)
        {
            var exists = _budgets.Any(b => b.Id == id);
            return exists ? Ok() : NotFound();
        }

        /// <summary>
        /// Get budget summary for a month
        /// </summary>
        [HttpGet("summary/{month}")]
        public ActionResult<object> GetBudgetSummary(string month)
        {
            // Validate month format
            if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
            {
                return BadRequest(new { message = "Month must be in format YYYY-MM" });
            }

            var monthlyBudgets = _budgets.Where(b => b.Month == month).ToList();

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
                Budgets = monthlyBudgets
            };

            return Ok(summary);
        }

        // Helper method to get category name
        // In production, this would come from your Category service/repository
        private string GetCategoryName(int categoryId)
        {
            // This is a placeholder. Replace with actual category lookup
            var categories = new Dictionary<int, string>
            {
                { 1, "Food & Dining" },
                { 2, "Transportation" },
                { 3, "Entertainment" },
                { 4, "Shopping" },
                { 5, "Utilities" },
                { 6, "Healthcare" },
                { 7, "Education" },
                { 8, "Rent/Mortgage" }
            };

            return categories.ContainsKey(categoryId) ? categories[categoryId] : $"Category {categoryId}";
        }

        // Seed sample data
        private void SeedSampleData()
        {
            var sampleBudgets = new[]
            {
                new BudgetResponse { Id = _nextId++, Allocated = 500.00m, Month = "2024-01", CategoryId = 1, CategoryName = "Food & Dining" },
                new BudgetResponse { Id = _nextId++, Allocated = 200.00m, Month = "2024-01", CategoryId = 2, CategoryName = "Transportation" },
                new BudgetResponse { Id = _nextId++, Allocated = 150.00m, Month = "2024-01", CategoryId = 3, CategoryName = "Entertainment" },
                new BudgetResponse { Id = _nextId++, Allocated = 500.00m, Month = "2024-02", CategoryId = 1, CategoryName = "Food & Dining" },
                new BudgetResponse { Id = _nextId++, Allocated = 100.00m, Month = "2024-02", CategoryId = 4, CategoryName = "Shopping" }
            };

            _budgets.AddRange(sampleBudgets);
        }
    }
}