using MedPact.Domain.Common;

namespace MedPact.Domain.Metrics;

public class MetricDefinition : TenantScopedEntity
{
    public required string Key { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required string Unit { get; set; }
    public int Version { get; set; } = 1;
    public string? Calculator { get; set; }
}
