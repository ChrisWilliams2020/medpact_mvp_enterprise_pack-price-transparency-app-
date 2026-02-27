using System.IdentityModel.Tokens.Jwt;
using System.Text;
using MedPact.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();
builder.Host.UseSerilog();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MedPact Core API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }, Array.Empty<string>() }
    });
});

builder.Services.AddInfrastructure(builder.Configuration);

// Authentication: OIDC when enabled, otherwise fall back to the symmetric dev JWT key.
// Enable OIDC by setting OIDC__Enabled=true and OIDC__Authority / OIDC__Audience (or AUTH__OIDC__* variants).
var oidcEnabled = builder.Configuration["OIDC__Enabled"] ?? builder.Configuration["AUTH__OIDC__Enabled"];
if (!string.IsNullOrEmpty(oidcEnabled) && oidcEnabled.Equals("true", StringComparison.OrdinalIgnoreCase))
{
    var authority = builder.Configuration["OIDC__Authority"] ?? builder.Configuration["AUTH__OIDC__Authority"];
    var audience = builder.Configuration["OIDC__Audience"] ?? builder.Configuration["AUTH__OIDC__Audience"] ?? builder.Configuration["JWT__Audience"] ?? builder.Configuration["Jwt:Audience"];

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(o =>
        {
            o.Authority = authority;
            o.Audience = audience;
            o.RequireHttpsMetadata = true;
            o.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                // PKI-signed tokens validated via identity provider's signing keys
                ValidateIssuerSigningKey = false
            };
        });
}
else
{
    // dev symmetric key fallback (existing behavior)
    var issuer = builder.Configuration["JWT__Issuer"] ?? builder.Configuration["Jwt:Issuer"];
    var audience = builder.Configuration["JWT__Audience"] ?? builder.Configuration["Jwt:Audience"];
    var key = builder.Configuration["JWT__Key"] ?? builder.Configuration["Jwt:Key"];

    if (string.IsNullOrEmpty(key))
    {
        Log.Warning("JWT__Key not set; ensure OIDC is enabled or JWT__Key is provided for production.");
    }

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(o =>
        {
            o.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = !string.IsNullOrEmpty(key),
                ValidIssuer = issuer,
                ValidAudience = audience,
                IssuerSigningKey = !string.IsNullOrEmpty(key) ? new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)) : null
            };
        });
}

builder.Services.AddAuthorization();

var app = builder.Build();

// Run migrations and seed data
try
{
    var runMigrations = builder.Configuration["RUN_MIGRATIONS_ON_STARTUP"] ?? Environment.GetEnvironmentVariable("RUN_MIGRATIONS_ON_STARTUP");
    if (string.IsNullOrEmpty(runMigrations) || runMigrations.Equals("true", StringComparison.OrdinalIgnoreCase))
    {
        DbInitializer.Initialize(app.Services);
    }
}
catch (Exception ex)
{
    Log.Fatal(ex, "Failed to initialize the database");
    throw;
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

public partial class Program {}
