using MedPact.Domain.Org;
using MedPact.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedPact.Api.Controllers;

[ApiController]
[Route("api/tenants")]
public class TenantsController : ControllerBase
{
    private readonly MedPactDbContext _db;
    public TenantsController(MedPactDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List() => Ok(await _db.Tenants.OrderBy(t => t.Name).ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Tenant tenant)
    {
        _db.Tenants.Add(tenant);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = tenant.Id }, tenant);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var t = await _db.Tenants.FindAsync(id);
        return t is null ? NotFound() : Ok(t);
    }
}
