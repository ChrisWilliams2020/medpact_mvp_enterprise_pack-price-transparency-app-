using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MedPact.Domain.Identity;
using MedPact.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace MedPact.Api.Controllers;

public record LoginRequest(Guid TenantId, string Email);

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly MedPactDbContext _db;
    private readonly IConfiguration _cfg;

    public AuthController(MedPactDbContext db, IConfiguration cfg)
    {
        _db = db;
        _cfg = cfg;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.TenantId == req.TenantId && u.Email == req.Email);
        if (user is null)
        {
            user = new User { TenantId = req.TenantId, Email = req.Email, DisplayName = req.Email };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        var roles = await (from ur in _db.UserRoles
                           join r in _db.Roles on ur.RoleId equals r.Id
                           where ur.TenantId == req.TenantId && ur.UserId == user.Id
                           select r.Name).ToListAsync();

        if (roles.Count == 0)
        {
            var admin = await _db.Roles.FirstOrDefaultAsync(r => r.TenantId == req.TenantId && r.Name == "Admin");
            if (admin is null)
            {
                admin = new Role { TenantId = req.TenantId, Name = "Admin", Description = "Tenant administrator" };
                _db.Roles.Add(admin);
                await _db.SaveChangesAsync();
            }
            _db.UserRoles.Add(new UserRole { TenantId = req.TenantId, UserId = user.Id, RoleId = admin.Id });
            await _db.SaveChangesAsync();
            roles = new List<string> { "Admin" };
        }

        var token = IssueJwt(req.TenantId, req.Email, roles);
        return Ok(new { token });
    }

    private string IssueJwt(Guid tenantId, string email, List<string> roles)
    {
        var issuer = _cfg["JWT__Issuer"] ?? _cfg["Jwt:Issuer"];
        var audience = _cfg["JWT__Audience"] ?? _cfg["Jwt:Audience"];
        var key = _cfg["JWT__Key"] ?? _cfg["Jwt:Key"];
        var expiresMinutes = int.TryParse(_cfg["JWT__ExpiresMinutes"] ?? _cfg["Jwt:ExpiresMinutes"], out var m) ? m : 480;

        var claims = new List<Claim>
        {
            new("tenant_id", tenantId.ToString()),
            new(ClaimTypes.Name, email),
            new(ClaimTypes.Email, email)
        };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var creds = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!)), SecurityAlgorithms.HmacSha256);
        var jwt = new JwtSecurityToken(issuer, audience, claims, expires: DateTime.UtcNow.AddMinutes(expiresMinutes), signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }
}
