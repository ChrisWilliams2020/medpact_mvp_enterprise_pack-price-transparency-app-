using MedPact.Domain.Common;

namespace MedPact.Domain.Org;

public class Tenant : BaseEntity
{
    public required string Name { get; set; }
    public string? Slug { get; set; }
    public bool IsActive { get; set; } = true;
}
