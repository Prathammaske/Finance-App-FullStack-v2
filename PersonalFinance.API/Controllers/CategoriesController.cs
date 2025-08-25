using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalFinance.API.Data;
using PersonalFinance.API.DTOs.Category;
using PersonalFinance.API.Models;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize] // Protection for the entire controller
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public CategoriesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET: api/categories
    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var categories = await _context.Categories
            .Where(c => c.UserId == userId)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name!
            })
            .ToListAsync();

        return Ok(categories);
    }

    // POST: api/categories
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto categoryDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var category = new Category
        {
            Name = categoryDto.Name,
            UserId = userId
        };

        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();

        // Map the created category back to a DTO to return it
        var categoryToReturn = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        };

        // Return a 201 Created response, a standard RESTful practice
        return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, categoryToReturn);
    }

    // PUT: api/categories/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CreateCategoryDto categoryDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // IMPORTANT: Find the category by its ID AND the user's ID
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (category == null)
        {
            // If it's not found, the user either doesn't own it or it doesn't exist.
            // In either case, it's "Not Found" for them.
            return NotFound();
        }

        category.Name = categoryDto.Name;
        await _context.SaveChangesAsync();

        // 204 No Content is a standard successful response for an update
        return NoContent();
    }

    // DELETE: api/categories/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // Same security check as PUT
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (category == null)
        {
            return NotFound();
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}