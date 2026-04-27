// 


//etako remove if not work
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.DTOs.Expense;
using ExpenseTracker.API.Enums;

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
        public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetAll(
            [FromQuery] int? categoryId = null,
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null)
        {
            var query = _context.Expenses
                .Include(e => e.Category)
                .AsQueryable();

            if (categoryId.HasValue)
                query = query.Where(e => e.CategoryId == categoryId.Value);

            if (from.HasValue)
                query = query.Where(e => e.Date >= from.Value);

            if (to.HasValue)
                query = query.Where(e => e.Date <= to.Value);

            var expenses = await query
                .OrderByDescending(e => e.Date)
                .Select(e => new ExpenseDto
                {
                    Id            = e.Id,
                    Method        = e.Method,
                    Reason        = e.Reason,
                    Amount        = e.Amount,
                    Date          = e.Date,
                    CategoryId    = e.CategoryId,
                    CategoryName  = e.Category.Name,
                    CategoryIcon  = e.Category.Icon,
                    CategoryColor = e.Category.Color
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
                Id            = expense.Id,
                Method        = expense.Method,
                Reason        = expense.Reason,
                Amount        = expense.Amount,
                Date          = expense.Date,
                CategoryId    = expense.CategoryId,
                CategoryName  = expense.Category.Name,
                CategoryIcon  = expense.Category.Icon,
                CategoryColor = expense.Category.Color
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
                Method     = request.Method,
                Reason     = request.Reason,
                Amount     = request.Amount,
                Date       = request.Date,
                CategoryId = request.CategoryId
            };
            _context.Expenses.Add(expense);

            // auto create transaction
            var transaction = new Transaction
            {
                Name       = category.Name,             // ← fixed
                Type       = TransactionType.EXPENSE,
                Method     = request.Method,
                Source     = request.Reason,
                Amount     = request.Amount,
                Date       = request.Date,
                CategoryId = request.CategoryId
            };
            _context.Transactions.Add(transaction);

            await _context.SaveChangesAsync();

            var dto = new ExpenseDto
            {
                Id            = expense.Id,
                Method        = expense.Method,
                Reason        = expense.Reason,
                Amount        = expense.Amount,
                Date          = expense.Date,
                CategoryId    = expense.CategoryId,
                CategoryName  = category.Name,
                CategoryIcon  = category.Icon,
                CategoryColor = category.Color
            };

            return CreatedAtAction(nameof(GetById), new { id = expense.Id }, dto);
        }
    }
}