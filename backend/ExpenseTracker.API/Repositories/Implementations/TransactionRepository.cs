using Microsoft.EntityFrameworkCore;
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Enums;
using ExpenseTracker.API.Repositories.Interfaces;

namespace ExpenseTracker.API.Repositories.Implementations
{
    public class TransactionRepository : Repository<Transaction>, ITransactionRepository
    {
        public TransactionRepository(AppDbContext context) : base(context) { }

        
    }
}