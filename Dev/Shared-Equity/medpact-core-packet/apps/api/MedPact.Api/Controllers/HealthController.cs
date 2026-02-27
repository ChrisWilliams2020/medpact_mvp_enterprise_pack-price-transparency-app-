using Microsoft.AspNetCore.Mvc;

namespace MedPact.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ok", service = "MedPact.Core.Api" });
}
