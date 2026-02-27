using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MedPact.Api.Controllers;
using MedPact.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace MedPact.ProviderTests;

public class AuthControllerTests
{
    [Fact]
    public async Task Login_CreatesUserAndReturnsToken()
    {
        var options = new DbContextOptionsBuilder<MedPactDbContext>()
            .UseInMemoryDatabase(databaseName: "AuthTestDb")
            .Options;

        // prepare a minimal configuration with a symmetric key
        var inMemorySettings = new Dictionary<string, string?>
        {
            { "JWT__Key", "test-signing-key-which-is-long-enough" },
            { "JWT__Issuer", "medpact.local" },
            { "JWT__Audience", "medpact.local" }
        };
        var cfg = new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();

        // create dbcontext and ensure no existing data
        await using (var db = new MedPactDbContext(options))
        {
            await db.Database.EnsureDeletedAsync();
            await db.Database.EnsureCreatedAsync();
        }

        await using (var db = new MedPactDbContext(options))
        {
            var controller = new AuthController(db, cfg);
            var tenantId = Guid.NewGuid();
            var email = "test@medpact.local";

            var result = await controller.Login(new LoginRequest(tenantId, email));
            // expect OkObjectResult with a token property
            Assert.IsType<Microsoft.AspNetCore.Mvc.OkObjectResult>(result);
            var ok = result as Microsoft.AspNetCore.Mvc.OkObjectResult;
            Assert.NotNull(ok?.Value);
            // prefer safe extraction to avoid dynamic binder issues in some test runners
            var value = ok!.Value;
            string? token = null;
            if (value is System.Collections.IDictionary dict)
            {
                if (dict.Contains("token")) token = dict["token"]?.ToString();
            }
            else
            {
                // try reflection for anonymous object
                var prop = value.GetType().GetProperty("token");
                if (prop != null) token = prop.GetValue(value)?.ToString();
            }
            Assert.False(string.IsNullOrEmpty(token));

            // confirm user was added to the database
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email && u.TenantId == tenantId);
            Assert.NotNull(user);
        }
    }
}
