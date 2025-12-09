# MedPACT Card Membership (MedPACT_Option2_Solution)

This repository contains the MedPACT Card Membership solution that was uploaded as `MedPACT_Option2_Solution.zip`.

## Contents

The solution includes the following top-level projects:

- **MedPACT.sln** - Visual Studio solution file
- **MedPACT.Api/** - API project (Web API)
- **MedPACT.Domain/** - Domain model layer
- **MedPACT.Infrastructure/** - Infrastructure and data access layer
- **MedPACT.Web/** - Web front-end (Blazor Server UI)
- Controllers, configuration, and related code

## Overview

This is a .NET solution (Visual Studio / dotnet CLI) containing API, Domain, Infrastructure, and Web projects. The zip attached to this repo includes the full solution with a complete provider-payer membership management system.

## Architecture

The solution follows a clean architecture pattern:

- **Domain Layer**: Core business logic and entities
- **Infrastructure Layer**: Database access, external services
- **API Layer**: RESTful API endpoints with Swagger documentation
- **Web Layer**: Blazor Server user interface

## Quick Start (Local Development)

### Prerequisites

- .NET 6.0 SDK or later
- Visual Studio 2022 (recommended) or Visual Studio Code
- SQL Server or SQL Server Express (for database)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ChrisWilliams2020/medpact_mvp_enterprise_pack-price-transparency-app-.git
   cd medpact_mvp_enterprise_pack-price-transparency-app-
   ```

2. **Extract the solution (if not already extracted):**
   ```bash
   unzip MedPACT_Option2_Solution.zip -d extracted_solution
   ```
   
   *Note: If the repository already contains the extracted project files, skip this step.*

3. **Navigate to the solution folder and restore dependencies:**
   ```bash
   cd extracted_solution
   dotnet restore
   ```

4. **Build the solution:**
   ```bash
   dotnet build
   ```

5. **Run the API project:**
   ```bash
   cd MedPACT.Api
   dotnet run
   ```
   
   The API will be available at: `https://localhost:5001`
   Swagger documentation: `https://localhost:5001/swagger`

6. **Run the Web UI (in a separate terminal):**
   ```bash
   cd MedPACT.Web
   dotnet run
   ```
   
   The Web UI will be available at: `https://localhost:5002` (port may vary)

### Using Visual Studio

1. Open `MedPACT.sln` in Visual Studio 2022
2. Set multiple startup projects:
   - Right-click on the solution
   - Select "Set Startup Projects"
   - Choose "Multiple startup projects"
   - Set both `MedPACT.Api` and `MedPACT.Web` to "Start"
3. Press F5 to run the solution

## Project Structure

```
MedPACT_Option2_Solution/
├── MedPACT.sln
├── MedPACT.Domain/
│   ├── Entities/
│   ├── Interfaces/
│   └── Services/
├── MedPACT.Infrastructure/
│   ├── Data/
│   ├── Repositories/
│   └── Migrations/
├── MedPACT.Api/
│   ├── Controllers/
│   ├── Program.cs
│   └── appsettings.json
└── MedPACT.Web/
    ├── Pages/
    ├── Shared/
    └── Program.cs
```

## Configuration

Update the connection strings in:
- `MedPACT.Api/appsettings.json`
- `MedPACT.Web/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MedPACT;Trusted_Connection=True;"
  }
}
```

## Features

- Provider and Payer membership management
- Card membership tracking
- RESTful API with Swagger documentation
- Blazor Server web interface
- Entity Framework Core for data access
- Clean architecture with separation of concerns

## API Endpoints

Access the full API documentation via Swagger at `https://localhost:5001/swagger` when running the API project.

## Testing

Run unit tests:
```bash
dotnet test
```

## Deployment

For production deployment, adjust the following:
1. Update connection strings for production database
2. Configure HTTPS certificates
3. Set appropriate CORS policies
4. Review and update security settings
5. Configure logging and monitoring

## Contributing to Repository

### Option A — Add directly to main

If you work locally and push to main:

```bash
git checkout main
git add .
git commit -m "Add MedPACT Card Membership documentation"
git push origin main
```

### Option B — Create a branch and open a Pull Request (Recommended)

```bash
git checkout -b feature/your-feature-name
git add .
git commit -m "Description of your changes"
git push --set-upstream origin feature/your-feature-name
```

Then open a PR on GitHub from your feature branch to `main`.

## Notes

- The solution uses .NET 6.0 or later
- SQL Server is required for the database
- Both the API and Web projects can run independently
- The API provides Swagger UI for easy testing and documentation
- The Web project uses Blazor Server for interactive UI

## Support

For questions or issues, please open an issue on the GitHub repository.

## License

Copyright © 2025 MedPACT. All rights reserved.
