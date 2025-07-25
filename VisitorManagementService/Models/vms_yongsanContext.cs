using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class vms_yongsanContext : DbContext
    {
        public vms_yongsanContext()
        {
        }

        public vms_yongsanContext(DbContextOptions<vms_yongsanContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AndroidNotificationDetail> AndroidNotificationDetails { get; set; }
        public virtual DbSet<AndroidUser> AndroidUsers { get; set; }
        public virtual DbSet<AndroidVisitorValidationView> AndroidVisitorValidationViews { get; set; }
        public virtual DbSet<Approval> Approvals { get; set; }
        public virtual DbSet<ApprovalConfiguration> ApprovalConfigurations { get; set; }
        public virtual DbSet<ApprovalConfigurationDetail> ApprovalConfigurationDetails { get; set; }
        public virtual DbSet<ApprovalDetail> ApprovalDetails { get; set; }
        public virtual DbSet<Area> Areas { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<CategoryCpMap> CategoryCpMaps { get; set; }
        public virtual DbSet<CategoryCpMapDetail> CategoryCpMapDetails { get; set; }
        public virtual DbSet<City> Cities { get; set; }
        public virtual DbSet<Company> Companies { get; set; }
        public virtual DbSet<Country> Countries { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<Department> Departments { get; set; }
        public virtual DbSet<Driver> Drivers { get; set; }
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<EmployeeDocumentDetail> EmployeeDocumentDetails { get; set; }
        public virtual DbSet<Feedback> Feedbacks { get; set; }
        public virtual DbSet<FeedbackDetail> FeedbackDetails { get; set; }
        public virtual DbSet<Function> Functions { get; set; }
        public virtual DbSet<FunctionRoleMap> FunctionRoleMaps { get; set; }
        public virtual DbSet<Gate> Gates { get; set; }
        public virtual DbSet<GateDetail> GateDetails { get; set; }
        public virtual DbSet<Instruction> Instructions { get; set; }
        public virtual DbSet<LicenseConfiguration> LicenseConfigurations { get; set; }
        public virtual DbSet<LoginHistory> LoginHistories { get; set; }
        public virtual DbSet<Material> Materials { get; set; }
        public virtual DbSet<MaterialCategory> MaterialCategories { get; set; }
        public virtual DbSet<MaterialSubCategory> MaterialSubCategories { get; set; }
        public virtual DbSet<MaterialType> MaterialTypes { get; set; }
        public virtual DbSet<Metadatum> Metadata { get; set; }
        public virtual DbSet<MobAndroidUsersView> MobAndroidUsersViews { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<NumberingSchema> NumberingSchemas { get; set; }
        public virtual DbSet<NumberingSchemaSearchView> NumberingSchemaSearchViews { get; set; }
        public virtual DbSet<OtpVerificationMob> OtpVerificationMobs { get; set; }
        public virtual DbSet<Plant> Plants { get; set; }
        public virtual DbSet<PlantNotificationDetail> PlantNotificationDetails { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<RoleWiseScreenMappingView> RoleWiseScreenMappingViews { get; set; }
        public virtual DbSet<Route> Routes { get; set; }
        public virtual DbSet<Sequence> Sequences { get; set; }
        public virtual DbSet<Shift> Shifts { get; set; }
        public virtual DbSet<State> States { get; set; }
        public virtual DbSet<Supplier> Suppliers { get; set; }
        public virtual DbSet<SupplierBillingdetail> SupplierBillingdetails { get; set; }
        public virtual DbSet<SupplierType> SupplierTypes { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserBranchMap> UserBranchMaps { get; set; }
        public virtual DbSet<UserCompanyMap> UserCompanyMaps { get; set; }
        public virtual DbSet<UserGateMap> UserGateMaps { get; set; }
        public virtual DbSet<UserPlantMap> UserPlantMaps { get; set; }
        public virtual DbSet<UserPlantMapView> UserPlantMapViews { get; set; }
        public virtual DbSet<UserRoleMap> UserRoleMaps { get; set; }
        public virtual DbSet<UserRoleMapView> UserRoleMapViews { get; set; }
        public virtual DbSet<UserRoleMappedFunctionView> UserRoleMappedFunctionViews { get; set; }
        public virtual DbSet<UserScreenMapping> UserScreenMappings { get; set; }
        public virtual DbSet<UserSession> UserSessions { get; set; }
        public virtual DbSet<UserView> UserViews { get; set; }
        public virtual DbSet<Userdevicetoken> Userdevicetokens { get; set; }
        public virtual DbSet<Userrolemap1> Userrolemaps1 { get; set; }
        public virtual DbSet<Vehicle> Vehicles { get; set; }
        public virtual DbSet<VehicleDocumentDetail> VehicleDocumentDetails { get; set; }
        public virtual DbSet<VendorRegistration> VendorRegistrations { get; set; }
        public virtual DbSet<Visitor> Visitors { get; set; }
        public virtual DbSet<VisitorDetail> VisitorDetails { get; set; }
        public virtual DbSet<VisitorDetailLog> VisitorDetailLogs { get; set; }
        public virtual DbSet<VisitorDocDetail> VisitorDocDetails { get; set; }
        public virtual DbSet<VisitorEntry> VisitorEntries { get; set; }
        public virtual DbSet<VisitorEntryAtvDetail> VisitorEntryAtvDetails { get; set; }
        public virtual DbSet<VisitorEntryBelongingDetail> VisitorEntryBelongingDetails { get; set; }
        public virtual DbSet<VisitorEntryDetail> VisitorEntryDetails { get; set; }
        public virtual DbSet<VisitorEntryLog> VisitorEntryLogs { get; set; }
        public virtual DbSet<VisitorEntryMaterialDetail> VisitorEntryMaterialDetails { get; set; }
        public virtual DbSet<VisitorEntryRefDetail> VisitorEntryRefDetails { get; set; }
        public virtual DbSet<VisitorLog> VisitorLogs { get; set; }
        public virtual DbSet<VrCompanyDoc> VrCompanyDocs { get; set; }
        public virtual DbSet<VrWorkerDetail> VrWorkerDetails { get; set; }
        public virtual DbSet<VrWorkerDoc> VrWorkerDocs { get; set; }
        public virtual DbSet<WhatsAppLog> WhatsAppLogs { get; set; }
        public virtual DbSet<WorkPermit> WorkPermits { get; set; }
        public virtual DbSet<WpApprovalDetail> WpApprovalDetails { get; set; }
        public virtual DbSet<WpCategoryDetail> WpCategoryDetails { get; set; }
        public virtual DbSet<WpCompanyDoc> WpCompanyDocs { get; set; }
        public virtual DbSet<WpCpMapDetail> WpCpMapDetails { get; set; }
        public virtual DbSet<WpWorkerDetail> WpWorkerDetails { get; set; }
        public virtual DbSet<WpWorkerDoc> WpWorkerDocs { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySQL("Server=3.109.131.222;Port=3306;Database=vms_yongsan;Uid=root;Pwd=Leiten@2024;Pooling=true;Max Pool Size=5000;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AndroidNotificationDetail>(entity =>
            {
                entity.HasKey(e => e.NotificationId)
                    .HasName("PRIMARY");

                entity.ToTable("android_notification_details");

                entity.Property(e => e.NotificationId)
                    .HasColumnType("bigint unsigned")
                    .HasColumnName("notification_id");

                entity.Property(e => e.Imageurl)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("imageurl");

                entity.Property(e => e.MobileNo)
                    .IsRequired()
                    .HasMaxLength(15)
                    .HasColumnName("mobile_no");

                entity.Property(e => e.NotificationMessage)
                    .IsRequired()
                    .HasColumnName("notification_message");

                entity.Property(e => e.NotificationStatus).HasColumnName("notification_status");

                entity.Property(e => e.NotificationType)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("notification_type");

                entity.Property(e => e.VisitorAddress)
                    .IsRequired()
                    .HasColumnName("visitor_address");

                entity.Property(e => e.VisitorEntryCode)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("visitor_entry_code");

                entity.Property(e => e.VisitorEntryDate)
                    .IsRequired()
                    .HasColumnName("Visitor_Entry_Date");

                entity.Property(e => e.VisitorOrHostId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("visitor_or_host_id");
            });

            modelBuilder.Entity<AndroidUser>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PRIMARY");

                entity.ToTable("android_users");

                entity.HasIndex(e => e.Emailid, "emailid")
                    .IsUnique();

                entity.HasIndex(e => e.Emailid, "emailid_2");

                entity.HasIndex(e => e.Mobileno, "mobileno")
                    .IsUnique();

                entity.HasIndex(e => e.Mobileno, "mobileno_2");

                entity.Property(e => e.UserId)
                    .HasColumnType("bigint unsigned")
                    .HasColumnName("user_id");

                entity.Property(e => e.CompanyName)
                    .HasMaxLength(100)
                    .HasColumnName("company_name");

                entity.Property(e => e.CreatedOn)
                    .HasColumnName("created_on")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.Emailid)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("emailid");

                entity.Property(e => e.Mobileno)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("mobileno");

                entity.Property(e => e.ModifiedOn)
                    .ValueGeneratedOnAddOrUpdate()
                    .HasColumnName("modified_on");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("password");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.UserImageName)
                    .HasMaxLength(255)
                    .HasColumnName("user_image_name");

                entity.Property(e => e.UserImageUrl)
                    .HasMaxLength(255)
                    .HasColumnName("user_image_url");

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("user_name");

                entity.Property(e => e.Verified).HasColumnName("verified");
            });

            modelBuilder.Entity<AndroidVisitorValidationView>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("android_visitor_validation_view");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.MobileNo)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.VisitorEntryCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Visitor_Entry_Code");
            });

            modelBuilder.Entity<Approval>(entity =>
            {
                entity.ToTable("approval");

                entity.Property(e => e.ApprovalId).HasColumnName("Approval_Id");

                entity.Property(e => e.ApprovalActivityId).HasColumnName("Approval_Activity_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DocumentId).HasColumnName("Document_Id");

                entity.Property(e => e.DocumentNo)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("Document_No");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");
            });

            modelBuilder.Entity<ApprovalConfiguration>(entity =>
            {
                entity.ToTable("approval_configuration");

                entity.Property(e => e.ApprovalConfigurationId).HasColumnName("Approval_Configuration_Id");

                entity.Property(e => e.ApprovalActivityId).HasColumnName("Approval_Activity_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DocumentId).HasColumnName("Document_Id");

                entity.Property(e => e.IsDepartmentSpecific).HasColumnName("Is_Department_Specific");

                entity.Property(e => e.IsNotifyApprove).HasColumnName("Is_Notify_Approve");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");
            });

            modelBuilder.Entity<ApprovalConfigurationDetail>(entity =>
            {
                entity.ToTable("approval_configuration_details");

                entity.HasIndex(e => e.ApprovalConfigurationId, "fk_Approval_Configuration_Approval_Configuration_Id");

                entity.Property(e => e.ApprovalConfigurationDetailId).HasColumnName("Approval_Configuration_Detail_Id");

                entity.Property(e => e.ApprovalConfigurationId).HasColumnName("Approval_Configuration_Id");

                entity.Property(e => e.DepartmentId).HasColumnName("Department_Id");

                entity.Property(e => e.IsNotifyApprove)
                    .HasColumnType("tinyint")
                    .HasColumnName("Is_Notify_Approve");

                entity.Property(e => e.LevelId).HasColumnName("Level_Id");

                entity.Property(e => e.PrimaryUserId).HasColumnName("Primary_User_Id");

                entity.Property(e => e.RoleId).HasColumnName("Role_Id");

                entity.Property(e => e.SecondaryUserId).HasColumnName("Secondary_User_Id");

                entity.HasOne(d => d.ApprovalConfiguration)
                    .WithMany(p => p.ApprovalConfigurationDetails)
                    .HasForeignKey(d => d.ApprovalConfigurationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Approval_Configuration_Approval_Configuration_Id");
            });

            modelBuilder.Entity<ApprovalDetail>(entity =>
            {
                entity.ToTable("approval_detail");

                entity.HasIndex(e => e.ApprovalId, "fk_Approval_Approval_Id");

                entity.Property(e => e.ApprovalDetailId).HasColumnName("Approval_Detail_Id");

                entity.Property(e => e.ApprovalId).HasColumnName("Approval_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DocumentId).HasColumnName("Document_Id");

                entity.Property(e => e.DocumentNo)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("Document_No");

                entity.Property(e => e.IsViewed).HasColumnName("Is_Viewed");

                entity.Property(e => e.LevelId).HasColumnName("Level_Id");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PrimaryUserId).HasColumnName("Primary_User_Id");

                entity.Property(e => e.Remarks1).HasMaxLength(500);

                entity.Property(e => e.Remarks2).HasMaxLength(500);

                entity.Property(e => e.SecondaryUserId).HasColumnName("Secondary_User_Id");

                entity.HasOne(d => d.Approval)
                    .WithMany(p => p.ApprovalDetails)
                    .HasForeignKey(d => d.ApprovalId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Approval_Approval_Id");
            });

            modelBuilder.Entity<Area>(entity =>
            {
                entity.ToTable("area");

                entity.Property(e => e.AreaId).HasColumnName("Area_Id");

                entity.Property(e => e.AreaCode)
                    .HasMaxLength(50)
                    .HasColumnName("Area_Code");

                entity.Property(e => e.AreaName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Area_Name");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("category");

                entity.Property(e => e.CategoryId).HasColumnName("Category_Id");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Category_Name");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.IsSysGenerated)
                    .HasColumnType("bit(1)")
                    .HasColumnName("Is_Sys_Generated");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");
            });

            modelBuilder.Entity<CategoryCpMap>(entity =>
            {
                entity.HasKey(e => e.CpMapId)
                    .HasName("PRIMARY");

                entity.ToTable("category_cp_map");

                entity.Property(e => e.CpMapId).HasColumnName("CP_Map_Id");

                entity.Property(e => e.CategoryId).HasColumnName("Category_Id");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Category_Name");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.IsSysGenerated)
                    .HasColumnName("Is_Sys_Generated")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");
            });

            modelBuilder.Entity<CategoryCpMapDetail>(entity =>
            {
                entity.ToTable("category_cp_map_details");

                entity.HasIndex(e => e.CpMapId, "fk_Category_CP_Map_CP_Map_Id");

                entity.Property(e => e.CategoryCpMapDetailId).HasColumnName("Category_CP_Map_Detail_Id");

                entity.Property(e => e.CategoryId).HasColumnName("Category_Id");

                entity.Property(e => e.CpMapId).HasColumnName("CP_Map_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.IsSysGenerated)
                    .HasColumnName("Is_Sys_Generated")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.HasOne(d => d.CpMap)
                    .WithMany(p => p.CategoryCpMapDetails)
                    .HasForeignKey(d => d.CpMapId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Category_CP_Map_CP_Map_Id");
            });

            modelBuilder.Entity<City>(entity =>
            {
                entity.ToTable("city");

                entity.Property(e => e.CityId).HasColumnName("City_Id");

                entity.Property(e => e.CityCode)
                    .HasMaxLength(50)
                    .HasColumnName("City_Code");

                entity.Property(e => e.CityName)
                    .HasMaxLength(250)
                    .HasColumnName("City_Name");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CountryId).HasColumnName("Country_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.StateId).HasColumnName("State_Id");
            });

            modelBuilder.Entity<Company>(entity =>
            {
                entity.ToTable("company");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CheckToken)
                    .HasColumnType("longtext")
                    .HasColumnName("Check_Token");

                entity.Property(e => e.CityId).HasColumnName("city_Id");

                entity.Property(e => e.CompanyCode)
                    .HasMaxLength(50)
                    .HasColumnName("Company_Code");

                entity.Property(e => e.CompanyName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Company_Name");

                entity.Property(e => e.CountryId).HasColumnName("Country_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.Host).HasColumnType("longtext");

                entity.Property(e => e.Mail).HasColumnType("longtext");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.Password).HasColumnType("longtext");

                entity.Property(e => e.Port).HasColumnType("longtext");

                entity.Property(e => e.StateId).HasColumnName("State_Id");

                entity.Property(e => e.UserName)
                    .HasColumnType("longtext")
                    .HasColumnName("User_Name");

                entity.Property(e => e.WhatsAppTemp)
                    .HasColumnType("longtext")
                    .HasColumnName("Whats_App_Temp");
            });

            modelBuilder.Entity<Country>(entity =>
            {
                entity.ToTable("country");

                entity.Property(e => e.CountryId).HasColumnName("Country_Id");

                entity.Property(e => e.CountryCode)
                    .HasMaxLength(50)
                    .HasColumnName("Country_Code");

                entity.Property(e => e.CountryName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Country_Name");

                entity.Property(e => e.CountryShortForm)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Country_Short_Form");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.Nationality)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.ToTable("customer");

                entity.Property(e => e.CustomerId).HasColumnName("Customer_Id");

                entity.Property(e => e.Address).HasMaxLength(500);

                entity.Property(e => e.CityId).HasColumnName("City_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.ContactPerson)
                    .HasMaxLength(100)
                    .HasColumnName("Contact_Person");

                entity.Property(e => e.CountryId).HasColumnName("Country_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.CustomerCode)
                    .HasMaxLength(50)
                    .HasColumnName("Customer_Code");

                entity.Property(e => e.CustomerImageName)
                    .HasColumnType("longtext")
                    .HasColumnName("Customer_Image_Name");

                entity.Property(e => e.CustomerImageUrl)
                    .HasColumnType("longtext")
                    .HasColumnName("Customer_Image_Url");

                entity.Property(e => e.CustomerName)
                    .HasMaxLength(100)
                    .HasColumnName("Customer_Name");

                entity.Property(e => e.Email).HasMaxLength(255);

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(20)
                    .HasColumnName("Phone_Number");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.StateId).HasColumnName("State_Id");
            });

            modelBuilder.Entity<Department>(entity =>
            {
                entity.ToTable("department");

                entity.Property(e => e.DepartmentId).HasColumnName("Department_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DepartmentCode)
                    .HasMaxLength(50)
                    .HasColumnName("Department_Code");

                entity.Property(e => e.DepartmentName)
                    .HasMaxLength(100)
                    .HasColumnName("Department_Name");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");
            });

            modelBuilder.Entity<Driver>(entity =>
            {
                entity.ToTable("driver");

                entity.Property(e => e.DriverId).HasColumnName("Driver_Id");

                entity.Property(e => e.BatchValidity)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Batch_Validity");

                entity.Property(e => e.ContactAddress)
                    .IsRequired()
                    .HasMaxLength(150)
                    .HasColumnName("Contact_Address");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.Dob).HasColumnType("datetime(6)");

                entity.Property(e => e.DocumentRefrenceName)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Refrence_Name");

                entity.Property(e => e.DriverCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Driver_Code");

                entity.Property(e => e.DriverMobileNo).HasColumnName("Driver_Mobile_No");

                entity.Property(e => e.DrivingLicenceNo)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Driving_Licence_No");

                entity.Property(e => e.EmergencyContactName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Emergency_Contact_Name");

                entity.Property(e => e.EmergencyContactNo).HasColumnName("Emergency_Contact_No");

                entity.Property(e => e.EmpId).HasColumnName("Emp_Id");

                entity.Property(e => e.HeavyBatchNo)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Heavy_Batch_No");

                entity.Property(e => e.LicenseValidity)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("License_Validity");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.NationalIdNo)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("National_Id_No");

                entity.Property(e => e.SuppId).HasColumnName("Supp_Id");

                entity.Property(e => e.UploadDocument)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Upload_Document");
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("employee");

                entity.Property(e => e.EmployeeId).HasColumnName("Employee_Id");

                entity.Property(e => e.Address).HasMaxLength(500);

                entity.Property(e => e.BiometricId).HasColumnName("Biometric_Id");

                entity.Property(e => e.BloodGroup).HasColumnName("Blood_Group");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DateOfJoining)
                    .HasColumnType("date")
                    .HasColumnName("Date_Of_Joining");

                entity.Property(e => e.DeptId).HasColumnName("Dept_Id");

                entity.Property(e => e.DesignationId).HasColumnName("Designation_Id");

                entity.Property(e => e.Dob).HasColumnType("date");

                entity.Property(e => e.Email).HasMaxLength(255);

                entity.Property(e => e.EmpTypeId).HasColumnName("Emp_Type_Id");

                entity.Property(e => e.EmployeeCode)
                    .HasMaxLength(20)
                    .HasColumnName("Employee_Code");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(255)
                    .HasColumnName("First_Name");

                entity.Property(e => e.IdcardNo)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("Idcard_No");

                entity.Property(e => e.ImageName)
                    .HasColumnType("longtext")
                    .HasColumnName("Image_Name");

                entity.Property(e => e.ImageUrl)
                    .HasColumnType("longtext")
                    .HasColumnName("Image_Url");

                entity.Property(e => e.LastName)
                    .HasMaxLength(255)
                    .HasColumnName("Last_Name");

                entity.Property(e => e.MaritalStatus).HasColumnName("Marital_Status");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.PrimaryMobileNo)
                    .HasMaxLength(15)
                    .HasColumnName("Primary_Mobile_No");

                entity.Property(e => e.ReleavingDate)
                    .HasColumnType("date")
                    .HasColumnName("Releaving_Date");

                entity.Property(e => e.ReportingPerson).HasColumnName("Reporting_Person");

                entity.Property(e => e.SecondaryMobileNo)
                    .HasMaxLength(15)
                    .HasColumnName("Secondary_Mobile_No");
            });

            modelBuilder.Entity<EmployeeDocumentDetail>(entity =>
            {
                entity.ToTable("employee_document_details");

                entity.HasIndex(e => e.EmployeeId, "fk_Employee_Employee_Id");

                entity.Property(e => e.EmployeeDocumentDetailId).HasColumnName("Employee_Document_Detail_Id");

                entity.Property(e => e.AttachmentName)
                    .HasMaxLength(300)
                    .HasColumnName("Attachment_Name");

                entity.Property(e => e.AttachmentUrl)
                    .HasMaxLength(300)
                    .HasColumnName("Attachment_Url");

                entity.Property(e => e.DocumentName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Document_Name");

                entity.Property(e => e.DocumentNo)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Document_No");

                entity.Property(e => e.EmployeeId).HasColumnName("Employee_Id");

                entity.Property(e => e.Remarks).HasMaxLength(500);

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.EmployeeDocumentDetails)
                    .HasForeignKey(d => d.EmployeeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Employee_Employee_Id");
            });

            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.ToTable("feedback");

                entity.Property(e => e.FeedbackId).HasColumnName("Feedback_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.FeedbackCode)
                    .HasMaxLength(50)
                    .HasColumnName("Feedback_Code");

                entity.Property(e => e.FeedbackDesc)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Feedback_Desc");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");
            });

            modelBuilder.Entity<FeedbackDetail>(entity =>
            {
                entity.ToTable("feedback_detail");

                entity.HasIndex(e => e.FeedbackId, "fk_Feedback_Detail_Feedback_Id");

                entity.Property(e => e.FeedbackDetailId).HasColumnName("Feedback_Detail_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.FeedbackId).HasColumnName("Feedback_Id");

                entity.Property(e => e.FeedbackType).HasColumnName("Feedback_Type");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.StarRating).HasColumnName("Star_Rating");

                entity.HasOne(d => d.Feedback)
                    .WithMany(p => p.FeedbackDetails)
                    .HasForeignKey(d => d.FeedbackId)
                    .HasConstraintName("fk_Feedback_Detail_Feedback_Id");
            });

            modelBuilder.Entity<Function>(entity =>
            {
                entity.ToTable("function");

                entity.Property(e => e.FunctionId).HasColumnName("Function_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.FunctionName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Function_Name");

                entity.Property(e => e.FunctionStatus).HasColumnName("Function_Status");

                entity.Property(e => e.FunctionUrl)
                    .HasMaxLength(300)
                    .HasColumnName("Function_Url");

                entity.Property(e => e.IsApprovalNeeded).HasColumnName("Is_Approval_Needed");

                entity.Property(e => e.IsExternal).HasColumnName("Is_External");

                entity.Property(e => e.MenuIcon)
                    .HasColumnType("longtext")
                    .HasColumnName("menu_Icon");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.ParentId).HasColumnName("Parent_Id");

                entity.Property(e => e.RelLink)
                    .HasColumnType("longtext")
                    .HasColumnName("rel_link");

                entity.Property(e => e.ScreenOrder).HasColumnName("Screen_Order");
            });

            modelBuilder.Entity<FunctionRoleMap>(entity =>
            {
                entity.ToTable("function_role_map");

                entity.Property(e => e.FunctionRoleMapId).HasColumnName("Function_Role_Map_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.FunctionId).HasColumnName("Function_Id");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.RoleId).HasColumnName("Role_Id");
            });

            modelBuilder.Entity<Gate>(entity =>
            {
                entity.ToTable("gate");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.GateCloseTime)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Gate_Close_Time");

                entity.Property(e => e.GateCode)
                    .HasMaxLength(50)
                    .HasColumnName("Gate_Code");

                entity.Property(e => e.GateInchargeId).HasColumnName("Gate_Incharge_id");

                entity.Property(e => e.GateName)
                    .HasMaxLength(100)
                    .HasColumnName("Gate_Name");

                entity.Property(e => e.GateNo)
                    .HasMaxLength(100)
                    .HasColumnName("Gate_No");

                entity.Property(e => e.GateOpenTime)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Gate_Open_Time");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");
            });

            modelBuilder.Entity<GateDetail>(entity =>
            {
                entity.ToTable("gate_detail");

                entity.HasIndex(e => e.GateId, "fk_Gate_Detail_Gate_Id");

                entity.Property(e => e.GateDetailId).HasColumnName("Gate_Detail_Id");

                entity.Property(e => e.Address).HasMaxLength(500);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("email");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.PhoneNumber)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Phone_Number");

                entity.Property(e => e.SecurityId).HasColumnName("Security_Id");

                entity.HasOne(d => d.Gate)
                    .WithMany(p => p.GateDetails)
                    .HasForeignKey(d => d.GateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Gate_Detail_Gate_Id");
            });

            modelBuilder.Entity<Instruction>(entity =>
            {
                entity.HasKey(e => e.InstructionsId)
                    .HasName("PRIMARY");

                entity.ToTable("instructions");

                entity.Property(e => e.InstructionsId).HasColumnName("Instructions_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.InstructionName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Instruction_Name");

                entity.Property(e => e.IsEnabled).HasColumnName("Is_Enabled");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.Points)
                    .IsRequired()
                    .HasColumnType("longtext");

                entity.Property(e => e.VisitorTypeId).HasColumnName("Visitor_Type_Id");
            });

            modelBuilder.Entity<LicenseConfiguration>(entity =>
            {
                entity.HasKey(e => e.LicenseId)
                    .HasName("PRIMARY");

                entity.ToTable("license_configuration");

                entity.Property(e => e.LicenseId).HasColumnName("License_Id");

                entity.Property(e => e.CompanyCode)
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnName("Company_Code");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CompanyName)
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnName("Company_Name");

                entity.Property(e => e.IsEmApprovalEnabled).HasColumnName("Is_EM_Approval_Enabled");

                entity.Property(e => e.IsWaApprovalEnabled).HasColumnName("Is_WA_Approval_Enabled");

                entity.Property(e => e.LicenseToken)
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnName("License_Token");

                entity.Property(e => e.TrialEndDate).HasColumnName("Trial_End_Date");

                entity.Property(e => e.TrialStartDate).HasColumnName("Trial_Start_Date");

                entity.Property(e => e.TrialTotalDays).HasColumnName("Trial_Total_Days");
            });

            modelBuilder.Entity<LoginHistory>(entity =>
            {
                entity.ToTable("login_history");

                entity.Property(e => e.LoginHistoryId).HasColumnName("Login_History_Id");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.UserId).HasColumnName("User_Id");
            });

            modelBuilder.Entity<Material>(entity =>
            {
                entity.ToTable("material");

                entity.Property(e => e.MaterialId).HasColumnName("Material_Id");

                entity.Property(e => e.BrandName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Brand_Name");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.MaterialCategoryId).HasColumnName("Material_Category_Id");

                entity.Property(e => e.MaterialCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Material_Code");

                entity.Property(e => e.MaterialImageName)
                    .HasColumnType("longtext")
                    .HasColumnName("Material_Image_Name");

                entity.Property(e => e.MaterialImageUrl)
                    .HasColumnType("longtext")
                    .HasColumnName("Material_Image_Url");

                entity.Property(e => e.MaterialName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Material_Name");

                entity.Property(e => e.MaterialSubCategoryId).HasColumnName("Material_Sub_Category_Id");

                entity.Property(e => e.MaterialType).HasColumnName("Material_Type");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PurchasePrice)
                    .HasColumnType("decimal(19,5)")
                    .HasColumnName("Purchase_Price");

                entity.Property(e => e.Uom).HasDefaultValueSql("'3'");
            });

            modelBuilder.Entity<MaterialCategory>(entity =>
            {
                entity.ToTable("material_category");

                entity.Property(e => e.MaterialCategoryId).HasColumnName("Material_Category_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.MaterialCategoryName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Material_Category_Name");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");
            });

            modelBuilder.Entity<MaterialSubCategory>(entity =>
            {
                entity.ToTable("material_sub_category");

                entity.Property(e => e.MaterialSubCategoryId).HasColumnName("Material_Sub_Category_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.MaterialCategoryId).HasColumnName("Material_Category_Id");

                entity.Property(e => e.MaterialSubCategoryCode)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Material_Sub_Category_Code");

                entity.Property(e => e.MaterialSubCategoryName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Material_Sub_Category_Name");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");
            });

            modelBuilder.Entity<MaterialType>(entity =>
            {
                entity.ToTable("material_type");

                entity.Property(e => e.MaterialTypeId).HasColumnName("Material_Type_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.MaterialTypeName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Material_Type_Name");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");
            });

            modelBuilder.Entity<Metadatum>(entity =>
            {
                entity.HasKey(e => e.MetaSubId)
                    .HasName("PRIMARY");

                entity.ToTable("metadata");

                entity.Property(e => e.MetaSubId).HasColumnName("Meta_Sub_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.MetaSubCode)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("Meta_Sub_Code");

                entity.Property(e => e.MetaSubDescription)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Meta_Sub_Description");

                entity.Property(e => e.MetaTypeCode)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("Meta_Type_Code");

                entity.Property(e => e.MetaTypeName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Meta_Type_Name");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");
            });

            modelBuilder.Entity<MobAndroidUsersView>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("mob_android_users_view");

                entity.Property(e => e.CompanyName).HasMaxLength(255);

                entity.Property(e => e.Emailid)
                    .HasMaxLength(100)
                    .HasColumnName("emailid");

                entity.Property(e => e.Mobileno)
                    .HasMaxLength(30)
                    .HasColumnName("mobileno");

                entity.Property(e => e.Password)
                    .HasColumnType("longtext")
                    .HasColumnName("password");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(8)
                    .HasColumnName("type")
                    .HasDefaultValueSql("''");

                entity.Property(e => e.UserId)
                    .HasMaxLength(20)
                    .HasColumnName("user_id");

                entity.Property(e => e.UserImageName)
                    .HasMaxLength(255)
                    .HasColumnName("user_image_name");

                entity.Property(e => e.UserImageUrl)
                    .HasMaxLength(255)
                    .HasColumnName("user_image_url");

                entity.Property(e => e.UserName)
                    .HasMaxLength(100)
                    .HasColumnName("user_name");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.ToTable("notification");

                entity.Property(e => e.NotificationId).HasColumnName("Notification_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.EntryCode)
                    .HasMaxLength(50)
                    .HasColumnName("Entry_Code");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.InchargeId).HasColumnName("Incharge_Id");

                entity.Property(e => e.MailId)
                    .HasMaxLength(500)
                    .HasColumnName("Mail_Id");

                entity.Property(e => e.MobileNo)
                    .IsRequired()
                    .HasMaxLength(15)
                    .HasColumnName("Mobile_No");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.NotificationSent)
                    .HasColumnName("Notification_Sent")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.NotificationType).HasColumnName("Notification_Type");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.SentTimestamp).HasColumnName("Sent_Timestamp");

                entity.Property(e => e.VisitorId).HasColumnName("Visitor_Id");

                entity.Property(e => e.VisitorName)
                    .HasMaxLength(100)
                    .HasColumnName("Visitor_Name");
            });

            modelBuilder.Entity<NumberingSchema>(entity =>
            {
                entity.ToTable("numbering_schema");

                entity.Property(e => e.NumberingSchemaId).HasColumnName("Numbering_Schema_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DateFormat).HasColumnName("Date_Format");

                entity.Property(e => e.DocumentId).HasColumnName("Document_Id");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.Prefix).HasMaxLength(20);

                entity.Property(e => e.SequenceName)
                    .HasMaxLength(100)
                    .HasColumnName("Sequence_Name");

                entity.Property(e => e.Suffix).HasMaxLength(20);

                entity.Property(e => e.SymbolId).HasColumnName("Symbol_Id");

                entity.Property(e => e.TableName)
                    .HasMaxLength(255)
                    .HasColumnName("Table_Name");

                entity.Property(e => e.WSequenceName)
                    .HasMaxLength(100)
                    .HasColumnName("W_Sequence_Name");
            });

            modelBuilder.Entity<NumberingSchemaSearchView>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("numbering_schema_search_view");

                entity.Property(e => e.DateFormat).HasColumnName("date_format");

                entity.Property(e => e.DateFormatName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasDefaultValueSql("''");

                entity.Property(e => e.FunctionId).HasColumnName("Function_Id");

                entity.Property(e => e.FunctionName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Function_Name");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.NumberingSchemaId).HasColumnName("Numbering_Schema_Id");

                entity.Property(e => e.Prefix).HasMaxLength(20);

                entity.Property(e => e.StatusName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Suffix).HasMaxLength(20);

                entity.Property(e => e.SymbolName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasDefaultValueSql("''");
            });

            modelBuilder.Entity<OtpVerificationMob>(entity =>
            {
                entity.HasKey(e => e.VerificationId)
                    .HasName("PRIMARY");

                entity.ToTable("otp_verification_mob");

                entity.HasIndex(e => e.VerificationNo, "verification_no");

                entity.Property(e => e.VerificationId)
                    .HasColumnType("bigint unsigned")
                    .HasColumnName("verification_id");

                entity.Property(e => e.ExpiryAt).HasColumnName("expiry_at");

                entity.Property(e => e.OtpCode)
                    .IsRequired()
                    .HasMaxLength(10)
                    .HasColumnName("otp_code");

                entity.Property(e => e.Status)
                    .HasColumnType("tinyint")
                    .HasColumnName("status");

                entity.Property(e => e.VerificationNo)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("verification_no");

                entity.Property(e => e.VerificationType)
                    .IsRequired()
                    .HasMaxLength(15)
                    .HasColumnName("verification_type");
            });

            modelBuilder.Entity<Plant>(entity =>
            {
                entity.ToTable("plant");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.Address).HasColumnType("longtext");

                entity.Property(e => e.AlertAfterMins)
                    .HasColumnType("decimal(5,2)")
                    .HasColumnName("Alert_After_Mins");

                entity.Property(e => e.CcMail)
                    .HasColumnType("longtext")
                    .HasColumnName("Cc_Mail");

                entity.Property(e => e.CheckToken)
                    .HasColumnType("longtext")
                    .HasColumnName("Check_Token");

                entity.Property(e => e.CityId).HasColumnName("city_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CountryId).HasColumnName("Country_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.GeoLocation)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Geo_Location");

                entity.Property(e => e.IsAutomaticApprove).HasColumnName("Is_Automatic_Approve");

                entity.Property(e => e.IsDocMandatory).HasColumnName("Is_Doc_Mandatory");

                entity.Property(e => e.IsFileMandatory).HasColumnName("Is_File_Mandatory");

                entity.Property(e => e.IsNotification)
                    .HasColumnType("tinyint")
                    .HasColumnName("Is_Notification");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Plant_Code");

                entity.Property(e => e.PlantName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Plant_Name");

                entity.Property(e => e.PlantType).HasColumnName("Plant_Type");

                entity.Property(e => e.ReportTimer)
                    .HasColumnType("decimal(5,2)")
                    .HasColumnName("Report_Timer");

                entity.Property(e => e.StateId).HasColumnName("State_Id");

                entity.Property(e => e.ToMail)
                    .HasColumnType("longtext")
                    .HasColumnName("To_Mail");

                entity.Property(e => e.UrlToken)
                    .HasColumnType("longtext")
                    .HasColumnName("URL_Token");
            });

            modelBuilder.Entity<PlantNotificationDetail>(entity =>
            {
                entity.ToTable("plant_notification_details");

                entity.HasIndex(e => e.PlantId, "fk_Plant_Plant_Id");

                entity.Property(e => e.PlantNotificationDetailId).HasColumnName("Plant_Notification_Detail_Id");

                entity.Property(e => e.DepartmentId).HasColumnName("Department_Id");

                entity.Property(e => e.LevelId).HasColumnName("Level_Id");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.PrimaryUserId).HasColumnName("Primary_User_Id");

                entity.Property(e => e.SecondaryUserId).HasColumnName("Secondary_User_Id");

                entity.HasOne(d => d.Plant)
                    .WithMany(p => p.PlantNotificationDetails)
                    .HasForeignKey(d => d.PlantId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Plant_Plant_Id");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("role");

                entity.Property(e => e.RoleId).HasColumnName("Role_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.IsDesignation).HasColumnName("Is_Designation");

                entity.Property(e => e.IsSystemGenerated)
                    .HasColumnName("Is_System_Generated")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.RoleCode)
                    .HasMaxLength(50)
                    .HasColumnName("Role_Code");

                entity.Property(e => e.RoleName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Role_Name");
            });

            modelBuilder.Entity<RoleWiseScreenMappingView>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("role_wise_screen_mapping_view");

                entity.Property(e => e.ModuleName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasDefaultValueSql("''");

                entity.Property(e => e.RoleId).HasColumnName("Role_Id");

                entity.Property(e => e.ScreenName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasDefaultValueSql("''");
            });

            modelBuilder.Entity<Route>(entity =>
            {
                entity.ToTable("route");

                entity.Property(e => e.RouteId).HasColumnName("Route_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.FromLocation)
                    .HasMaxLength(255)
                    .HasColumnName("From_Location");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.RouteCode)
                    .HasMaxLength(50)
                    .HasColumnName("Route_Code");

                entity.Property(e => e.RouteDesc)
                    .HasColumnType("longtext")
                    .HasColumnName("Route_Desc");

                entity.Property(e => e.RouteDistanceInKm)
                    .HasColumnType("decimal(10,2)")
                    .HasColumnName("Route_Distance_In_Km");

                entity.Property(e => e.RouteName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Route_Name");

                entity.Property(e => e.ToLocation)
                    .HasMaxLength(255)
                    .HasColumnName("To_Location");
            });

            modelBuilder.Entity<Sequence>(entity =>
            {
                entity.HasKey(e => e.SequenceName)
                    .HasName("PRIMARY");

                entity.ToTable("sequences");

                entity.Property(e => e.SequenceName)
                    .HasMaxLength(255)
                    .HasColumnName("sequence_name");

                entity.Property(e => e.NextVal)
                    .HasColumnName("next_val")
                    .HasDefaultValueSql("'1'");
            });

            modelBuilder.Entity<Shift>(entity =>
            {
                entity.ToTable("shift");

                entity.Property(e => e.ShiftId).HasColumnName("Shift_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.ShiftCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Shift_Code");

                entity.Property(e => e.ShiftFromTime)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Shift_From_Time");

                entity.Property(e => e.ShiftHours)
                    .HasColumnType("decimal(5,2)")
                    .HasColumnName("Shift_Hours");

                entity.Property(e => e.ShiftName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Shift_Name");

                entity.Property(e => e.ShiftToTime)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Shift_To_Time");

                entity.Property(e => e.ShiftType)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Shift_Type");
            });

            modelBuilder.Entity<State>(entity =>
            {
                entity.ToTable("state");

                entity.Property(e => e.StateId).HasColumnName("State_Id");

                entity.Property(e => e.CountryId).HasColumnName("Country_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.StateCode)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("State_Code");

                entity.Property(e => e.StateName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("State_Name");
            });

            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.ToTable("supplier");

                entity.Property(e => e.SupplierId).HasColumnName("Supplier_Id");

                entity.Property(e => e.Address).HasMaxLength(500);

                entity.Property(e => e.CityId).HasColumnName("City_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CountryId).HasColumnName("Country_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.SeriesId).HasColumnName("Series_Id");

                entity.Property(e => e.StateId).HasColumnName("State_Id");

                entity.Property(e => e.SupplierAreaCode)
                    .HasMaxLength(10)
                    .HasColumnName("Supplier_Area_Code");

                entity.Property(e => e.SupplierCategoryId).HasColumnName("Supplier_Category_Id");

                entity.Property(e => e.SupplierCode)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("Supplier_Code");

                entity.Property(e => e.SupplierCstNo)
                    .HasMaxLength(20)
                    .HasColumnName("Supplier_Cst_No");

                entity.Property(e => e.SupplierEccNo)
                    .HasMaxLength(20)
                    .HasColumnName("Supplier_Ecc_No");

                entity.Property(e => e.SupplierGstNo)
                    .HasMaxLength(20)
                    .HasColumnName("Supplier_Gst_No");

                entity.Property(e => e.SupplierImageName)
                    .HasColumnType("longtext")
                    .HasColumnName("Supplier_Image_Name");

                entity.Property(e => e.SupplierImageUrl)
                    .HasColumnType("longtext")
                    .HasColumnName("Supplier_Image_Url");

                entity.Property(e => e.SupplierIsLocal).HasColumnName("Supplier_Is_Local");

                entity.Property(e => e.SupplierMailId)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Supplier_Mail_Id");

                entity.Property(e => e.SupplierMailId2)
                    .HasMaxLength(50)
                    .HasColumnName("Supplier_Mail_Id2");

                entity.Property(e => e.SupplierMobileNo)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("Supplier_Mobile_No");

                entity.Property(e => e.SupplierMobileNo2)
                    .HasMaxLength(50)
                    .HasColumnName("Supplier_Mobile_No2");

                entity.Property(e => e.SupplierName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Supplier_Name");

                entity.Property(e => e.SupplierPanNo)
                    .HasMaxLength(20)
                    .HasColumnName("Supplier_Pan_No");

                entity.Property(e => e.SupplierTinNo)
                    .HasMaxLength(20)
                    .HasColumnName("Supplier_Tin_No");

                entity.Property(e => e.SupplierTypeId).HasColumnName("Supplier_Type_Id");

                entity.Property(e => e.SupplierVatNo)
                    .HasMaxLength(20)
                    .HasColumnName("Supplier_Vat_No");
            });

            modelBuilder.Entity<SupplierBillingdetail>(entity =>
            {
                entity.HasKey(e => e.SupplierBillingId)
                    .HasName("PRIMARY");

                entity.ToTable("supplier_billingdetails");

                entity.HasIndex(e => e.SupplierId, "fk_Supplier_BillingDetails_Supplier_Id");

                entity.Property(e => e.SupplierBillingId).HasColumnName("Supplier_Billing_Id");

                entity.Property(e => e.BillingAddressOne)
                    .IsRequired()
                    .HasMaxLength(300)
                    .HasColumnName("Billing_Address_One");

                entity.Property(e => e.BillingAddressTwo)
                    .IsRequired()
                    .HasMaxLength(300)
                    .HasColumnName("Billing_Address_Two");

                entity.Property(e => e.BillingContactPerson)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Billing_ContactPerson");

                entity.Property(e => e.BillingMailId)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Billing_Mail_Id");

                entity.Property(e => e.BillingMobileNo)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Billing_MobileNo");

                entity.Property(e => e.BillingPhoneOne)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Billing_Phone_One");

                entity.Property(e => e.BillingPhoneTwo)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Billing_Phone_Two");

                entity.Property(e => e.BillingPincode)
                    .IsRequired()
                    .HasMaxLength(10)
                    .HasColumnName("Billing_Pincode");

                entity.Property(e => e.CityId).HasColumnName("City_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CountryId).HasColumnName("Country_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DocumentName)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Name");

                entity.Property(e => e.DocumentUrl)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Url");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.StateId).HasColumnName("State_Id");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.SupplierId).HasColumnName("Supplier_Id");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.SupplierBillingdetails)
                    .HasForeignKey(d => d.SupplierId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Supplier_BillingDetails_Supplier_Id");
            });

            modelBuilder.Entity<SupplierType>(entity =>
            {
                entity.ToTable("supplier_type");

                entity.Property(e => e.SupplierTypeId).HasColumnName("Supplier_Type_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.SupplierTypeCode)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("Supplier_Type_Code");

                entity.Property(e => e.SupplierTypeName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Supplier_Type_Name");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.Property(e => e.Address).HasMaxLength(500);

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DefaultRoleId).HasColumnName("Default_Role_Id");

                entity.Property(e => e.DeptId).HasColumnName("Dept_Id");

                entity.Property(e => e.DigitalSign)
                    .HasMaxLength(500)
                    .HasColumnName("Digital_Sign");

                entity.Property(e => e.DigitalSignName)
                    .HasMaxLength(500)
                    .HasColumnName("Digital_Sign_Name");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.IsBlocked).HasColumnName("is_blocked");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnType("longtext");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.SecondaryMobileNo)
                    .HasMaxLength(15)
                    .HasColumnName("Secondary_Mobile_No");

                entity.Property(e => e.UserCode)
                    .HasMaxLength(20)
                    .HasColumnName("User_Code");

                entity.Property(e => e.UserEmail)
                    .HasMaxLength(100)
                    .HasColumnName("User_Email");

                entity.Property(e => e.UserImageName)
                    .HasColumnType("longtext")
                    .HasColumnName("user_image_name");

                entity.Property(e => e.UserImageUrl)
                    .HasColumnType("longtext")
                    .HasColumnName("user_image_url");

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("User_Name");

                entity.Property(e => e.UserTelNo)
                    .HasMaxLength(15)
                    .HasColumnName("User_Tel_No");
            });

            modelBuilder.Entity<UserBranchMap>(entity =>
            {
                entity.ToTable("user_branch_map");

                entity.HasIndex(e => e.UserId, "fk_Users_User_Id");

                entity.Property(e => e.UserBranchMapId).HasColumnName("User_Branch_Map_Id");

                entity.Property(e => e.AccountingYear).HasColumnName("Accounting_Year");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.IsDefault).HasColumnName("Is_Default");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserBranchMaps)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Users_User_Id");
            });

            modelBuilder.Entity<UserCompanyMap>(entity =>
            {
                entity.HasKey(e => e.UserCompanyId)
                    .HasName("PRIMARY");

                entity.ToTable("user_company_map");

                entity.HasIndex(e => e.UserId, "fk_User_User_Id");

                entity.Property(e => e.UserCompanyId).HasColumnName("User_Company_Id");

                entity.Property(e => e.AccountingYear).HasColumnName("Accounting_Year");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.IsDefault).HasColumnName("Is_Default");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserCompanyMaps)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_User_User_Id");
            });

            modelBuilder.Entity<UserGateMap>(entity =>
            {
                entity.ToTable("user_gate_map");

                entity.HasIndex(e => e.UserId, "fk_User_Gate_Id_User_Id");

                entity.Property(e => e.UserGateMapId).HasColumnName("User_Gate_Map_Id");

                entity.Property(e => e.AccountingYear).HasColumnName("Accounting_Year");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.IsDefault).HasColumnName("Is_Default");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserGateMaps)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_User_Gate_Id_User_Id");
            });

            modelBuilder.Entity<UserPlantMap>(entity =>
            {
                entity.ToTable("user_plant_map");

                entity.HasIndex(e => e.UserId, "fk_User_Plant_Id_User_Id");

                entity.Property(e => e.UserPlantMapId).HasColumnName("User_Plant_Map_Id");

                entity.Property(e => e.AccountingYear).HasColumnName("Accounting_Year");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.IsDefault).HasColumnName("Is_Default");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserPlantMaps)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_User_Plant_Id_User_Id");
            });

            modelBuilder.Entity<UserPlantMapView>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("user_plant_map_view");

                entity.Property(e => e.IsDefault).HasColumnName("Is_Default");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.PlantName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Plant_Name");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("User_Name");
            });

            modelBuilder.Entity<UserRoleMap>(entity =>
            {
                entity.ToTable("user_role_map");

                entity.HasIndex(e => e.UserId, "fk_User_Roll_Map_User_Id");

                entity.Property(e => e.UserRoleMapId).HasColumnName("User_Role_Map_Id");

                entity.Property(e => e.AccountingYear).HasColumnName("Accounting_Year");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.IsDefault).HasColumnName("Is_Default");

                entity.Property(e => e.RoleId).HasColumnName("Role_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserRoleMaps)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_User_Roll_Map_User_Id");
            });

            modelBuilder.Entity<UserRoleMapView>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("user_role_map_view");

                entity.Property(e => e.IsDefault).HasColumnName("Is_Default");

                entity.Property(e => e.RoleId).HasColumnName("Role_Id");

                entity.Property(e => e.RoleName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Role_Name");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("User_Name");
            });

            modelBuilder.Entity<UserRoleMappedFunctionView>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("user_role_mapped_function_view");

                entity.Property(e => e.Approval).HasColumnName("APPROVAL");

                entity.Property(e => e.Create).HasColumnName("CREATE");

                entity.Property(e => e.Delete).HasColumnName("DELETE");

                entity.Property(e => e.Moduleid).HasColumnName("MODULEID");

                entity.Property(e => e.Modulename)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("MODULENAME");

                entity.Property(e => e.Path)
                    .HasMaxLength(300)
                    .HasColumnName("PATH");

                entity.Property(e => e.Pricehistory).HasColumnName("PRICEHISTORY");

                entity.Property(e => e.Print).HasColumnName("PRINT");

                entity.Property(e => e.Profit).HasColumnName("PROFIT");

                entity.Property(e => e.RoleId).HasColumnName("Role_Id");

                entity.Property(e => e.RoleName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Role_Name");

                entity.Property(e => e.ScreenId).HasColumnName("Screen_Id");

                entity.Property(e => e.ScreenOrder).HasColumnName("Screen_Order");

                entity.Property(e => e.Screenname)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("SCREENNAME");

                entity.Property(e => e.Series).HasColumnName("SERIES");

                entity.Property(e => e.Update).HasColumnName("UPDATE");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("User_Name");

                entity.Property(e => e.View).HasColumnName("VIEW");
            });

            modelBuilder.Entity<UserScreenMapping>(entity =>
            {
                entity.ToTable("user_screen_mapping");

                entity.Property(e => e.UserScreenMappingId).HasColumnName("User_Screen_Mapping_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.ModuleId).HasColumnName("Module_Id");

                entity.Property(e => e.RoleId).HasColumnName("Role_Id");

                entity.Property(e => e.ScreenId).HasColumnName("Screen_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");
            });

            modelBuilder.Entity<UserSession>(entity =>
            {
                entity.ToTable("user_session");

                entity.Property(e => e.UserSessionId).HasColumnName("User_Session_Id");

                entity.Property(e => e.AndroidUser).HasColumnName("android_user");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.IosUser).HasColumnName("ios_user");

                entity.Property(e => e.LoggedInOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Logged_In_On");

                entity.Property(e => e.LoggedOutOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Logged_Out_On");

                entity.Property(e => e.LoggedRole).HasColumnName("Logged_Role");

                entity.Property(e => e.LoggedUser).HasColumnName("Logged_User");

                entity.Property(e => e.Mobileno)
                    .HasMaxLength(15)
                    .HasColumnName("mobileno");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.SessionId)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Session_Id");

                entity.Property(e => e.SessionStatus).HasColumnName("Session_Status");
            });

            modelBuilder.Entity<UserView>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("user_view");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.Currentbranchid).HasColumnName("currentbranchid");

                entity.Property(e => e.Currentbranchname)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("currentbranchname")
                    .HasDefaultValueSql("''");

                entity.Property(e => e.DefaultRoleId).HasColumnName("Default_Role_Id");

                entity.Property(e => e.Defaultrolename)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("defaultrolename");

                entity.Property(e => e.Isdefaultbranchid).HasColumnName("isdefaultbranchid");

                entity.Property(e => e.Isdefaultbranchname)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("isdefaultbranchname");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnType("longtext");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.Statusid).HasColumnName("statusid");

                entity.Property(e => e.Statusname).HasColumnName("statusname");

                entity.Property(e => e.UserEmail)
                    .HasMaxLength(100)
                    .HasColumnName("User_Email");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("User_Name");

                entity.Property(e => e.UserTelNo)
                    .HasMaxLength(15)
                    .HasColumnName("User_Tel_No");
            });

            modelBuilder.Entity<Userdevicetoken>(entity =>
            {
                entity.ToTable("userdevicetokens");

                entity.HasIndex(e => e.MobileNumber, "MobileNumber")
                    .IsUnique();

                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.DeviceToken).HasMaxLength(255);

                entity.Property(e => e.MobileNumber).HasMaxLength(15);
            });

            modelBuilder.Entity<Userrolemap1>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("userrolemap");

                entity.Property(e => e.AccountingYear).HasColumnName("Accounting_Year");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.IsDefault).HasColumnName("Is_Default");

                entity.Property(e => e.RoleId).HasColumnName("Role_Id");

                entity.Property(e => e.UserId).HasColumnName("User_Id");

                entity.Property(e => e.UserRoleMapId).HasColumnName("User_Role_Map_Id");
            });

            modelBuilder.Entity<Vehicle>(entity =>
            {
                entity.ToTable("vehicle");

                entity.Property(e => e.VehicleId).HasColumnName("Vehicle_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DriverId).HasColumnName("Driver_Id");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.PurposeOfVisit).HasColumnName("Purpose_Of_Visit");

                entity.Property(e => e.Remarks).HasMaxLength(500);

                entity.Property(e => e.ServiceDate)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Service_Date");

                entity.Property(e => e.SupplierAddress)
                    .HasMaxLength(300)
                    .HasColumnName("Supplier_Address");

                entity.Property(e => e.SupplierId).HasColumnName("Supplier_Id");

                entity.Property(e => e.SupplierMobileNo)
                    .HasMaxLength(20)
                    .HasColumnName("Supplier_Mobile_No");

                entity.Property(e => e.VehicleCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Vehicle_Code");

                entity.Property(e => e.VehicleFcDate)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Vehicle_Fc_Date");

                entity.Property(e => e.VehicleModel)
                    .IsRequired()
                    .HasMaxLength(10)
                    .HasColumnName("Vehicle_Model");

                entity.Property(e => e.VehicleName)
                    .HasMaxLength(100)
                    .HasColumnName("Vehicle_Name");

                entity.Property(e => e.VehicleNo)
                    .IsRequired()
                    .HasMaxLength(25)
                    .HasColumnName("Vehicle_No");

                entity.Property(e => e.VehicleToken)
                    .HasColumnType("longtext")
                    .HasColumnName("Vehicle_Token");

                entity.Property(e => e.VehicleType).HasColumnName("Vehicle_Type");
            });

            modelBuilder.Entity<VehicleDocumentDetail>(entity =>
            {
                entity.ToTable("vehicle_document_details");

                entity.HasIndex(e => e.VehicleId, "fk_Vehicle_Vehicle_Id");

                entity.Property(e => e.VehicleDocumentDetailId).HasColumnName("Vehicle_Document_Detail_Id");

                entity.Property(e => e.AttachmentName)
                    .HasMaxLength(300)
                    .HasColumnName("Attachment_Name");

                entity.Property(e => e.AttachmentUrl)
                    .HasMaxLength(300)
                    .HasColumnName("Attachment_Url");

                entity.Property(e => e.DocumentName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Document_Name");

                entity.Property(e => e.DocumentNo)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Document_No");

                entity.Property(e => e.Remarks).HasMaxLength(500);

                entity.Property(e => e.VehicleId).HasColumnName("Vehicle_Id");

                entity.HasOne(d => d.Vehicle)
                    .WithMany(p => p.VehicleDocumentDetails)
                    .HasForeignKey(d => d.VehicleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Vehicle_Vehicle_Id");
            });

            modelBuilder.Entity<VendorRegistration>(entity =>
            {
                entity.HasKey(e => e.VendorRegId)
                    .HasName("PRIMARY");

                entity.ToTable("vendor_registration");

                entity.Property(e => e.VendorRegId).HasColumnName("Vendor_Reg_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DocStatus)
                    .HasColumnName("Doc_Status")
                    .HasDefaultValueSql("'74'");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.InsuranceValidFrom)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Insurance_Valid_From");

                entity.Property(e => e.InsuranceValidTo)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Insurance_Valid_To");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.StatusRemarks)
                    .HasColumnType("longtext")
                    .HasColumnName("Status_Remarks");

                entity.Property(e => e.ValidFrom)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Valid_From");

                entity.Property(e => e.ValidTo)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Valid_To");

                entity.Property(e => e.VendorName)
                    .HasMaxLength(255)
                    .HasColumnName("Vendor_Name");

                entity.Property(e => e.VendorRegCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Vendor_Reg_Code");

                entity.Property(e => e.VendorRegDate)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Vendor_Reg_Date");
            });

            modelBuilder.Entity<Visitor>(entity =>
            {
                entity.ToTable("visitor");

                entity.Property(e => e.VisitorId).HasColumnName("Visitor_Id");

                entity.Property(e => e.AadharNo).HasColumnName("Aadhar_No");

                entity.Property(e => e.Address).HasColumnType("longtext");

                entity.Property(e => e.CityId).HasColumnName("City_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CountryId).HasColumnName("Country_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.Dob).HasColumnType("datetime(6)");

                entity.Property(e => e.DocumentName)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Name");

                entity.Property(e => e.DocumentUrl)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Url");

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("First_Name");

                entity.Property(e => e.IdCardNo)
                    .HasMaxLength(255)
                    .HasColumnName("Id_Card_No");

                entity.Property(e => e.IdCardType).HasColumnName("Id_Card_Type");

                entity.Property(e => e.LastName)
                    .HasMaxLength(255)
                    .HasColumnName("Last_Name");

                entity.Property(e => e.MailId)
                    .HasMaxLength(255)
                    .HasColumnName("Mail_Id");

                entity.Property(e => e.MobileNo)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Mobile_No");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.StateId).HasColumnName("State_Id");

                entity.Property(e => e.TitleId).HasColumnName("Title_id");

                entity.Property(e => e.VisitorCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Visitor_Code");

                entity.Property(e => e.VisitorCompany)
                    .HasMaxLength(255)
                    .HasColumnName("Visitor_Company");

                entity.Property(e => e.VisitorDocumentName)
                    .HasColumnType("longtext")
                    .HasColumnName("Visitor_Document_Name");

                entity.Property(e => e.VisitorDocumentUrl)
                    .HasColumnType("longtext")
                    .HasColumnName("Visitor_Document_Url");

                entity.Property(e => e.VisitorTypeId).HasColumnName("Visitor_Type_Id");
            });

            modelBuilder.Entity<VisitorDetail>(entity =>
            {
                entity.ToTable("visitor_detail");

                entity.HasIndex(e => e.VisitorId, "fk_Visitor_Detail_Visitor_Id");

                entity.Property(e => e.VisitorDetailId).HasColumnName("Visitor_Detail_Id");

                entity.Property(e => e.AadharNo).HasColumnName("Aadhar_No");

                entity.Property(e => e.DepartmentId).HasColumnName("Department_Id");

                entity.Property(e => e.DigitalSignName)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Digital_Sign_Name");

                entity.Property(e => e.DigitalSignUrl)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Digital_Sign_URL");

                entity.Property(e => e.Dob).HasColumnType("datetime(6)");

                entity.Property(e => e.DocumentName)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Name");

                entity.Property(e => e.DocumentUrl)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Url");

                entity.Property(e => e.ExpirryDate)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Expirry_Date");

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("First_Name");

                entity.Property(e => e.IdCardNo)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Id_Card_No");

                entity.Property(e => e.IdCardType).HasColumnName("Id_Card_Type");

                entity.Property(e => e.IsTermsAgreed).HasColumnName("Is_Terms_Agreed");

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Last_Name");

                entity.Property(e => e.MailId)
                    .HasMaxLength(255)
                    .HasColumnName("Mail_Id");

                entity.Property(e => e.MobileNo)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Mobile_No");

                entity.Property(e => e.SignedVersion).HasColumnName("Signed_Version");

                entity.Property(e => e.TagNo)
                    .HasColumnType("longtext")
                    .HasColumnName("Tag_No");

                entity.Property(e => e.TitleId).HasColumnName("Title_id");

                entity.Property(e => e.VisitorCompany)
                    .HasColumnType("longtext")
                    .HasColumnName("Visitor_Company");

                entity.Property(e => e.VisitorDetailCode)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("visitor_detail_Code");

                entity.Property(e => e.VisitorId).HasColumnName("Visitor_Id");

                entity.HasOne(d => d.Visitor)
                    .WithMany(p => p.VisitorDetails)
                    .HasForeignKey(d => d.VisitorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Visitor_Detail_Visitor_Id");
            });

            modelBuilder.Entity<VisitorDetailLog>(entity =>
            {
                entity.ToTable("visitor_detail_log");

                entity.HasIndex(e => e.VisitorLogId, "fk_Visitor_Detail_Log_Visitor_Log_Id");

                entity.Property(e => e.VisitorDetailLogId).HasColumnName("Visitor_Detail_Log_Id");

                entity.Property(e => e.DepartmentId).HasColumnName("Department_Id");

                entity.Property(e => e.Dob).HasColumnType("datetime(6)");

                entity.Property(e => e.DocumentName)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Name");

                entity.Property(e => e.DocumentUrl)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Url");

                entity.Property(e => e.ExpirryDate)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Expirry_Date");

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("First_Name");

                entity.Property(e => e.IdCardNo)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Id_Card_No");

                entity.Property(e => e.IdCardType).HasColumnName("Id_Card_Type");

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Last_Name");

                entity.Property(e => e.MailId)
                    .HasMaxLength(255)
                    .HasColumnName("Mail_Id");

                entity.Property(e => e.MobileNo)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Mobile_No");

                entity.Property(e => e.TagNo)
                    .HasColumnType("longtext")
                    .HasColumnName("Tag_No");

                entity.Property(e => e.TitleId).HasColumnName("Title_id");

                entity.Property(e => e.VisitorDetailCode)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("Visitor_Detail_Code");

                entity.Property(e => e.VisitorDetailId).HasColumnName("Visitor_Detail_Id");

                entity.Property(e => e.VisitorId).HasColumnName("Visitor_Id");

                entity.Property(e => e.VisitorLogId).HasColumnName("Visitor_Log_Id");

                entity.HasOne(d => d.VisitorLog)
                    .WithMany(p => p.VisitorDetailLogs)
                    .HasForeignKey(d => d.VisitorLogId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Visitor_Detail_Log_Visitor_Log_Id");
            });

            modelBuilder.Entity<VisitorDocDetail>(entity =>
            {
                entity.HasKey(e => e.VisitorDocId)
                    .HasName("PRIMARY");

                entity.ToTable("visitor_doc_detail");

                entity.HasIndex(e => e.VisitorId, "fk_Visitor_Doc_Detail_Visitor_Id");

                entity.Property(e => e.VisitorDocId).HasColumnName("Visitor_Doc_Id");

                entity.Property(e => e.IdCardNo)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Id_Card_No");

                entity.Property(e => e.IdCardType)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Id_Card_Type");

                entity.Property(e => e.IdCardUrl)
                    .HasMaxLength(100)
                    .HasColumnName("Id_Card_Url");

                entity.Property(e => e.VisitorId).HasColumnName("Visitor_Id");

                entity.HasOne(d => d.Visitor)
                    .WithMany(p => p.VisitorDocDetails)
                    .HasForeignKey(d => d.VisitorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Visitor_Doc_Detail_Visitor_Id");
            });

            modelBuilder.Entity<VisitorEntry>(entity =>
            {
                entity.ToTable("visitor_entry");

                entity.Property(e => e.VisitorEntryId).HasColumnName("Visitor_Entry_Id");

                entity.Property(e => e.AadharNo).HasColumnName("Aadhar_No");

                entity.Property(e => e.AccessType).HasColumnName("Access_Type");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.ContainerNumber)
                    .HasMaxLength(100)
                    .HasColumnName("Container_Number");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DcNumber)
                    .HasMaxLength(100)
                    .HasColumnName("Dc_Number");

                entity.Property(e => e.DriverId)
                    .HasMaxLength(300)
                    .HasColumnName("Driver_Id");

                entity.Property(e => e.DriverName)
                    .HasMaxLength(300)
                    .HasColumnName("Driver_Name");

                entity.Property(e => e.EndingKm)
                    .HasColumnType("decimal(18,2)")
                    .HasColumnName("Ending_Km");

                entity.Property(e => e.EntryTime)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Entry_Time");

                entity.Property(e => e.EntryType).HasColumnName("Entry_Type");

                entity.Property(e => e.ExitTime)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Exit_Time");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.IdProofNo)
                    .HasMaxLength(255)
                    .HasColumnName("Id_Proof_No");

                entity.Property(e => e.IdProofType).HasColumnName("Id_Proof_Type");

                entity.Property(e => e.InvoiceNumber)
                    .HasMaxLength(100)
                    .HasColumnName("Invoice_Number");

                entity.Property(e => e.IsAndroidVisitor)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_android_visitor");

                entity.Property(e => e.IsAppointmentBooking).HasColumnName("Is_Appointment_Booking");

                entity.Property(e => e.IsEinvBillNo).HasColumnName("Is_Einv_Bill_No");

                entity.Property(e => e.IsEwayBillNo).HasColumnName("Is_Eway_Bill_No");

                entity.Property(e => e.IsExistingDriver).HasColumnName("Is_Existing_Driver");

                entity.Property(e => e.IsExistingVehicle).HasColumnName("Is_Existing_Vehicle");

                entity.Property(e => e.IsExtended).HasColumnName("Is_Extended");

                entity.Property(e => e.IsInternalAppointment).HasColumnName("Is_Internal_Appointment");

                entity.Property(e => e.IsMeetingClose)
                    .HasColumnType("bit(1)")
                    .HasColumnName("is_meeting_close");

                entity.Property(e => e.IsPreBooking).HasColumnName("Is_Pre_Booking");

                entity.Property(e => e.MobileNo)
                    .HasMaxLength(50)
                    .HasColumnName("Mobile_No");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.NumberOfPassengers)
                    .HasMaxLength(100)
                    .HasColumnName("Number_Of_Passengers");

                entity.Property(e => e.PartyName).HasColumnName("Party_Name");

                entity.Property(e => e.PartyType).HasColumnName("Party_Type");

                entity.Property(e => e.PersonName)
                    .HasMaxLength(255)
                    .HasColumnName("Person_Name");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.PoNumber)
                    .HasMaxLength(100)
                    .HasColumnName("Po_Number");

                entity.Property(e => e.PreviousValidFrom)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("previous_Valid_From");

                entity.Property(e => e.PreviousValidTo)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("previous_Valid_To");

                entity.Property(e => e.PurposeOfVisit).HasColumnName("Purpose_Of_Visit");

                entity.Property(e => e.RefNo)
                    .HasMaxLength(50)
                    .HasColumnName("Ref_No");

                entity.Property(e => e.RescheduledDateTime).HasColumnName("rescheduled_date_time");

                entity.Property(e => e.RouteId).HasColumnName("Route_Id");

                entity.Property(e => e.StartingKm)
                    .HasColumnType("decimal(18,2)")
                    .HasColumnName("Starting_Km");

                entity.Property(e => e.TagNo)
                    .HasColumnType("longtext")
                    .HasColumnName("Tag_No");

                entity.Property(e => e.ValidFrom)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Valid_From");

                entity.Property(e => e.ValidTo)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Valid_To");

                entity.Property(e => e.VehicleDocumentName)
                    .HasColumnType("longtext")
                    .HasColumnName("Vehicle_Document_Name");

                entity.Property(e => e.VehicleDocumentUrl)
                    .HasColumnType("longtext")
                    .HasColumnName("Vehicle_Document_Url");

                entity.Property(e => e.VehicleModel)
                    .HasMaxLength(300)
                    .HasColumnName("Vehicle_Model");

                entity.Property(e => e.VehicleName)
                    .HasMaxLength(300)
                    .HasColumnName("Vehicle_Name");

                entity.Property(e => e.VehicleNo)
                    .HasMaxLength(100)
                    .HasColumnName("Vehicle_No");

                entity.Property(e => e.VehicleTypeId).HasColumnName("Vehicle_Type_Id");

                entity.Property(e => e.VisitEndTime)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Visit_End_Time");

                entity.Property(e => e.VisitedEmployeeId).HasColumnName("Visited_Employee_Id");

                entity.Property(e => e.VisitorEntryCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Visitor_Entry_Code");

                entity.Property(e => e.VisitorEntryDate)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Visitor_Entry_Date");

                entity.Property(e => e.VisitorId).HasColumnName("Visitor_Id");

                entity.Property(e => e.VisitorImageName)
                    .HasColumnType("longtext")
                    .HasColumnName("Visitor_Image_Name");

                entity.Property(e => e.VisitorImageUrl)
                    .HasColumnType("longtext")
                    .HasColumnName("Visitor_Image_Url");

                entity.Property(e => e.VisitorRemarks)
                    .HasColumnType("longtext")
                    .HasColumnName("Visitor_Remarks");

                entity.Property(e => e.VisitorTypeId).HasColumnName("Visitor_Type_Id");
            });

            modelBuilder.Entity<VisitorEntryAtvDetail>(entity =>
            {
                entity.ToTable("visitor_entry_atv_detail");

                entity.HasIndex(e => e.VisitorEntryId, "fk_Visitor_Entry_Atv_Detail_Visitor_Entry_Id");

                entity.Property(e => e.VisitorEntryAtvDetailId).HasColumnName("Visitor_Entry_Atv_Detail_Id");

                entity.Property(e => e.AreaToVisit).HasColumnName("Area_To_Visit");

                entity.Property(e => e.VisitorEntryId).HasColumnName("Visitor_Entry_Id");

                entity.HasOne(d => d.VisitorEntry)
                    .WithMany(p => p.VisitorEntryAtvDetails)
                    .HasForeignKey(d => d.VisitorEntryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Visitor_Entry_Atv_Detail_Visitor_Entry_Id");
            });

            modelBuilder.Entity<VisitorEntryBelongingDetail>(entity =>
            {
                entity.ToTable("visitor_entry_belonging_detail");

                entity.HasIndex(e => e.VisitorEntryId, "fk_Visitor_Entry_Belonging_Detail_Visitor_Entry_Id");

                entity.Property(e => e.VisitorEntryBelongingDetailId).HasColumnName("Visitor_Entry_Belonging_Detail_Id");

                entity.Property(e => e.DeviceName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Device_Name");

                entity.Property(e => e.DeviceNo)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Device_No");

                entity.Property(e => e.VisitorEntryId).HasColumnName("Visitor_Entry_Id");

                entity.HasOne(d => d.VisitorEntry)
                    .WithMany(p => p.VisitorEntryBelongingDetails)
                    .HasForeignKey(d => d.VisitorEntryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Visitor_Entry_Belonging_Detail_Visitor_Entry_Id");
            });

            modelBuilder.Entity<VisitorEntryDetail>(entity =>
            {
                entity.ToTable("visitor_entry_detail");

                entity.HasIndex(e => e.VisitorEntryId, "fk_Visitor_Entry_Detail_Visitor_Entry_Id");

                entity.Property(e => e.VisitorEntryDetailId).HasColumnName("Visitor_Entry_Detail_Id");

                entity.Property(e => e.AadharNo).HasColumnName("Aadhar_No");

                entity.Property(e => e.DepartmentId).HasColumnName("Department_Id");

                entity.Property(e => e.DigitalSignName)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Digital_Sign_Name");

                entity.Property(e => e.DigitalSignUrl)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Digital_Sign_URL");

                entity.Property(e => e.Dob).HasColumnType("datetime(6)");

                entity.Property(e => e.DocumentName)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Name");

                entity.Property(e => e.DocumentUrl)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Url");

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("First_Name");

                entity.Property(e => e.IdCardNo)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Id_Card_No");

                entity.Property(e => e.IdCardType).HasColumnName("Id_Card_Type");

                entity.Property(e => e.IsEditedImage).HasColumnName("Is_Edited_Image");

                entity.Property(e => e.IsTermsAgreed).HasColumnName("Is_Terms_Agreed");

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Last_Name");

                entity.Property(e => e.MailId)
                    .HasColumnType("longtext")
                    .HasColumnName("Mail_Id");

                entity.Property(e => e.MobileNo)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Mobile_No");

                entity.Property(e => e.SignedVersion).HasColumnName("Signed_Version");

                entity.Property(e => e.TagNo)
                    .HasColumnType("longtext")
                    .HasColumnName("Tag_No");

                entity.Property(e => e.TitleId).HasColumnName("Title_id");

                entity.Property(e => e.ValidFrom)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Valid_From");

                entity.Property(e => e.ValidTo)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Valid_To");

                entity.Property(e => e.VisitorCompany)
                    .HasColumnType("longtext")
                    .HasColumnName("Visitor_Company");

                entity.Property(e => e.VisitorEntryDetailCode)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("Visitor_Entry_Detail_Code");

                entity.Property(e => e.VisitorEntryId).HasColumnName("Visitor_Entry_Id");

                entity.Property(e => e.VisitorId).HasColumnName("Visitor_Id");

                entity.HasOne(d => d.VisitorEntry)
                    .WithMany(p => p.VisitorEntryDetails)
                    .HasForeignKey(d => d.VisitorEntryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Visitor_Entry_Detail_Visitor_Entry_Id");
            });

            modelBuilder.Entity<VisitorEntryLog>(entity =>
            {
                entity.ToTable("visitor_entry_log");

                entity.Property(e => e.VisitorEntryLogId).HasColumnName("Visitor_Entry_Log_Id");

                entity.Property(e => e.CheckedIn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Checked_In");

                entity.Property(e => e.CheckedOut)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Checked_Out");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.VisitorEntryCode)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Visitor_Entry_Code");

                entity.Property(e => e.VisitorEntryDetailId).HasColumnName("Visitor_Entry_Detail_Id");
            });

            modelBuilder.Entity<VisitorEntryMaterialDetail>(entity =>
            {
                entity.ToTable("visitor_entry_material_detail");

                entity.HasIndex(e => e.VisitorEntryId, "fk_Visitor_Entry_Material_Detail_Visitor_Entry_Id");

                entity.Property(e => e.VisitorEntryMaterialDetailId).HasColumnName("Visitor_Entry_Material_Detail_Id");

                entity.Property(e => e.MaterialId).HasColumnName("Material_Id");

                entity.Property(e => e.Qty)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.VisitorEntryId).HasColumnName("Visitor_Entry_Id");

                entity.HasOne(d => d.VisitorEntry)
                    .WithMany(p => p.VisitorEntryMaterialDetails)
                    .HasForeignKey(d => d.VisitorEntryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Visitor_Entry_Material_Detail_Visitor_Entry_Id");
            });

            modelBuilder.Entity<VisitorEntryRefDetail>(entity =>
            {
                entity.ToTable("visitor_entry_ref_detail");

                entity.HasIndex(e => e.VisitorEntryId, "fk_Visitor_Entry_Ref_Detail_Visitor_Entry_Id");

                entity.Property(e => e.VisitorEntryRefDetailId).HasColumnName("Visitor_Entry_Ref_Detail_Id");

                entity.Property(e => e.RefTypeId).HasColumnName("Ref_Type_Id");

                entity.Property(e => e.RefValue)
                    .HasMaxLength(50)
                    .HasColumnName("Ref_Value");

                entity.Property(e => e.VisitorEntryId).HasColumnName("Visitor_Entry_Id");

                entity.HasOne(d => d.VisitorEntry)
                    .WithMany(p => p.VisitorEntryRefDetails)
                    .HasForeignKey(d => d.VisitorEntryId)
                    .HasConstraintName("fk_Visitor_Entry_Ref_Detail_Visitor_Entry_Id");
            });

            modelBuilder.Entity<VisitorLog>(entity =>
            {
                entity.ToTable("visitor_log");

                entity.Property(e => e.VisitorLogId).HasColumnName("Visitor_Log_Id");

                entity.Property(e => e.Address).HasColumnType("longtext");

                entity.Property(e => e.CityId).HasColumnName("City_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CountryId).HasColumnName("Country_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.Dob).HasColumnType("datetime(6)");

                entity.Property(e => e.DocumentName)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Name");

                entity.Property(e => e.DocumentUrl)
                    .IsRequired()
                    .HasColumnType("longtext")
                    .HasColumnName("Document_Url");

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("First_Name");

                entity.Property(e => e.IdCardNo)
                    .HasMaxLength(255)
                    .HasColumnName("Id_Card_No");

                entity.Property(e => e.IdCardType).HasColumnName("Id_Card_Type");

                entity.Property(e => e.IsLatest).HasColumnName("Is_Latest");

                entity.Property(e => e.LastName)
                    .HasMaxLength(255)
                    .HasColumnName("Last_Name");

                entity.Property(e => e.MailId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Mail_Id");

                entity.Property(e => e.MobileNo)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Mobile_No");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.StateId).HasColumnName("State_Id");

                entity.Property(e => e.TitleId).HasColumnName("Title_id");

                entity.Property(e => e.VisitorCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Visitor_Code");

                entity.Property(e => e.VisitorCompany)
                    .HasMaxLength(255)
                    .HasColumnName("Visitor_Company");

                entity.Property(e => e.VisitorDocumentName)
                    .HasColumnType("longtext")
                    .HasColumnName("Visitor_Document_Name");

                entity.Property(e => e.VisitorDocumentUrl)
                    .HasColumnType("longtext")
                    .HasColumnName("Visitor_Document_Url");

                entity.Property(e => e.VisitorId).HasColumnName("Visitor_Id");

                entity.Property(e => e.VisitorTypeId).HasColumnName("Visitor_Type_Id");
            });

            modelBuilder.Entity<VrCompanyDoc>(entity =>
            {
                entity.ToTable("vr_company_docs");

                entity.HasIndex(e => e.VendorRegId, "fk_VR_Company_Docs_Vendor_Reg_Id");

                entity.Property(e => e.VrCompanyDocId).HasColumnName("VR_Company_Doc_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.DocumentName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Document_Name");

                entity.Property(e => e.DocumentNo)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Document_No");

                entity.Property(e => e.DocumentType).HasColumnName("Document_Type");

                entity.Property(e => e.DocumentUrl)
                    .HasMaxLength(300)
                    .HasColumnName("Document_Url");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.Remarks).HasMaxLength(100);

                entity.Property(e => e.Status).HasDefaultValueSql("'74'");

                entity.Property(e => e.VendorRegId).HasColumnName("Vendor_Reg_Id");

                entity.HasOne(d => d.VendorReg)
                    .WithMany(p => p.VrCompanyDocs)
                    .HasForeignKey(d => d.VendorRegId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_VR_Company_Docs_Vendor_Reg_Id");
            });

            modelBuilder.Entity<VrWorkerDetail>(entity =>
            {
                entity.ToTable("vr_worker_detail");

                entity.HasIndex(e => e.VendorRegId, "fk_VR_Worker_Detail_Vendor_Reg_Id");

                entity.Property(e => e.VrWorkerDetailId).HasColumnName("VR_Worker_Detail_Id");

                entity.Property(e => e.IsIncharge).HasColumnName("Is_Incharge");

                entity.Property(e => e.MailId)
                    .HasMaxLength(255)
                    .HasColumnName("Mail_Id");

                entity.Property(e => e.MobileNo)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Mobile_No");

                entity.Property(e => e.ValidFrom)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Valid_From");

                entity.Property(e => e.ValidTo)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Valid_To");

                entity.Property(e => e.VendorRegId).HasColumnName("Vendor_Reg_Id");

                entity.Property(e => e.WorkerName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Worker_Name");

                entity.HasOne(d => d.VendorReg)
                    .WithMany(p => p.VrWorkerDetails)
                    .HasForeignKey(d => d.VendorRegId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_VR_Worker_Detail_Vendor_Reg_Id");
            });

            modelBuilder.Entity<VrWorkerDoc>(entity =>
            {
                entity.ToTable("vr_worker_docs");

                entity.HasIndex(e => e.VrWorkerDetailId, "fk_VR_Worker_Docs_VR_Worker_Detail_Id");

                entity.Property(e => e.VrWorkerDocId).HasColumnName("VR_Worker_Doc_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.DocumentName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Document_Name");

                entity.Property(e => e.DocumentNo)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Document_No");

                entity.Property(e => e.DocumentType).HasColumnName("Document_Type");

                entity.Property(e => e.DocumentUrl)
                    .HasMaxLength(300)
                    .HasColumnName("Document_Url");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.Remarks).HasMaxLength(100);

                entity.Property(e => e.Status).HasDefaultValueSql("'74'");

                entity.Property(e => e.VrWorkerDetailId).HasColumnName("VR_Worker_Detail_Id");

                entity.HasOne(d => d.VrWorkerDetail)
                    .WithMany(p => p.VrWorkerDocs)
                    .HasForeignKey(d => d.VrWorkerDetailId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_VR_Worker_Docs_VR_Worker_Detail_Id");
            });

            modelBuilder.Entity<WhatsAppLog>(entity =>
            {
                entity.ToTable("whats_app_log");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.FromContact).HasMaxLength(12);

                entity.Property(e => e.MessageTime).HasColumnType("datetime(6)");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.RefCode).HasMaxLength(50);

                entity.Property(e => e.TemplateId).HasColumnType("longtext");

                entity.Property(e => e.ToContact).HasMaxLength(12);

                entity.Property(e => e.WhatsAppLogData).HasColumnType("longtext");
            });

            modelBuilder.Entity<WorkPermit>(entity =>
            {
                entity.ToTable("work_permit");

                entity.Property(e => e.WorkPermitId).HasColumnName("Work_Permit_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.ContractName)
                    .HasMaxLength(255)
                    .HasColumnName("Contract_Name");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DeptId).HasColumnName("Dept_Id");

                entity.Property(e => e.DocStatus)
                    .HasColumnName("Doc_Status")
                    .HasDefaultValueSql("'74'");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.PoNo)
                    .HasMaxLength(50)
                    .HasColumnName("Po_No");

                entity.Property(e => e.StatusRemarks)
                    .HasColumnType("longtext")
                    .HasColumnName("Status_Remarks");

                entity.Property(e => e.ValidFrom)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Valid_From");

                entity.Property(e => e.ValidTo)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Valid_To");

                entity.Property(e => e.VendorRegId).HasColumnName("Vendor_Reg_Id");

                entity.Property(e => e.WorkOrganizer).HasColumnName("Work_Organizer");

                entity.Property(e => e.WorkPermitCode)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("Work_Permit_Code");

                entity.Property(e => e.WorkPermitDate)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Work_Permit_Date");
            });

            modelBuilder.Entity<WpApprovalDetail>(entity =>
            {
                entity.ToTable("wp_approval_detail");

                entity.HasIndex(e => e.WorkPermitId, "fk_Wp_Approval_Detail_Wp_Approval_Detail_Id");

                entity.Property(e => e.WpApprovalDetailId).HasColumnName("Wp_Approval_Detail_Id");

                entity.Property(e => e.CreatedBy).HasColumnName("Created_By");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Created_On");

                entity.Property(e => e.DeptId).HasColumnName("Dept_Id");

                entity.Property(e => e.DigitalSign)
                    .HasMaxLength(500)
                    .HasColumnName("Digital_Sign");

                entity.Property(e => e.DigitalSignUrl)
                    .HasMaxLength(500)
                    .HasColumnName("Digital_Sign_Url");

                entity.Property(e => e.LevelId).HasColumnName("Level_Id");

                entity.Property(e => e.ModifiedBy).HasColumnName("Modified_By");

                entity.Property(e => e.ModifiedOn)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Modified_On");

                entity.Property(e => e.PrimaryUserId).HasColumnName("Primary_User_Id");

                entity.Property(e => e.Remarks1).HasMaxLength(500);

                entity.Property(e => e.Remarks2).HasMaxLength(500);

                entity.Property(e => e.SecondaryUserId).HasColumnName("Secondary_User_Id");

                entity.Property(e => e.WorkPermitId).HasColumnName("Work_Permit_Id");

                entity.HasOne(d => d.WorkPermit)
                    .WithMany(p => p.WpApprovalDetails)
                    .HasForeignKey(d => d.WorkPermitId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Wp_Approval_Detail_Wp_Approval_Detail_Id");
            });

            modelBuilder.Entity<WpCategoryDetail>(entity =>
            {
                entity.ToTable("wp_category_detail");

                entity.HasIndex(e => e.WorkPermitId, "fk_Wp_Category_Detail_Work_Permit_Id");

                entity.Property(e => e.WpCategoryDetailId).HasColumnName("WP_Category_Detail_Id");

                entity.Property(e => e.CategoryId).HasColumnName("Category_Id");

                entity.Property(e => e.CategoryName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Category_Name");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.RemarkStatus).HasColumnName("Remark_Status");

                entity.Property(e => e.WorkPermitId).HasColumnName("Work_Permit_Id");

                entity.HasOne(d => d.WorkPermit)
                    .WithMany(p => p.WpCategoryDetails)
                    .HasForeignKey(d => d.WorkPermitId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Wp_Category_Detail_Work_Permit_Id");
            });

            modelBuilder.Entity<WpCompanyDoc>(entity =>
            {
                entity.ToTable("wp_company_docs");

                entity.HasIndex(e => e.WorkPermitId, "fk_WP_Company_Docs_Work_Permit_Id");

                entity.Property(e => e.WpCompanyDocId).HasColumnName("WP_Company_Doc_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.DocumentName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Document_Name");

                entity.Property(e => e.DocumentNo)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Document_No");

                entity.Property(e => e.DocumentType).HasColumnName("Document_Type");

                entity.Property(e => e.DocumentUrl)
                    .HasMaxLength(300)
                    .HasColumnName("Document_Url");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.Remarks).HasMaxLength(100);

                entity.Property(e => e.Status).HasDefaultValueSql("'74'");

                entity.Property(e => e.WorkPermitId).HasColumnName("Work_Permit_Id");

                entity.HasOne(d => d.WorkPermit)
                    .WithMany(p => p.WpCompanyDocs)
                    .HasForeignKey(d => d.WorkPermitId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_WP_Company_Docs_Work_Permit_Id");
            });

            modelBuilder.Entity<WpCpMapDetail>(entity =>
            {
                entity.ToTable("wp_cp_map_detail");

                entity.HasIndex(e => e.WorkPermitId, "fk_WP_Cp_Map_Detail_Work_Permit_Id");

                entity.Property(e => e.WpCpMapDetailId).HasColumnName("Wp_Cp_Map_Detail_Id");

                entity.Property(e => e.CategoryId).HasColumnName("Category_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.CpDes)
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnName("Cp_Des");

                entity.Property(e => e.CpMapId).HasColumnName("Cp_Map_Id");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.WorkPermitId).HasColumnName("Work_Permit_Id");

                entity.HasOne(d => d.WorkPermit)
                    .WithMany(p => p.WpCpMapDetails)
                    .HasForeignKey(d => d.WorkPermitId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_WP_Cp_Map_Detail_Work_Permit_Id");
            });

            modelBuilder.Entity<WpWorkerDetail>(entity =>
            {
                entity.ToTable("wp_worker_detail");

                entity.HasIndex(e => e.WorkPermitId, "fk_WP_Worker_Detail_Work_Permit_Id");

                entity.Property(e => e.WpWorkerDetailId).HasColumnName("WP_Worker_Detail_Id");

                entity.Property(e => e.IsEditedImage)
                    .HasColumnName("Is_Edited_Image")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.IsIncharge).HasColumnName("Is_Incharge");

                entity.Property(e => e.IsWorking)
                    .HasColumnName("Is_Working")
                    .HasDefaultValueSql("'0'");

                entity.Property(e => e.MailId)
                    .HasMaxLength(255)
                    .HasColumnName("Mail_Id");

                entity.Property(e => e.MobileNo)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Mobile_No");

                entity.Property(e => e.ProfileImgName)
                    .HasMaxLength(255)
                    .HasColumnName("Profile_Img_Name");

                entity.Property(e => e.ProfileImgUrl)
                    .HasMaxLength(255)
                    .HasColumnName("Profile_Img_Url");

                entity.Property(e => e.ValidFrom)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Valid_From");

                entity.Property(e => e.ValidTo)
                    .HasColumnType("datetime(6)")
                    .HasColumnName("Valid_To");

                entity.Property(e => e.WorkPermitId).HasColumnName("Work_Permit_Id");

                entity.Property(e => e.WorkerName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .HasColumnName("Worker_Name");

                entity.HasOne(d => d.WorkPermit)
                    .WithMany(p => p.WpWorkerDetails)
                    .HasForeignKey(d => d.WorkPermitId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_WP_Worker_Detail_Work_Permit_Id");
            });

            modelBuilder.Entity<WpWorkerDoc>(entity =>
            {
                entity.ToTable("wp_worker_docs");

                entity.HasIndex(e => e.WpWorkerDetailId, "fk_WP_Worker_Docs_WP_Worker_Detail_Id");

                entity.Property(e => e.WpWorkerDocId).HasColumnName("WP_Worker_Doc_Id");

                entity.Property(e => e.CompanyId).HasColumnName("Company_Id");

                entity.Property(e => e.DocumentName)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Document_Name");

                entity.Property(e => e.DocumentNo)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("Document_No");

                entity.Property(e => e.DocumentType).HasColumnName("Document_Type");

                entity.Property(e => e.DocumentUrl)
                    .HasMaxLength(300)
                    .HasColumnName("Document_Url");

                entity.Property(e => e.GateId).HasColumnName("Gate_Id");

                entity.Property(e => e.PlantId).HasColumnName("Plant_Id");

                entity.Property(e => e.Remarks).HasMaxLength(100);

                entity.Property(e => e.Status).HasDefaultValueSql("'74'");

                entity.Property(e => e.WpWorkerDetailId).HasColumnName("WP_Worker_Detail_Id");

                entity.HasOne(d => d.WpWorkerDetail)
                    .WithMany(p => p.WpWorkerDocs)
                    .HasForeignKey(d => d.WpWorkerDetailId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_WP_Worker_Docs_WP_Worker_Detail_Id");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
