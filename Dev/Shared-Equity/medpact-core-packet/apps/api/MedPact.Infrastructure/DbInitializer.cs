using System;
using System.Text.Json;
using MedPact.Domain.Metrics;
using MedPact.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace MedPact.Infrastructure;

public static class DbInitializer
{
    public static void Initialize(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MedPactDbContext>();
        db.Database.Migrate();

    // Rely on EF migrations being present in the repository. Database.Migrate()
    // will create or update the schema. After migrations are applied, attempt
    // to seed if the MetricDefinitions set is empty. Any seeding errors are
    // caught so the application doesn't crash on startup.

        // seed metrics if not present
        try
        {
            if (!db.MetricDefinitions.Any())
            {
                var path = Path.Combine("docs", "seed-metrics.json");
                if (File.Exists(path))
                {
                    var json = File.ReadAllText(path);
                    var defs = JsonSerializer.Deserialize<List<MetricDefinition>>(json) ?? new List<MetricDefinition>();
                    db.MetricDefinitions.AddRange(defs);
                    db.SaveChanges();
                }
            }
        }
        catch (Exception ex)
        {
            // guard against race conditions or unexpected schema differences; do not
            // crash the app during startup for non-fatal seed errors.
            Console.WriteLine($"DbInitializer: failed to seed metrics: {ex.Message}");
        }
    }
}
