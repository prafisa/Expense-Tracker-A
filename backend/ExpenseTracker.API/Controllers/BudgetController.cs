using Microsoft.AspNetCore.Mvc;
using ExpenseTracker.API.DTOs.Budget;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetController : ControllerBase
    {
        private static List<BudgetResponse> _budgets = new();
        private static int _nextId = 1;
        private static readonly object _lock = new object();

        public BudgetController()
        {
            lock (_lock)
            {
                if (!_budgets.Any())
                {
                    SeedSampleData();
                }
            }
        }

        /// <summary>
        /// Get all budgets with optional year and month filters
        /// </summary>
        [HttpGet]
        public ActionResult<IEnumerable<BudgetResponse>> GetAllBudgets([FromQuery] int? year = null, [FromQuery] int? month = null)
        {
            var query = _budgets.AsEnumerable();
            
            if (year.HasValue)
            {
                query = query.Where(b => b.Month.StartsWith($"{year}-"));
            }
            
            if (month.HasValue && year.HasValue)
            {
                query = query.Where(b => b.Month == $"{year}-{month:D2}");
            }
            
            return Ok(query.ToList());
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
            if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
            {
                return BadRequest(new { message = "Month must be in format YYYY-MM" });
            }

            var budgets = _budgets.Where(b => b.Month == month).ToList();
            return Ok(budgets);
        }

        /// <summary>
        /// Get available years and months
        /// </summary>
        [HttpGet("available-dates")]
        public ActionResult<object> GetAvailableDates()
        {
            var years = _budgets.Select(b => int.Parse(b.Month.Split('-')[0])).Distinct().OrderBy(y => y).ToList();
            var months = Enumerable.Range(1, 12).Select(m => new { Value = m, Name = new DateTime(2000, m, 1).ToString("MMMM") }).ToList();
            
            return Ok(new { years, months });
        }

        /// <summary>
        /// Create a new budget
        /// </summary>
        [HttpPost]
        public ActionResult<BudgetResponse> CreateBudget([FromBody] CreateBudgetRequest request)
        {
            lock (_lock)
            {
                // Validate
                if (request.Allocated <= 0)
                {
                    return BadRequest(new { message = "Allocated amount must be greater than 0" });
                }

                // Check for duplicates
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
                    CategoryName = GetCategoryName(request.CategoryId)
                };

                _budgets.Add(newBudget);
                return CreatedAtAction(nameof(GetBudgetById), new { id = newBudget.Id }, newBudget);
            }
        }

        /// <summary>
        /// Update an existing budget - FIXED VERSION
        /// </summary>
        [HttpPut("{id}")]
        public ActionResult<BudgetResponse> UpdateBudget(int id, [FromBody] UpdateBudgetRequest request)
        {
            Console.WriteLine($"UpdateBudget called with ID: {id}");
            Console.WriteLine($"Request data: Allocated={request.Allocated}, Month={request.Month}, CategoryId={request.CategoryId}");
            
            lock (_lock)
            {
                var existingBudget = _budgets.FirstOrDefault(b => b.Id == id);
                if (existingBudget == null)
                {
                    Console.WriteLine($"Budget with ID {id} not found");
                    return NotFound(new { message = $"Budget with ID {id} not found" });
                }

                // Check for duplicate (excluding current budget)
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
                
                Console.WriteLine($"Budget updated successfully: {existingBudget.Id}");
                return Ok(existingBudget);
            }
        }

        /// <summary>
        /// Delete a budget
        /// </summary>
        [HttpDelete("{id}")]
        public IActionResult DeleteBudget(int id)
        {
            lock (_lock)
            {
                var budget = _budgets.FirstOrDefault(b => b.Id == id);
                if (budget == null)
                {
                    return NotFound(new { message = $"Budget with ID {id} not found" });
                }

                _budgets.Remove(budget);
                return NoContent();
            }
        }

        /// <summary>
        /// Delete budgets by month
        /// </summary>
        [HttpDelete("month/{month}")]
        public IActionResult DeleteBudgetsByMonth(string month)
        {
            if (!System.Text.RegularExpressions.Regex.IsMatch(month, @"^\d{4}-\d{2}$"))
            {
                return BadRequest(new { message = "Month must be in format YYYY-MM" });
            }

            lock (_lock)
            {
                var budgetsToDelete = _budgets.Where(b => b.Month == month).ToList();
                int deletedCount = budgetsToDelete.Count;

                foreach (var budget in budgetsToDelete)
                {
                    _budgets.Remove(budget);
                }

                return Ok(new { message = $"Deleted {deletedCount} budget(s) for month {month}" });
            }
        }

        /// <summary>
        /// Get budget summary for a month
        /// </summary>
        [HttpGet("summary/{month}")]
        public ActionResult<object> GetBudgetSummary(string month)
        {
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

        private string GetCategoryName(int categoryId)
        {
            var categories = new Dictionary<int, string>
            {
                { 1, "Food & Dining" },
                { 2, "Transportation" },
                { 3, "Entertainment" },
                { 4, "Shopping" },
                { 5, "Utilities" },
                { 6, "Healthcare" },
                { 7, "Education" },
                { 8, "Rent/Mortgage" },
                { 9, "Insurance" },
                { 10, "Savings" }
            };

            return categories.GetValueOrDefault(categoryId, $"Category {categoryId}");
        }

        private void SeedSampleData()
        {
            _budgets.Clear();
            _nextId = 1;
            
            var sampleBudgets = new List<BudgetResponse>
            {
                new BudgetResponse { Id = _nextId++, Allocated = 750.00m, Month = "2024-01", CategoryId = 1, CategoryName = GetCategoryName(1) },
                new BudgetResponse { Id = _nextId++, Allocated = 300.00m, Month = "2024-01", CategoryId = 2, CategoryName = GetCategoryName(2) },
                new BudgetResponse { Id = _nextId++, Allocated = 200.00m, Month = "2024-01", CategoryId = 3, CategoryName = GetCategoryName(3) },
                new BudgetResponse { Id = _nextId++, Allocated = 650.00m, Month = "2024-02", CategoryId = 1, CategoryName = GetCategoryName(1) },
                new BudgetResponse { Id = _nextId++, Allocated = 150.00m, Month = "2024-02", CategoryId = 4, CategoryName = GetCategoryName(4) },
                new BudgetResponse { Id = _nextId++, Allocated = 800.00m, Month = "2024-03", CategoryId = 1, CategoryName = GetCategoryName(1) },
                new BudgetResponse { Id = _nextId++, Allocated = 350.00m, Month = "2024-03", CategoryId = 5, CategoryName = GetCategoryName(5) },
                new BudgetResponse { Id = _nextId++, Allocated = 900.00m, Month = "2024-04", CategoryId = 1, CategoryName = GetCategoryName(1) },
                new BudgetResponse { Id = _nextId++, Allocated = 400.00m, Month = "2024-04", CategoryId = 2, CategoryName = GetCategoryName(2) }
            };

            _budgets.AddRange(sampleBudgets);
        }
    }
}