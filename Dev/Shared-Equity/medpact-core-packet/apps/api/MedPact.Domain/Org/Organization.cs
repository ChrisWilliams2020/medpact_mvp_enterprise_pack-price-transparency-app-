using MedPact.Domain.Common;

namespace MedPact.Domain.Org;

public class Organization : TenantScopedEntity
{
    public required string Name { get; set; }
    public string? Type { get; set; }
}
