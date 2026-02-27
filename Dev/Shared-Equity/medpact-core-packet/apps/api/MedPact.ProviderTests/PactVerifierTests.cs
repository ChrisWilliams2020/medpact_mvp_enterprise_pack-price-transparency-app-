using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using Xunit;

namespace MedPact.ProviderTests;

public class PactVerifierTests
{
    private readonly HttpClient _http = new HttpClient();
    private readonly string _baseUrl = Environment.GetEnvironmentVariable("BASE_URL") ?? "http://localhost:5100";

    [Fact]
    public async Task VerifyPacts()
    {
        var pactFiles = Directory.GetFiles("pacts", "*.json");
        if (!pactFiles.Any())
        {
            // nothing to verify
            return;
        }

        foreach (var file in pactFiles)
        {
            var json = await File.ReadAllTextAsync(file);
            using var doc = JsonDocument.Parse(json);
            var interactions = doc.RootElement.GetProperty("interactions");
            foreach (var interaction in interactions.EnumerateArray())
            {
                // if interaction has providerState, call provider-states endpoint
                if (interaction.TryGetProperty("providerState", out var ps))
                {
                    var req = new { state = ps.GetString(), @params = new { } };
                    var resp = await _http.PostAsJsonAsync(_baseUrl + "/provider-states", req);
                    resp.EnsureSuccessStatusCode();
                }

                var request = interaction.GetProperty("request");
                var method = request.GetProperty("method").GetString() ?? "GET";
                var path = request.GetProperty("path").GetString() ?? "/";
                var url = _baseUrl.TrimEnd('/') + path;

                HttpResponseMessage response = method.ToUpper() switch
                {
                    "GET" => await _http.GetAsync(url),
                    _ => await _http.SendAsync(new HttpRequestMessage(new HttpMethod(method), url))
                };

                // basic status code assertion
                var expectedStatus = interaction.GetProperty("response").GetProperty("status").GetInt32();
                Assert.Equal(expectedStatus, (int)response.StatusCode);
            }
        }
    }
}
