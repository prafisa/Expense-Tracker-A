using Microsoft.EntityFrameworkCore;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs.Income;
using ExpenseTracker.API.Enums;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IncomeController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<IncomeController> _logger;

    public IncomeController(AppDbContext context, ILogger<IncomeController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // ── GET /api/income ───────────────────────────────────────────────────────
    [HttpGet]
    public async Task<ActionResult<IEnumerable<IncomeResponse>>> GetAll()
    {
        try
        {
            var incomes = await _context.Incomes
                .Include(i => i.Category)
                .Select(i => ToResponse(i))
                .ToListAsync();

            return Ok(incomes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting incomes");
            return StatusCode(500, new { message = "Error retrieving incomes" });
        }
    }

    // ── GET /api/income/{id} ──────────────────────────────────────────────────
    [HttpGet("{id}")]
    public async Task<ActionResult<IncomeResponse>> GetById(int id)
    {
        try
        {
            var income = await _context.Incomes
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (income == null)
                return NotFound(new { message = "Income not found" });

            return Ok(ToResponse(income));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting income {Id}", id);
            return StatusCode(500, new { message = "Error retrieving income" });
        }
    }

    // ── POST /api/income ──────────────────────────────────────────────────────
    [HttpPost]
    public async Task<ActionResult<IncomeResponse>> Create(CreateIncomeRequest request)
    {
        try
        {
            var category = await _context.Categories.FindAsync(request.CategoryId);

            if (category == null)
                return BadRequest(new { message = "Category not found" });

            if (category.Type != TransactionType.INCOME)
                return BadRequest(new { message = "Category must be of type INCOME" });

            var income = new Income
            {
                Method     = request.Method,
                Source     = request.Source,
                Amount     = request.Amount,
                Date       = request.Date,
                CategoryId = request.CategoryId
            };

            _context.Incomes.Add(income);

            var transaction = new Transaction
            {
                Name       = request.Source ?? category.Name,
                Type       = TransactionType.INCOME,
                Method     = request.Method,
                Source     = request.Source,
                Amount     = request.Amount,
                Date       = request.Date,
                CategoryId = request.CategoryId
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = income.Id }, ToResponse(income));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating income");
            return StatusCode(500, new { message = "Error creating income" });
        }
    }
    
    // ── DELETE /api/income/{id} ───────────────────────────────────────────────
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var income = await _context.Incomes
                .Include(i => i.Category)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (income == null)
                return NotFound(new { message = "Income not found" });

            // remove mirror Transaction record
            var transaction = await _context.Transactions
                .FirstOrDefaultAsync(t =>
                    t.CategoryId == income.CategoryId &&
                    t.Type       == TransactionType.INCOME &&
                    t.Date       == income.Date &&
                    t.Amount     == income.Amount);

            if (transaction != null)
                _context.Transactions.Remove(transaction);

            _context.Incomes.Remove(income);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting income {Id}", id);
            return StatusCode(500, new { message = "Error deleting income" });
        }
    }

    // ── Private helper ────────────────────────────────────────────────────────
    private static IncomeResponse ToResponse(Income i) => new()
    {
        Id            = i.Id,
        Method        = i.Method,
        Source        = i.Source,
        Amount        = i.Amount,
        Date          = i.Date,
        CategoryId    = i.CategoryId,
        CategoryName  = i.Category?.Name  ?? string.Empty,
        CategoryIcon  = i.Category?.Icon  ?? string.Empty,
        CategoryColor = i.Category?.Color ?? string.Empty
    };
}