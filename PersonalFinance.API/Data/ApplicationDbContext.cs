using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PersonalFinance.API.Models;
namespace PersonalFinance.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        //Each DbSet will become a table in the database.
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Account> Accounts { get; set; }

        public DbSet<Budget> Budgets { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            // This is required to ensure the Identity tables are configured correctly
            base.OnModelCreating(builder);

            //  it demonstrates how the Fluent API works.
            builder.Entity<Transaction>()
                .Property(t => t.Amount)
                .HasColumnType("decimal(18, 2)");
        }
    }
}
