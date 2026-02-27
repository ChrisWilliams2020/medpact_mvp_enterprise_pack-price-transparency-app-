using MedPact.Domain.Audit;
using MedPact.Domain.Clinical;
using MedPact.Domain.Identity;
using MedPact.Domain.Ingestion;
using MedPact.Domain.Metrics;
using MedPact.Domain.Org;
using Microsoft.EntityFrameworkCore;

namespace MedPact.Infrastructure.Persistence;

public class MedPactDbContext : DbContext
{
    public MedPactDbContext(DbContextOptions<MedPactDbContext> options) : base(options) {}

    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<Site> Sites => Set<Site>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<Provider> Providers => Set<Provider>();
    public DbSet<AuditEvent> AuditEvents => Set<AuditEvent>();
    public DbSet<IngestionJob> IngestionJobs => Set<IngestionJob>();
    public DbSet<MetricDefinition> MetricDefinitions => Set<MetricDefinition>();
    public DbSet<MetricValue> MetricValues => Set<MetricValue>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tenant>().HasIndex(x => x.Name);

        modelBuilder.Entity<User>().HasIndex(x => new { x.TenantId, x.Email }).IsUnique();
        modelBuilder.Entity<Role>().HasIndex(x => new { x.TenantId, x.Name }).IsUnique();
        modelBuilder.Entity<MetricDefinition>().HasIndex(x => new { x.TenantId, x.Key, x.Version }).IsUnique();

        base.OnModelCreating(modelBuilder);
    }
}
