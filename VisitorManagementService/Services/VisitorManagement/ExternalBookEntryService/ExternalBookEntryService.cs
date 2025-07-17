using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
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

namespace VisitorManagementMySQL.Services.VisitorManagement.ExternalBookEntryService
{
    public class ExternalBookEntryService : IExternalBookEntryService
    {
        private readonly IMailService mailService;
        private readonly ICommonService commonService;
        private readonly MailSettings _mailSettings;
        private readonly IWhatsAppService whatsAppService;
        private readonly DbContextHelper dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IDapperContext dapperContext;
        private readonly FileUploadService uploadService;
        private readonly IApprovalWorkFlow approvalservice; 
        private VisitorEntryDTO dto;
         private readonly ApprovalWorkFlowDTO approvaldto;

        public ExternalBookEntryService(
            DbContextHelper _dbContext,
            IHttpContextAccessor _httpContextAccessor,
            IDapperContext _dapperContext,
            FileUploadService _uploadService,
            IApprovalWorkFlow _approvalservice,
            IMailService mailService,
            IWhatsAppService whatsAppService,
            IOptions<MailSettings> mailSettings,
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
            approvaldto = new ApprovalWorkFlowDTO();
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
                long CompanyId = obj["CompanyId"].ToObject<long>();
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
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            type,
                            VisitorEntryId,
                            Scheme,
                            SchemeVehicle,
                            SchemeDetail,
                            CompanyId,
                            PlantId = (object)null,
                            RoleId,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            VisitorId = (object)null,
                            text = (object)null,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
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
                    dto.DriverList = (await spcall.ReadAsync<dynamic>()).ToList(); //department
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

        public async Task<VisitorEntryDTO> OnEnterMobileNo(JObject obj)
        {
            try
            {
                string MobileNo = obj["MobileNo"].ToObject<string>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();

                string Scheme =
                    $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host.Value.ToString()}/upload/VisitorDigSigns/";

                string Type = "OnEnterMobileNo";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_APPOINT_ENTRY_CI",
                        new
                        {
                            Type,
                            MobileNo,
                            Scheme,
                            CompanyId,
                            PlantId,
                            RoleId,
                        }
                    );

                    dto.VisitorEntryHeader = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
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
                            PartyType,
                            type,
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId = (object)null,
                            VisitorId = (object)null,
                            text = (object)null,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType = (object)null,
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
                            VisitorTypeId,
                            Scheme,
                            type,
                            CompanyId,
                            RoleId,
                            VisitorEntryId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorEntryCode = (object)null,
                            PlantId = (object)null,
                            VisitorId = (object)null,
                            text = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            VehicleData = (object)null,
                            DeptId = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.VisitorNameList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.VehicleList = (await spcall.ReadAsync<dynamic>()).ToList();
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
                string VisitorDetailIds = obj["VisitorDetailIds"].ToObject<string>();
                long VisitorId = obj["VisitorId"].ToObject<long>();
                long Detail = obj["Detail"].ToObject<long>();
                // List<int> VisitorId = obj["VisitorId"].ToObject<List<int>>();
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
                string type = null;
                if (Detail == 0)
                {
                    type = "OnChangeVisitor";
                }
                else if (Detail == 1)
                {
                    type = "OnChangeMultiVisitor";
                }
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorTypeId,
                            VisitorId,
                            Scheme,
                            SchemeDetail,
                            type,
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds,
                            VisitorEntryCode = (object)null,
                            PlantId = (object)null,
                            text = (object)null,
                            SchemeVehicle = (object)null,
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

        public async Task<VisitorEntryDTO> FilterVehicleNo(JObject obj)
        {
            try
            {
                string text = obj["text"].ToObject<string>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorEntry/";
                string type = "FilterVehicleNo";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            text,
                            Scheme,
                            type,
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId,
                            VisitorId = (object)null,
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
                    dto.VehicleNoList = (await spcall.ReadAsync<dynamic>()).ToList();
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

        public async Task<VisitorEntryDTO> FilterDriver(JObject obj)
        {
            try
            {
                string text = obj["text"].ToObject<string>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorEntry/";
                string type = "FilterDriver";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            text,
                            Scheme,
                            type,
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId,
                            VisitorId = (object)null,
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
                    dto.DriverList = (await spcall.ReadAsync<dynamic>()).ToList();
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
                            text,
                            Scheme,
                            type,
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId = (object)null,
                            VisitorId = (object)null,
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
            IFormFile digSign,
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
                                    licRes?["transtatus"]?["lstErrorItem"][0]?["Title"]?.ToString()
                                    ?? "Error Occurred",
                                Message =
                                    licRes?["transtatus"]?["lstErrorItem"][0]["Message"]?.ToString()
                                    ?? "An unknown error occurred. Please contact support.",
                            }
                        );
                        return dto;
                    }
                    else
                    {
                        apiresult = licRes.ToString();

                        string companyLocToken = "";
                        JObject resLoc = JObject.Parse(
                            licRes?["transtatus"]?["lstErrorItem"][0]["Response"].ToString()
                        );
                        JArray licenseCompanyLocations = (JArray)resLoc?["LicenseCompanyLocations"];
                        List<object> companyLocTokenss = new List<object>();

                        var blackListedVisitor = false;
                        var approvedLink = "";
                        string BrandLogo =
                            Directory.GetCurrentDirectory() + "\\upload\\Logo\\app-logo.png";
                        string BrandLogoBig = "/upload/Logo/app-logo-big.png";

                        using (var transaction = dbContext.Database.BeginTransaction())
                        {
                            VisitorEntry visitorEntryUpdated = new VisitorEntry();
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
                            // VisitorEntry.VisitorEntryMaterialDetails = (List<VisitorEntryMaterialDetail>)serializer.Deserialize(new JTokenReader(_EmployeeJSON["VisitorEntryMaterialDetail"]), typeof(List<VisitorEntryMaterialDetail>));
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

                            VisitorEntry.VisitorEntryAtvDetails =
                                (List<VisitorEntryAtvDetail>)
                                    serializer.Deserialize(
                                        new JTokenReader(_EmployeeJSON["VisitorEntryAtvDetail"]),
                                        typeof(List<VisitorEntryAtvDetail>)
                                    );

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
                                .Users.Where(x => x.UserId == VisitorEntry.VisitedEmployeeId)
                                .SingleOrDefault();
                            if (VisitorEntry.VisitorTypeId != 66)
                            {
                                VisitorEntry.CreatedBy = (int)primeUser.UserId;
                            }
                            else
                            {
                                VisitorEntry.CreatedBy = 0;
                            }

                            Company company = new Company();
                            company = dbContext
                                .Companies.Where(x => x.CompanyId == VisitorEntry.CompanyId)
                                .SingleOrDefault();

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
                            if (digSign != null)
                            {
                                var digSignUploaded = uploadService.UploadFile(
                                    digSign,
                                    "VisitorDigSigns"
                                );
                            }
                            dbContext.VisitorEntries.Add(VisitorEntry);
                            dbContext.SaveChanges();
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
                            var VisitedEmp = dbContext
                                .Users.Where(x => x.UserId == VisEntry.VisitedEmployeeId)
                                .SingleOrDefault();
                            Role VisitedEmpRole = new Role();

                            if (VisitorEntry.VisitorTypeId != 66)
                            {
                                VisitedEmpRole = dbContext
                                    .Roles.Where(x => x.RoleId == VisitedEmp.DefaultRoleId)
                                    .SingleOrDefault();
                            }

                            var blackListVisitorAlreadyExists = dbContext
                                .Visitors.Where(x => x.Status == 2)
                                .ToList();

                            Visitor blackListedVisitors = new Visitor();

                            if (blackListVisitorAlreadyExists.Count > 0)
                            {
                                foreach (var item in blackListVisitorAlreadyExists)
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
                            if (blackListedVisitor)
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
                                        $"You are an BlackListed Visitor {blackListedVisitors.FirstName + " " + blackListedVisitors.LastName}, Your Request on {VisEntry.ValidFrom} can't be Processed. Please Contact the Responsible Person, or whoever you are visiting."
                                    )
                                    // .Replace("{{RejectedContent}}", $"You are an BlackListed Visitor {blackListedVisitors.FirstName + " " + blackListedVisitors.LastName} your Request on {VisEntry.VisitorEntryDate} is can't be Processed. Please Contact the Responsible Person or Whom you are Visiting to Visit.")
                                    .Replace("{{UserName}}", Convert.ToString(VisitedEmp.UserName))
                                    .Replace(
                                        "{{RoleName}}",
                                        Convert.ToString(VisitedEmpRole.RoleName)
                                    )
                                    .Replace("{{serviceURL}}", _mailSettings.Service)
                                    .Replace("{{siteURL}}", _mailSettings.Website)
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

                                JObject convertObj = (JObject)JToken.FromObject(emailObj);
                                var mail = mailService.SendApprovalReqEmail(
                                    convertObj,
                                    (long)dto.VisitorEntryHeader.CompanyId,
                                    company
                                );
                            }
                            else
                            {
                                if (VisitorEntry.IsAppointmentBooking == true)
                                {
                                    // Uncommend Below lines for Approval Configuration Type Of Approval

                                    ApprovalRequest request = new ApprovalRequest();
                                    request.documentdetailid = VisEntry.VisitorEntryId;
                                    request.documentactivityid = 70;
                                    request.documentid = 34;
                                    request.remarks1 = "";
                                    request.remarks2 = "";
                                    request.userid = VisitorEntry.CreatedBy;
                                    request.plantid = VisEntry.PlantId ?? 0;
                                    request.documentno = VisEntry.VisitorEntryCode;
                                    request.companyid = VisEntry.CompanyId ?? 0;
                                    approvalservice.ApprovalWorkFlowInsert(request);

                                    // Whom To Visit Approval

                                    // Approval App = new Approval();
                                    // App.ApprovalId = 0;
                                    // App.PlantId = VisEntry.PlantId ?? 0;
                                    // App.DocumentId = 8;
                                    // App.DocumentNo = VisEntry.VisitorEntryCode;
                                    // App.ApprovalActivityId = 70;
                                    // App.Status = 74;
                                    // App.CreatedBy = (int)primeUser.UserId;
                                    // App.CreatedOn = VisitorEntry.CreatedOn;
                                    ApprovalDetail appdet = new ApprovalDetail();
                                    appdet.ApprovalDetailId = 0;
                                    appdet.ApprovalId = 0;
                                    appdet.DocumentId = 34;
                                    appdet.DocumentNo = VisEntry.VisitorEntryCode;
                                    appdet.LevelId = 67;
                                    appdet.PrimaryUserId = primeUser.UserId;
                                    appdet.Status = 74;
                                    appdet.Remarks1 = "";
                                    appdet.Remarks2 = "";
                                    appdet.CreatedBy = (int)primeUser.UserId;
                                    appdet.CreatedOn = VisitorEntry.CreatedOn;
                                    appdet.IsViewed = false;
                                    // App.ApprovalDetails.Add(appdet);
                                    // dbContext.Approvals.Add(App);
                                    // dbContext.SaveChanges();

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
                                        VisEntry.Status = 2;
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
                                        stringObject =
                                            $"{blackListedVisitors.FirstName + " " + blackListedVisitors.LastName} Visitor Based  {blackListedVisitors.MobileNo} Mobile No is Blacklisted.";
                                        // stringObject = $"You are an BlackListed Visitor {blackListedVisitors.FirstName + " " + blackListedVisitors.LastName} your Request on {dto.VisitorEntryHeader.VisitorEntryDate} is can't be Processed. Please Contact the Responsible Person or Whom you are Visiting to Visit.";
                                        object emailObj = new
                                        {
                                            FromID = "reply-no@visitorManagement.com",
                                            ToID = blackListedVisitors.MailId,
                                            Subject = stringObject,
                                            Template = MailText,
                                        };

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
                                        // var approveLink = GenerateMailToken("ENCRYPT", "", "APPROVE", appdet.DocumentNo + "_" + "APP");
                                        // var rejectLink = GenerateMailToken("ENCRYPT", "", "REJECT", appdet.DocumentNo + "_" + "REJ");

                                        // var approveLink = GenerateMailToken("ENCRYPT", "", "APPROVE", "VIE00341_1_1_8_90048_75");

                                        List<string> namesList = new List<string>();
                                        foreach (var entry in VisEntrydetail)
                                        {
                                            namesList.Add(entry.FirstName);
                                        }
                                        string names = string.Join(", ", namesList);

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

                                            var approveLink = GenerateMailToken(
                                                "ENCRYPT",
                                                "",
                                                "APPROVE",
                                                $"{appdet.DocumentNo}_{VisEntry.CompanyId}_{VisEntry.PlantId}_{appdet.DocumentId}_{workflowdetail.PrimaryUserId}_75_{VisEntry.VisitorTypeId}_67"
                                            );
                                            var rejectLink = GenerateMailToken(
                                                "ENCRYPT",
                                                "",
                                                "REJECT",
                                                $"{appdet.DocumentNo}_{VisEntry.CompanyId}_{VisEntry.PlantId}_{appdet.DocumentId}_{workflowdetail.PrimaryUserId}_76_{VisEntry.VisitorTypeId}_67"
                                            );
                                            var rescheduleLink = GenerateMailToken(
                                                "ENCRYPT",
                                                "",
                                                "RESCHEDULE",
                                                $"{VisEntry.VisitorEntryCode}_{VisEntry.CompanyId}_{VisEntry.PlantId}_{34}_{primeUser.UserId}_145_{VisEntry.VisitorTypeId}_{67}_{VisEntry.VisitorEntryId}_{ApproveSendUser.DefaultRoleId ?? 0}"
                                            );

                                            visitorEntryUpdated = VisEntry;
                                            dto.VisitorEntryHeader = visitorEntryUpdated;
                                            var visitorCompany = VisEntrydetail[0].VisitorCompany;
                                            MailText = MailText
                                                .Replace(
                                                    "[WhomToVisit]",
                                                    Convert.ToString(ApproveSendUser?.UserName)
                                                )
                                                .Replace("[Visitor]", Convert.ToString(names))
                                                .Replace("[approveLevels]", "")
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
                                                .Replace(
                                                    "{{RescheduleLink}}",
                                                    Convert.ToString(rescheduleLink.Result)
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
                                            company = dbContext
                                                .Companies.Where(x =>
                                                    x.CompanyId == VisitorEntry.CompanyId
                                                )
                                                .SingleOrDefault();

                                            JObject convertObj = (JObject)JToken.FromObject(emailObj);

                                            foreach (dynamic token in companyLocTokenss)
                                            {
                                                if (
                                                    token.IsEmApprovalEnabled == true
                                                    && _mailSettings.MSend == true
                                                )
                                                {
                                                    var mail = mailService.SendApprovalReqEmail(
                                                        convertObj,
                                                        (long)dto.VisitorEntryHeader.CompanyId,
                                                        company
                                                    );
                                                }
                                            // }
                                            // foreach (dynamic token in companyLocTokenss)
                                            // {
                                                if (
                                                    token.IsWaApprovalEnabled == true
                                                    && _mailSettings.WSend == true
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
                                                        // rescheduleLink
                                                    );
                                                }
                                            }
                                            approvedLink = approveLink.Result;
                                        }
                                    }
                                }
                                else
                                {
                                    if (VisitorEntry.VisitorTypeId == 35)
                                    {
                                        VisEntry.Status = 74;
                                    }
                                    else
                                    {
                                        VisEntry.Status = 75;
                                    }
                                    dbContext.VisitorEntries.Update(VisEntry);
                                    dbContext.SaveChanges();
                                }
                            }
                            transaction.Commit();
                            Plant isPlantApprove = new Plant();

                            if (VisitorEntry.VisitorTypeId != 66)
                            {
                                isPlantApprove = dbContext
                                    .Plants.Where(x => x.PlantId == VisEntry.PlantId)
                                    .SingleOrDefault();
                                if (isPlantApprove.IsAutomaticApprove == true)
                                {
                                    await approvalservice.UserWorkFlowUpdateUsingToken(
                                        approvedLink
                                    );
                                }
                            }

                            dto.VisitorEntryHeader = VisEntry;
                            dto.VisitorEntryDetail = VisEntrydetail;
                        }
                        dto.tranStatus.result = true;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem { ErrorNo = "VMS000", Message = "Created Successfully." }
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
                string Scheme = "https://vmstestservice.leitenindia.com" + "/upload/VisitorEntry/";
                string SchemeUpload = "https://vmstestservice.leitenindia.com";
                // string Scheme =
                //     httpContextAccessor.HttpContext.Request.Scheme
                //     + "://"
                //     + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                //     + "/upload/VisitorEntry/";
                // string SchemeUpload =
                //     httpContextAccessor.HttpContext.Request.Scheme
                //     + "://"
                //     + httpContextAccessor.HttpContext.Request.Host.Value.ToString();
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
                            // hParam.image.link = Scheme + entry.DocumentUrl;
                            string BrandLogoBig = "/upload/Logo/avatar.png";
                            hParam.image.link = SchemeUpload + BrandLogoBig;
                        }
                    }
                }

                fParam.text = Convert.ToString(VisitedEmp?.UserName);
                List<string> namesList = new List<string>();
                foreach (var entry in visEntrydetail)
                {
                    namesList.Add(entry.FirstName);
                }
                sParam.text = string.Join(", ", namesList);

                // tParam.text = Convert.ToString(visitorEntry.ValidFrom.Date.ToShortDateString() + " " + visitorEntry.ValidFrom.Date.ToShortTimeString());
                tParam.text = Convert.ToString(
                    visitorEntry.ValidFrom.ToShortDateString()
                        + " "
                        + visitorEntry.ValidFrom.ToShortTimeString()
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
                long? PlantId = (long)obj["PlantId"];
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
                            type,
                            Scheme,
                            PlantId,
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            VisitorId = (object)null,
                            text = (object)null,
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
                            // FDate,
                            // TDate
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
            IFormFile digSign,
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
                if (digSign != null)
                {
                    var digSignUploaded = uploadService.UploadFile(digSign, "VisitorDigSigns");
                }
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
                if (VisitorEntry.VisitorEntryCode == null)
                {
                    VisitorEntry.VisitorEntryCode = await GenerateUniqueCode();
                }

                dbContext.VisitorEntries.Update(VisitorEntry);
                dbContext.SaveChanges();
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

        public async Task<VisitorEntryDTO> UpdateImage(
            JObject obj,
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

                var resturnstring = uploadService.UploadFile(webfile, "VisitorEntry");
                var resturnstrings = uploadService.UploadFiles(webfiles, "VisitorEntryDetail");

                dbContext.VisitorEntries.Update(VisitorEntry);
                dbContext.SaveChanges();

                var VisEntryUpdated = dbContext
                    .VisitorEntries.Where(x => x.VisitorEntryId == VisitorEntry.VisitorEntryId)
                    .SingleOrDefault();
                var VisEntrydetailUpdated = dbContext
                    .VisitorEntryDetails.Where(x => x.VisitorEntryId == VisitorEntry.VisitorEntryId)
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
                string type = "CheckinCkeckoutPageLoad";
                long CompanyId = obj["CompanyId"].ToObject<long>();
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new { type }
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
                string? type = obj["type"].ToObject<string?>();
                using (var transaction = dbContext.Database.BeginTransaction())
                {
                    var VisEntry = dbContext
                        .VisitorEntries.Where(x => x.VisitorEntryCode == VisitorEntryCode)
                        .SingleOrDefault();
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
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Checked In Successfully." }
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

        public async Task<VisitorEntryDTO> CheckOut(JObject obj)
        {
            try
            {
                int UserId = obj["UserId"].ToObject<int>();
                string VisitorEntryCode = obj["VisitorEntryCode"].ToObject<string>();
                long VisitorEntryDetailId = obj["VisitorEntryDetailId"].ToObject<long>();
                DateTime Checkouttime = obj["Checkouttime"].ToObject<DateTime>();
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
                        new ErrorItem { ErrorNo = "VMS000", Message = "Checked Out Successfully." }
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
                            text,
                            EntryType,
                            type,
                            PlantId,
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorEntryCode = (object)null,
                            VisitorTypeId = (object)null,
                            VisitorId = (object)null,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
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

        public async Task<VisitorEntryDTO> OnChangeVehicle(JObject obj)
        {
            try
            {
                string VehicleNo = obj["VehicleNo"].ToObject<string>();
                // int EntryType = obj["EntryType"].ToObject<int>();
                string type = "OnChangeVehicleCode";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryCode = (object)null,
                            EntryType = (object)null,
                            type,
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId = (object)null,
                            VisitorId = (object)null,
                            text = (object)null,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
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
                            VehicleNo,
                        }
                    );
                    dto.VehicleList = (await spcall.ReadAsync<dynamic>()).ToList();
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

        public async Task<VisitorEntryDTO> OnChangeVehicleNo(JObject obj)
        {
            try
            {
                string VehicleNo = obj["VehicleNo"].ToObject<string>();
                long VisitorEntryId = obj["VisitorEntryId"].ToObject<long>();
                // int EntryType = obj["EntryType"].ToObject<int>();
                string type = "OnChangeVehicleNo";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryCode = (object)null,
                            EntryType = (object)null,
                            type,
                            VisitorEntryId,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId = (object)null,
                            VisitorId = (object)null,
                            text = (object)null,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
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
                            VehicleNo,
                        }
                    );
                    dto.VisitorEntryHeader = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    if (dto.VisitorEntryHeader != null)
                    {
                        dto.VisitorEntryDetails = (await spcall.ReadAsync<dynamic>())
                            .Where(x => x.VisitorEntryId == dto.VisitorEntryHeader.VisitorEntryId)
                            .ToList();
                    }
                    dto.RefList = (await spcall.ReadAsync<Metadatum>()).ToList();
                }
                dto.tranStatus.result = true;
               
                if (dto.VisitorEntryHeader != null && dto.VisitorEntryHeader.VisitorEntryId > 0 
                    && (dto.VisitorEntryHeader.EntryTime != null && dto.VisitorEntryHeader.ExitTime == null)
                    )
                {
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "Vehicle IN Record Found." }
                    );
                }
                else if (dto.VisitorEntryHeader != null && dto.VisitorEntryHeader.VisitorEntryId > 0 
                    && (dto.VisitorEntryHeader.EntryTime == null && dto.VisitorEntryHeader.ExitTime != null)
                    )
                {
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "Vehicle OUT Record Found." }
                    );
                }
                else if (dto.VisitorEntryHeader != null && dto.VisitorEntryHeader.VisitorEntryId > 0 
                    && (dto.VisitorEntryHeader.EntryTime != null && dto.VisitorEntryHeader.ExitTime != null)
                    )
                {
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "Vehicle IN/ OUT Record Found." }
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

        public async Task<VisitorEntryDTO> OnChangeExistVehicleNo(JObject obj)
        {
            try
            {
                long VisitorEntryId = obj["VisitorEntryId"].ToObject<long>();
                string type = "OnChangeExistVehicleNo";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            VisitorEntryCode = (object)null,
                            EntryType = (object)null,
                            type,
                            VisitorEntryId,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId = (object)null,
                            VisitorId = (object)null,
                            text = (object)null,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
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
                    dto.VisitorEntryHeader = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.VisitorEntryDetails = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.RefList = (await spcall.ReadAsync<Metadatum>()).ToList();
                }
                dto.tranStatus.result = true;
                 if (dto.VisitorEntryHeader != null && dto.VisitorEntryHeader.VisitorEntryId > 0 
                    && (dto.VisitorEntryHeader.EntryTime != null && dto.VisitorEntryHeader.ExitTime == null)
                    )
                {
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "Vehicle IN Record Found." }
                    );
                }
                else if (dto.VisitorEntryHeader != null && dto.VisitorEntryHeader.VisitorEntryId > 0 
                    && (dto.VisitorEntryHeader.EntryTime == null && dto.VisitorEntryHeader.ExitTime != null)
                    )
                {
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "Vehicle OUT Record Found." }
                    );
                }
                else if (dto.VisitorEntryHeader != null && dto.VisitorEntryHeader.VisitorEntryId > 0 
                    && (dto.VisitorEntryHeader.EntryTime != null && dto.VisitorEntryHeader.ExitTime != null)
                    )
                {
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "Vehicle IN/ OUT Record Found." }
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
                            VisitorEntryCode,
                            EntryType,
                            type,
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorTypeId = (object)null,
                            PlantId = (object)null,
                            VisitorId = (object)null,
                            text = (object)null,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
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

        public async Task<VisitorEntryDTO> OnChangePlant(JObject obj)
        {
            try
            {
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "OnChangePlant";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            Type,
                            PlantId,
                            VisitorEntryCode = (object)null,
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorTypeId = (object)null,
                            VisitorId = (object)null,
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
                    dto.OnchangePlantList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.AreaList = (await spcall.ReadAsync<Area>()).ToList();
                }
                dto.tranStatus.result = true;
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorEntryDTO> OnChangeDepartment(JObject obj)
        {
            try
            {
                long DeptId = obj["DeptId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "OnChangeDepartment";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_ENTRY_CI",
                        new
                        {
                            Type,
                            DeptId,
                            PlantId,
                            VisitorEntryCode = (object)null,
                            VisitorEntryId = (object)null,
                            VisitorDetailId = (object)null,
                            VisitorDetailIds = (object)null,
                            VisitorTypeId = (object)null,
                            VisitorId = (object)null,
                            text = (object)null,
                            Scheme = (object)null,
                            SchemeVehicle = (object)null,
                            SchemeDetail = (object)null,
                            EntryType = (object)null,
                            PartyType = (object)null,
                            Visitor_Type_Id = (object)null,
                            CompanyId = (object)null,
                            VehicleData = (object)null,
                            UserId = (object)null,
                            DetailId = (object)null,
                            RoleId = (object)null,
                            WorkPermitId = (object)null,
                            WorkPermitCode = (object)null,
                            VehicleNo = (object)null,
                        }
                    );
                    dto.EmployeeList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
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
                    else if (ApprovalType == "RESCHEDULE")
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


                public async Task<VisitorEntryDTO> GetRescheduleVisList(JObject obj)
        {
            try
            {
                long VisitorEntryId = obj["VisitorEntryId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long? PrimaryUserId = obj?["PrimaryUserId"]?.ToObject<long?>();
                string Type = "GetRescheduleVisList";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_RESCHEDULE_EX",
                        new
                        {
                            Type,
                            VisitorEntryId,
                            CompanyId = (object)null,
                            RoleId = (object)null,
                            PrimaryUserId,
                        }
                    );
                    // dto.reScheduleVisiorList = (await spcall.ReadAsync<dynamic>()).ToList(); 
                    dto.VisitorEntry = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.VisitorEntryDetail = (await spcall.ReadAsync<VisitorEntryDetail>()).ToList();
                }
                dto.tranStatus.result = true;
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }
        public async Task<VisitorEntryDTO> UpdateVisitorEntry(JObject obj)
{
    try
    {
        using (var transaction = dbContext.Database.BeginTransaction())
        {
            JObject _EmployeeJSON = (JObject)obj;
            var serializer = new Newtonsoft.Json.JsonSerializer();

            VisitorEntry VisitorEntry = _EmployeeJSON["VisitorEntry"]
                .ToObject<VisitorEntry>(serializer);

            VisitorEntry.VisitorEntryDetails = _EmployeeJSON["VisitorEntryDetail"]
                .ToObject<List<VisitorEntryDetail>>(serializer);

            User VisitEmp = new User();
            Role VisitedEmpRole = new Role();
            if (VisitorEntry.VisitorTypeId != 66)
            {
                VisitEmp = dbContext.Users.FirstOrDefault(x => x.UserId == VisitorEntry.VisitedEmployeeId);
                VisitedEmpRole = dbContext.Roles.FirstOrDefault(x => x.RoleId == VisitEmp.DefaultRoleId);
            }

            JObject ApprovalRequest = (JObject)obj["ApprovalRequest"];
            string SaveType = obj["SaveType"].ToObject<string>();

            JObject payload = new JObject
            {
                ["ApprovalRequest"] = JObject.FromObject(ApprovalRequest)
            };

            dbContext.VisitorEntries.Update(VisitorEntry);

            if (SaveType == "resc")
            {
                await approvalservice.ApprovalWorkFlowUpdate(payload);
            }

            dbContext.SaveChanges();

            // ⬇️ After saving, call WhatsApp and Email services

            string mailType = "true"; // or "false", based on your condition
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "VisitorPassReschedule.html");

            Company company = dbContext.Companies
                .FirstOrDefault(x => x.CompanyId == VisitorEntry.CompanyId);

            string mailText = System.IO.File.ReadAllText(filePath);

            dto.tranStatus.result = true;
            dto.tranStatus.lstErrorItem.Add(new ErrorItem
            {
                ErrorNo = "VMS000",
                Message = "Visitor Data Updated & Notifications Sent Successfully."
            });

            transaction.Commit();


            ApprovalWorkFlowDTO emailPass = SendPassEmail(
                VisitorEntry.VisitorEntryDetails.ToList(),
                VisitorEntry,
                mailText,
                mailType,
                filePath,
                company
            );

            // 📤 Send WhatsApp
            ApprovalWorkFlowDTO whatsPass = SendPassWhatsApp(
                VisitorEntry.VisitorEntryDetails.ToList(),
                VisitorEntry,
                mailText,
                mailType,
  VisitEmp?.UserName,
                VisitedEmpRole?.RoleName
            );

            // 📧 Send Email


            // ✅ Response
            
        }
    }
    catch (Exception ex)
    {
        dto.tranStatus.result = false;
        dto.tranStatus.lstErrorItem.Add(
            new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
        );
    }

    return dto;
}

private ApprovalWorkFlowDTO SendPassEmail(
            List<VisitorEntryDetail> visitorEntryDetail,
            VisitorEntry visitorEntry,
            string MailText,
            string MailType,
            string FilePath,
            Company company
        )
        {
            string visitorTypeClass = "";
            string visitorTypeName = "";
            string BrandLogo = "/upload/Logo/app-logo.png";
            string BrandLogoBig = "/upload/Logo/app-logo-big.png";

            if (visitorEntry.VisitorTypeId == 35)
            {
                visitorTypeClass = "#61c455";
                visitorTypeName = "Visitor";
            }
            else if (visitorEntry.VisitorTypeId == 36)
            {
                visitorTypeClass = "#3eabeb";
                visitorTypeName = "Contractor";
            }
            else if (visitorEntry.VisitorTypeId == 117)
            {
                visitorTypeClass = "#eba63e";
                visitorTypeName = "WorkPermit";
            }
            foreach (var item in visitorEntryDetail)
            {
                var TokenData = "";
                var resultValue = "";
                // foreach (var itemDtl in visitorEntryDetail)
                // {

                var User = dbContext
                                    .Users.Where(x => x.UserId == visitorEntry.VisitedEmployeeId)
                                    .SingleOrDefault();

                var Role = dbContext
                                    .Roles.Where(x => x.RoleId == User.DefaultRoleId)
                                    .SingleOrDefault();

                TokenData =
                    $"{visitorEntry.CompanyId}_{item.VisitorEntryDetailId}_{visitorEntry.PlantId}_{visitorEntry.VisitorEntryCode}_{visitorEntry.VisitorTypeId}_{visitorEntry.VisitorEntryId}";
                // }
                resultValue = ApproveTokenService.GenerateToken(TokenData);
                StreamReader str = new StreamReader(FilePath);
                MailText = str.ReadToEnd();

                MailText = MailText
                    .Replace(
                        "{{PersonName}}",
                        Convert.ToString(item.FirstName + " " + item.LastName)
                    )
                    .Replace(
                        "{{PassLink}}",
                        Convert.ToString(
                            _mailSettings.Website + "/home/print?encrypted=" + resultValue
                        )
                    )
                    .Replace("{{UserName}}", Convert.ToString(User.UserName))
                    .Replace("{{RoleName}}", Convert.ToString(Role.RoleName))
                    .Replace("{{serviceURL}}", _mailSettings.Service)
                    .Replace("{{siteURL}}", _mailSettings.Website)
                    .Replace("{{Logo}}", BrandLogo)
                    .Replace("{{BrandLogoBig}}", BrandLogoBig);

                var stringObject = "";
                if (MailType == "true")
                {
                    stringObject =
                        $"{item.FirstName + " " + item.LastName} your Pass for your Visit on {visitorEntry.RescheduledDateTime}";
                }
                else if (MailType == "false")
                {
                    stringObject = "Requested Gate Pass Rejected.";
                }
                // var emailVal = ApproveTokenService.DecryptToken(item.MailId);
                object emailObj = new
                {
                    FromID = "reply-no@visitorManagement.com",
                    ToID = item.MailId,
                    Subject = stringObject,
                    Template = MailText,
                };

                // var converter = new CoreHtmlToImage.HtmlConverter();
                // var bytes = converter.FromHtmlString(MailText);
                // File.WriteAllBytes("image.jpg", bytes);


                JObject convertObj = (JObject)JToken.FromObject(emailObj);
                var mail = mailService.SendApprovalReqEmail(
                    convertObj,
                    visitorEntry.CompanyId,
                    company
                );
            }

            dto.tranStatus.result = true;
            return approvaldto;
        }

private ApprovalWorkFlowDTO SendPassWhatsApp(
            List<VisitorEntryDetail> visitorEntryDetail,
            VisitorEntry visitorEntry,
            string MailText,
            string MailType,
            string UserName,
            string RoleName
        )
        {
            string visitorTypeClass = "";
            string visitorTypeName = "";
            string BrandLogo = "/upload/Logo/app-logo.png";
            string BrandLogoBig = "/upload/Logo/app-logo-big.png";

            foreach (var item in visitorEntryDetail)
            {
                
                  string notifyMessage = $"Dear {UserName},\n" +
                        $"Your visit has been ended.";
                                                
                    var whatsJson = new JObject
                    {
                        ["to_contact"] = "91" + item.MobileNo,
                        ["type"] = "text",
                        ["text"] = new JObject { ["body"] = notifyMessage }
                    };

                // string jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(whatsJson);                           
                

                string jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(whatsJson);

                Console.WriteLine(jsonString);
                JObject tempObj = new JObject();
                tempObj = whatsJson;
                string FromContact = "917358112529";
                string ToContact = "91" + Convert.ToString(item.MobileNo);
                DateTime MessageTime = DateTime.Now;
                string Template = "approval_template_vms";
                WhatsAppLogSaveOut(
                    tempObj,
                    (int)visitorEntry.CompanyId,
                    (int)visitorEntry.PlantId,
                    (int)visitorEntry.VisitedEmployeeId,
                    FromContact,
                    ToContact,
                    MessageTime,
                    Template,
                    (string)visitorEntry.VisitorEntryCode
                );
                var mail = whatsAppService.SendApprovalReqWhatsApp(jsonString);
                // if (MailType == "true")
                // {
                //     if (mail != null)
                //     {
                //         dynamic text = new JObject();
                //         jsonObject.to_contact = "91" + Convert.ToString(item.MobileNo);
                //         jsonObject.type = "text";

                //         text.body =
                //             $"Dear {Convert.ToString(workPermit.WorkerName)},We regret to inform you that your  gate pass request has been rejected.";
                //         jsonObject.text = text;
                //     }
                // }
            }
            approvaldto.tranStatus.result = true;
            // dto.tranStatus.lstErrorItem.Add(new ErrorItem
            // {
            //     ErrorNo = "VMS000",
            //     Message = ""
            // });
            return approvaldto;
        }

        public ApprovalWorkFlowDTO WhatsAppLogSaveOut(
            JObject obj,
            int CompanyId,
            int PlantId,
            int UserId,
            string FromContact,
            string ToContact,
            DateTime MessageTime,
            string Template,
            string EntryRefCode
        )
        {
            try
            {
                long messageType = 104;

                Newtonsoft.Json.Linq.JObject _WhatsAppJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();

                WhatsAppLog whatsAppLog = new WhatsAppLog();
                whatsAppLog.WhatsAppLogData = _WhatsAppJSON.ToString();
                whatsAppLog.TemplateId = Template;
                whatsAppLog.SentType = 103;
                whatsAppLog.FromContact = FromContact;
                whatsAppLog.ToContact = ToContact;
                whatsAppLog.MessageType = (int?)messageType;
                whatsAppLog.DeliveryStatus = null;
                whatsAppLog.MessageTime = MessageTime;
                whatsAppLog.RefCode = EntryRefCode;
                whatsAppLog.CompanyId = CompanyId;
                whatsAppLog.PlantId = PlantId;
                whatsAppLog.CreatedBy = UserId;
                whatsAppLog.CreatedOn = DateTime.Now;
                whatsAppLog.ModifiedBy = null;
                whatsAppLog.ModifiedOn = null;
                dbContext.WhatsAppLogs.Add(whatsAppLog);
                dbContext.SaveChanges();

                dto.tranStatus.result = true;
                //     dto.tranStatus.lstErrorItem.Add(
                //        new ErrorItem
                //        {
                //            Message = "Something Went Wrong, Please Try Again."
                //        }
                //    );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return approvaldto;
        }


    }
}
