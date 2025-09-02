using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalFinance.API.Data;
using PersonalFinance.API.DTOs.Account; 
using PersonalFinance.API.Models;
using System.Security.Claims;
[Route("api/[controller]")]
[ApiController]
[Authorize] 
public class AccountsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    public AccountsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET: api/accounts
    [HttpGet]
    public async Task<IActionResult> GetAccounts()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var accounts = await _context.Accounts 
            .Where(a => a.UserId == userId) 
            .Select(a => new AccountDto 
            {
                Id = a.Id,
                Name = a.Name!
            })
            .ToListAsync();

        return Ok(accounts);
    }

    // POST: api/accounts
    [HttpPost]
    public async Task<IActionResult> CreateAccount([FromBody] CreateAccountDto accountDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var account = new Account 
        {
            Name = accountDto.Name,
            UserId = userId 
        };

        await _context.Accounts.AddAsync(account);
        await _context.SaveChangesAsync();

        var accountToReturn = new AccountDto
        {
            Id = account.Id,
            Name = account.Name
        };

        return CreatedAtAction(nameof(GetAccounts), new { id = account.Id }, accountToReturn);
    }

    // PUT: api/accounts/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAccount(int id, [FromBody] CreateAccountDto accountDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        
        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (account == null)
        {
            return NotFound();
        }

        account.Name = accountDto.Name;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/accounts/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAccount(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // Securely find the account by Id AND UserId
        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (account == null)
        {
            return NotFound();
        }

        _context.Accounts.Remove(account);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}