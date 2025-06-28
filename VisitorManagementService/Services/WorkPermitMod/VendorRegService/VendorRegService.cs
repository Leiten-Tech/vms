using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

namespace VisitorManagementMySQL.Services.WorkPermitMod.VendorRegService
{
    public class VendorRegService : IVendorRegService
    {
        private readonly IMailService mailService;
        private readonly MailSettings _mailSettings;
        private readonly IWhatsAppService whatsAppService;
        private readonly DbContextHelper dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IDapperContext dapperContext;
        private readonly FileUploadService uploadService;
        private readonly IApprovalWorkFlow approvalservice;
        private VendorRegDTO dto;

        public VendorRegService(
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
            dto = new VendorRegDTO();
            dto.tranStatus = new ErrorContext();
            dto.tranStatus.result = false;
            dto.tranStatus.lstErrorItem = new List<ErrorItem>();
            _mailSettings = mailSettings.Value;
        }

        public async Task<VendorRegDTO> CreateInitialize(JObject obj)
        {
            try
            {
                long VendorRegId = obj["VendorRegId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                // long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                long UserId = obj["UserId"].ToObject<long>();

                string SchemeCPDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VendorRegCompanyDocs/";
                string SchemeVRDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkerDocs/";
                string type = "CreateInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VENDOR_REG",
                        new
                        {
                            type,
                            PlantId,
                            VendorRegId,
                            CompanyId,
                            SchemeCPDoc,
                            SchemeVRDoc,
                            UserId,
                        }
                    );

                    dto.WorkOrganiser = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.WorkerStatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.VendorStatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.CompanyDocs = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.WorkDocs = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.ApprovalConfig = (await spcall.ReadAsync<ApprovalConfiguration>()).ToList();
                    if (VendorRegId > 0)
                    {
                        dto.VendorRegHeader = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                        dto.VrWorkerDetail = (await spcall.ReadAsync<dynamic>()).ToList();
                        dto.VrWorkerDocDetail = (await spcall.ReadAsync<dynamic>()).ToList();
                        dto.VrCompanyDocDetail = (await spcall.ReadAsync<dynamic>()).ToList();
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

        public async Task<VendorRegDTO> SearchInitialize(JObject obj)
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
                    + "/upload/VendorRegCompanyDocs/";
                string SchemeVRDoc =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/WorkerDocs/";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VENDOR_REG",
                        new
                        {
                            type,
                            PlantId,
                            UserId,
                            VendorRegId = (object)null,
                            CompanyId = (object)null,
                            SchemeCPDoc = (object)null,
                            SchemeVRDoc = (object)null,
                        }
                    );
                    dto.VendorRegList = (await spcall.ReadAsync<dynamic>()).ToList();
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

        public async Task<VendorRegDTO> Create(
            object obj,
            [FromForm] List<IFormFile> companyFiles,
            [FromForm] List<IFormFile> workerFiles
        )
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _VendorRegJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();

                VendorRegistration vendorReg = (VendorRegistration)
                    serializer.Deserialize(
                        new JTokenReader(_VendorRegJSON["VendorReg"]),
                        typeof(VendorRegistration)
                    );
                vendorReg.VrWorkerDetails =
                    (List<VrWorkerDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_VendorRegJSON["VendorRegWorkers"]),
                            typeof(List<VrWorkerDetail>)
                        );
                vendorReg.VrCompanyDocs =
                    (List<VrCompanyDoc>)
                        serializer.Deserialize(
                            new JTokenReader(_VendorRegJSON["VendorRegCompanyDocs"]),
                            typeof(List<VrCompanyDoc>)
                        );
                var vendorName = dbContext
                    .VendorRegistrations.Where(c => c.VendorName == vendorReg.VendorName)
                    .AsNoTracking()
                    .SingleOrDefault();
                if (vendorName != null)
                {
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                "Vendor name\" " + vendorName.VendorName + "\"is already exists.",
                        }
                    );
                    return dto;
                }
                vendorReg.VendorRegCode = await GenerateUniqueCode();

                var returnCompanyDocs = uploadService.UploadFiles(
                    companyFiles,
                    "VendorRegCompanyDocs"
                );
                var returnWorkerDocs = uploadService.UploadFiles(workerFiles, "WorkerDocs");

                dbContext.VendorRegistrations.Add(vendorReg);
                dbContext.SaveChanges();

                var vendorRegUpdated = dbContext
                    .VendorRegistrations.Where(vr => vr.VendorRegCode == vendorReg.VendorRegCode)
                    .AsNoTracking()
                    .SingleOrDefault();
                ApprovalRequest request = new ApprovalRequest();
                request.documentdetailid = vendorRegUpdated.VendorRegId;
                request.documentid = 41;
                request.documentactivityid = 70;
                request.remarks1 = "";
                request.remarks2 = "";
                request.userid = vendorRegUpdated.CreatedBy;
                request.plantid = vendorRegUpdated.PlantId ?? 0;
                request.documentno = vendorRegUpdated.VendorRegCode;
                request.companyid = vendorRegUpdated.CompanyId ?? 0;
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

        public async Task<VendorRegDTO> Update(
            object obj,
            [FromForm] List<IFormFile> companyFiles,
            [FromForm] List<IFormFile> workerFiles
        )
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _VendorRegJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();

                List<VrWorkerDetail> workerdetails = new List<VrWorkerDetail>();
                List<VrCompanyDoc> workerCompanydetails = new List<VrCompanyDoc>();

                VendorRegistration vendorReg = (VendorRegistration)
                    serializer.Deserialize(
                        new JTokenReader(_VendorRegJSON["VendorReg"]),
                        typeof(VendorRegistration)
                    );
                workerdetails =
                    (List<VrWorkerDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_VendorRegJSON["VendorRegWorkers"]),
                            typeof(List<VrWorkerDetail>)
                        );
                workerCompanydetails =
                    (List<VrCompanyDoc>)
                        serializer.Deserialize(
                            new JTokenReader(_VendorRegJSON["VendorRegCompanyDocs"]),
                            typeof(List<VrCompanyDoc>)
                        );
                // VendorRegistration vendorName = dbContext
                //     .VendorRegistrations.Where(c => c.VendorName == vendorReg.VendorName && vendorName.VendorRegId != vendorReg.VendorRegId)
                //     .SingleOrDefault();
                // if (vendorName != null)
                // {
                //     dto.tranStatus.result = false;
                //     dto.tranStatus.lstErrorItem.Add(
                //         new ErrorItem
                //         {
                //             ErrorNo = "VMS000",
                //             Message =
                //                 "Vendor name\" " + vendorName.VendorName + "\"is already exists.",
                //         }
                //     );
                //     return dto;
                // }


                // if (workerdetails.Count > 0)
                // {
                //     List<VrWorkerDetail> wpWorkerDetails = dbContext.VrWorkerDetails.Where(u => u.VendorRegId == vendorReg.VendorRegId).AsNoTracking().ToList();
                //     foreach (var i in wpWorkerDetails)
                //     {
                //         List<VrWorkerDoc> wpWorkerDocs = dbContext.VrWorkerDocs.Where(u => u.VrWorkerDetailId == i.VrWorkerDetailId).AsNoTracking().ToList();
                //         dbContext.VrWorkerDocs.RemoveRange(wpWorkerDocs);
                //     }
                // }
                // if (workerdetails.Count > 0)
                // {
                //     List<VrWorkerDetail> wpWorkerDetails = dbContext.VrWorkerDetails.Where(u => u.VendorRegId == vendorReg.VendorRegId).AsNoTracking().ToList();
                //     foreach (var i in wpWorkerDetails)
                //     {
                //         dbContext.VrWorkerDetails.RemoveRange(wpWorkerDetails);
                //     }
                // }

                if (workerdetails.Count > 0)
                {
                    var wpWorkerDetails = dbContext
                        .VrWorkerDetails.Where(u => u.VendorRegId == vendorReg.VendorRegId)
                        .Include(wd => wd.VrWorkerDocs)
                        .ToList();

                    foreach (var detail in wpWorkerDetails)
                    {
                        dbContext.VrWorkerDocs.RemoveRange(detail.VrWorkerDocs);
                    }

                    dbContext.VrWorkerDetails.RemoveRange(wpWorkerDetails);
                }

                if (workerCompanydetails.Count > 0)
                {
                    List<VrCompanyDoc> wpCompanyDocs = dbContext
                        .VrCompanyDocs.Where(u => u.VendorRegId == vendorReg.VendorRegId)
                        .AsNoTracking()
                        .ToList();
                    dbContext.VrCompanyDocs.RemoveRange(wpCompanyDocs);
                }

                var returnCompanyDocs = uploadService.UploadFiles(
                    companyFiles,
                    "VendorRegCompanyDocs"
                );
                var returnWorkerDocs = uploadService.UploadFiles(workerFiles, "WorkerDocs");

                vendorReg.VrWorkerDetails = workerdetails;
                vendorReg.VrCompanyDocs = workerCompanydetails;

                dbContext.VendorRegistrations.Update(vendorReg);
                dbContext.SaveChanges();

                var vendorRegUpdated = dbContext
                    .VendorRegistrations.Where(vr => vr.VendorRegCode == vendorReg.VendorRegCode)
                    .AsNoTracking()
                    .SingleOrDefault();
                ApprovalRequest request = new ApprovalRequest();
                request.documentdetailid = vendorRegUpdated.VendorRegId;
                request.documentid = 41;
                request.documentactivityid = 71;
                request.remarks1 = "";
                request.remarks2 = "";
                request.userid = vendorRegUpdated.CreatedBy;
                request.plantid = vendorRegUpdated.PlantId ?? 0;
                request.documentno = vendorRegUpdated.VendorRegCode;
                request.companyid = vendorRegUpdated.CompanyId ?? 0;
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

        public async Task<VendorRegDTO> ChangeStatus(JObject obj)
        {
            try
            {
                long VendorRegId = obj["VendorRegId"].ToObject<long>();
                var VendorRegistrations = dbContext
                    .VendorRegistrations.Where(x => x.VendorRegId == VendorRegId)
                    .AsNoTracking()
                    .SingleOrDefault();
                VendorRegistrations.Status = 121;
                dbContext.VendorRegistrations.Update(VendorRegistrations);
                var WorkPermit = dbContext
                    .WorkPermits.Where(x => x.VendorRegId == VendorRegId)
                    .AsNoTracking()
                    .ToList();
                if (WorkPermit != null)
                {
                    foreach (var item in WorkPermit)
                    {
                        item.Status = 121;
                        dbContext.WorkPermits.Update(item);
                    }
                }

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

        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "41";
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
    }
}
