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

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        // sabai categories list garne, optional type filter satha
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetAll(
            [FromQuery] TransactionType? type = null)
        {
            var query = _context.Categories.AsQueryable();

            if (type.HasValue)
                query = query.Where(c => c.Type == type.Value);

            var categories = await query
                .Select(c => new CategoryResponse
                {
                    Id          = c.Id,
                    Name        = c.Name,
                    Type        = c.Type,
                    Description = c.Description,
                    Icon        = c.Icon,
                    Color       = c.Color
                })
                .ToListAsync();

            return Ok(categories);
        }

        // id le specific category nikalne
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryResponse>> GetById(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                return NotFound();

            var response = new CategoryResponse
            {
                Id          = category.Id,
                Name        = category.Name,
                Type        = category.Type,
                Description = category.Description,
                Icon        = category.Icon,
                Color       = category.Color
            };

            return Ok(response);
        }

        // naya category banauney
        [HttpPost]
        public async Task<ActionResult<CategoryResponse>> Create(CreateCategoryRequest request)
        {
            var category = new Category
            {
                Name        = request.Name,
                Type        = request.Type,
                Description = request.Description,
                Icon        = request.Icon,
                Color       = request.Color
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var response = new CategoryResponse
            {
                Id          = category.Id,
                Name        = category.Name,
                Type        = category.Type,
                Description = category.Description,
                Icon        = category.Icon,
                Color       = category.Color
            };

            return CreatedAtAction(nameof(GetById), new { id = category.Id }, response);
        }

        // existing category update garne
        [HttpPut("{id}")]
        public async Task<ActionResult<CategoryResponse>> Update(int id, UpdateCategoryRequest request)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                return NotFound();

            category.Name        = request.Name;
            category.Type        = request.Type;
            category.Description = request.Description;
            category.Icon        = request.Icon;
            category.Color       = request.Color;

            await _context.SaveChangesAsync();

            var response = new CategoryResponse
            {
                Id          = category.Id,
                Name        = category.Name,
                Type        = category.Type,
                Description = category.Description,
                Icon        = category.Icon,
                Color       = category.Color
            };

            return Ok(response);
        }

        // category delete garne — use ma cha bhane delete nagarne
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                return NotFound();

            bool inUse = await _context.Transactions.AnyAsync(t => t.CategoryId == id)
                      || await _context.Incomes.AnyAsync(i => i.CategoryId == id)
                      || await _context.Expenses.AnyAsync(e => e.CategoryId == id);

            if (inUse)
                return BadRequest("Cannot delete category that is in use.");

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}