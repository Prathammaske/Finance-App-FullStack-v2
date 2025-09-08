using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalFinance.API.Services;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _notificationService;

    public NotificationsController(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpPost("trigger-check")]
    public async Task<IActionResult> TriggerNotificationCheck()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var billReminders = await _notificationService.CheckUpcomingBills(userId);
        var budgetAlerts = await _notificationService.CheckBudgetThresholds(userId);

        var allNotifications = billReminders.Concat(budgetAlerts).ToList();

        // We can return the messages to the frontend if we want
        return Ok(new { Message = "Notification check complete. See server console log for details.", Notifications = allNotifications });
    }
}