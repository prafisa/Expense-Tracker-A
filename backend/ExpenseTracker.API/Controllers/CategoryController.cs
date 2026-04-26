using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.DTOs.Category;
using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(AppDbContext context, ILogger<CategoryController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetAll(
            [FromQuery] TransactionType? type = null)
        {
            try
            {
                var query = _context.Categories.AsQueryable();

                if (type.HasValue)
                    query = query.Where(c => c.Type == type.Value);

                var categories = await query
                    .Select(c => new CategoryResponse
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Type = c.Type,
                        Description = c.Description,
                        Icon = c.Icon,
                        Color = c.Color
                    })
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting categories");
                return StatusCode(500, new { message = "Error retrieving categories" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryResponse>> GetById(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);

                if (category == null)
                    return NotFound(new { message = "Category not found" });

                var response = new CategoryResponse
                {
                    Id = category.Id,
                    Name = category.Name,
                    Type = category.Type,
                    Description = category.Description,
                    Icon = category.Icon,
                    Color = category.Color
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting category by id");
                return StatusCode(500, new { message = "Error retrieving category" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<CategoryResponse>> Create(CreateCategoryRequest request)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(request.Name))
                    return BadRequest(new { message = "Category name is required" });

                if (string.IsNullOrWhiteSpace(request.Icon))
                    return BadRequest(new { message = "Category icon is required" });

                var category = new Category
                {
                    Name = request.Name,
                    Type = request.Type,
                    Description = request.Description ?? "",
                    Icon = request.Icon,
                    Color = request.Color ?? "#64748b"
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                var response = new CategoryResponse
                {
                    Id = category.Id,
                    Name = category.Name,
                    Type = category.Type,
                    Description = category.Description,
                    Icon = category.Icon,
                    Color = category.Color
                };

                return CreatedAtAction(nameof(GetById), new { id = category.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category");
                return StatusCode(500, new { message = "Error creating category" });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CategoryResponse>> Update(int id, UpdateCategoryRequest request)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);

                if (category == null)
                    return NotFound(new { message = "Category not found" });

                // Validate required fields
                if (string.IsNullOrWhiteSpace(request.Name))
                    return BadRequest(new { message = "Category name is required" });

                if (string.IsNullOrWhiteSpace(request.Icon))
                    return BadRequest(new { message = "Category icon is required" });

                category.Name = request.Name;
                category.Type = request.Type;
                category.Description = request.Description ?? "";
                category.Icon = request.Icon;
                category.Color = request.Color ?? "#64748b";

                await _context.SaveChangesAsync();

                var response = new CategoryResponse
                {
                    Id = category.Id,
                    Name = category.Name,
                    Type = category.Type,
                    Description = category.Description,
                    Icon = category.Icon,
                    Color = category.Color
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating category");
                return StatusCode(500, new { message = "Error updating category" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);

                if (category == null)
                    return NotFound(new { message = "Category not found" });

                bool inUse = await _context.Transactions.AnyAsync(t => t.CategoryId == id)
                          || await _context.Incomes.AnyAsync(i => i.CategoryId == id)
                          || await _context.Expenses.AnyAsync(e => e.CategoryId == id);

                if (inUse)
                    return BadRequest(new { message = "Cannot delete category that is in use" });

                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category");
                return StatusCode(500, new { message = "Error deleting category" });
            }
        }
    }
}