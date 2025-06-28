using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Services.ApprovalWorkflow;
using VisitorManagementMySQL.Services.Common;
using VisitorManagementMySQL.Services.MailService;
using VisitorManagementMySQL.Services.Master.FileUploadService;
using VisitorManagementMySQL.Services.WhatsAppService;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.VisitorManagement.VisitorEntryService
{
    public class VisitorEntryService : IVisitorEntryService
    {
        private readonly IMailService mailService;
        private readonly MailSettings _mailSettings;
        private readonly IWhatsAppService whatsAppService;
        private readonly DbContextHelper dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IDapperContext dapperContext;
        private readonly FileUploadService uploadService;
        private readonly IApprovalWorkFlow approvalservice;
        private readonly ICommonService commonService;

        private VisitorEntryDTO dto;

        public VisitorEntryService(
            DbContextHelper _dbContext,
            IHttpContextAccessor _httpContextAccessor,
            IDapperContext _dapperContext,
            FileUploadService _uploadService,
            IApprovalWorkFlow _approvalservice,
            IMailService mailService,
            IOptions<MailSettings> mailSettings,
            IWhatsAppService whatsAppService,
            ICommonService _commonService
        )
        {
            dbContext = _dbContext;
            httpContextAccessor = _httpContextAccessor;
            dapperContext = _dapperContext;
            uploadService = _uploadService;
            approvalservice = _approvalservice;
            this.mailService = mailService;
            this.whatsAppService = whatsAppService;
            commonService = _commonService;
            dto = new VisitorEntryDTO();
            dto.tranStatus = new ErrorContext();
            dto.tranStatus.result = false;
            dto.tranStatus.lstErrorItem = new List<ErrorItem>();
            _mailSettings = mailSettings.Value;
        }

        public async Task<VisitorEntryDTO> CreateInitialize(JObject obj)
        {
            try
            {
                long VisitorEntryId = obj["VisitorEntryId"].ToObject<long>();
                long VisitorTypeId = obj["VisitorTypeId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();

                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorEntry/";
                string SchemeVehicle =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorEntryVehicle/";
                string SchemeDetail =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorDetail/";
                string type = "CreateInitialize";
                // var VisEntry = dbContext.VisitorEntries.Where(x => x.VisitorEntryCode == "VIE00441").SingleOrDefault();

                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId,
                            PlantId,
                            VisitorId = (object)null,
                            type,
                            text = (object)null,
                            Scheme,
                            SchemeVehicle,
                            SchemeDetail,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );

                    dto.VisitorTypeList = (await spcall.ReadAsync<Metadatum>()).ToList(); //Visitor type list
                    dto.IsPreBookingList = (await spcall.ReadAsync<Metadatum>()).ToList(); //yes or no
                    dto.ProofList = (await spcall.ReadAsync<Metadatum>()).ToList(); //id proofs
                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList(); //active/inactive
                    dto.TitleList = (await spcall.ReadAsync<Metadatum>()).ToList(); //titlelist
                    dto.ChallanTypeList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.VehicleTypeList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.RefList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.DriverList = (await spcall.ReadAsync<dynamic>()).ToList(); //driverlist
                    dto.EmployeeList = (await spcall.ReadAsync<dynamic>()).ToList(); //employee
                    dto.DepartmentList = (await spcall.ReadAsync<Department>()).ToList(); //department
                    dto.VisitorNameList = (await spcall.ReadAsync<dynamic>()).ToList(); //VisittorNameLis
                    dto.UpdatedVisitorNameList = (await spcall.ReadAsync<dynamic>()).ToList(); //VisittorNameLis
                    dto.PartyTypeList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.AreaList = (await spcall.ReadAsync<Area>()).ToList();
                    dto.RouteList = (await spcall.ReadAsync<Route>()).ToList();
                    dto.VehicleList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.MaterialList = (await spcall.ReadAsync<Material>()).ToList();
                    dto.PurposeList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.PlantList = (await spcall.ReadAsync<Plant>()).ToList();
                    dto.WorkPermitList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.TermsConditions = (await spcall.ReadAsync<Instruction>()).SingleOrDefault();

                    if (VisitorEntryId > 0)
                    {
                        dto.VisitorEntryHeader = (
                            await spcall.ReadAsync<dynamic>()
                        ).SingleOrDefault();
                        dto.VisitorEntryDetail = (
                            await spcall.ReadAsync<VisitorEntryDetail>()
                        ).ToList();
                        dto.VisitorEntryBelongingDetail = (
                            await spcall.ReadAsync<VisitorEntryBelongingDetail>()
                        ).ToList();
                        dto.VisitorEntryMaterialDetail = (
                            await spcall.ReadAsync<VisitorEntryMaterialDetail>()
                        ).ToList();
                        dto.VisitorEntryAtvDetail = (
                            await spcall.ReadAsync<VisitorEntryAtvDetail>()
                        ).ToList();
                    }
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> OnChangePartyType(JObject obj)
        {
            try
            {
                int PartyType = obj["PartyType"].ToObject<int>();
                string type = "OnChangePartyType";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId = (object)null,
                            VisitorId = (object)null,
                            type,
                            text = (object)null,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType = (object)null,
                            PartyType,
                            Visitor_Type_Id = (object)null,
                            CompanyId = (object)null,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId = (object)null,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.PartyNameList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> OnChangeVisitorType(JObject obj)
        {
            try
            {
                long VisitorTypeId = obj["VisitorTypeId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/Visitor/";
                string type = "OnChangeVisitorType";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId,
                            PlantId,
                            VisitorId = (object)null,
                            type,
                            text = (object)null,
                            Scheme,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.VisitorNameList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.VehicleList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.WorkPermitList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> OnChangeWorkPermit(JObject obj)
        {
            try
            {
                long WorkPermitId = obj["WorkPermitId"].ToObject<long>();
                string WorkPermitCode = obj["WorkPermitCode"].ToObject<string>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/Visitor/";
                string type = "OnChangeWorkPermit";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId,
                            VisitorId = (object)null,
                            type,
                            text = (object)null,
                            Scheme,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId = (object)null,
                            WorkPermitId,
                            WorkPermitCode,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.WorkPermitHeader = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.WorkPermitWorkerDetails = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.WorkPermitEntryDetails = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> OnChangeVisitor(JObject obj)
        {
            try
            {
                long VisitorTypeId = obj["VisitorTypeId"].ToObject<long>();
                long VisitorId = obj["VisitorId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorDetail/";
                string SchemeDetail =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/Visitor/";
                string type = "OnChangeVisitor";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId,
                            PlantId,
                            VisitorId,
                            type,
                            text = (object)null,
                            Scheme,
                            SchemeVehicle = (object)null,
                            SchemeDetail,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.VisitorWorkerList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> OnChangeVisHost(JObject obj)
        {
            try
            {
                long VisitorTypeId = obj["VisitorTypeId"].ToObject<long>();
                long VisitorId = obj["VisitorId"].ToObject<long>();
                long UserId = obj["UserId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/Visitor/";
                string type = "OnChangeVisHost";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId,
                            PlantId,
                            VisitorId,
                            type,
                            text = (object)null,
                            Scheme,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId,
                            DetailId = (object)null,
                            RoleId,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.LastVisitorEntryList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.LastVisitorEntryBelongList = (
                        await spcall.ReadAsync<VisitorEntryBelongingDetail>()
                    ).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> FilterPreBookinNo(JObject obj)
        {
            try
            {
                string text = obj["text"].ToObject<string>();
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorEntry/";
                string type = "FilterPreBookinNo";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId = (object)null,
                            VisitorId = (object)null,
                            type,
                            text,
                            Scheme,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId = (object)null,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId = (object)null,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.PreBookingList = (await spcall.ReadAsync<VisitorEntry>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> Create(
            object obj,
            IFormFile webfile,
            IFormFile webfile1,
            List<IFormFile> webfiles
        )
        {
            using (var ftransaction = dbContext.Database.BeginTransaction())
            {
                try
                {
                    Newtonsoft.Json.Linq.JObject _EmployeeJSON = (Newtonsoft.Json.Linq.JObject)obj;
                    Newtonsoft.Json.JsonSerializer serializer =
                        new Newtonsoft.Json.JsonSerializer();
                    VisitorEntry VisitorEntry = (VisitorEntry)
                        serializer.Deserialize(
                            new JTokenReader(_EmployeeJSON["VisitorEntry"]),
                            typeof(VisitorEntry)
                        );

                    Company createComp = dbContext
                        .Companies.Where(c => c.CompanyId == VisitorEntry.CompanyId)
                        .SingleOrDefault();
                    Plant currentPlant = dbContext
                        .Plants.Where(x => x.PlantId == VisitorEntry.PlantId)
                        .SingleOrDefault();
                    JObject licRes = new JObject();
                    string apiresult = "";

                    if (
                        currentPlant != null
                        && createComp != null
                        && (
                            createComp.CheckToken == null
                            || createComp.CheckToken == ""
                            || currentPlant.CheckToken == null
                            || currentPlant.CheckToken == ""
                        )
                    )
                    {
                        dto.tranStatus.result = false;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Title = "No License Key Found.",
                                Message =
                                    "No License has been Created. Please Contact your Administrator.",
                            }
                        );
                        return dto;
                    }
                    else
                    {
                        JObject checkObj = new JObject();
                        checkObj = new JObject
                        {
                            { "CheckToken", createComp.CheckToken },
                            { "PlantCheckToken", currentPlant.CheckToken },
                        };

                        licRes = await commonService.GetLicData(checkObj);
                        if (
                            licRes == null
                            || licRes["transtatus"] == null
                            || !(bool)licRes["transtatus"]["result"]
                        )
                        {
                            dto.tranStatus.result = (bool)licRes?["transtatus"]?["result"];
                            dto.tranStatus.lstErrorItem.Add(
                                new ErrorItem
                                {
                                    ErrorNo = "VMS000",
                                    Title =
                                        licRes
                                            ?["transtatus"]?["lstErrorItem"][0]
                                            ?["Title"]?.ToString() ?? "Error Occurred",
                                    Message =
                                        licRes
                                            ?["transtatus"]?["lstErrorItem"][0]["Message"]
                                            ?.ToString()
                                        ?? "An unknown error occurred. Please contact support.",
                                }
                            );
                            return dto;
                        }
                        else
                        {
                            var blackListedVisitor = false;
                            var approvedLink = "";
                            string BrandLogo =
                                Directory.GetCurrentDirectory() + "\\upload\\Logo\\app-logo.png";
                            string BrandLogoBig = "/upload/Logo/app-logo-big.png";
                            VisitorEntry visitorEntryUpdated = new VisitorEntry();
                            Company companyEmailConfig = new Company();
                            string FilePath =
                                Directory.GetCurrentDirectory()
                                + "\\Templates\\VisitorEntryEmailTemplate.html";
                            StreamReader str = new StreamReader(FilePath);
                            string MailText = str.ReadToEnd();

                            VisitorEntry.VisitorEntryDetails =
                                (List<VisitorEntryDetail>)
                                    serializer.Deserialize(
                                        new JTokenReader(_EmployeeJSON["VisitorEntryDetail"]),
                                        typeof(List<VisitorEntryDetail>)
                                    );
                            VisitorEntry.VisitorEntryBelongingDetails =
                                (List<VisitorEntryBelongingDetail>)
                                    serializer.Deserialize(
                                        new JTokenReader(
                                            _EmployeeJSON["VisitorEntryBelongingDetail"]
                                        ),
                                        typeof(List<VisitorEntryBelongingDetail>)
                                    );
                            VisitorEntry.VisitorEntryMaterialDetails =
                                (List<VisitorEntryMaterialDetail>)
                                    serializer.Deserialize(
                                        new JTokenReader(
                                            _EmployeeJSON["VisitorEntryMaterialDetail"]
                                        ),
                                        typeof(List<VisitorEntryMaterialDetail>)
                                    );
                            VisitorEntry.VisitorEntryAtvDetails =
                                (List<VisitorEntryAtvDetail>)
                                    serializer.Deserialize(
                                        new JTokenReader(_EmployeeJSON["VisitorEntryAtvDetail"]),
                                        typeof(List<VisitorEntryAtvDetail>)
                                    );

                            if (VisitorEntry.VisitorTypeId == 66)
                            {
                                VisitorEntry.VisitorEntryRefDetails =
                                    (List<VisitorEntryRefDetail>)
                                        serializer.Deserialize(
                                            new JTokenReader(
                                                _EmployeeJSON["VisitorEntryRefDetail"]
                                            ),
                                            typeof(List<VisitorEntryRefDetail>)
                                        );
                            }
                            VisitorEntry.VisitorEntryCode = await GenerateUniqueCode();
                            var resturnstring = uploadService.UploadFile(webfile, "VisitorEntry");
                            var resturnVehiclestring = uploadService.UploadFile(
                                webfile1,
                                "VisitorEntryVehicle"
                            );
                            var resturnstrings = uploadService.UploadFiles(
                                webfiles,
                                "VisitorEntryDetail"
                            );
                            dbContext.VisitorEntries.Add(VisitorEntry);
                            dbContext.SaveChanges();
                            ftransaction.Commit();

                            var VisEntry = dbContext
                                .VisitorEntries.Where(x =>
                                    x.VisitorEntryCode == VisitorEntry.VisitorEntryCode
                                )
                                .SingleOrDefault();
                            var VisEntrydetail = dbContext
                                .VisitorEntryDetails.Where(x =>
                                    x.VisitorEntryId == VisEntry.VisitorEntryId
                                )
                                .ToList();
                            User VisitedEmp = new User();
                            Role VisitedEmpRole = new Role();
                            if (VisEntry.VisitorTypeId != 66)
                            {
                                VisitedEmp = dbContext
                                    .Users.Where(x => x.UserId == VisEntry.VisitedEmployeeId)
                                    .SingleOrDefault();
                                VisitedEmpRole = dbContext
                                    .Roles.Where(x => x.RoleId == VisitedEmp.DefaultRoleId)
                                    .SingleOrDefault();
                            }
                            companyEmailConfig = dbContext
                                .Companies.Where(x => x.CompanyId == VisitorEntry.CompanyId)
                                .SingleOrDefault();

                            var blackListVisitorAlreadyExists = dbContext
                                .Visitors.Where(x => x.Status == 2)
                                .ToList();

                            Visitor blackListedVisitors = new Visitor();
                            if (VisitorEntry.VisitorTypeId != 66)
                            {
                                if (blackListVisitorAlreadyExists.Count > 0)
                                {
                                    foreach (var item in blackListVisitorAlreadyExists)
                                    {
                                        if (VisEntrydetail.Count > 0)
                                        {
                                            if (
                                                item.MobileNo == VisEntrydetail[0].MobileNo
                                                || (
                                                    !string.IsNullOrEmpty(VisEntrydetail[0].MailId)
                                                    && item.MailId == VisEntrydetail[0].MailId
                                                )
                                            )
                                            {
                                                blackListedVisitor = true;
                                                blackListedVisitors = item;
                                                break;
                                            }
                                            else
                                            {
                                                blackListedVisitor = false;
                                                blackListedVisitors = item;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }

                            if (blackListedVisitor && VisitorEntry.VisitorTypeId == 66)
                            {
                                FilePath =
                                    Directory.GetCurrentDirectory()
                                    + "\\Templates\\BlackListedVisitor.html";
                                str = new StreamReader(FilePath);
                                MailText = str.ReadToEnd();
                                MailText = MailText
                                    .Replace(
                                        "{{PersonName}}",
                                        Convert.ToString(
                                            blackListedVisitors.FirstName
                                                + " "
                                                + blackListedVisitors.LastName
                                        )
                                    )
                                    .Replace(
                                        "{{RejectedContent}}",
                                        $"{blackListedVisitors.FirstName + " " + blackListedVisitors.LastName} Visitor Based  {blackListedVisitors.MobileNo} Mobile No is Blacklisted."
                                    )
                                    // .Replace("{{RejectedContent}}", $"You are an BlackListed Visitor {blackListedVisitors.FirstName + " " + blackListedVisitors.LastName} your Request on {VisEntry.VisitorEntryDate} is can't be Processed. Please Contact the Responsible Person or Whom you are Visiting to Visit.")
                                    .Replace("{{UserName}}", Convert.ToString(VisitedEmp.UserName))
                                    .Replace(
                                        "{{RoleName}}",
                                        Convert.ToString(VisitedEmpRole.RoleName)
                                    )
                                    .Replace("{{siteURL}}", _mailSettings.Website)
                                    .Replace("{{serviceURL}}", _mailSettings.Service)
                                    .Replace("{{Logo}}", BrandLogo)
                                    .Replace("{{BrandLogoBig}}", BrandLogoBig);

                                var stringObject = "";
                                stringObject =
                                    $"Your Request on {VisEntry.ValidFrom} can't be Processed.";
                                object emailObj = new
                                {
                                    FromID = "reply-no@visitorManagement.com",
                                    ToID = blackListedVisitors.MailId,
                                    Subject = stringObject,
                                    Template = MailText,
                                };

                                Company company = new Company();
                                company = dbContext
                                    .Companies.Where(x => x.CompanyId == VisitorEntry.CompanyId)
                                    .SingleOrDefault();

                                JObject convertObj = (JObject)JToken.FromObject(emailObj);
                                var mail = mailService.SendApprovalReqEmail(
                                    convertObj,
                                    (long)dto.VisitorEntryHeader.CompanyId,
                                    company
                                );
                            }
                            else
                            {
                                apiresult = licRes.ToString();

                                string companyLocToken = "";
                                JObject resLoc = JObject.Parse(
                                    licRes?["transtatus"]?["lstErrorItem"][0]["Response"].ToString()
                                );
                                JArray licenseCompanyLocations = (JArray)
                                    resLoc?["LicenseCompanyLocations"];
                                List<object> companyLocTokenss = new List<object>();

                                List<ApprovalConfiguration> ApprovalConfig = dbContext
                                    .ApprovalConfigurations.Where(y =>
                                        y.DocumentId == 34 && y.Status == 1
                                    )
                                    .ToList();

                                if (licenseCompanyLocations.Count > 0)
                                {
                                    var companyLocTokens = licenseCompanyLocations
                                        .Select(loc => loc["CompanyLocToken"]?.ToString())
                                        .ToList();

                                    Plant currentPlantAct = dbContext
                                        .Plants.Where(x =>
                                            companyLocTokens.Contains(x.CheckToken)
                                            && x.PlantId == VisitorEntry.PlantId
                                        )
                                        .SingleOrDefault();

                                    companyLocTokenss = licenseCompanyLocations
                                        .Where(loc =>
                                            loc["CompanyLocToken"]?.ToString()
                                            == currentPlantAct.CheckToken
                                        )
                                        .Select(loc => new
                                        {
                                            CompanyLocToken = loc["CompanyLocToken"]?.ToString(),
                                            IsWaApprovalEnabled = loc["IsWaApprovalEnabled"]
                                                ?.ToObject<bool>() ?? false,
                                            IsEmApprovalEnabled = loc["IsEmApprovalEnabled"]
                                                ?.ToObject<bool>() ?? false,
                                        })
                                        .ToList<object>();
                                }

                                var primeUser = dbContext
                                    .Users.Where(x => x.UserId == VisEntry.VisitedEmployeeId)
                                    .SingleOrDefault();
                                if (
                                     VisitorEntry.VisitorTypeId != 117
                                )
                                {
                                    ApprovalRequest request = new ApprovalRequest();
                                    Approval App = new Approval();
                                    ApprovalDetail appdet = new ApprovalDetail();

                                    if (
                                        VisitorEntry.VisitorTypeId == 36
                                        && ApprovalConfig.Count > 0
                                    )
                                    {
                                        // Uncommend Below lines for Approval Configuration Type Of Approval

                                        request.documentdetailid = VisEntry.VisitorEntryId;
                                        request.documentid = 34;
                                        request.documentactivityid = 70;
                                        request.remarks1 = "";
                                        request.remarks2 = "";
                                        request.userid = VisitorEntry.CreatedBy;
                                        request.plantid = VisEntry.PlantId ?? 0;
                                        request.documentno = VisEntry.VisitorEntryCode;
                                        request.companyid = VisEntry.CompanyId ?? 0;
                                        approvalservice.ApprovalWorkFlowInsert(request);
                                    }
                                    else
                                    {
                                        // Whom To Visit Approval

                                        App.ApprovalId = 0;
                                        App.PlantId = VisEntry.PlantId ?? 0;
                                        App.DocumentId = 34;
                                        App.DocumentNo = VisEntry.VisitorEntryCode;
                                        App.ApprovalActivityId = 70;
                                        App.Status = 74;
                                        App.CreatedBy = VisitorEntry.CreatedBy;
                                        App.CreatedOn = VisitorEntry.CreatedOn;

                                        appdet.ApprovalDetailId = 0;
                                        appdet.ApprovalId = 0;
                                        appdet.DocumentId = 34;
                                        appdet.DocumentNo = VisEntry.VisitorEntryCode;
                                        appdet.LevelId = 67;
                                        appdet.PrimaryUserId = primeUser.UserId;
                                        appdet.Status = 74;
                                        appdet.Remarks1 = "";
                                        appdet.Remarks2 = "";
                                        appdet.CreatedBy = VisitorEntry.CreatedBy;
                                        appdet.CreatedOn = VisitorEntry.CreatedOn;
                                        appdet.IsViewed = false;
                                        App.ApprovalDetails.Add(appdet);
                                        dbContext.Approvals.Add(App);
                                        dbContext.SaveChanges();
                                    }

                                    // string BrandLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDE1M0ZDMzY0ODhEMTFFRTlBNUNERDNGMTUzRDI3NzgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDE1M0ZDMzc0ODhEMTFFRTlBNUNERDNGMTUzRDI3NzgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MTUzRkMzNDQ4OEQxMUVFOUE1Q0REM0YxNTNEMjc3OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MTUzRkMzNTQ4OEQxMUVFOUE1Q0REM0YxNTNEMjc3OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtbRvfsAAAXBSURBVHja1Jp7TJdVGMd/XBMwMPOWlaJmsBSZScagmVRubNYoNUui5bq6wkZm64/USlu2roKhlbZw2WWtttKy1qhoXspVFuHMMBUrphSlaV6I6Nf3bN93ezo7533Pjx+/H/RsnwHn9p7nPec8z3Oel4RwOBxykAFgASgGO8Cj4HCoL4hSwIE3wv+V9x37xZwEhxU4GzSDdFHWAXJBC0gCs8AUcAy8Cb7sSyswABzUVuB3MIj1L2h1f4Nr4rUCrg3napNcyPKSsFn2g0xtDLXaaSC5NxRQFIA7wVRR9kzYLpeLdteDT6hYE3gaDIu3AiYe9lGgkG0WW+qbxDbsNQXOBycNk2tgfVHYX9ZFq0BiwBkfCKaD8ZZ6ZZ3mgTZRtpVlIfb1k1L6mG5Lsk9dBngPFIIuMANsMLRbBzZSSWVGd4JO1p3j4CAVR7Q5TQL5IBXsA9vBb5Ga0au15d4k6maAR8AVAUu8JGAL/Qz6i/ZTwBeGdu3ggUjPwEWgSwyyiuXLtMFv8hljguWMeFIr2k4HfwYovDLSQ6wm1wjqaMPPAse1QX8EGWyfRPMo3+qtlslsFv1Op4l1kYporNBYelophzlh5Sc+A0dBK1hK56X6XQiqwafgHXAL6CfGvS3sLp+DvGjM6EZtwBVcnX2Ghy1wHPOtCBQ4Bm52NaMmKQfVYDN4EFSBCjDK0LbCccxBETw/XbY3mdE0sII+QE1wlzCrJ2kqqwz+wvYw9ZL+CZhUWwQKqOcf9DOj14nlWsOySnAIrNf2rkcOOGFY7pdYrwK42bxX1IOnaKG8/uURbKEtINfvDJQI83kXOBOcEgPMtezjSs3sbgODWfeqYSKd4FqhYKOjAuUuVki9nVKaxUztgHpRplJsGhgu+l0AbmTfdJbd7jOZQ0LJyaAtYPJPdDeYmwTWcnLe5Js4aCsnbuv7ccCkZmov7kPwl8HXVLp44jThXPxYqD1gtaVdKtgboMB8Q79chis3gEvp6IxzkVZoIlgMLmYg1Q4KeP9t0izBT9rfrfw5mBGmsmT1DMQawWgfq7LHULabRHQnzuENq4H7N5FL95VB8yTGJQdoWVT7MaBZ89DFPDM22WtZ8WxeiEYJb+58oUnQXPwcMeliLc5JFb+/a5jgd6ybR6sjZQ/I1549mp7eCwCV9fsIjO+pO7GSGkNdiiUY6+LKhjjZRQw97jBcJ1UQuNsnSZAdrQID6dimWeq3Gx78Ky2Wy/i1AYe9tqfvxEU0q4nikqPLckO/WeBFZibyxbbdGaDALtN5iEaBDzjwuaJMObDXwAaeHz0HVGOILC9hXdB94IB25qJWYCLDigTH9lMtE2t0dHgN3clK+MnXoE5ZYkNdFniSSYEyluVbxslheLwq4HkvR5Od9iPNkGV7Vrw5dc8dAcosb7adBkL1e9zSpjpWiS2ZXhwnyrZaIsgmw+Qe0sabzATCFsZfRbHMzIV4vVMx/lBRdo+Y4A9giPCw6+nEvgH3R5vsdfk+0F1R3wzGgtfBfq2uH5NlnVr5BDAfZDOZVQN+6YkvNC6YrFF/nhFZdhXYwRirTJSrcOGIIfWSFOst5GXxmnlvkHGUiutbxPVxnJbo+gOMZN1zlgM8O5rkrqsMAedxa3gyE6SAkeBKluVqbTLZT8lQy9jD4rGFErQoNcT7tBcP5YnEmLz8H6WJVXVVlmCwIB5byEa2wUeUMkSuZz40JC72dWLyKpS+N15WSKXB7wbbiJIzmDpvsXhrm+QxSfYt+4bisYVG8K09Ly46njN7RbTL4lutMmy5XvnEJLmMV0DPJMow2GuzSZS/rW0flVB7jOF2Sm8oEDKEzuoA38e/x2jXylMiFF+tHd5lfUEBxWnCwamL//diks28DKmD3qEpcFyspi/JMf5HgA7x+wkwByxisnc5f2bQCOhJ4SyXB8QyFnKVRH7ZLBRlDaDk/6KAkuFgCS89ynwuFckyX/lXgAEATExigKgYpqQAAAAASUVORK5CYII=";
                                    VisitedEmp = dbContext
                                        .Users.Where(x => x.UserId == VisEntry.VisitedEmployeeId)
                                        .SingleOrDefault();
                                    var PurposeName = dbContext
                                        .Metadata.Where(x => x.MetaSubId == VisEntry.PurposeOfVisit)
                                        .SingleOrDefault();
                                    visitorEntryUpdated.VisitorEntryCode =
                                        VisEntry.VisitorEntryCode;
                                    visitorEntryUpdated.VisitorEntryId = VisEntry.VisitorEntryId;
                                    dto.VisitorEntryHeader = visitorEntryUpdated;

                                    if (blackListVisitorAlreadyExists.Count > 0)
                                    {
                                        foreach (var item in blackListVisitorAlreadyExists)
                                        {
                                            if (
                                                item.VisitorId == dto.VisitorEntryHeader.VisitorId
                                                && (
                                                    item.MobileNo == dto.VisitorEntryHeader.MobileNo
                                                    || (
                                                        !string.IsNullOrEmpty(
                                                            dto.VisitorEntryHeader.MailId
                                                        )
                                                        && item.MailId
                                                            == dto.VisitorEntryHeader.MailId
                                                    )
                                                )
                                            )
                                            {
                                                blackListedVisitor = true;
                                                blackListedVisitors = item;
                                            }
                                            else
                                            {
                                                blackListedVisitor = false;
                                                blackListedVisitors = item;
                                            }
                                        }
                                    }
                                    if (blackListedVisitor)
                                    {
                                        MailText = MailText
                                            .Replace(
                                                "{{PersonName}}",
                                                Convert.ToString(
                                                    blackListedVisitors.FirstName
                                                        + " "
                                                        + blackListedVisitors.LastName
                                                )
                                            )
                                            .Replace("{{PassLink}}", "")
                                            .Replace(
                                                "{{UserName}}",
                                                Convert.ToString(dto.VisitorEntryHeader.UserName)
                                            )
                                            .Replace(
                                                "{{RoleName}}",
                                                Convert.ToString(dto.VisitorEntryHeader.RoleName)
                                            )
                                            .Replace("{{siteURL}}", _mailSettings.Website)
                                            .Replace("{{serviceURL}}", _mailSettings.Service)
                                            .Replace("{{Logo}}", BrandLogo)
                                            .Replace("{{BrandLogoBig}}", BrandLogoBig);

                                        var stringObject = "";
                                        // stringObject = $"You are an BlackListed Visitor {blackListedVisitors.FirstName + " " + blackListedVisitors.LastName} your Request on {dto.VisitorEntryHeader.VisitorEntryDate} is can't be Processed. Please Contact the Responsible Person or Whom you are Visiting to Visit.";
                                        stringObject =
                                            $"{blackListedVisitors.FirstName + " " + blackListedVisitors.LastName} Visitor Based  {blackListedVisitors.MobileNo} Mobile No is Blacklisted.";
                                        object emailObj = new
                                        {
                                            FromID = "reply-no@visitorManagement.com",
                                            ToID = blackListedVisitors.MailId,
                                            Subject = stringObject,
                                            Template = MailText,
                                        };

                                        Company company = new Company();
                                        company = dbContext
                                            .Companies.Where(x =>
                                                x.CompanyId == VisitorEntry.CompanyId
                                            )
                                            .SingleOrDefault();

                                        JObject convertObj = (JObject)JToken.FromObject(emailObj);
                                        var mail = mailService.SendApprovalReqEmail(
                                            convertObj,
                                            (long)dto.VisitorEntryHeader.CompanyId,
                                            company
                                        );
                                    }
                                    else
                                    {
                                        // MAIL APPROVAL
                                        // GET APPROVAL CONFIG

                                        var workflowheader = dbContext
                                                .ApprovalConfigurations.Where(x =>
                                                    x.DocumentId == 34
                                                    && x.PlantId == request.plantid
                                                    && x.ApprovalActivityId == request.documentactivityid
                                                    && x.Status == 1
                                                )
                                                .SingleOrDefault();
                                        if (workflowheader != null)
                                        {
                                            var workflowdetail = dbContext.ApprovalConfigurationDetails.SingleOrDefault(A =>
                                                A.ApprovalConfigurationId == workflowheader.ApprovalConfigurationId &&
                                                A.LevelId == 67
                                            );
                                            var selectedUserId = (workflowdetail?.PrimaryUserId == 0)
                                                 ? VisitedEmp.UserId
                                                 : (workflowdetail?.PrimaryUserId ?? VisitedEmp.UserId);

                                            var ApproveSendUser = dbContext.Users
                                                .Where(x => x.UserId == selectedUserId)
                                                .SingleOrDefault();

                                            // GET APPROVAL CONFIG

                                            // var approveLink = GenerateMailToken(
                                            //     "ENCRYPT",
                                            //     "",
                                            //     "APPROVE",
                                            //     $"{VisEntry.VisitorEntryCode}_{VisEntry.CompanyId}_{VisEntry.PlantId}_{34}_{primeUser.UserId}_75_{VisEntry.VisitorTypeId}_67"
                                            // );
                                            // var rejectLink = GenerateMailToken(
                                            //     "ENCRYPT",
                                            //     "",
                                            //     "REJECT",
                                            //     $"{VisEntry.VisitorEntryCode}_{VisEntry.CompanyId}_{VisEntry.PlantId}_{34}_{primeUser.UserId}_76_{VisEntry.VisitorTypeId}_67"
                                            // );

                                            var approveLink = GenerateMailToken(
                                                "ENCRYPT",
                                                "",
                                                "APPROVE",
                                                $"{VisEntry.VisitorEntryCode}_{VisEntry.CompanyId}_{VisEntry.PlantId}_{34}_{workflowdetail.PrimaryUserId}_75_{VisEntry.VisitorTypeId}_67"
                                            );
                                            var rejectLink = GenerateMailToken(
                                                "ENCRYPT",
                                                "",
                                                "REJECT",
                                                $"{VisEntry.VisitorEntryCode}_{VisEntry.CompanyId}_{VisEntry.PlantId}_{34}_{workflowdetail.PrimaryUserId}_76_{VisEntry.VisitorTypeId}_67"
                                            );

                                            visitorEntryUpdated = VisEntry;
                                            dto.VisitorEntryHeader = visitorEntryUpdated;
                                            var visitorCompany = VisEntrydetail[0].VisitorCompany;
                                            MailText = MailText
                                                .Replace(
                                                    "[WhomToVisit]",
                                                    Convert.ToString(ApproveSendUser?.UserName)
                                                )
                                                .Replace(
                                                    "[Visitor]",
                                                    Convert.ToString(VisEntry.PersonName)
                                                )
                                                .Replace(
                                                    "[VisitDate]",
                                                    Convert.ToString(
                                                        VisEntry.ValidFrom.Value.ToShortDateString()
                                                    )
                                                )
                                                .Replace(
                                                    "[VisitTime]",
                                                    Convert.ToString(
                                                        VisEntry.ValidFrom.Value.ToShortTimeString()
                                                    )
                                                )
                                                .Replace(
                                                    "[PurposeOfVisit]",
                                                    Convert.ToString(PurposeName.MetaSubDescription)
                                                )
                                                .Replace(
                                                    "[VisitorCompany]",
                                                    Convert.ToString(visitorCompany ?? "-")
                                                )
                                                .Replace(
                                                    "{{ApproveLink}}",
                                                    Convert.ToString(approveLink.Result)
                                                )
                                                .Replace(
                                                    "{{RejectLink}}",
                                                    Convert.ToString(rejectLink.Result)
                                                )
                                                .Replace("{{serviceURL}}", _mailSettings.Service)
                                                .Replace("{{siteURL}}", _mailSettings.Website)
                                                .Replace("{{Logo}}", BrandLogo)
                                                .Replace("{{BrandLogoBig}}", BrandLogoBig);
                                            object emailObj = new
                                            {
                                                FromID = "reply-no@visitorManagement.com",
                                                ToID = ApproveSendUser.UserEmail,
                                                Subject = $"Pending Approval for Visitor {VisEntry.PersonName} on {VisEntry.ValidFrom.Value.ToLongDateString()} {VisEntry.ValidFrom.Value.ToLongTimeString()} from {Convert.ToString(visitorCompany)} for {PurposeName.MetaSubDescription}",
                                                Template = MailText,
                                            };

                                            JObject convertObj = (JObject)JToken.FromObject(emailObj);
                                            foreach (dynamic token in companyLocTokenss)
                                            {
                                                if (
                                                    token.IsEmApprovalEnabled == true
                                                    && _mailSettings.MSend
                                                )
                                                {
                                                    var mail = mailService.SendApprovalReqEmail(
                                                        convertObj,
                                                        (long)dto.VisitorEntryHeader.CompanyId,
                                                        companyEmailConfig
                                                    );
                                                }
                                            }
                                            foreach (dynamic token in companyLocTokenss)
                                            {
                                                if (
                                                    token.IsWaApprovalEnabled == true
                                                    && _mailSettings.WSend
                                                )
                                                {
                                                    var whatsApp = sendWhatsAppApproval(
                                                        VisEntrydetail,
                                                        dto.VisitorEntryHeader,
                                                        PurposeName,
                                                        visitorCompany,
                                                        ApproveSendUser,
                                                        approveLink,
                                                        rejectLink
                                                    );
                                                }
                                            }
                                            approvedLink = approveLink.Result;
                                        }
                                    }
                                    // transaction.Commit();
                                    var isPlantApprove = dbContext
                                        .Plants.Where(x => x.PlantId == VisEntry.PlantId)
                                        .SingleOrDefault();
                                    if (isPlantApprove.IsAutomaticApprove == true)
                                    {
                                        await approvalservice.UserWorkFlowUpdateUsingToken(
                                            approvedLink
                                        );
                                    }
                                }
                                else
                                {
                                    if (VisitorEntry.VisitorTypeId == 35)
                                    {
                                        VisEntry.Status = 74;
                                        dbContext.VisitorEntries.Update(VisEntry);
                                        dbContext.SaveChanges();
                                        // transaction.Commit();
                                    }
                                    else
                                    {
                                        VisEntry.Status = 75;
                                        dbContext.VisitorEntries.Update(VisEntry);
                                        dbContext.SaveChanges();
                                        // transaction.Commit();
                                        if (VisitorEntry.VisitorTypeId == 117)
                                        {
                                            await approvalservice.SendPassInternal(
                                                VisEntry,
                                                "true",
                                                companyEmailConfig
                                            );
                                        }
                                    }
                                }
                            }

                            dto.VisitorEntryHeader = VisEntry;
                            dto.VisitorEntryDetail = VisEntrydetail;

                            if (blackListedVisitor)
                            {
                                dto.tranStatus.result = false;
                                dto.tranStatus.lstErrorItem.Add(
                                    new ErrorItem
                                    {
                                        ErrorNo = "VMS000",
                                        Message =
                                            "Mobile No or Mail Id is assigned to a Blacklisted Visitor.",
                                    }
                                );
                            }
                            else
                            {
                                dto.tranStatus.result = true;
                                dto.tranStatus.lstErrorItem.Add(
                                    new ErrorItem
                                    {
                                        ErrorNo = "VMS000",
                                        Message = "Created Successfully.",
                                    }
                                );
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    ftransaction.Rollback();
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                    );
                }
            }
            return dto;
        }

        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "8";
            string series = "45";

            using (dapperContext)
            {
                var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                    spName: "GetPrimaryKey",
                    new { documentid, series }
                );
                documentno = (await spcall.ReadAsync<string>()).SingleOrDefault();
            }

            bool isDuplicate = dbContext.VisitorEntries.Any(entry =>
                entry.VisitorEntryCode == documentno
            );
            if (isDuplicate)
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "GetPrimaryKey",
                        new { documentid, series }
                    );
                    documentno = (await spcall.ReadAsync<string>()).SingleOrDefault();
                }
            }

            return documentno;
        }

        // public async Task<string> GenerateUniqueCode()
        // {
        //     string documentno = "";
        //     string documentid = "8";
        //     string series = "45";
        //     using (dapperContext)
        //     {
        //         var spcall = await dapperContext.ExecuteStoredProcedureAsync(
        //             spName: "GetPrimaryKey",
        //             new { documentid, series }
        //         );
        //         documentno = (await spcall.ReadAsync<string>()).SingleOrDefault();
        //     }

        //     return documentno;
        // }

        public async Task<VisitorEntryDTO> ChangeStatus(JObject obj)
        {
            try
            {
                long VisitorEntryId = obj["VisitorEntryId"].ToObject<long>();
                var VisitorEntries = dbContext
                    .VisitorEntries.Where(x => x.VisitorEntryId == VisitorEntryId)
                    .SingleOrDefault();
                VisitorEntries.Status = 2;
                dbContext.VisitorEntries.Update(VisitorEntries);
                dbContext.SaveChanges();
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Status Changed Successfully." }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> SearchInitialize(JObject obj)
        {
            try
            {
                long PlantId = (long)obj["PlantId"];
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                // DateTime FDate =obj["FromDate"].ToObject<DateTime>();
                // DateTime TDate =obj["ToDate"].ToObject<DateTime>();
                string type = "SearchInitialize";
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorEntry/";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId,
                            VisitorId = (object)null,
                            type,
                            text = (object)null,
                            Scheme,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.VisitorEntryList = (await spcall.ReadAsync<dynamic>()).ToList();
                }

                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> Update(
            object obj,
            IFormFile webfile,
            IFormFile webfile1,
            List<IFormFile> webfiles
        )
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _EmployeeJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();
                VisitorEntry VisitorEntry = (VisitorEntry)
                    serializer.Deserialize(
                        new JTokenReader(_EmployeeJSON["VisitorEntry"]),
                        typeof(VisitorEntry)
                    );
                VisitorEntry.VisitorEntryDetails =
                    (List<VisitorEntryDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_EmployeeJSON["VisitorEntryDetail"]),
                            typeof(List<VisitorEntryDetail>)
                        );
                VisitorEntry.VisitorEntryBelongingDetails =
                    (List<VisitorEntryBelongingDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_EmployeeJSON["VisitorEntryBelongingDetail"]),
                            typeof(List<VisitorEntryBelongingDetail>)
                        );
                VisitorEntry.VisitorEntryAtvDetails =
                    (List<VisitorEntryAtvDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_EmployeeJSON["VisitorEntryAtvDetail"]),
                            typeof(List<VisitorEntryAtvDetail>)
                        );
                if (VisitorEntry.VisitorTypeId == 66)
                {
                    VisitorEntry.VisitorEntryRefDetails =
                        (List<VisitorEntryRefDetail>)
                            serializer.Deserialize(
                                new JTokenReader(_EmployeeJSON["VisitorEntryRefDetail"]),
                                typeof(List<VisitorEntryRefDetail>)
                            );
                }
                var resturnstring = uploadService.UploadFile(webfile, "VisitorEntry");
                var resturnVehiclestring = uploadService.UploadFile(
                    webfile1,
                    "VisitorEntryVehicle"
                );
                var resturnstrings = uploadService.UploadFiles(webfiles, "VisitorEntryDetail");

                if (VisitorEntry.VisitorTypeId == 0)
                {
                    foreach (var item in VisitorEntry.VisitorEntryDetails)
                    {
                        JObject jObject = new JObject(
                            new JProperty("UserId", VisitorEntry.ModifiedBy),
                            new JProperty("VisitorEntryCode", VisitorEntry.VisitorEntryCode),
                            new JProperty("VisitorEntryDetailId", item.VisitorEntryDetailId),
                            new JProperty("Checkintime", VisitorEntry.ModifiedOn)
                        );
                        await CheckIn(jObject);
                    }
                }
                dbContext.VisitorEntries.Update(VisitorEntry);
                dbContext.SaveChanges();
                var VisEntryUpdated = dbContext
                    .VisitorEntries.Where(x => x.VisitorEntryCode == VisitorEntry.VisitorEntryCode)
                    .SingleOrDefault();
                var VisEntrydetailUpdated = dbContext
                    .VisitorEntryDetails.Where(x =>
                        x.VisitorEntryId == VisEntryUpdated.VisitorEntryId
                    )
                    .ToList();

                dto.VisitorEntryHeader = VisEntryUpdated;
                dto.VisitorEntryDetail = VisEntrydetailUpdated;

                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Updated Successfully." }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> CheckinCkeckoutPageLoad(JObject obj)
        {
            try
            {
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string type = "CheckinCkeckoutPageLoad";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId,
                            VisitorId = (object)null,
                            type,
                            text = (object)null,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId = (object)null,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.VisitorEntryTypeList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.VisitorEntryLogList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Checked Out Successfully." }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> CheckIn(JObject obj)
        {
            try
            {
                int UserId = obj["UserId"].ToObject<int>();
                string VisitorEntryCode = obj["VisitorEntryCode"].ToObject<string>();
                long VisitorEntryDetailId = obj["VisitorEntryDetailId"].ToObject<long>();
                DateTime Checkintime = obj["Checkintime"].ToObject<DateTime>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string? type = obj["type"].ToObject<string?>();

                static bool ContainsWop(string input)
                {
                    if (string.IsNullOrEmpty(input))
                        return false;

                    return input.IndexOf("WOP", StringComparison.OrdinalIgnoreCase) >= 0;
                }

                if (ContainsWop(VisitorEntryCode))
                {
                    var WorkPerm = dbContext
                        .WorkPermits.Where(x => x.WorkPermitCode == VisitorEntryCode)
                        .SingleOrDefault();
                    var workPermWorker = dbContext
                        .WpWorkerDetails.Where(x => x.WpWorkerDetailId == VisitorEntryDetailId)
                        .SingleOrDefault();
                    if (WorkPerm != null)
                    {
                        using (var transaction = dbContext.Database.BeginTransaction())
                        {
                            if (type == "SelfApproval")
                            {
                                WorkPerm.Status = 75;
                                dbContext.WorkPermits.Update(WorkPerm);
                                dbContext.SaveChanges();
                            }
                            VisitorEntryLog logExists = dbContext
                                .VisitorEntryLogs.Where(l =>
                                    l.VisitorEntryCode == VisitorEntryCode
                                    && l.CheckedIn != null
                                    && l.VisitorEntryDetailId == VisitorEntryDetailId
                                    && l.CheckedIn.Date == DateTime.Now.Date
                                )
                                .SingleOrDefault();

                            VisitorEntryLog log = new VisitorEntryLog();
                            if (logExists != null)
                            {
                                dto.tranStatus.result = false;
                                dto.tranStatus.lstErrorItem.Add(
                                    new ErrorItem
                                    {
                                        ErrorNo = "VMS000",
                                        Message =
                                            $"Visitor {workPermWorker.WorkerName}-{VisitorEntryCode} is Already in Checked-In.",
                                    }
                                );
                            }
                            else
                            {
                                log.VisitorEntryLogId = 0;
                                log.VisitorEntryCode = VisitorEntryCode;
                                log.VisitorEntryDetailId = VisitorEntryDetailId;
                                log.CheckedIn = Checkintime;
                                log.CreatedBy = UserId;
                                log.CreatedOn = Checkintime;
                                dbContext.VisitorEntryLogs.Add(log);
                                dbContext.SaveChanges();
                                transaction.Commit();
                            }
                        }
                    }
                    dto.tranStatus.result = true;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                $"Visitor {workPermWorker.WorkerName}-{WorkPerm.WorkPermitCode} Checked-In Successfully.",
                        }
                    );
                }
                else
                {
                    var VisEntry = dbContext
                        .VisitorEntries.Where(x => x.VisitorEntryCode == VisitorEntryCode)
                        .SingleOrDefault();
                    if (VisEntry != null)
                    {
                        using (var transaction = dbContext.Database.BeginTransaction())
                        {
                            if (type == "SelfApproval")
                            {
                                VisEntry.Status = 75;
                                dbContext.VisitorEntries.Update(VisEntry);
                                dbContext.SaveChanges();
                            }
                            VisitorEntryLog logExists = dbContext
                                .VisitorEntryLogs.Where(l =>
                                    l.VisitorEntryCode == VisitorEntryCode
                                    && l.CheckedIn != null
                                    && l.VisitorEntryDetailId == VisitorEntryDetailId
                                    && l.CheckedIn.Date == DateTime.Now.Date
                                )
                                .SingleOrDefault();

                            VisitorEntryLog log = new VisitorEntryLog();
                            if (logExists != null)
                            {
                                dto.tranStatus.result = false;
                                dto.tranStatus.lstErrorItem.Add(
                                    new ErrorItem
                                    {
                                        ErrorNo = "VMS000",
                                        Message =
                                            $"Visitor {VisEntry.PersonName}-{VisEntry.VisitorEntryCode} is Already in Checked-In.",
                                    }
                                );
                            }
                            else
                            {
                                log.VisitorEntryLogId = 0;
                                log.VisitorEntryCode = VisitorEntryCode;
                                log.VisitorEntryDetailId = VisitorEntryDetailId;
                                log.CheckedIn = Checkintime;
                                log.CreatedBy = UserId;
                                log.CreatedOn = Checkintime;
                                dbContext.VisitorEntryLogs.Add(log);
                                dbContext.SaveChanges();
                                transaction.Commit();
                            }
                        }
                    }
                    dto.tranStatus.result = true;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                $"Visitor {VisEntry.PersonName}-{VisEntry.VisitorEntryCode} Checked-In Successfully.",
                        }
                    );
                }
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> CheckOut(JObject obj)
        {
            try
            {
                int UserId = obj["UserId"].ToObject<int>();
                string VisitorEntryCode = obj["VisitorEntryCode"].ToObject<string>();
                long VisitorEntryDetailId = obj["VisitorEntryDetailId"].ToObject<long>();
                DateTime Checkouttime = obj["Checkouttime"].ToObject<DateTime>();

                static bool ContainsWop(string input)
                {
                    if (string.IsNullOrEmpty(input))
                        return false;

                    return input.IndexOf("WOP", StringComparison.OrdinalIgnoreCase) >= 0;
                }
                if (ContainsWop(VisitorEntryCode))
                {
                    var WorkPerm = dbContext
                        .WorkPermits.Where(x => x.WorkPermitCode == VisitorEntryCode)
                        .SingleOrDefault();
                    var workPermWorker = dbContext
                        .WpWorkerDetails.Where(x => x.WpWorkerDetailId == VisitorEntryDetailId)
                        .SingleOrDefault();
                    var veHeader = this
                        .dbContext.VisitorEntryLogs.Where(x =>
                            x.VisitorEntryCode == VisitorEntryCode
                            && x.VisitorEntryDetailId == VisitorEntryDetailId
                            && x.CheckedOut == null
                        )
                        .ToList();
                    if (veHeader.Count > 0)
                    {
                        foreach (var item in veHeader)
                        {
                            item.CheckedOut = Checkouttime;
                            item.ModifiedBy = UserId;
                            item.ModifiedOn = Checkouttime;
                        }
                        dbContext.VisitorEntryLogs.UpdateRange(veHeader);
                        dbContext.SaveChanges();
                        dto.tranStatus.result = true;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Message =
                                    $" Visitor {workPermWorker.WorkerName}-{WorkPerm.WorkPermitCode} Checked Out Successfully.",
                            }
                        );
                    }
                    else
                    {
                        dto.tranStatus.result = false;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem { ErrorNo = "VMS000", Message = "No Records Found" }
                        );
                    }
                }
                else
                {
                    var VisEntry = dbContext
                        .VisitorEntries.Where(x => x.VisitorEntryCode == VisitorEntryCode)
                        .SingleOrDefault();

                    var veHeader = this
                        .dbContext.VisitorEntryLogs.Where(x =>
                            x.VisitorEntryCode == VisitorEntryCode
                            && x.VisitorEntryDetailId == VisitorEntryDetailId
                            && x.CheckedOut == null
                        )
                        .ToList();
                    if (veHeader.Count > 0)
                    {
                        foreach (var item in veHeader)
                        {
                            item.CheckedOut = Checkouttime;
                            item.ModifiedBy = UserId;
                            item.ModifiedOn = Checkouttime;
                        }
                        dbContext.VisitorEntryLogs.UpdateRange(veHeader);
                        dbContext.SaveChanges();
                        dto.tranStatus.result = true;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Message =
                                    $" Visitor {VisEntry.PersonName}-{VisEntry.VisitorEntryCode} Checked Out Successfully.",
                            }
                        );
                    }
                    else
                    {
                        dto.tranStatus.result = false;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem { ErrorNo = "VMS000", Message = "No Records Found" }
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> FilterVisitorEntryCodeManual(JObject obj)
        {
            try
            {
                long PlantId = obj["PlantId"].ToObject<long>();
                string text = obj["text"].ToObject<string>();
                int EntryType = obj["EntryType"].ToObject<int>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                string type = "FilterVisitorEntryCodeManual";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId,
                            VisitorId = (object)null,
                            type,
                            text,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    if (EntryType == 60)
                    {
                        dto.VisitorEntryCheckInCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.VisitorEntryAppovalList = (await spcall.ReadAsync<dynamic>()).ToList();
                    }
                    else
                    {
                        dto.VisitorEntryCheckInCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.VisitorEntryAppovalList = (await spcall.ReadAsync<dynamic>()).ToList();
                    }
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Code Fetched SuccessFully." }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> FilterVisitorEntryCode(JObject obj)
        {
            try
            {
                long PlantId = obj["PlantId"].ToObject<long>();
                string text = obj["text"].ToObject<string>();
                int EntryType = obj["EntryType"].ToObject<int>();
                string type = "FilterVisitorEntryCode";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId,
                            VisitorId = (object)null,
                            type,
                            text,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId = (object)null,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId = (object)null,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    if (EntryType == 60)
                    {
                        dto.VisitorEntryCheckInCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.VisitorEntryCheckOutLCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.VisitorEntryCheckOutMCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.VisitorEntryCheckedInOutCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.VisitorEntryAppovalList = (await spcall.ReadAsync<dynamic>()).ToList();
                    }
                    else
                    {
                        dto.VisitorEntryCheckInCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.VisitorEntryCheckOutLCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.VisitorEntryAppovalList = (await spcall.ReadAsync<dynamic>()).ToList();
                    }
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Code Fetched SuccessFully." }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> VehicleData(JObject obj)
        {
            try
            {
                long PlantId = obj["PlantId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                string VehicleData = obj["VehicleData"].ToObject<string>();
                string type = "VehicleData";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId,
                            VisitorId = (object)null,
                            type,
                            text = (object)null,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId,
                            VehicleData,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId = (object)null,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.VehicleDataList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Code Fetched SuccessFully." }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> OnChangeVisitorEntryCode(JObject obj)
        {
            try
            {
                string VisitorEntryCode = obj["VisitorEntryCode"].ToObject<string>();
                int EntryType = obj["EntryType"].ToObject<int>();
                string type = "OnChangeVisitorEntryCode";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode,
                            VisitorTypeId = (object)null,
                            PlantId = (object)null,
                            VisitorId = (object)null,
                            type,
                            text = (object)null,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId = (object)null,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId = (object)null,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.VisitorEmployeeList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> OnChangeEntryDetail(JObject obj)
        {
            try
            {
                int VisitorEntryId = obj["VisitorEntryId"].ToObject<int>();
                long VisitorDetailId = obj["VisitorEntryDetailId"].ToObject<long>();
                string type = "OnChangeEntryDetail";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId,
                            VisitorDetailId,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId = (object)null,
                            VisitorId = (object)null,
                            type,
                            text = (object)null,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId = (object)null,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId = (object)null,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.OnChangeEntryDetailList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<string> GenerateMailToken(
            string tokenType,
            string encryptedToken,
            string ApprovalType,
            string ApprovalText
        )
        {
            var resultValue = "";
            try
            {
                if (tokenType == "ENCRYPT")
                {
                    if (ApprovalType == "APPROVE")
                    {
                        resultValue = ApproveTokenService.GenerateToken(ApprovalText);
                    }
                    else if (ApprovalType == "REJECT")
                    {
                        resultValue = ApproveTokenService.GenerateToken(ApprovalText);
                    }
                }
                else if (tokenType == "DECRYPT")
                {
                    resultValue = ApproveTokenService.DecryptToken(encryptedToken);
                }
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return resultValue;
        }

        public VisitorEntryDTO sendWhatsAppApproval(
            List<VisitorEntryDetail> visEntrydetail,
            dynamic visitorEntry,
            dynamic PurposeName,
            dynamic visComp,
            dynamic VisitedEmp,
            Task<string> approveLink,
            Task<string> rejectLink
        )
        {
            try
            {
                dynamic jsonObject = new JObject();
                jsonObject.to_contact = "91" + Convert.ToString(VisitedEmp.UserTelNo);
                jsonObject.type = "template";

                jsonObject.custom = new JObject();
                dynamic customJsonObject = new JObject();

                customJsonObject.ApproveToken = Convert.ToString(approveLink.Result);
                customJsonObject.RejectToken = Convert.ToString(rejectLink.Result);
                customJsonObject.WhatsAppCallApi = Convert.ToString(
                    _mailSettings.Service + _mailSettings.WhatsAppCallAPIPath
                );

                jsonObject.custom = Newtonsoft.Json.JsonConvert.SerializeObject(customJsonObject);

                dynamic template = new JObject();
                template.name = "ntn_approval";
                template.language = "en";

                JArray components = new JArray();
                dynamic headComponent = new JObject();
                dynamic bodyComponent = new JObject();

                headComponent.type = "header";
                bodyComponent.type = "body";

                JArray hParameters = new JArray();
                JArray parameters = new JArray();

                dynamic hParam = new JObject();

                dynamic fParam = new JObject();
                dynamic sParam = new JObject();
                dynamic tParam = new JObject();
                dynamic foParam = new JObject();
                dynamic fiParam = new JObject();

                hParam.type = "image";

                fParam.type = "text";
                sParam.type = "text";
                tParam.type = "text";
                foParam.type = "text";
                fiParam.type = "text";

                hParam.image = new JObject();
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorEntry/";
                string SchemeUpload =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString();
                if (visitorEntry.IsInternalAppointment)
                {
                    string BrandLogoBig = "/upload/Logo/avatar.png";
                    hParam.image.link = SchemeUpload + BrandLogoBig;
                }
                else
                {
                    foreach (var entry in visEntrydetail)
                    {
                        if (entry.DocumentUrl == "" || entry.DocumentUrl == null)
                        {
                            string BrandLogoBig = "/upload/Logo/avatar.png";
                            hParam.image.link = SchemeUpload + BrandLogoBig;
                        }
                        else
                        {
                            hParam.image.link = Scheme + entry.DocumentUrl;
                        }
                    }
                }

                fParam.text = Convert.ToString(VisitedEmp?.UserName);
                foreach (var item in visEntrydetail)
                {
                    sParam.text = Convert.ToString(item.FirstName);
                }

                tParam.text = Convert.ToString(
                    visitorEntry.ValidFrom.Date.ToShortDateString()
                        + " "
                        + visitorEntry.ValidFrom.Date.ToShortTimeString()
                );
                foParam.text = Convert.ToString(
                    string.IsNullOrWhiteSpace(visComp) || visComp.Length == 0 ? "-" : visComp
                );
                fiParam.text = Convert.ToString(PurposeName.MetaSubDescription);

                parameters.Add(fParam);
                parameters.Add(sParam);
                parameters.Add(tParam);
                parameters.Add(foParam);
                parameters.Add(fiParam);

                hParameters.Add(hParam);

                headComponent.parameters = hParameters;
                bodyComponent.parameters = parameters;

                components.Add(headComponent);
                components.Add(bodyComponent);

                template.components = components;
                jsonObject.template = template;

                string jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObject);
                Console.WriteLine(jsonString);
                JObject tempObj = new JObject();
                tempObj = jsonObject;
                string FromContact = "917358112529";
                string ToContact = "91" + Convert.ToString(VisitedEmp.UserTelNo);
                DateTime MessageTime = DateTime.Now;
                string Template = "ntn_approval";
                string EntryRefCode = visitorEntry.VisitorEntryCode;
                approvalservice.WhatsAppLogSaveOut(
                    tempObj,
                    (int)visitorEntry.CompanyId,
                    (int)visitorEntry.PlantId,
                    (int)visitorEntry.VisitedEmployeeId,
                    FromContact,
                    ToContact,
                    MessageTime,
                    Template,
                    EntryRefCode
                );

                var mail = whatsAppService.SendApprovalReqWhatsApp(jsonString);

                dto.tranStatus.result = true;
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> ShowPass(JObject obj)
        {
            try
            {
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorEntry/";
                string SchemeVehicle =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorEntryVehicle/";
                string SchemeDetail =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorDetail/";

                string type = "ShowPass";
                string VisitorEntryId = obj["VisitorEntryId"].ToObject<string>();
                string VisitorEntryCode = obj["VisitorEntryCode"].ToObject<string>();
                string VisitorTypeId = obj["VisitorTypeId"].ToObject<string>();
                string DetailId = obj["DetailId"].ToObject<string>();
                long CompanyId = obj["CompanyId"].ToObject<long>();

                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryId,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode,
                            VisitorTypeId,
                            PlantId = (object)null,
                            VisitorId = (object)null,
                            type,
                            text = (object)null,
                            Scheme,
                            SchemeVehicle,
                            SchemeDetail,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId,
                            RoleId = (object)null,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );

                    dto.VisitorEntryHeader = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.VisitorEntryDetails = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.UpdatedVisitorNameList = (await spcall.ReadAsync<dynamic>()).ToList(); //VisitorNameList
                    dto.VisitorEntryBelongingDetail = (
                        await spcall.ReadAsync<VisitorEntryBelongingDetail>()
                    ).ToList();
                }
                dto.tranStatus.result = true;
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }
    }
}
