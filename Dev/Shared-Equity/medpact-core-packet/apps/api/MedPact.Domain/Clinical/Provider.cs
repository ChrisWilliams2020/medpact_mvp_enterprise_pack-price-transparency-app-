using MedPact.Domain.Common;

namespace MedPact.Domain.Clinical;

public class Provider : TenantScopedEntity
{
    public required string Npi { get; set; }
    public required string LastName { get; set; }
    public string? FirstName { get; set; }
    public string? Specialty { get; set; }
    public Guid? DepartmentId { get; set; }
}
