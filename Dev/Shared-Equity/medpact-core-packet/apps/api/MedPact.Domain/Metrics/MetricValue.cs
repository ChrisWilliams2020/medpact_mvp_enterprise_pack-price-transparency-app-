using MedPact.Domain.Common;

namespace MedPact.Domain.Metrics;

public class MetricValue : TenantScopedEntity
{
    public required string MetricKey { get; set; }
    public DateOnly PeriodStart { get; set; }
    public DateOnly PeriodEnd { get; set; }
    public decimal Value { get; set; }
    public string? DimensionType { get; set; }
    public string? DimensionKey { get; set; }
}
