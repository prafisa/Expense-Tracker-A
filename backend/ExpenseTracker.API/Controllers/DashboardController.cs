using ExpenseTracker.API.Data;
using ExpenseTracker.API.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController :ControllerBase
    {
        private readonly AppDbContext _context;
        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // URL: GET /api/dashboard/summary
        // URL: GET /api/dashboard/summary?dateFrom=2026-04-01&dateTo=2026-04-30
        [HttpGet("summary")]
        //read from url
        public async Task<IActionResult> GetSummary([FromQuery] DateTime? dateFrom, [FromQuery] DateTime? dateTo)
        {
            //get all transactions (no data filter) used for net balance
            var allTransactions = await _context.Transactions
                .Include(t => t.Category)
                .ToListAsync();

            //get filtered transactions used for income, expense and savings
            var query = _context.Transactions
                .Include(t => t.Category)
                .AsQueryable(); //build the query but don't run yet

            // if user passed ?dateFrom= and ?dateFrom=  in URL, filter by it
            if (dateFrom.HasValue)
                query = query.Where(t => t.Date >= dateFrom.Value);

            if (dateTo.HasValue)
                query = query.Where(t => t.Date <= dateTo.Value);

            var filtered = await query.ToListAsync();


            //calculate summary numbers
            //total income in selected period
            var periodIncome = filtered
                .Where(t => t.Type == TransactionType.INCOME)
                .Sum(t => t.Amount);

            //total expense in selected period
            var periodExpense = filtered
                .Where(t => t.Type == TransactionType.EXPENSE)
                .Sum (t => t.Amount);

            //net savings == income minus expense 
            var netSavings = periodIncome - periodExpense;

            //savings rate = what % of income was saved
            var savingsRate = periodIncome > 0
                ? Math.Round((netSavings/periodIncome)*100,1)
                : 0;

            //net balance = all time income minus all time expense
            //all time income
            var allTimeIncome = allTransactions
                .Where(t => t.Type == TransactionType.INCOME)
                .Sum(t => t.Amount);

            //all time expense
            var allTimeExpense = allTransactions
                .Where(t=> t.Type == TransactionType.EXPENSE)
                .Sum((t) => t.Amount);

            //net balance
            var netBalance = allTimeIncome - allTimeExpense;


            //monthly chart data

            //groupby groups transaction by momnth

            var monthlyData = filtered
                .GroupBy(t => new
                {
                    Year = t.Date.Year,
                    Month = t.Date.Month
                })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    month = $"{g.Key.Year}-{g.Key.Month:D2}",
                    income = g.Where(t => t.Type == TransactionType.INCOME)
                            .Sum(t => t.Amount),
                    expense = g.Where(t => t.Type == TransactionType.EXPENSE)
                            .Sum(t => t.Amount),
                })
                .ToList();

            //category donut chart data
            //{ name: "Food & Dining", amount: 200, percentage: 40 }
            //get total expene for percentage calculation
            var totalExpenseAmount = filtered
                .Where(t => t.Type == TransactionType.EXPENSE)
                .Sum(t => t.Amount);

            //group expense by category name
            var CategoryData = filtered
                .Where(t => t.Type == TransactionType.EXPENSE)
                .GroupBy(t => t.Category.Name)
                .Select(g => new
                {
                    name = g.Key, //food
                    amount = g.Sum(t => t.Amount), //total amount
                    // percentage = this category / total * 100
                    percentage = totalExpenseAmount > 0
                        ? (int)Math.Round(
                            (g.Sum(t => t.Amount) / totalExpenseAmount) * 100)
                        : 0
                })
                .OrderByDescending(c => c.amount)
                .ToList();

            //daily chart data

            var days = new[] { "Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat" };

            //get today's date
            var today = DateTime.Today;

            //get this week's sunday
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek);

            var dailyData = Enumerable.Range(0, 7).Select(i =>
            {
                var day = startOfWeek.AddDays(i);

                return new
                {
                    day = days[i],
                    amount = allTransactions
                    .Where(t => t.Date.Date == day.Date
                    && t.Type == TransactionType.EXPENSE)
                    .Sum(t => t.Amount)
                };
            })
                .ToList();

            //result
            //            [
            //  { "day": "Sun", "amount": 0   },
            //  { "day": "Mon", "amount": 45  },
            //  { "day": "Tue", "amount": 120 },
            //  { "day": "Wed", "amount": 112 },
            //  { "day": "Thu", "amount": 0   },
            //  { "day": "Fri", "amount": 95  },
            //  { "day": "Sat", "amount": 180 }
            //]


            //recent 5 transaction
            var recentTransactions = filtered
                .OrderByDescending(t => t.Date)
                .Take(5)
                .Select(t => new
                {
                    id = t.Id,
                    name = t.Name,
                    type = t.Type.ToString(),
                    categoryName = t.Category.Name,
                    amount = t.Amount,
                    date = t.Date,
                    method = t.Method.ToString(), // ← Method enum
                    source = t.Source
                })
                .ToList();

            //return everything as json
            return Ok(new
            {
                // summary cards
                periodIncome,             // income in selected period
                periodExpense,            // expense in selected period
                netSavings,               // savings in selected period
                savingsRate,              // savings % in selected period
                netBalance,               // all time balance

                // transaction counts
                totalTransactions = filtered.Count,
                totalIncomeTransactions = filtered
                   .Count(t => t.Type == TransactionType.INCOME),
                totalExpenseTransactions = filtered
                   .Count(t => t.Type == TransactionType.EXPENSE),

                // chart data
                monthlyData,    //  bar chart
                CategoryData,   // donut chart
                dailyData,      // daily chart

                // list
                recentTransactions
            });
        }

    }
}
