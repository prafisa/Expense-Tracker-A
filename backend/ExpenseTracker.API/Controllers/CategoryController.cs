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

        // database context inject gareko
        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        // sabai categories list garne API
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetAll()
        {
            var categories = await _context.Categories
                .Select(c => new CategoryResponse
                {
                    Id = c.Id,
                    Name = c.Name,
                    Type = c.Type.ToString(),
                    Description = c.Description,
                    Icon = c.Icon,
                    Color = c.Color
                })
                .ToListAsync();

            return Ok(categories);
        }


        /// <summary>
        /// Get specific category by id
        /// </summary>
        // id ko basis ma specific category nikalne API
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryResponse>> GetById(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                return NotFound();

            var response = new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Type = category.Type.ToString(),
                Description = category.Description,
                Icon = category.Icon,
                Color = category.Color
            };

            return Ok(response);
        }

        /// <summary>
        /// Create a new category
        /// </summary>
        // naya category add garne API
        [HttpPost]
        public async Task<ActionResult<CategoryResponse>> Create(CreateCategoryRequest request)
        {
            // type valid cha ki chaina check garne
            if (!Enum.TryParse<TransactionType>(request.Type.ToUpper(), out var parsedType))
            {
                return BadRequest("Invalid category type. Use INCOME or EXPENSE.");
            }

            var category = new Category
            {
                Name = request.Name,
                Type = parsedType,
                Description = request.Description,
                Icon = request.Icon,
                Color = request.Color
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var response = new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Type = category.Type.ToString(),
                Description = category.Description,
                Icon = category.Icon,
                Color = category.Color
            };

            return CreatedAtAction(nameof(GetById), new { id = category.Id }, response);
        }

        // existing category update garne API
        [HttpPut("{id}")]
        public async Task<ActionResult<CategoryResponse>> Update(int id, UpdateCategoryRequest request)
        {
            var category = await _context.Categories.FindAsync(id);

            // category bhetena bhane not found pathaune
            if (category == null)
                return NotFound();

            // type valid cha ki check garne
            if (!Enum.TryParse<TransactionType>(request.Type.ToUpper(), out var parsedType))
            {
                return BadRequest("Invalid category type. Use INCOME or EXPENSE.");
            }

            // naya data le purano data replace garne
            category.Name = request.Name;
            category.Type = parsedType;
            category.Description = request.Description;
            category.Icon = request.Icon;
            category.Color = request.Color;

            await _context.SaveChangesAsync();

            var response = new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Type = category.Type.ToString(),
                Description = category.Description,
                Icon = category.Icon,
                Color = category.Color
            };

            return Ok(response);
        }

        // category delete garne API
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            // delete garna khojeko category bhetena bhane
            if (category == null)
                return NotFound();

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}