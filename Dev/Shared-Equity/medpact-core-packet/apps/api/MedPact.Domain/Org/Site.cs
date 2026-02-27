using MedPact.Domain.Common;

namespace MedPact.Domain.Org;

public class Site : TenantScopedEntity
{
    public Guid OrganizationId { get; set; }
    public required string Name { get; set; }
    public string? Address { get; set; }
}
