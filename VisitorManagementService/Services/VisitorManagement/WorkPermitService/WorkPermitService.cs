using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Services.ApprovalWorkflow;
using VisitorManagementMySQL.Services.MailService;
using VisitorManagementMySQL.Services.Master.FileUploadService;
using VisitorManagementMySQL.Services.WhatsAppService;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.VisitorManagement.WorkPermitService
{
    public class WorkPermitService : IWorkPermitService
    {
        private readonly IMailService mailService;
        private readonly MailSettings _mailSettings;
        private readonly IWhatsAppService whatsAppService;
        private readonly DbContextHelper dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IDapperContext dapperContext;
        private readonly FileUploadService uploadService;
        private readonly IApprovalWorkFlow approvalservice;
        private WorkPermitDTO dto;

        public WorkPermitService(
            DbContextHelper _dbContext,
            IHttpContextAccessor _httpContextAccessor,
            IDapperContext _dapperContext,
            FileUploadService _uploadService,
            IApprovalWorkFlow _approvalservice,
            IMailService mailService,
            IWhatsAppService whatsAppService,
            IOptions<MailSettings> mailSettings
        )
        {
            dbContext = _dbContext;
            httpContextAccessor = _httpContextAccessor;
            dapperContext = _dapperContext;
            uploadService = _uploadService;
            approvalservice = _approvalservice;
            this.mailService = mailService;
            this.whatsAppService = whatsAppService;
            dto = new WorkPermitDTO();
            dto.tranStatus = new ErrorContext();
            dto.tranStatus.result = false;
            dto.tranStatus.lstErrorItem = new List<ErrorItem>();
            _mailSettings = mailSettings.Value;
        }

        public async Task<WorkPermitDTO> CreateInitialize(JObject obj)
        {
            try
            {
                long WorkPermitId = obj["WorkPermitId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                // long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();

                string SchemeCPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkPermitCompanyDocs/";
                string SchemeWPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkerDocs/";
                string SchemeUserDSign =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/UserDigitalSigns/";
                string type = "CreateInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_WORK_PERMIT",
                        new
                        {
                            type,
                            PlantId,
                            WorkPermitId,
                            CompanyId,
                            SchemeCPDoc,
                            SchemeWPDoc,
                            SchemeVRDoc = (object)null,
                            SchemeUserDSign,
                            UserId = (object)null,
                            text = (object)null,
                            CategoryId = (object)null,
                            VendorId = (object)null,
                            WPWorkerDetailId = (object)null,
                            EntryType = (object)null,
                        }
                    );

                    dto.WorkOrganiser = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.WorkerStatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.WorkDocs = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.Departments = (await spcall.ReadAsync<Department>()).ToList();
                    dto.Categories = (await spcall.ReadAsync<Category>()).ToList();
                    dto.VendorRegs = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.WpApprovalList = (await spcall.ReadAsync<dynamic>()).ToList();
                    if (WorkPermitId > 0)
                    {
                        dto.WorkPermitHeader = (
                            await spcall.ReadAsync<dynamic>()
                        ).SingleOrDefault();
                        dto.WpWorkerDetail = (await spcall.ReadAsync<dynamic>()).ToList();
                        dto.WpWorkerDocDetail = (await spcall.ReadAsync<dynamic>()).ToList();
                        dto.WpCompanyDocDetail = (await spcall.ReadAsync<dynamic>()).ToList();
                        dto.WpCategoryDetail = (await spcall.ReadAsync<dynamic>()).ToList();
                        dto.WpApprovalList = (await spcall.ReadAsync<dynamic>()).ToList();
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

        public async Task<WorkPermitDTO> SearchInitialize(JObject obj)
        {
            try
            {
                long PlantId = (long)obj["PlantId"];
                long UserId = (long)obj["UserId"];
                string type = "SearchInitialize";
                string SchemeCPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkPermitCompanyDocs/";
                string SchemeWPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkerDocs/";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_WORK_PERMIT",
                        new
                        {
                            type,
                            PlantId,
                            UserId,
                            WorkPermitId = (object)null,
                            CompanyId = (object)null,
                            SchemeCPDoc = (object)null,
                            SchemeWPDoc = (object)null,
                            SchemeVRDoc = (object)null,
                            SchemeUserDSign = (object)null,
                            text = (object)null,
                            CategoryId = (object)null,
                            VendorId = (object)null,
                            WPWorkerDetailId = (object)null,
                            EntryType = (object)null,
                        }
                    );
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

        public async Task<WorkPermitDTO> Create(
            object obj,
            [FromForm] List<IFormFile> companyFiles,
            [FromForm] List<IFormFile> workerFiles
        )
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _WorkPermitJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();

                WorkPermit workPermit = (WorkPermit)
                    serializer.Deserialize(
                        new JTokenReader(_WorkPermitJSON["WorkerPermit"]),
                        typeof(WorkPermit)
                    );
                workPermit.WpWorkerDetails =
                    (List<WpWorkerDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_WorkPermitJSON["WorkerPermitWorkers"]),
                            typeof(List<WpWorkerDetail>)
                        );
                workPermit.WpCategoryDetails =
                    (List<WpCategoryDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_WorkPermitJSON["WorkerPermitNature"]),
                            typeof(List<WpCategoryDetail>)
                        );
                workPermit.WpApprovalDetails =
                    (List<WpApprovalDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_WorkPermitJSON["WorkerPermitAppDetail"]),
                            typeof(List<WpApprovalDetail>)
                        );
                workPermit.WpCpMapDetails =
                    (List<WpCpMapDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_WorkPermitJSON["WorkerPermitCpMapDetails"]),
                            typeof(List<WpCpMapDetail>)
                        );

                workPermit.WorkPermitCode = await GenerateUniqueCode();

                // ApprovalRequest request = new ApprovalRequest();
                // // request.documentdetailid = workPermit.WorkPermitId;
                // // request.documentid = 40;
                // // request.remarks1 = "";
                // // request.remarks2 = "";
                // // request.userid = workPermit.CreatedBy;
                // // request.plantid = workPermit.PlantId ?? 0;
                // // request.documentno = workPermit.WorkPermitCode;
                // // request.companyid = workPermit.CompanyId ?? 0;
                // request.companyid = workPermit.CompanyId ?? 0;
                // request.plantid = workPermit.PlantId ?? 0;
                // request.requesterid = null;
                // request.documentno = workPermit.WorkPermitCode;
                // request.documentid = 40;
                // request.documentdetailid = workPermit.WorkPermitId;
                // request.status = null;
                // request.approverid = workPermit.CreatedBy;
                // request.levelid = 67;
                // request.alternateuser = null;
                // request.remarks1 = "";
                // request.remarks2 = "";
                // request.parentid = "";
                // request.userid = workPermit.CreatedBy;
                // request.requestfromdate = null;
                // request.requesttodate = null;
                // // request.Isviewed = false;
                // approvalservice.ApprovalWorkFlowInsert(request);

                // var returnCompanyDocs = uploadService.UploadFiles(
                //     companyFiles,
                //     "WorkPermitCompanyDocs"
                // );
                var returnWorkerDocs = uploadService.UploadFiles(workerFiles, "WorkerDocs");

                dbContext.WorkPermits.Add(workPermit);
                dbContext.SaveChanges();

                var WorkerPermitUpdated = dbContext
                    .WorkPermits.Where(wp => wp.WorkPermitCode == workPermit.WorkPermitCode)
                    .SingleOrDefault();
                ApprovalRequest request = new ApprovalRequest();
                request.documentdetailid = WorkerPermitUpdated.WorkPermitId;
                request.documentid = 42;
                request.documentactivityid = 70;
                request.remarks1 = "";
                request.remarks2 = "";
                request.userid = WorkerPermitUpdated.CreatedBy;
                request.plantid = WorkerPermitUpdated.PlantId ?? 0;
                request.documentno = WorkerPermitUpdated.WorkPermitCode;
                request.companyid = WorkerPermitUpdated.CompanyId ?? 0;
                approvalservice.ApprovalWorkFlowInsert(request);

                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Created Successfully" }
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

        public async Task<WorkPermitDTO> Update(
            object obj,
            [FromForm] List<IFormFile> companyFiles,
            [FromForm] List<IFormFile> workerFiles
        )
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _WorkPermitJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();

                List<WpWorkerDetail> workerDetails = new List<WpWorkerDetail>();
                List<WpCategoryDetail> categoryDetails = new List<WpCategoryDetail>();
                List<WpApprovalDetail> approvalDetails = new List<WpApprovalDetail>();
                List<WpCpMapDetail> cpMapDetails = new List<WpCpMapDetail>();

                WorkPermit workPermit = (WorkPermit)
                    serializer.Deserialize(
                        new JTokenReader(_WorkPermitJSON["WorkerPermit"]),
                        typeof(WorkPermit)
                    );
                workerDetails =
                    (List<WpWorkerDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_WorkPermitJSON["WorkerPermitWorkers"]),
                            typeof(List<WpWorkerDetail>)
                        );
                categoryDetails =
                    (List<WpCategoryDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_WorkPermitJSON["WorkerPermitNature"]),
                            typeof(List<WpCategoryDetail>)
                        );
                approvalDetails =
                    (List<WpApprovalDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_WorkPermitJSON["WorkerPermitAppDetail"]),
                            typeof(List<WpApprovalDetail>)
                        );
                cpMapDetails =
                    (List<WpCpMapDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_WorkPermitJSON["WorkerPermitCpMapDetails"]),
                            typeof(List<WpCpMapDetail>)
                        );

                if (workerDetails.Count > 0)
                {
                    List<WpWorkerDetail> wpWorkerDetails = dbContext
                        .WpWorkerDetails.Where(u => u.WorkPermitId == workPermit.WorkPermitId)
                        .ToList();
                    foreach (var i in wpWorkerDetails)
                    {
                        List<WpWorkerDoc> wpWorkerDocs = dbContext
                            .WpWorkerDocs.Where(u => u.WpWorkerDetailId == i.WpWorkerDetailId)
                            .ToList();
                        dbContext.WpWorkerDocs.RemoveRange(wpWorkerDocs);
                    }
                }
                if (workerDetails.Count > 0)
                {
                    List<WpWorkerDetail> wpWorkerDetails = dbContext
                        .WpWorkerDetails.Where(u => u.WorkPermitId == workPermit.WorkPermitId)
                        .ToList();
                    foreach (var i in wpWorkerDetails)
                    {
                        dbContext.WpWorkerDetails.RemoveRange(wpWorkerDetails);
                    }
                }
                if (categoryDetails.Count > 0)
                {
                    List<WpCategoryDetail> wpCategoryDetails = dbContext
                        .WpCategoryDetails.Where(u => u.WorkPermitId == workPermit.WorkPermitId)
                        .ToList();
                    foreach (var i in wpCategoryDetails)
                    {
                        dbContext.WpCategoryDetails.RemoveRange(wpCategoryDetails);
                    }
                }
                if (cpMapDetails.Count > 0)
                {
                    List<WpCpMapDetail> wpCpMapDetails = dbContext
                        .WpCpMapDetails.Where(u => u.WorkPermitId == workPermit.WorkPermitId)
                        .ToList();
                    foreach (var i in wpCpMapDetails)
                    {
                        dbContext.WpCpMapDetails.RemoveRange(wpCpMapDetails);
                    }
                }
                if (approvalDetails.Count > 0)
                {
                    List<WpApprovalDetail> WpApprovalDetails = dbContext
                        .WpApprovalDetails.Where(u => u.WorkPermitId == workPermit.WorkPermitId)
                        .ToList();
                    dbContext.WpApprovalDetails.RemoveRange(WpApprovalDetails);
                }

                var returnWorkerDocs = uploadService.UploadFiles(workerFiles, "WorkerDocs");

                workPermit.WpWorkerDetails = workerDetails;
                workPermit.WpCategoryDetails = categoryDetails;
                workPermit.WpApprovalDetails = approvalDetails;
                workPermit.WpCpMapDetails = cpMapDetails;

                dbContext.WorkPermits.Update(workPermit);
                dbContext.SaveChanges();

                var WorkerPermitUpdated = dbContext
                    .WorkPermits.Where(wp => wp.WorkPermitCode == workPermit.WorkPermitCode)
                    .SingleOrDefault();
                ApprovalRequest request = new ApprovalRequest();
                request.documentdetailid = WorkerPermitUpdated.WorkPermitId;
                request.documentid = 42;
                request.documentactivityid = 71;
                request.remarks1 = "";
                request.remarks2 = "";
                request.userid = WorkerPermitUpdated.CreatedBy;
                request.plantid = WorkerPermitUpdated.PlantId ?? 0;
                request.documentno = WorkerPermitUpdated.WorkPermitCode;
                request.companyid = WorkerPermitUpdated.CompanyId ?? 0;
                approvalservice.ApprovalWorkFlowInsert(request);

                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Updated Successfully" }
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

        public async Task<WorkPermitDTO> UpdateImage(
            object obj,
            [FromForm] List<IFormFile> workerFiles
        )
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _WorkPermitJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();

                List<WpWorkerDetail> workerDetails = new List<WpWorkerDetail>();
                List<WpCategoryDetail> categoryDetails = new List<WpCategoryDetail>();
                List<WpApprovalDetail> approvalDetails = new List<WpApprovalDetail>();

                WorkPermit workPermit = (WorkPermit)
                    serializer.Deserialize(
                        new JTokenReader(_WorkPermitJSON["WorkerPermit"]),
                        typeof(WorkPermit)
                    );
                workerDetails =
                    (List<WpWorkerDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_WorkPermitJSON["WorkerPermitWorkers"]),
                            typeof(List<WpWorkerDetail>)
                        );

                var returnWorkerDocs = uploadService.UploadFiles(workerFiles, "WorkerDocs");
                workPermit.WpWorkerDetails = workerDetails;

                dbContext.WorkPermits.Update(workPermit);
                dbContext.SaveChanges();

                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Updated Successfully" }
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

        public async Task<WorkPermitDTO> ChangeStatus(JObject obj)
        {
            try
            {
                long WorkPermitId = obj["WorkPermitId"].ToObject<long>();
                var WorkPermits = dbContext
                    .WorkPermits.Where(x => x.WorkPermitId == WorkPermitId)
                    .SingleOrDefault();
                WorkPermits.Status = 121;
                dbContext.WorkPermits.Update(WorkPermits);
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

        public async Task<WorkPermitDTO> FetchCheckPoints(JObject obj)
        {
            try
            {
                string CategoryId = obj["CategoryId"].ToObject<string>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                // long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                long WorkPermitId = obj["WorkPermitId"].ToObject<long>();

                string SchemeCPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkPermitCompanyDocs/";
                string SchemeWPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkerDocs/";
                string type = "FetchCheckPoints";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_WORK_PERMIT",
                        new
                        {
                            type,
                            PlantId,
                            CategoryId,
                            WorkPermitId,
                            CompanyId,
                            SchemeCPDoc,
                            SchemeWPDoc,
                            SchemeVRDoc = (object)null,
                            SchemeUserDSign = (object)null,
                            UserId = (object)null,
                            text = (object)null,
                            VendorId = (object)null,
                            WPWorkerDetailId = (object)null,
                            EntryType = (object)null,
                        }
                    );

                    dto.WpCheckPoints = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "No Vendors Found." }
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

        public async Task<WorkPermitDTO> GetWpPass(JObject obj)
        {
            try
            {
                // string CategoryId = obj["CategoryId"].ToObject<string>();
                long SendType = obj["SendType"].ToObject<long>();
                string MailType = obj["MailType"].ToObject<string>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long WorkPermitId = obj["WorkPermitId"].ToObject<long>();
                long WPWorkerDetailId = obj["WPWorkerDetailId"].ToObject<long>();
                // long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();

                string SchemeCPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkerDocs/";
                string SchemeWPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkerDocs/";
                string type = "GetPass";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_WORK_PERMIT",
                        new
                        {
                            type,
                            PlantId,
                            CategoryId = (object)null,
                            WorkPermitId,
                            CompanyId,
                            SchemeCPDoc,
                            SchemeWPDoc,
                            SchemeVRDoc = (object)null,
                            SchemeUserDSign = (object)null,
                            UserId = (object)null,
                            text = (object)null,
                            VendorId = (object)null,
                            WPWorkerDetailId,
                            EntryType = (object)null,
                        }
                    );

                    dto.WpPassHead = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.WorkPermitHeader = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.WpWorkerDetail = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.WpWorkerDocDetail = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.WpApprovalList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.WpCategoryDetail = (await spcall.ReadAsync<dynamic>()).ToList();
                    string FilePath = "";
                    if (MailType == "true")
                    {
                        FilePath =
                            Directory.GetCurrentDirectory() + "\\Templates\\VisitorPass.html";
                    }
                    else if (MailType == "false")
                    {
                        FilePath = Directory.GetCurrentDirectory() + "\\Templates\\RejectMail.html";
                    }
                    StreamReader str = new StreamReader(FilePath);
                    string MailText = str.ReadToEnd();

                    Company company = new Company();
                    int companyId = (int)dto.WpPassHead.CompanyId;
                    company = dbContext
                        .Companies.Where(x => x.CompanyId == companyId)
                        .SingleOrDefault();
                    dto.tranStatus.result = true;

                    if (SendType == 101)
                    {
                        //mail
                        WorkPermitDTO emailPass = SendPassEmail(
                            new List<dynamic>(),
                            dto.WpPassHead,
                            MailText,
                            MailType,
                            FilePath,
                            company
                        );
                    }
                    else if (SendType == 102)
                    {
                        // whatsapp
                        WorkPermitDTO whatsPass = SendPassWhatsApp(
                            new List<dynamic>(),
                            dto.WpPassHead,
                            MailText,
                            MailType
                        );
                    }
                }
                // dto.tranStatus.lstErrorItem.Add(
                //     new ErrorItem { ErrorNo = "VMS000", Message = "" }
                // );
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

        public async Task<WorkPermitDTO> FetchVendor(JObject obj)
        {
            try
            {
                string text = obj["text"].ToObject<string>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                // long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();

                string SchemeCPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkPermitCompanyDocs/";
                string SchemeWPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkerDocs/";
                string type = "FetchVendor";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_WORK_PERMIT",
                        new
                        {
                            type,
                            PlantId,
                            WorkPermitId = (object)null,
                            CompanyId,
                            SchemeCPDoc,
                            SchemeWPDoc,
                            SchemeUserDSign = (object)null,
                            SchemeVRDoc = (object)null,
                            UserId = (object)null,
                            text,
                            CategoryId = (object)null,
                            VendorId = (object)null,
                            WPWorkerDetailId = (object)null,
                            EntryType = (object)null,
                        }
                    );

                    dto.VendorList = (await spcall.ReadAsync<VendorRegistration>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "No Vendors Found." }
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

        public async Task<WorkPermitDTO> OnChangeVendor(JObject obj)
        {
            try
            {
                long VendorId = obj["VendorId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                // long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                long WorkPermitId = obj["WorkPermitId"].ToObject<long>();
                string SchemeCPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkPermitCompanyDocs/";
                string SchemeWPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkerDocs/";
                string SchemeVRDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkerDocs/";
                string SchemeUserDSign =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/UserDigitalSigns/";
                string type = "OnChangeVendor";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_WORK_PERMIT",
                        new
                        {
                            type,
                            PlantId,
                            WorkPermitId,
                            CompanyId,
                            SchemeCPDoc,
                            SchemeWPDoc,
                            SchemeVRDoc,
                            SchemeUserDSign,
                            UserId = (object)null,
                            text = (object)null,
                            CategoryId = (object)null,
                            VendorId,
                            WPWorkerDetailId = (object)null,
                            EntryType = (object)null,
                        }
                    );

                    dto.WorkPermitHeader = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.WpWorkerDetail = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.WpWorkerDocDetail = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.WpApprovalList = (await spcall.ReadAsync<dynamic>()).ToList();
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

        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "40";
            string series = "45";
            using (dapperContext)
            {
                var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                    spName: "GetPrimaryKey",
                    new { documentid, series }
                );
                documentno = (await spcall.ReadAsync<string>()).SingleOrDefault();
            }
            return documentno;
        }

        public async Task<WorkPermitDTO> FilterWorkPermitCode(JObject obj)
        {
            try
            {
                // long CompanyId = obj["CompanyId"].ToObject<long>();
                // long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                // long WorkPermitId = obj["WorkPermitId"].ToObject<long>();

                string text = obj["text"].ToObject<string>();
                int EntryType = obj["EntryType"].ToObject<int>();

                string SchemeCPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkPermitCompanyDocs/";
                string SchemeWPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkerDocs/";
                string SchemeVRDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkerDocs/";
                string SchemeUserDSign =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/UserDigitalSigns/";

                string type = "FilterWorkPermitCode";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_WORK_PERMIT",
                        new
                        {
                            type,
                            PlantId,
                            WorkPermitId = (object)null,
                            CompanyId = (object)null,
                            SchemeCPDoc,
                            SchemeWPDoc,
                            SchemeVRDoc,
                            SchemeUserDSign,
                            UserId = (object)null,
                            text,
                            CategoryId = (object)null,
                            VendorId = (object)null,
                            WPWorkerDetailId = (object)null,
                            EntryType,
                        }
                    );
                    if (EntryType == 60)
                    {
                        dto.WorkPermitCheckInCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.WorkPermitCheckOutLCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.WorkPermitCheckOutMCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.WorkPermitCheckedInOutCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.WorkPermitAppovalList = (await spcall.ReadAsync<dynamic>()).ToList();
                    }
                    else
                    {
                        dto.WorkPermitCheckInCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.WorkPermitCheckOutLCodeList = (
                            await spcall.ReadAsync<dynamic>()
                        ).ToList();
                        dto.WorkPermitAppovalList = (await spcall.ReadAsync<dynamic>()).ToList();
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

        public async Task<WorkPermitDTO> CheckIn(JObject obj)
        {
            try
            {
                int UserId = obj["UserId"].ToObject<int>();
                string WorkPermitCode = obj["WorkPermitCode"].ToObject<string>();
                long WorkPermitDetailId = obj["WpWorkerDetailId"].ToObject<long>();
                DateTime Checkintime = obj["Checkintime"].ToObject<DateTime>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                // long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string? type = obj["type"].ToObject<string?>();
                WorkPermit WorkPermit = dbContext
                    .WorkPermits.Where(x => x.WorkPermitCode == WorkPermitCode)
                    .SingleOrDefault();
                WpWorkerDetail workerDtl = dbContext
                    .WpWorkerDetails.Where(x => x.WpWorkerDetailId == WorkPermitDetailId)
                    .SingleOrDefault();
                using (var transaction = dbContext.Database.BeginTransaction())
                {
                    if (type == "SelfApproval")
                    {
                        WorkPermit.Status = 75;
                        dbContext.WorkPermits.Update(WorkPermit);
                        dbContext.SaveChanges();
                    }
                    VisitorEntryLog logExists = dbContext
                        .VisitorEntryLogs.Where(l =>
                            l.VisitorEntryCode == WorkPermitCode
                            && l.CheckedIn != null
                            && l.VisitorEntryDetailId == WorkPermitDetailId
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
                                    $"Visitor {workerDtl.WorkerName}-{WorkPermitCode} is Already in Checked-In.",
                            }
                        );
                    }
                    else
                    {
                        log.VisitorEntryLogId = 0;
                        log.VisitorEntryCode = WorkPermitCode;
                        log.VisitorEntryDetailId = WorkPermitDetailId;
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
                    new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message =
                            $"Worker {workerDtl.WorkerName}-{WorkPermitCode} Checked-In Successfully.",
                    }
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

        public async Task<WorkPermitDTO> CheckOut(JObject obj)
        {
            try
            {
                int UserId = obj["UserId"].ToObject<int>();
                string WorkPermitCode = obj["WorkPermitCode"].ToObject<string>();
                long WorkPermitDetailId = obj["WpWorkerDetailId"].ToObject<long>();
                DateTime Checkouttime = obj["Checkouttime"].ToObject<DateTime>();

                var WorkPermit = dbContext
                    .WorkPermits.Where(x => x.WorkPermitCode == WorkPermitCode)
                    .SingleOrDefault();
                WpWorkerDetail workerDtl = dbContext
                    .WpWorkerDetails.Where(x => x.WpWorkerDetailId == WorkPermitDetailId)
                    .SingleOrDefault();
                var veHeader = this
                    .dbContext.VisitorEntryLogs.Where(x =>
                        x.VisitorEntryCode == WorkPermitCode
                        && x.VisitorEntryDetailId == WorkPermitDetailId
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
                                $" Visitor {workerDtl.WorkerName}-{WorkPermitCode} Checked Out Successfully.",
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
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        private WorkPermitDTO SendPassEmail(
            List<dynamic> workPermitDetail,
            dynamic workPermit,
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

            var TokenData = "";
            var resultValue = "";

            TokenData =
                $"{workPermit.CompanyId}_{workPermit.WPWorkerDetailId}_{workPermit.PlantId}_{dto.WpPassHead.WorkPermitCode}_{117}_{dto.WpPassHead.WorkPermitId}";
            resultValue = ApproveTokenService.GenerateToken(TokenData);

            StreamReader str = new StreamReader(FilePath);
            MailText = str.ReadToEnd();

            MailText = MailText
                .Replace("{{PersonName}}", Convert.ToString(workPermit.WorkerName))
                .Replace(
                    "{{PassLink}}",
                    Convert.ToString(
                        _mailSettings.Website + "/home/workpermit?encrypted=" + resultValue
                    )
                )
                .Replace("{{UserName}}", "")
                .Replace("{{RoleName}}", "")
                .Replace("{{serviceURL}}", _mailSettings.Service)
                .Replace("{{siteURL}}", _mailSettings.Website)
                .Replace("{{Logo}}", BrandLogo)
                .Replace("{{BrandLogoBig}}", BrandLogoBig);

            var stringObject = "";
            if (MailType == "true")
            {
                stringObject =
                    $"{workPermit.WorkerName} your Pass for your Visit on {workPermit.WorkPermitDate}";
            }
            else if (MailType == "false")
            {
                stringObject = "Requested Gate Pass Rejected.";
            }
            if (workPermit.MailId == null || workPermit.MailId == "")
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { Message = "No Mail Id Exists." });
            }
            else
            {
                object emailObj = new
                {
                    FromID = "reply-no@visitorManagement.com",
                    ToID = workPermit.MailId,
                    Subject = stringObject,
                    Template = MailText,
                };

                JObject convertObj = (JObject)JToken.FromObject(emailObj);
                var mail = mailService.SendApprovalReqEmail(
                    convertObj,
                    (long)workPermit.CompanyId,
                    company
                );
                dto.tranStatus.result = true;

                dto.tranStatus.lstErrorItem.Add(new ErrorItem { Message = "Mail Sent." });
            }
            return dto;
        }

        private WorkPermitDTO SendPassWhatsApp(
            List<dynamic> workPermitDetail,
            dynamic workPermit,
            string MailText,
            string MailType
        )
        {
            string visitorTypeClass = "";
            string visitorTypeName = "";
            string BrandLogo = "/upload/Logo/app-logo.png";
            string BrandLogoBig = "/upload/Logo/app-logo-big.png";

            dynamic jsonObject = new JObject();
            jsonObject.to_contact = "91" + Convert.ToString(workPermit.MobileNo);
            if (MailType == "true")
            {
                jsonObject.type = "template";

                dynamic template = new JObject();
                template.name = "versuni_pass";
                template.language = "en";

                JArray components = new JArray();
                dynamic bodyComponent = new JObject();

                bodyComponent.type = "body";
                JArray parameters = new JArray();

                dynamic fParam = new JObject();
                dynamic sParam = new JObject();

                fParam.type = "text";

                fParam.text = Convert.ToString(workPermit.WorkerName);
                sParam.type = "text";
                var resultValue = "";
                var TokenData = "";

                TokenData =
                    $"{workPermit.CompanyId}_{workPermit.WPWorkerDetailId}_{workPermit.PlantId}_{dto.WpPassHead.WorkPermitCode}_{117}_{dto.WpPassHead.WorkPermitId}";

                resultValue = ApproveTokenService.GenerateToken(TokenData);
                sParam.text = Convert.ToString(
                    _mailSettings.Website + "/home/workpermit?encrypted=" + resultValue
                );

                parameters.Add(fParam);
                parameters.Add(sParam);

                bodyComponent.parameters = parameters;

                components.Add(bodyComponent);

                template.components = components;
                jsonObject.template = template;
            }
            else if (MailType == "false")
            {
                jsonObject.type = "text";

                dynamic text = new JObject();

                text.body =
                    $"Dear {Convert.ToString(workPermit.WorkerName)},We regret to inform you that your  gate pass request has been rejected.";
                jsonObject.text = text;
            }

            string jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObject);

            Console.WriteLine(jsonString);
            JObject tempObj = new JObject();
            tempObj = jsonObject;
            string FromContact = "917358112529";
            string ToContact = "91" + Convert.ToString(workPermit.MobileNo);
            DateTime MessageTime = DateTime.Now;
            string Template = "ntn_approval";
            WhatsAppLogSaveOut(
                tempObj,
                (int)workPermit.CompanyId,
                (int)workPermit.PlantId,
                (int)workPermit.WorkOrganizer,
                FromContact,
                ToContact,
                MessageTime,
                Template,
                (string)workPermit.WorkPermitCode
            );
            var mail = whatsAppService.SendApprovalReqWhatsApp(jsonString);

            dto.tranStatus.result = true;
            dto.tranStatus.lstErrorItem.Add(new ErrorItem { Message = "WhatsApp Message Sent." });
            return dto;
        }

        public WorkPermitDTO WhatsAppLogSaveOut(
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
            return dto;
        }
    }
}
