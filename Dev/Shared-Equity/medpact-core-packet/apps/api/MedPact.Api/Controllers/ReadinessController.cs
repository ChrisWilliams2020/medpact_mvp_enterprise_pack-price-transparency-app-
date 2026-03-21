using MedPact.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedPact.Api.Controllers;

[ApiController]
[Route("api/ready")]
[AllowAnonymous]
public class ReadinessController : ControllerBase
{
    private readonly MedPactDbContext _db;

    public ReadinessController(MedPactDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            // quick DB check
            await _db.Database.ExecuteSqlRawAsync("SELECT 1");

            // check for pending migrations
            var pending = (await _db.Database.GetPendingMigrationsAsync()).Any();
            if (pending)
                return StatusCode(503, new { status = "migrations_pending" });

            return Ok(new { status = "ready" });
        }
        catch (Exception ex)
        {
            return StatusCode(503, new { status = "unavailable", error = ex.Message });
        }
    }
}
