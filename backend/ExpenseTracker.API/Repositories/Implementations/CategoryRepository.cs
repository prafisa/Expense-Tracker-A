using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Repositories.Interfaces;

namespace ExpenseTracker.API.Repositories.Implementations
{
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context) : base(context) { }

        
    }
}