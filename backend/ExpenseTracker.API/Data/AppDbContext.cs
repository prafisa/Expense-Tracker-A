using Microsoft.EntityFrameworkCore;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Enums;

namespace ExpenseTracker.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Income> Incomes { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Budget> Budgets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── Category ──────────────────────────────────────────────────────
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Type).IsRequired()
                      .HasConversion<string>();
                entity.Property(c => c.Description).HasMaxLength(255);
                entity.Property(c => c.Icon).HasMaxLength(100);
                entity.Property(c => c.Color).HasMaxLength(20);
            });

            // ── Transaction ───────────────────────────────────────────────────
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Name).IsRequired().HasMaxLength(150);
                entity.Property(t => t.Type).IsRequired()
                      .HasConversion<string>();
                entity.Property(t => t.Source).IsRequired()
                      .HasConversion<string>();
                entity.Property(t => t.Reason).HasMaxLength(255);
                entity.Property(t => t.Amount).HasColumnType("decimal(18,2)");
                entity.Property(t => t.Date).IsRequired();

                entity.HasOne(t => t.Category)
                      .WithMany(c => c.Transactions)
                      .HasForeignKey(t => t.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ── Income ────────────────────────────────────────────────────────
            modelBuilder.Entity<Income>(entity =>
            {
                entity.HasKey(i => i.Id);
                entity.Property(i => i.Source).IsRequired()
                      .HasConversion<string>();
                entity.Property(i => i.Amount).HasColumnType("decimal(18,2)");
                entity.Property(i => i.Date).IsRequired();

                entity.HasOne(i => i.Category)
                      .WithMany(c => c.Incomes)
                      .HasForeignKey(i => i.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ── Expense ───────────────────────────────────────────────────────
            modelBuilder.Entity<Expense>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Source).IsRequired()
                      .HasConversion<string>();
                entity.Property(e => e.Reason).HasMaxLength(255);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Date).IsRequired();

                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Expenses)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ── Budget ────────────────────────────────────────────────────────
            modelBuilder.Entity<Budget>(entity =>
            {
                entity.HasKey(b => b.Id);
                entity.Property(b => b.Allocated).HasColumnType("decimal(18,2)");
                entity.Property(b => b.Month).IsRequired().HasMaxLength(7); // "2026-04"

                entity.HasOne(b => b.Category)
                      .WithMany(c => c.Budgets)
                      .HasForeignKey(b => b.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // ── Seed Categories ───────────────────────────────────────────────
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Food & Dining",  Type = TransactionType.EXPENSE, Icon = "UtensilsCrossed", Color = "#f97316", Description = "Food and dining expenses" },
                new Category { Id = 2, Name = "Transport",      Type = TransactionType.EXPENSE, Icon = "Bus",             Color = "#3b82f6", Description = "Transport expenses" },
                new Category { Id = 3, Name = "Health",         Type = TransactionType.EXPENSE, Icon = "Pill",            Color = "#22c55e", Description = "Health expenses" },
                new Category { Id = 4, Name = "Utilities",      Type = TransactionType.EXPENSE, Icon = "Zap",             Color = "#eab308", Description = "Utility bills" },
                new Category { Id = 5, Name = "Shopping",       Type = TransactionType.EXPENSE, Icon = "ShoppingBag",     Color = "#ec4899", Description = "Shopping expenses" },
                new Category { Id = 6, Name = "Entertainment",  Type = TransactionType.EXPENSE, Icon = "Gamepad2",        Color = "#8b5cf6", Description = "Entertainment expenses" },
                new Category { Id = 7, Name = "Salary",         Type = TransactionType.INCOME,  Icon = "Briefcase",       Color = "#14b8a6", Description = "Salary income" },
                new Category { Id = 8, Name = "Freelance",      Type = TransactionType.INCOME,  Icon = "Laptop",          Color = "#6366f1", Description = "Freelance income" },
                new Category { Id = 9, Name = "Investment",     Type = TransactionType.INCOME,  Icon = "TrendingUp",      Color = "#f59e0b", Description = "Investment returns" }
            );
        }
    }
}