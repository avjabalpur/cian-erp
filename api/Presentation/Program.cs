using Npgsql;
using System.Data;
using System.Reflection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Xcianify.Core.Domain.Repositories;
using Xcianify.Core.Domain.Services;
using Xcianify.Core.Mappers;
using Xcianify.Core.Security;
using Xcianify.Presentation.Extensions;
using Xcianify.Repository;
using Xcianify.Repository.DbContext;
using Xcianify.Services;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Microsoft.SharePoint.Client;
using Xcianify.Core.Configuration;

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables()
    .Build();
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<DapperDbContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });

    // Alternatively, for more specific control:
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://yourfrontend.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add services to the container.

// Add Swagger/OpenAPI support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    c =>
    {
        // Configure Swagger to use JWT Authentication
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
        c.MapType<RequestType>(() => new OpenApiSchema
        {
            Type = "string",
            Enum = new[] { new OpenApiString("list"), new OpenApiString("flow") }
        });
    }
    );

// Configure database connection
builder.Services.AddScoped<IDbConnection>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    return new NpgsqlConnection(connectionString);
});

// Configure JWT
builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("JwtConfig"));

// Add JWT Authentication
var jwtConfig = builder.Configuration.GetSection("JwtConfig").Get<JwtConfig>();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.Key)),
        ValidateIssuer = true,
        ValidIssuer = jwtConfig.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtConfig.Audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddScoped<IAuthService, AuthService>();

// Register AutoMapper profiles
builder.Services.AddAutoMapper(
    typeof(UserMapper),
    typeof(RoleMapper),
    typeof(PermissionMapper),
    typeof(OrganizationMapper),
    typeof(ItemMasterMapper),
    typeof(SalesOrderMapper)
);

// Register repositories
builder.Services.AddScoped<ILocationTypeRepository, LocationTypeRepository>();
builder.Services.AddScoped<IOrganizationRepository, OrganizationRepository>();
builder.Services.AddScoped<IOrganizationAccountRepository, OrganizationAccountRepository>();

// Register services
builder.Services.AddScoped<ILocationTypeService, LocationTypeService>();
builder.Services.AddScoped<IOrganizationService, OrganizationService>();
builder.Services.AddScoped<IOrganizationAccountService, OrganizationAccountService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<IPermissionRepository, PermissionRepository>();
builder.Services.AddScoped<IRolePermissionRepository, RolePermissionRepository>();

// Register services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<IPermissionService, PermissionService>();
builder.Services.AddScoped<IRolePermissionService, RolePermissionService>();

// Register Item Master services and repositories
builder.Services.AddScoped<IItemMasterRepository, ItemMasterRepository>();

// Register Department services and repositories
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();

// Register Division services and repositories
builder.Services.AddScoped<IDivisionRepository, DivisionRepository>();
builder.Services.AddScoped<IDivisionService, DivisionService>();

// Register ItemSalesDetail services and repositories
builder.Services.AddScoped<IItemSalesDetailRepository, ItemSalesDetailRepository>();
builder.Services.AddScoped<IItemSalesDetailService, ItemSalesDetailService>();

// Register ItemStockAnalysis services and repositories
builder.Services.AddScoped<IItemStockAnalysisRepository, ItemStockAnalysisRepository>();
builder.Services.AddScoped<IItemStockAnalysisService, ItemStockAnalysisService>();
builder.Services.AddScoped<IItemSpecificationRepository, ItemSpecificationRepository>();
builder.Services.AddScoped<IItemMasterService, ItemMasterService>();

// Register security services
builder.Services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();

// Register role-related services
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();

// Register Sales Order repositories
builder.Services.AddScoped<ISalesOrderRepository, SalesOrderRepository>();
builder.Services.AddScoped<ISalesOrderCommentRepository, SalesOrderCommentRepository>();
builder.Services.AddScoped<ISalesOrderChatRepository, SalesOrderChatRepository>();
builder.Services.AddScoped<ISalesOrderDocumentRepository, SalesOrderDocumentRepository>();
builder.Services.AddScoped<ISalesOrderPerformaInvoiceRepository, SalesOrderPerformaInvoiceRepository>();
builder.Services.AddScoped<ISalesOrderPerformaInvoiceItemRepository, SalesOrderPerformaInvoiceItemRepository>();
builder.Services.AddScoped<ISalesOrderQuotationRepository, SalesOrderQuotationRepository>();
builder.Services.AddScoped<ISalesOrderQuotationItemRepository, SalesOrderQuotationItemRepository>();
builder.Services.AddScoped<ISalesOrderSaveTransactionRepository, SalesOrderSaveTransactionRepository>();
builder.Services.AddScoped<ISalesOrderStageRepository, SalesOrderStageRepository>();

// Register Sales Order services
builder.Services.AddScoped<ISalesOrderService, SalesOrderService>();
builder.Services.AddScoped<ISalesOrderCommentService, SalesOrderCommentService>();
builder.Services.AddScoped<ISalesOrderChatService, SalesOrderChatService>();
builder.Services.AddScoped<ISalesOrderDocumentService, SalesOrderDocumentService>();
builder.Services.AddScoped<ISalesOrderPerformaInvoiceService, SalesOrderPerformaInvoiceService>();
builder.Services.AddScoped<ISalesOrderPerformaInvoiceItemService, SalesOrderPerformaInvoiceItemService>();
builder.Services.AddScoped<ISalesOrderQuotationService, SalesOrderQuotationService>();
builder.Services.AddScoped<ISalesOrderQuotationItemService, SalesOrderQuotationItemService>();
builder.Services.AddScoped<ISalesOrderSaveTransactionService, SalesOrderSaveTransactionService>();
builder.Services.AddScoped<ISalesOrderStageService, SalesOrderStageService>();

// Add Controllers
builder.Services.AddControllers();

var app = builder.Build();
var connectionString = builder.Configuration.GetConnectionString("dbPostgreSQLConnection");
if (connectionString != null)
{
    await MigrationRunner.RunMigrationsAsync(connectionString);
}

// Use Swagger if in the development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

// Other middleware
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

app.UseExceptionHandling();

Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;

app.Run();
