using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using PersonalFinance.API.Controllers;
using PersonalFinance.API.Data;
using PersonalFinance.API.Models;
using PersonalFinance.API.DTOs.Transaction;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using System.Threading.Tasks;

public class TransactionsControllerTests
{
    [Fact]
    public async Task CreateTransaction_WithValidData_ReturnsCreatedAtActionResult()
    {
        // ARRANGE

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;
        var dbContext = new ApplicationDbContext(options);

        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
        var userManagerMock = new Mock<UserManager<ApplicationUser>>(
            userStoreMock.Object, null, null, null, null, null, null, null, null);

        var mapperMock = new Mock<IMapper>();

        var controller = new TransactionsController(dbContext, userManagerMock.Object, mapperMock.Object);

        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, "test-user-id")
        }, "mock"));
        controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext() { User = user }
        };

        dbContext.Categories.Add(new Category { Id = 1, UserId = "test-user-id", Name = "Test" });
        dbContext.Accounts.Add(new Account { Id = 1, UserId = "test-user-id", Name = "Test" });
        await dbContext.SaveChangesAsync();

        var createTransactionDto = new CreateTransactionDto
        {
            CategoryId = 1,
            AccountId = 1,
            Amount = 100,
            Title = "Test Transaction"
        };

        // ACT
        var result = await controller.CreateTransaction(createTransactionDto);

        // ASSERT
        var actionResult = Assert.IsType<CreatedAtActionResult>(result);
        var createdTransaction = Assert.IsType<Transaction>(actionResult.Value);
        Assert.Equal(100, createdTransaction.Amount);
        Assert.Equal("test-user-id", createdTransaction.UserId);
    }
}