FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy everything and restore/publish the API
COPY . ./
RUN dotnet restore "apps/api/MedPact.Core.sln"
RUN dotnet publish "apps/api/MedPact.Api/MedPact.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish ./
# copy small ops scripts
COPY ops/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
# ensure 'nc' is available for the entrypoint DB wait loop
RUN apt-get update \
 && apt-get install -y --no-install-recommends netcat-openbsd \
 && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
