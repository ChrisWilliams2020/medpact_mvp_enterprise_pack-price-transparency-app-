using MedPact.Domain.Common;

namespace MedPact.Domain.Ingestion;

public class IngestionJob : TenantScopedEntity
{
    public required string SourceName { get; set; }
    public required string Status { get; set; } = "Pending"; // Pending, Running, Failed, Complete
    public DateTimeOffset? StartedAt { get; set; }
    public DateTimeOffset? FinishedAt { get; set; }
    public string? SummaryJson { get; set; }
}
