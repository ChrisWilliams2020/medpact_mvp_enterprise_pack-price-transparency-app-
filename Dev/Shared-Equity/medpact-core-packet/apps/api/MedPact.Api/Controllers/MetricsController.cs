using MedPact.Domain.Metrics;
using MedPact.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedPact.Api.Controllers;

[ApiController]
[Route("api/metrics")]
[Authorize]
public class MetricsController : ControllerBase
{
    private readonly MedPactDbContext _db;
    public MetricsController(MedPactDbContext db) => _db = db;

    [HttpGet("definitions")]
    public async Task<IActionResult> GetDefinitions()
    {
        var tenantId = GetTenantId();
        var defs = await _db.MetricDefinitions.Where(x => x.TenantId == tenantId).OrderBy(x => x.Key).ToListAsync();
        return Ok(defs);
    }

    [HttpPost("definitions")]
    public async Task<IActionResult> UpsertDefinition([FromBody] MetricDefinition def)
    {
        var tenantId = GetTenantId();
        def.TenantId = tenantId;

        var existing = await _db.MetricDefinitions
            .FirstOrDefaultAsync(x => x.TenantId == tenantId && x.Key == def.Key && x.Version == def.Version);

        if (existing is null)
            _db.MetricDefinitions.Add(def);
        else
        {
            existing.Name = def.Name;
            existing.Description = def.Description;
            existing.Unit = def.Unit;
            existing.Calculator = def.Calculator;
            existing.UpdatedAt = DateTimeOffset.UtcNow;
        }

        await _db.SaveChangesAsync();
        return Ok(def);
    }

    private Guid GetTenantId()
    {
        var tid = User.Claims.FirstOrDefault(c => c.Type == "tenant_id")?.Value;
        return Guid.TryParse(tid, out var g) ? g : throw new InvalidOperationException("Missing tenant_id claim.");
    }
}
