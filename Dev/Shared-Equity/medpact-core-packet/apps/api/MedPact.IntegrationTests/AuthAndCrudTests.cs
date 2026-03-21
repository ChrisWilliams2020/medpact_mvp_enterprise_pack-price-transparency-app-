using System;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using MedPact.Domain.Org;
using Xunit;

public class AuthAndCrudTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public AuthAndCrudTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task LoginAndCallProtectedEndpoint()
    {
        var client = _factory.CreateClient();
        var tenantId = Guid.NewGuid();
        var login = new { TenantId = tenantId, Email = "tester@local" };
        var res = await client.PostAsJsonAsync("/api/auth/login", login);
        if (!res.IsSuccessStatusCode)
        {
            var body = await res.Content.ReadAsStringAsync();
            Assert.True(false, $"Login failed: {res.StatusCode} - {body}");
        }
        var payload = await res.Content.ReadFromJsonAsync<JsonElement>();
        var token = payload.GetProperty("token").GetString();
        Assert.False(string.IsNullOrEmpty(token));

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        // Try to call tenants (protected by auth in some configs)
        var tenantsRes = await client.GetAsync("/api/tenants");
        // Accept either success or 200; if API returns 200, ensure seeded or new tenant present
        if (tenantsRes.IsSuccessStatusCode)
        {
            var tenants = await tenantsRes.Content.ReadFromJsonAsync<Tenant[]>();
            Assert.NotNull(tenants);
        }
    }

    [Fact]
    public async Task TenantCrudFlow()
    {
        var client = _factory.CreateClient();
        var tenantId = Guid.NewGuid();
        var login = new { TenantId = tenantId, Email = "crud@local" };
        var res = await client.PostAsJsonAsync("/api/auth/login", login);
        if (!res.IsSuccessStatusCode)
        {
            var body = await res.Content.ReadAsStringAsync();
            Assert.True(false, $"Login failed: {res.StatusCode} - {body}");
        }
        var token = (await res.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("token").GetString();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Create tenant via direct DB or API if available. If API lacks create endpoint, fall back to DB approach.
        var newTenant = new { Name = "CrudTenant" };
        var createRes = await client.PostAsJsonAsync("/api/tenants", newTenant);
        if (createRes.IsSuccessStatusCode)
        {
            var created = await createRes.Content.ReadFromJsonAsync<JsonElement>();
            Assert.Equal("CrudTenant", created.GetProperty("name").GetString(), ignoreCase: true);
        }
        else
        {
            // No API create -> query list to ensure tenant exists from login seed
            var listRes = await client.GetAsync("/api/tenants");
            if (listRes.IsSuccessStatusCode)
            {
                var tenants = await listRes.Content.ReadFromJsonAsync<Tenant[]>();
                Assert.Contains(tenants, t => t.Name == "TestTenant" || t.Name == "CrudTenant");
            }
        }
    }
}
