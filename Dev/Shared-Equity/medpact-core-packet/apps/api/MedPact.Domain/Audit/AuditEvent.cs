using MedPact.Domain.Common;

namespace MedPact.Domain.Audit;

public class AuditEvent : TenantScopedEntity
{
    public required string Actor { get; set; }
    public required string Action { get; set; }
    public required string EntityType { get; set; }
    public required string EntityId { get; set; }
    public string? DetailJson { get; set; }
}
