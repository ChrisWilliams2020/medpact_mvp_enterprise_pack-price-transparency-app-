using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MedPact.Infrastructure.Persistence;
using MedPact.Domain.Org;
using Microsoft.AspNetCore.Mvc;

namespace MedPact.Api.Controllers;

[ApiController]
[Route("provider-states")]
public class PactProviderStatesController : ControllerBase
{
    private readonly MedPactDbContext _db;
    private readonly IConfiguration _config;

    public PactProviderStatesController(MedPactDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public record ProviderStateRequest([property: JsonPropertyName("state")] string State, [property: JsonPropertyName("params")] JsonElement? Params);

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ProviderStateRequest req)
    {
        // Only enable provider states when explicitly allowed (dev/test).
        var enabled = _config["PROVIDER_STATES_ENABLED"] ?? Environment.GetEnvironmentVariable("PROVIDER_STATES_ENABLED");
        if (string.IsNullOrEmpty(enabled) || !enabled.Equals("true", StringComparison.OrdinalIgnoreCase))
            return NotFound();

        // Very small, explicit provider states used by consumer pacts.
        if (req.State == null) return BadRequest();

        switch (req.State)
        {
            case "A tenant exists":
                {
                    var name = req.Params?.TryGetProperty("name", out var n) == true ? n.GetString() ?? "e2e-tenant" : "e2e-tenant";
                    var slug = req.Params?.TryGetProperty("slug", out var s) == true ? s.GetString() ?? Guid.NewGuid().ToString() : Guid.NewGuid().ToString();
                    var tenant = await _db.Tenants.FirstOrDefaultAsync(t => t.Slug == slug || t.Name == name);
                    if (tenant == null)
                    {
                        tenant = new Tenant { Name = name, Slug = slug };
                        _db.Tenants.Add(tenant);
                        await _db.SaveChangesAsync();
                    }
                    return Ok(new { id = tenant.Id });
                }
            case "No tenants":
                {
                    _db.Tenants.RemoveRange(_db.Tenants);
                    await _db.SaveChangesAsync();
                    return Ok();
                }
            default:
                return BadRequest(new { error = "Unknown provider state" });
        }
    }
}
