using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.DTOs.Expense;

namespace ExpenseTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpenseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExpenseController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetAll()
        {
            var expenses = await _context.Expenses
                .Include(e => e.Category)
                .Select(e => new ExpenseDto
                {
                    Id = e.Id,
                    Method = e.Method,
                    Reason = e.Reason,  
                    Amount = e.Amount,
                    Date = e.Date,
                    CategoryId = e.CategoryId,
                    CategoryName = e.Category.Name
                })
                .ToListAsync();
            return Ok(expenses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseDto>> GetById(int id)
        {
            var expense = await _context.Expenses
                .Include(e => e.Category)
                .FirstOrDefaultAsync(e => e.Id == id);
            if (expense == null) return NotFound();
            var dto = new ExpenseDto
            {
                Id = expense.Id,
                Method = expense.Method,
                Reason = expense.Reason,
                Amount = expense.Amount,    
                Date = expense.Date,
                CategoryId = expense.CategoryId,
                CategoryName = expense.Category.Name
            };
            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<ExpenseDto>> Create(CreateExpenseRequest request)
        {
            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category == null) return BadRequest("Category not found");
            var expense = new Expense
            {
                Method = request.Method,
                Reason = request.Reason,
                Amount = request.Amount,
                Date = request.Date,
                CategoryId = request.CategoryId
            };
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            var dto = new ExpenseDto
            {
                Id = expense.Id,
                Method = expense.Method,
                Reason = expense.Reason,
                Amount = expense.Amount,
                Date = expense.Date,
                CategoryId = expense.CategoryId,
                CategoryName = category.Name
            };
            return CreatedAtAction(nameof(GetById), new { id = expense.Id }, dto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ExpenseDto>> Update(int id, UpdateExpenseRequest request)
        {
            var expense = await _context.Expenses
                .Include(e => e.Category)
                .FirstOrDefaultAsync(e => e.Id == id);
            if (expense == null) return NotFound();
            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category == null) return BadRequest("Category not found");
            expense.Method = request.Method;
            expense.Reason = request.Reason;
            expense.Amount = request.Amount;
            expense.Date = request.Date;
            expense.CategoryId = request.CategoryId;
            await _context.SaveChangesAsync();
            var dto = new ExpenseDto
            {
                Id = expense.Id,
                Method = expense.Method,
                Reason = expense.Reason,
                Amount = expense.Amount,
                Date = expense.Date,
                CategoryId = expense.CategoryId,
                CategoryName = category.Name
            };
            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return NotFound();
            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}