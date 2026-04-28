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

        // ── GET /api/category ─────────────────────────────────────────────────
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
                    .Select(c => ToResponse(c))
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting categories");
                return StatusCode(500, new { message = "Error retrieving categories" });
            }
        }

        // ── GET /api/category/{id} ────────────────────────────────────────────
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryResponse>> GetById(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);

                if (category == null)
                    return NotFound(new { message = "Category not found" });

                return Ok(ToResponse(category));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting category {Id}", id);
                return StatusCode(500, new { message = "Error retrieving category" });
            }
        }

        // ── POST /api/category ────────────────────────────────────────────────
        [HttpPost]
        public async Task<ActionResult<CategoryResponse>> Create(CreateCategoryRequest request)
        {
            try
            {
                var category = new Category
                {
                    Name        = request.Name,
                    Type        = request.Type,
                    Description = request.Description ?? string.Empty,
                    Icon        = request.Icon!,
                    Color       = request.Color ?? "#64748b"
                };

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = category.Id }, ToResponse(category));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category");
                return StatusCode(500, new { message = "Error creating category" });
            }
        }

        // ── PUT /api/category/{id} ────────────────────────────────────────────
        [HttpPut("{id}")]
        public async Task<ActionResult<CategoryResponse>> Update(int id, UpdateCategoryRequest request)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);

                if (category == null)
                    return NotFound(new { message = "Category not found" });

                category.Name        = request.Name;
                category.Type        = request.Type;
                category.Description = request.Description ?? string.Empty;
                category.Icon        = request.Icon!;
                category.Color       = request.Color ?? "#64748b";

                await _context.SaveChangesAsync();

                return Ok(ToResponse(category));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating category {Id}", id);
                return StatusCode(500, new { message = "Error updating category" });
            }
        }

        // ── DELETE /api/category/{id} ─────────────────────────────────────────
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
                    return BadRequest(new { message = "Cannot delete a category that is currently in use" });

                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category {Id}", id);
                return StatusCode(500, new { message = "Error deleting category" });
            }
        }

        // ── Private helper ────────────────────────────────────────────────────
        private static CategoryResponse ToResponse(Category c) => new()
        {
            Id          = c.Id,
            Name        = c.Name,
            Type        = c.Type,
            Description = c.Description,
            Icon        = c.Icon,
            Color       = c.Color
        };
    }
}