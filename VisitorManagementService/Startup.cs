using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Services.ApprovalWorkflow;
using VisitorManagementMySQL.Services.Authentication;
using VisitorManagementMySQL.Services.Common;
using VisitorManagementMySQL.Services.DashBoard.IndividualService;
using VisitorManagementMySQL.Services.Login;
using VisitorManagementMySQL.Services.MailService;
using VisitorManagementMySQL.Services.Master.ApprovalService;
using VisitorManagementMySQL.Services.Master.AreaService;
using VisitorManagementMySQL.Services.Master.CatetoryCPMappingService;
using VisitorManagementMySQL.Services.Master.CityService;
using VisitorManagementMySQL.Services.Master.CompanyService;
using VisitorManagementMySQL.Services.Master.CountryService;
using VisitorManagementMySQL.Services.Master.DepartmentService;
using VisitorManagementMySQL.Services.Master.DriverService;
using VisitorManagementMySQL.Services.Master.EmployeeService;
using VisitorManagementMySQL.Services.Master.ExternalBookVisitorService;
using VisitorManagementMySQL.Services.Master.FeedbackService;
using VisitorManagementMySQL.Services.Master.FileUploadService;
using VisitorManagementMySQL.Services.Master.GateService;
using VisitorManagementMySQL.Services.Master.InstructionsService;
using VisitorManagementMySQL.Services.Master.MaterialService;
using VisitorManagementMySQL.Services.Master.NumberingSchemaService;
using VisitorManagementMySQL.Services.Master.PlantService;
using VisitorManagementMySQL.Services.Master.PreviewPassService;
using VisitorManagementMySQL.Services.Master.RoleScreenMappingService;
using VisitorManagementMySQL.Services.Master.RoleService;
using VisitorManagementMySQL.Services.Master.RouteService;
using VisitorManagementMySQL.Services.Master.ShiftService;
using VisitorManagementMySQL.Services.Master.StateService;
using VisitorManagementMySQL.Services.Master.SupplierService;
using VisitorManagementMySQL.Services.Master.UserScreenMappingService;
using VisitorManagementMySQL.Services.Master.UserService;
using VisitorManagementMySQL.Services.Master.VehicleService;
using VisitorManagementMySQL.Services.Master.VisitorService;
using VisitorManagementMySQL.Services.Master.WIntegrationService;
using VisitorManagementMySQL.Services.Master.CalendarService;
using VisitorManagementMySQL.Services.Master.WorkFlowService;
using VisitorManagementMySQL.Services.Notification;
using VisitorManagementMySQL.Services.Reports.RptCheckInCheckOutService;
using VisitorManagementMySQL.Services.VisitorManagement.ExternalBookEntryService;
using VisitorManagementMySQL.Services.VisitorManagement.VisitorEntryService;
using VisitorManagementMySQL.Services.VisitorManagement.WorkPermitService;
using VisitorManagementMySQL.Services.WhatsAppService;
using VisitorManagementMySQL.Services.WorkPermitMod.VendorRegService;

namespace VisitorManagementMySQL
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add CORS services
            services.AddCors(options =>
            {
                options.AddPolicy(
                    "AllowAllOrigins",
                    builder =>
                    {
                        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                    }
                );
            });

            services.AddScoped<IMailService, MailService>();
            services.AddScoped<IWhatsAppService, WhatsAppService>();
            // services.AddSingleton<DapperContext>();
            // var emailConfig = Configuration.GetSection("MailSettings").Get<MailSettings>();
            services.Configure<MailSettings>(Configuration.GetSection("MailSettings"));
            services.AddMemoryCache();
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc(
                    "v1",
                    new OpenApiInfo { Title = "VisitorManagementMySQL", Version = "v1" }
                );
            });
            #region  Sql Connection Set Up
            var connectionString = Configuration.GetConnectionString("VisitorManagementCon");
            services.Configure<DbConnectionInfo>(settings =>
                Configuration.GetSection("ConnectionStrings").Bind(settings)
            );
            services.AddScoped<DbContextHelper>();
            services.AddHostedService<NotificationCheckService>();
            services.AddSignalR();
            services.Configure<FormOptions>(o =>
            {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });
            //     services.AddDbContext<DbContextHelper>(opt =>
            //    {
            //        opt.UseSqlServer(connectionString);
            //        //    opt.UseLazyLoadingProxies(true);
            //        opt.EnableSensitiveDataLogging();
            //        opt.ConfigureWarnings(warnings =>
            //            warnings.Ignore(CoreEventId.DetachedLazyLoadingWarning)
            //            .Ignore(CoreEventId.LazyLoadOnDisposedContextWarning)
            //            );
            //    });
            services
                .AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft
                        .Json
                        .ReferenceLoopHandling
                        .Ignore;
                });
            var key = "64A63153-11C1-4919-9133-EFAF99A9B456";
            services
                .AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x =>
                {
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters =
                        new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                        {
                            ValidateLifetime = true,
                            RequireExpirationTime = true,
                            ValidateIssuer = false,
                            ValidateAudience = false,
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(
                                Encoding.ASCII.GetBytes(key)
                            ),
                        };
                });
            services.AddSingleton<ITokenAuthService, TokenAuthService>();
            services.AddHttpContextAccessor();
            services.AddScoped<IDapperContext, DapperContext>();
            services.AddScoped<DbContextHelper>();
            services.AddScoped<ICommonService, CommonService>();
            services.AddScoped<IStateService, StateService>();
            services.AddScoped<ILoginService, LoginService>();
            services.AddScoped<ITokenAuthService, TokenAuthService>();
            services.AddScoped<ICountryService, CountryService>();
            services.AddScoped<IRoleScreenMappingService, RoleScreenMappingService>();
            services.AddScoped<IUserScreenMappingService, UserScreenMappingService>();
            services.AddScoped<INumberingSchemaService, NumberingSchemaService>();

            //feno
            services.AddScoped<ICityService, CityService>();
            services.AddScoped<IDepartmentService, DepartmentService>();
            services.AddScoped<IGateService, GateService>();
            services.AddScoped<IPlantService, PlantService>();
            services.AddScoped<IDriverService, DriverService>();
            services.AddScoped<IVehicleService, VehicleService>();
            services.AddScoped<IMaterialService, MaterialService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<FileUploadService>();
            services.AddScoped<IApprovalService, ApprovalService>();
            services.AddScoped<IIndividualService, IndividualService>();
            services.AddScoped<IWIntegrationService, WIntegrationService>();
            services.AddScoped<IWorkFlowService, WorkFlowService>();
            services.AddScoped<IApprovalWorkFlow, ApprovalWorkFlow>();
            services.AddScoped<IPreviewPassService, PreviewPassService>();

            // Supriya
            services.AddScoped<ICompanyService, CompanyService>();
            services.AddScoped<ISupplierService, SupplierService>();
            services.AddScoped<IRouteService, RouteService>();
            services.AddScoped<IAreaService, AreaService>();
            services.AddScoped<IShiftService, ShiftService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IRptCheckInCheckOutService, RptCheckInCheckOutService>();
            services.AddScoped<IInstructionsService, InstructionsService>();

            // Rahul
            services.AddScoped<IVisitorEntryService, VisitorEntryService>();
            services.AddScoped<IVisitorService, VisitorService>();
            services.AddScoped<IExternalBookEntryService, ExternalBookEntryService>();
            services.AddScoped<IExternalBookVisitorService, ExternalBookVisitorService>();
            services.AddScoped<IVisitorService, VisitorService>();
            services.AddScoped<IApprovalWorkFlow, ApprovalWorkFlow>();
            services.AddScoped<IWorkPermitService, WorkPermitService>();

            services.AddScoped<IVendorRegService, VendorRegService>();
            services.AddScoped<ICategoryCPMappingService, CategoryCPMappingService>();
            services.AddScoped<IFeedbackService, FeedbackService>();
            services.AddScoped<ICalendarService, CalendarService>();

            #endregion
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("AllowAllOrigins");
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "VisitorManagementMySQL v1")
                );
            }
            app.UseStaticFiles();
            app.UseStaticFiles(
                new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(Directory.GetCurrentDirectory(), @"upload")
                    ),
                    RequestPath = new PathString("/upload"),
                    // OnPrepareResponse = ctx =>
                    // {
                    //     const int durationInSeconds = 60 * 60 * 365;
                    //     ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                    //     "public,max-age=" + durationInSeconds;
                    // }
                }
            );
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
