using MedPact.Domain.Common;

namespace MedPact.Domain.Org;

public class Department : TenantScopedEntity
{
    public Guid SiteId { get; set; }
    public required string Name { get; set; }
}
