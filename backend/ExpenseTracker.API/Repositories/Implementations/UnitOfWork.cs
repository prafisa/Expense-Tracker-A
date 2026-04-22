using ExpenseTracker.API.Data;
using ExpenseTracker.API.Repositories.Interfaces;
using ExpenseTracker.API.Repositories.Implementations;

namespace ExpenseTracker.API.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public ICategoryRepository Categories { get; private set; }
        public ITransactionRepository Transactions { get; private set; }
        public IIncomeRepository Incomes { get; private set; }
        public IExpenseRepository Expenses { get; private set; }
        public IBudgetRepository Budgets { get; private set; }

        public UnitOfWork(AppDbContext context)
        {
            _context     = context;
            Categories   = new CategoryRepository(context);
            Transactions = new TransactionRepository(context);
            Incomes      = new IncomeRepository(context);
            Expenses     = new ExpenseRepository(context);
            Budgets      = new BudgetRepository(context);
        }

        public async Task<int> CompleteAsync()
            => await _context.SaveChangesAsync();

        public void Dispose()
            => _context.Dispose();
    }
}