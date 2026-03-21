using MedPact.Domain.Common;

namespace MedPact.Domain.Identity;

public class User : TenantScopedEntity
{
    public required string Email { get; set; }
    public string? DisplayName { get; set; }
    public bool IsActive { get; set; } = true;
    public string? PasswordHash { get; set; } // placeholder for dev
}
