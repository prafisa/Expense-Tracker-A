
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Repositories.Interfaces;

namespace ExpenseTracker.API.Repositories.Implementations
{
    public class IncomeRepository : Repository<Income>, IIncomeRepository
    {
        public IncomeRepository(AppDbContext context) : base(context) { }

    
    }
}