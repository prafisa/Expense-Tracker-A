using ExpenseTracker.API.Data;
using ExpenseTracker.API.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(AppDbContext context, ILogger<DashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ── GET /api/dashboard/summary ────────────────────────────────────────
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary(
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null)
        {
            try
            {
                // one load for all transactions — used for net balance + daily chart
                var allTransactions = await _context.Transactions
                    .Include(t => t.Category)
                    .ToListAsync();

                // filtered period
                var filtered = allTransactions.AsEnumerable();

                if (dateFrom.HasValue)
                    filtered = filtered.Where(t => t.Date >= dateFrom.Value);

                if (dateTo.HasValue)
                    filtered = filtered.Where(t => t.Date <= dateTo.Value);

                var filteredList = filtered.ToList();

                // previous period (for trend comparison)
                IEnumerable<ExpenseTracker.API.Models.Transaction> prevList = new List<ExpenseTracker.API.Models.Transaction>();

                if (dateFrom.HasValue && dateTo.HasValue)
                {
                    var range   = (dateTo.Value - dateFrom.Value).Days + 1;
                    var prevFrom = dateFrom.Value.AddDays(-range);
                    var prevTo   = dateFrom.Value.AddDays(-1);

                    prevList = allTransactions
                        .Where(t => t.Date >= prevFrom && t.Date <= prevTo);
                }

                var prevIncome  = prevList.Where(t => t.Type == TransactionType.INCOME).Sum(t => t.Amount);
                var prevExpense = prevList.Where(t => t.Type == TransactionType.EXPENSE).Sum(t => t.Amount);
                var prevSavings = prevIncome - prevExpense;

                // current period summary
                var periodIncome  = filteredList.Where(t => t.Type == TransactionType.INCOME).Sum(t => t.Amount);
                var periodExpense = filteredList.Where(t => t.Type == TransactionType.EXPENSE).Sum(t => t.Amount);
                var netSavings    = periodIncome - periodExpense;
                var savingsRate   = periodIncome > 0 ? Math.Round((netSavings / periodIncome) * 100, 1) : 0;

                // all-time net balance
                var allTimeIncome  = allTransactions.Where(t => t.Type == TransactionType.INCOME).Sum(t => t.Amount);
                var allTimeExpense = allTransactions.Where(t => t.Type == TransactionType.EXPENSE).Sum(t => t.Amount);
                var netBalance     = allTimeIncome - allTimeExpense;

                // trend diffs
                decimal incomeDiff       = periodIncome - prevIncome;
                decimal expenseDiff      = periodExpense - prevExpense;
                decimal savingsDiff      = netSavings - prevSavings;
                decimal incomeRate       = prevIncome  > 0 ? Math.Round((incomeDiff  / prevIncome)  * 100, 1) : 0;
                decimal expenseRate      = prevExpense > 0 ? Math.Round((expenseDiff / prevExpense) * 100, 1) : 0;
                decimal savingsRateChange = prevSavings != 0 ? Math.Round((savingsDiff / Math.Abs(prevSavings)) * 100, 1) : 0;

                // monthly bar chart
                var monthlyData = filteredList
                    .GroupBy(t => new { t.Date.Year, t.Date.Month })
                    .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                    .Select(g => new
                    {
                        month   = $"{g.Key.Year}-{g.Key.Month:D2}",
                        income  = g.Where(t => t.Type == TransactionType.INCOME).Sum(t => t.Amount),
                        expense = g.Where(t => t.Type == TransactionType.EXPENSE).Sum(t => t.Amount)
                    }).ToList();

                // category donut chart
                var totalExpenseAmount = filteredList
                    .Where(t => t.Type == TransactionType.EXPENSE).Sum(t => t.Amount);

                var categoryData = filteredList
                    .Where(t => t.Type == TransactionType.EXPENSE)
                    .GroupBy(t => t.Category.Name)
                    .Select(g => new
                    {
                        name       = g.Key,
                        icon       = g.First().Category.Icon,
                        color      = g.First().Category.Color,
                        amount     = g.Sum(t => t.Amount),
                        percentage = totalExpenseAmount > 0
                            ? (int)Math.Round((g.Sum(t => t.Amount) / totalExpenseAmount) * 100)
                            : 0
                    })
                    .OrderByDescending(c => c.amount)
                    .ToList();

                // daily chart — always current week, always all-time data
                var days        = new[] { "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" };
                var today       = DateTime.Today;
                var startOfWeek = today.AddDays(-(int)today.DayOfWeek);

                var dailyData = Enumerable.Range(0, 7).Select(i =>
                {
                    var day = startOfWeek.AddDays(i);
                    return new
                    {
                        day    = days[i],
                        amount = allTransactions
                            .Where(t => t.Date.Date == day.Date && t.Type == TransactionType.EXPENSE)
                            .Sum(t => t.Amount)
                    };
                }).ToList();

                // recent 5 transactions — all-time, not filtered
                var recentTransactions = allTransactions
                    .OrderByDescending(t => t.Date)
                    .Take(5)
                    .Select(t => new
                    {
                        id            = t.Id,
                        name          = t.Name,
                        type          = t.Type.ToString(),
                        categoryName  = t.Category?.Name,
                        categoryIcon  = t.Category?.Icon,
                        categoryColor = t.Category?.Color,
                        amount        = t.Amount,
                        date          = t.Date,
                        method        = t.Method.ToString(),
                        source        = t.Source
                    }).ToList();

                return Ok(new
                {
                    netBalance,
                    periodIncome,
                    incomeDiff,
                    incomeRate,
                    periodExpense,
                    expenseDiff,
                    expenseRate,
                    netSavings,
                    savingsRate,
                    savingsDiff,
                    savingsRateChange,
                    totalTransactions        = filteredList.Count,
                    totalIncomeTransactions  = filteredList.Count(t => t.Type == TransactionType.INCOME),
                    totalExpenseTransactions = filteredList.Count(t => t.Type == TransactionType.EXPENSE),
                    monthlyData,
                    categoryData,
                    dailyData,
                    recentTransactions
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard summary");
                return StatusCode(500, new { message = "Error retrieving dashboard summary" });
            }
        }
    }
}