using ExpenseTracker.API.Repositories.Interfaces;

namespace ExpenseTracker.API.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        ICategoryRepository Categories { get; }
        ITransactionRepository Transactions { get; }
        IIncomeRepository Incomes { get; }
        IExpenseRepository Expenses { get; }
        IBudgetRepository Budgets { get; }
        Task<int> CompleteAsync();
    }
}