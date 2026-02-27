using MedPact.Domain.Common;

namespace MedPact.Domain.Identity;

public class Role : TenantScopedEntity
{
    public required string Name { get; set; }
    public string? Description { get; set; }
}
