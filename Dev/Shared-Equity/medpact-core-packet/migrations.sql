CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;


DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE TABLE "AuditEvents" (
        "Id" uuid NOT NULL,
        "Actor" text NOT NULL,
        "Action" text NOT NULL,
        "EntityType" text NOT NULL,
        "EntityId" text NOT NULL,
        "DetailJson" text,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        "TenantId" uuid NOT NULL,
        CONSTRAINT "PK_AuditEvents" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE TABLE "Departments" (
        "Id" uuid NOT NULL,
        "SiteId" uuid NOT NULL,
        "Name" text NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        "TenantId" uuid NOT NULL,
        CONSTRAINT "PK_Departments" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE TABLE "IngestionJobs" (
        "Id" uuid NOT NULL,
        "SourceName" text NOT NULL,
        "Status" text NOT NULL,
        "StartedAt" timestamp with time zone,
        "FinishedAt" timestamp with time zone,
        "SummaryJson" text,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        "TenantId" uuid NOT NULL,
        CONSTRAINT "PK_IngestionJobs" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE TABLE "MetricDefinitions" (
        "Id" uuid NOT NULL,
        "Key" text NOT NULL,
        "Name" text NOT NULL,
        "Description" text,
        "Unit" text NOT NULL,
        "Version" integer NOT NULL,
        "Calculator" text,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        "TenantId" uuid NOT NULL,
        CONSTRAINT "PK_MetricDefinitions" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE TABLE "MetricValues" (
        "Id" uuid NOT NULL,
        "MetricKey" text NOT NULL,
        "PeriodStart" date NOT NULL,
        "PeriodEnd" date NOT NULL,
        "Value" numeric NOT NULL,
        "DimensionType" text,
        "DimensionKey" text,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        "TenantId" uuid NOT NULL,
        CONSTRAINT "PK_MetricValues" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE TABLE "Organizations" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Type" text,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        "TenantId" uuid NOT NULL,
        CONSTRAINT "PK_Organizations" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE TABLE "Providers" (
        "Id" uuid NOT NULL,
        "Npi" text NOT NULL,
        "LastName" text NOT NULL,
        "FirstName" text,
        "Specialty" text,
        "DepartmentId" uuid,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        "TenantId" uuid NOT NULL,
        CONSTRAINT "PK_Providers" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE TABLE "Roles" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Description" text,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        "TenantId" uuid NOT NULL,
        CONSTRAINT "PK_Roles" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE TABLE "Sites" (
        "Id" uuid NOT NULL,
        "OrganizationId" uuid NOT NULL,
        "Name" text NOT NULL,
        "Address" text,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        "TenantId" uuid NOT NULL,
        CONSTRAINT "PK_Sites" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE TABLE "Tenants" (
        "Id" uuid NOT NULL,
        "Name" text NOT NULL,
        "Slug" text,
        "IsActive" boolean NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        CONSTRAINT "PK_Tenants" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE TABLE "UserRoles" (
        "Id" uuid NOT NULL,
        "UserId" uuid NOT NULL,
        "RoleId" uuid NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        "TenantId" uuid NOT NULL,
        CONSTRAINT "PK_UserRoles" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE TABLE "Users" (
        "Id" uuid NOT NULL,
        "Email" text NOT NULL,
        "DisplayName" text,
        "IsActive" boolean NOT NULL,
        "PasswordHash" text,
        "CreatedAt" timestamp with time zone NOT NULL,
        "UpdatedAt" timestamp with time zone,
        "TenantId" uuid NOT NULL,
        CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_MetricDefinitions_TenantId_Key_Version" ON "MetricDefinitions" ("TenantId", "Key", "Version");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Roles_TenantId_Name" ON "Roles" ("TenantId", "Name");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE INDEX "IX_Tenants_Name" ON "Tenants" ("Name");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Users_TenantId_Email" ON "Users" ("TenantId", "Email");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260225043237_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20260225043237_InitialCreate', '8.0.0');
    END IF;
END $EF$;
COMMIT;

