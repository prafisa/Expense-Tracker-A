using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Repositories.Interfaces;

namespace ExpenseTracker.API.Repositories.Implementations
{
    public class BudgetRepository : Repository<Budget>, IBudgetRepository
    {
        public BudgetRepository(AppDbContext context) : base(context) { }
    }
}