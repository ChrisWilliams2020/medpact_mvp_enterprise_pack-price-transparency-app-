using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using MedPact.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Prevent the app from running EF Core migrations in tests (InMemory doesn't support Relational Migrate)
        builder.ConfigureAppConfiguration((context, conf) =>
        {
            conf.AddInMemoryCollection(new Dictionary<string, string?> {
                { "RUN_MIGRATIONS_ON_STARTUP", "false" },
                // Key must be at least 256 bits for HS256 (32 bytes). Use a longer test key here.
                { "JWT__Key", "test_jwt_key_made_long_enough_for_hs256_please_change_0123456789" },
                { "JWT__Issuer", "medpact-test" },
                { "JWT__Audience", "medpact-test-aud" }
            });
        });

        builder.ConfigureServices(services =>
        {
            // Remove the existing DbContext registration
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<MedPactDbContext>));
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Register InMemory DB for tests
            services.AddDbContext<MedPactDbContext>(options =>
            {
                options.UseInMemoryDatabase("MedPact_Test_Db");
            });

            // Build the service provider and seed data
            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<MedPactDbContext>();
            db.Database.EnsureCreated();
            // Optionally seed minimal data
            if (!db.Tenants.Any())
            {
                db.Tenants.Add(new MedPact.Domain.Org.Tenant { Id = Guid.NewGuid(), Name = "TestTenant" });
                db.SaveChanges();
            }
        });
    }
}
