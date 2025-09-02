using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
// THIS IS THE KEY: Protect the entire controller
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    [HttpGet("health")]
    public IActionResult GetSystemHealth()
    {
        return Ok(new { Status = "API is running correctly." });
    }
}