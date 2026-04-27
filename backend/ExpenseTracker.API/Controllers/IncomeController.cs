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

    public IncomeController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<IncomeResponse>>> GetAll()
    {
        var incomes = await _context.Incomes
            .Include(i => i.Category)
            .Select(i => new IncomeResponse
            {
                Id = i.Id,
                Method = i.Method,
                Source = i.Source,
                Amount = i.Amount,
                Date = i.Date,
                CategoryId = i.CategoryId,
                CategoryName = i.Category.Name ?? string.Empty,
                CategoryIcon = i.Category.Icon ?? string.Empty,
                CategoryColor = i.Category.Color ?? string.Empty
            })
            .ToListAsync();
        return Ok(incomes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IncomeResponse>> GetById(int id)
    {
        var income = await _context.Incomes
            .Include(i => i.Category)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (income == null) return NotFound();

        var response = new IncomeResponse
        {
            Id = income.Id,
            Method = income.Method,
            Source = income.Source,
            Amount = income.Amount,
            Date = income.Date,
            CategoryId = income.CategoryId,
            CategoryName = income.Category?.Name ?? string.Empty,
            CategoryIcon = income.Category?.Icon ?? string.Empty,
            CategoryColor = income.Category?.Color ?? string.Empty
        };

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<IncomeResponse>> Create(CreateIncomeRequest request)
    {
        var category = await _context.Categories.FindAsync(request.CategoryId);
        if (category == null) return BadRequest("Category not found");

        var income = new Income
        {
            Method = request.Method,
            Source = request.Source,
            Amount = request.Amount,
            Date = request.Date,
            CategoryId = request.CategoryId
        };

        _context.Incomes.Add(income);

        var transaction = new Transaction
        {
            Type = TransactionType.INCOME,
            Method = request.Method,
            Source = request.Source,
            Amount = request.Amount,
            Date = request.Date,
            CategoryId = request.CategoryId
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        var response = new IncomeResponse
        {
            Id = income.Id,
            Method = income.Method,
            Source = income.Source,
            Amount = income.Amount,
            Date = income.Date,
            CategoryId = income.CategoryId,
            CategoryName = category.Name,
            CategoryIcon = category.Icon ?? string.Empty,
            CategoryColor = category.Color ?? string.Empty
        };

        return CreatedAtAction(nameof(GetById), new { id = income.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<IncomeResponse>> Update(int id, UpdateIncomeRequest request)
    {
        var income = await _context.Incomes
            .Include(i => i.Category)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (income == null) return NotFound();

        var category = await _context.Categories.FindAsync(request.CategoryId);
        if (category == null) return BadRequest("Category not found");

        income.Method = request.Method;
        income.Source = request.Source;
        income.Amount = request.Amount;
        income.Date = request.Date;
        income.CategoryId = request.CategoryId;

        await _context.SaveChangesAsync();

        var response = new IncomeResponse
        {
            Id = income.Id,
            Method = income.Method,
            Source = income.Source,
            Amount = income.Amount,
            Date = income.Date,
            CategoryId = income.CategoryId,
            CategoryName = category.Name,
            CategoryIcon = category.Icon ?? string.Empty,
            CategoryColor = category.Color ?? string.Empty
        };

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var income = await _context.Incomes.FindAsync(id);
        if (income == null) return NotFound();

        _context.Incomes.Remove(income);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}