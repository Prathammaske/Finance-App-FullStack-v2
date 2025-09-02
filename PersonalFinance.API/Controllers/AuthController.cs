using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PersonalFinance.API.DTOs.Auth;
using PersonalFinance.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var userExists = await _userManager.FindByEmailAsync(registerDto.Email!);
        if (userExists != null)
        {
            return BadRequest(new AuthResponseDto { IsSuccess = false, Message = "User already exists!" });
        }

        ApplicationUser newUser = new()
        {
            Email = registerDto.Email,
            UserName = registerDto.Username,
            SecurityStamp = Guid.NewGuid().ToString()
        };

        var result = await _userManager.CreateAsync(newUser, registerDto.Password!);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return BadRequest(new AuthResponseDto { IsSuccess = false, Message = $"User creation failed: {errors}" });
        }

        return Ok(new AuthResponseDto { IsSuccess = true, Message = "User created successfully!" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email!);

        if (user != null && await _userManager.CheckPasswordAsync(user, loginDto.Password!))
        {
            // The 'await' is needed because GenerateJwtToken now fetches roles asynchronously
            var tokenString = await GenerateJwtToken(user);

            // Return the single access token
            return Ok(new AuthResponseDto { IsSuccess = true, Token = tokenString, Message = "Login successful" });
        }

        return Unauthorized(new AuthResponseDto { IsSuccess = false, Message = "Invalid credentials" });
    }

    // This method must be 'async Task<string>' to use 'await' for getting roles
    private async Task<string> GenerateJwtToken(ApplicationUser user)
    {
        // Use a List<Claim> so we can add the role claims to it
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // Get the user's roles from the database
        var userRoles = await _userManager.GetRolesAsync(user);

        // Add a role claim for each role the user has
        foreach (var userRole in userRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, userRole));
        }

        var jwtKey = _configuration["Jwt:Key"]!;
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            expires: DateTime.UtcNow.AddHours(3), // Set a reasonable expiration for the access token
            claims: claims,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}