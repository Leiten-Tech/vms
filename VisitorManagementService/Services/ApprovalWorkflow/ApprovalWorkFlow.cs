using System;
using System.Collections.Generic;
using System.Data;
// using System.Data.Common;
// using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QRCoder;
using SkiaSharp;
using Svg.Skia;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Services.Common;
using VisitorManagementMySQL.Services.MailService;
using VisitorManagementMySQL.Services.Master.FileUploadService;
using VisitorManagementMySQL.Services.WhatsAppService;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.ApprovalWorkflow
{
    public class ApprovalWorkFlow : IApprovalWorkFlow
    {
        private readonly IMailService mailService;
        private readonly IWhatsAppService whatsAppService;
        private readonly FileUploadService uploadService;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly DbContextHelper dbContext;
        private readonly MailSettings _mailSettings;
        private readonly IConfiguration _Configuration;
        private IWebHostEnvironment _webHostEnvironment;
        private readonly IDapperContext dapperContext;
        private readonly ApprovalWorkFlowDTO dto;
        private readonly ICommonService commonService;

        public ApprovalWorkFlow(
            DbContextHelper _dbContext,
            IDapperContext _dapperContext,
            IHttpContextAccessor _httpContextAccessor,
            IOptions<MailSettings> mailSettings,
            IMailService mailService,
            IWhatsAppService whatsAppService,
            FileUploadService _uploadService,
            IConfiguration Configuration,
            IWebHostEnvironment webHostEnvironment,
            ICommonService _commonService
        )
        {
            dbContext = _dbContext;
            dapperContext = _dapperContext;
            httpContextAccessor = _httpContextAccessor;
            _webHostEnvironment = webHostEnvironment; // has ContentRootPath property
            this.mailService = mailService;
            this.whatsAppService = whatsAppService;
            _mailSettings = mailSettings.Value;
            uploadService = _uploadService;
            _Configuration = Configuration;
            dto = new ApprovalWorkFlowDTO();
            dto.tranStatus = new ErrorContext();
            dto.tranStatus.result = false;
            dto.tranStatus.lstErrorItem = new List<ErrorItem>();
            commonService = _commonService;
        }

        public async Task<object> ApprovalWorkFlowInsert(ApprovalRequest request)
        {
            try
            {
                using (dapperContext)
                {
                    var spCall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_APPROVAL_WORKFLOW_INITIALIZE",
                        new
                        {
                            companyId = request.companyid,
                            plantId = request.plantid,
                            requesterid = request.requesterid,
                            documentno = request.documentno,
                            documentid = request.documentid,
                            documentactivityid = request.documentactivityid,
                            documentdetailid = request.documentdetailid,
                            status = request.status,
                            approverid = request.approverid,
                            levelid = request.levelid,
                            alternateuser = request.alternateuser,
                            remarks1 = request.remarks1,
                            remarks2 = request.remarks2,
                            parentid = request.parentid,
                            userid = request.userid,
                            requestfromdate = request.requestfromdate,
                            requesttodate = request.requesttodate,
                        }
                    );
                    dto.VisitorEntryHeader =
                        (await spCall.ReadFirstOrDefaultAsync<string>()) ?? string.Empty;
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

            // using (var command = dbContext.Database.GetDbConnection().CreateCommand())
            // {
            //     try
            //     {
            //         command.CommandText = "SP_APPROVAL_WORKFLOW_INITIALIZE";
            //         command.CommandType = CommandType.StoredProcedure;
            //         command.Parameters.AddRange(request.GetCommandParams(command).ToArray());
            //         dbContext.Database.OpenConnection();
            //         if (dbContext.Database.CurrentTransaction != null)
            //         {
            //             command.Transaction =
            //                 dbContext.Database.CurrentTransaction.GetDbTransaction();
            //             var dataReader = command.ExecuteReader();
            //             dataReader.Close();
            //         }
            //         else
            //         {
            //             command.Transaction = GetTransaction().GetDbTransaction();
            //             var dataReader = command.ExecuteReader();
            //             dataReader.Close();
            //             command.Transaction.Commit();
            //         }
            //         dbContext.Database.CloseConnection();
            //         dto.tranStatus.result = true;
            //     }
            //     catch (Exception ex)
            //     {
            //         dbContext.Database.CloseConnection();
            //         dto.tranStatus.result = false;
            //         dto.tranStatus.lstErrorItem.Add(
            //             new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
            //         );
            //     }
            // }
            // return dto;
        }

        // Send To Approval Update:
        public async Task<object> ApprovalWorkFlowUpdate(JObject obj)
        {
            ApprovalRequest request = obj["ApprovalRequest"].ToObject<ApprovalRequest>();
            // using (var command = dbContext.Database.GetDbConnection().CreateCommand())
            // {
            try
            {
                VisitorEntry VisEntry = new VisitorEntry();
                Company company = new Company();
                company = dbContext
                    .Companies.Where(x => x.CompanyId == request.companyid)
                    .SingleOrDefault();
                using (dapperContext)
                {
                    var workflowheader = dbContext
                        .ApprovalConfigurations.Where(x =>
                            x.DocumentId == request.documentid
                            && x.PlantId == request.plantid
                            && x.ApprovalActivityId == request.documentactivityid
                            && x.Status == 1
                        )
                        .SingleOrDefault();
                    if (workflowheader != null)
                    {
                        var workflowdetail = dbContext.ApprovalConfigurationDetails.Any(A =>
                            A.ApprovalConfigurationId == workflowheader.ApprovalConfigurationId
                            &&
                            (
                                workflowheader.DocumentId != 34
                                || (A.PrimaryUserId != 0 || A.SecondaryUserId != 0
                                    ? (A.PrimaryUserId == request.userid || A.SecondaryUserId == request.userid)
                                    : true)
                            )
                        );
                        if (workflowdetail == false)
                        {
                            dto.tranStatus.result = false;
                            dto.tranStatus.lstErrorItem.Add(
                                new ErrorItem
                                {
                                    ErrorNo = "VMS000",
                                    Message =
                                        "This Document No : '"
                                        + request.documentno
                                        + "' is not Eligible to Approve from this User",
                                }
                            );
                        }
                    }

                    if (dto.tranStatus.lstErrorItem.Count == 0)
                    {
                        request.Isviewed = 1;

                        // Execute the stored procedure with all parameters
                        var spCall = await dapperContext.ExecuteStoredProcedureAsync(
                            "SP_APPROVAL_WORKFLOW_UPDATE",
                            new
                            {
                                CompanyId = request.companyid,
                                PlantId = request.plantid,
                                RequesterId = request.requesterid,
                                DocumentNo = request.documentno,
                                DocumentId = request.documentid,
                                DocumentActivityId = request.documentactivityid,
                                DocumentDetailId = request.documentdetailid,
                                Status = request.status,
                                ApproverId = request.approverid,
                                LevelId = request.levelid,
                                AlternateUser = request.alternateuser,
                                Remarks1 = request.remarks1,
                                Remarks2 = request.remarks2,
                                ParentId = request.parentid,
                                UserId = request.userid,
                                RequestFromDate = request.requestfromdate,
                                RequestToDate = request.requesttodate,
                                IsViewed = request.Isviewed,
                            }
                        );

                        dto.ConditionExists = (await spCall.ReadFirstOrDefaultAsync<int>());
                        dto.CurrLvlSts = (await spCall.ReadFirstOrDefaultAsync<int>());
                        if (dto.ConditionExists == 1)
                        {
                            dto.ConditionList =
                                (await spCall.ReadFirstOrDefaultAsync<string>()) ?? string.Empty;
                            var tempapprovalDetail = dbContext
                                .ApprovalDetails.Where(x =>
                                    x.DocumentNo == request.documentno
                                    && x.PrimaryUserId == request.approverid
                                )
                                .SingleOrDefault();
                            dto.tranStatus.result = false;
                            if (tempapprovalDetail.Status == 75)
                            {
                                dto.tranStatus.lstErrorItem.Add(
                                    new ErrorItem
                                    {
                                        ErrorNo = "VMS000",
                                        Message =
                                            $"{tempapprovalDetail.DocumentNo} Already in Approved Status",
                                    }
                                );
                            }
                            if (tempapprovalDetail.Status == 76)
                            {
                                dto.tranStatus.result = false;
                                dto.tranStatus.lstErrorItem.Add(
                                    new ErrorItem
                                    {
                                        ErrorNo = "VMS000",
                                        Message =
                                            $"{tempapprovalDetail.DocumentNo} Already in Rejected Status",
                                    }
                                );
                            }
                        }
                        else if (dto.CurrLvlSts == 74)
                        {
                            dto.UpdatedApprovalDetailList = (
                                await spCall.ReadAsync<dynamic>()
                            ).ToList();
                            dto.StatusSP = (await spCall.ReadFirstOrDefaultAsync<int>());
                            dto.NextStageCountSP = (await spCall.ReadFirstOrDefaultAsync<int>());
                            if (dto.StatusSP != 76)
                            {
                                if (dto.NextStageCountSP != 0)
                                {
                                    dto.ApprovalList = (await spCall.ReadAsync<dynamic>()).ToList();
                                    dto.ApprovalDetailList = (
                                        await spCall.ReadAsync<dynamic>()
                                    ).ToList();
                                    dto.NextApprovalDetail = (
                                        await spCall.ReadAsync<ApprovalDetail>()
                                    ).SingleOrDefault();
                                }
                                else
                                {
                                    dto.ApprovalList = (await spCall.ReadAsync<dynamic>()).ToList();
                                    dto.ApprovalDetailList = (
                                        await spCall.ReadAsync<dynamic>()
                                    ).ToList();
                                    dto.NextApprovalDetail = (
                                        await spCall.ReadAsync<ApprovalDetail>()
                                    ).SingleOrDefault();
                                    if (request.documentid == 42)
                                    {
                                        // WorkPermit workPermit = new WorkPermit();
                                        // workPermit = dbContext
                                        //     .WorkPermits.Where(x =>
                                        //         x.VisitorEntryCode == request.documentno
                                        //     )
                                        //     .SingleOrDefault();
                                        // var VisEntryDetail = dbContext
                                        //     .VisitorEntryDetails.Where(x =>
                                        //         x.VisitorEntryId == VisEntry.VisitorEntryId
                                        //     )
                                        //     .ToList();
                                        // VisEntry.VisitorEntryDetails = VisEntryDetail;

                                        // SendPassInternal(VisEntry, "true", company);
                                        // dto.tranStatus.result = true;

                                        // dto.tranStatus.lstErrorItem.Add(
                                        //     new ErrorItem
                                        //     {
                                        //         ErrorNo = "VMS000",
                                        //         Message = "Pass Sent Successfully.",
                                        //     }
                                        // );
                                    }
                                }
                            }

                            // var approvalHeader = dbContext
                            //     .Approvals.Where(x => x.DocumentNo == request.documentno)
                            //     .SingleOrDefault();

                            if (request.documentid == 34 && dto.StatusSP != 76)
                            {
                                VisEntry = dbContext
                                    .VisitorEntries.Where(x =>
                                        x.VisitorEntryCode == request.documentno
                                    )
                                    .SingleOrDefault();
                                var VisEntryDetail = dbContext
                                    .VisitorEntryDetails.Where(x =>
                                        x.VisitorEntryId == VisEntry.VisitorEntryId
                                    )
                                    .ToList();
                                VisEntry.VisitorEntryDetails = VisEntryDetail;

                                if (VisEntry.VisitorTypeId == 36 || VisEntry.VisitorTypeId == 35)
                                {
                                    // if (approvalHeader.Status == 74)
                                    // {
                                    if (
                                        dto.ApprovalDetailList != null
                                        && dto.ApprovalDetailList.Count > 0
                                    )
                                    {
                                        var tempapprovalDetail = dto
                                            .ApprovalDetailList.Where(x =>
                                                x.PrimaryUserId == request.approverid
                                            )
                                            .SingleOrDefault();

                                        if (
                                            tempapprovalDetail != null
                                            && tempapprovalDetail.Status == 75
                                        )
                                        {
                                            if (dto.NextApprovalDetail.Status == 74)
                                            {
                                                // MAIL APPROVAL
                                                var approvedLink = "";

                                                string BrandLogo =
                                                    Directory.GetCurrentDirectory()
                                                    + "\\upload\\Logo\\app-logo.png";
                                                string BrandLogoBig =
                                                    "/upload/Logo/app-logo-big.png";
                                                string FilePath =
                                                    Directory.GetCurrentDirectory()
                                                    + "\\Templates\\VisitorEntryEmailTemplate.html";
                                                StreamReader str = new StreamReader(FilePath);
                                                string MailText = str.ReadToEnd();
                                                Company companyEmailConfig = new Company();
                                                VisitorEntry visitorEntryUpdated =
                                                    new VisitorEntry();
                                                var primeUser = dbContext
                                                    .Users.Where(x =>
                                                        x.UserId
                                                        == dto.NextApprovalDetail.PrimaryUserId
                                                    )
                                                    .SingleOrDefault();
                                                User VisitedEmp = new User();
                                                Role VisitedEmpRole = new Role();
                                                if (VisEntry.VisitorTypeId != 66)
                                                {
                                                    VisitedEmp = dbContext
                                                        .Users.Where(x =>
                                                            x.UserId
                                                            == dto.NextApprovalDetail.PrimaryUserId
                                                        )
                                                        .SingleOrDefault();
                                                    VisitedEmpRole = dbContext
                                                        .Roles.Where(x =>
                                                            x.RoleId == VisitedEmp.DefaultRoleId
                                                        )
                                                        .SingleOrDefault();
                                                }
                                                companyEmailConfig = dbContext
                                                    .Companies.Where(x =>
                                                        x.CompanyId == VisEntry.CompanyId
                                                    )
                                                    .SingleOrDefault();

                                                var approveLink = GenerateMailToken(
                                                    "ENCRYPT",
                                                    "",
                                                    "APPROVE",
                                                    $"{VisEntry.VisitorEntryCode}_{VisEntry.CompanyId}_{VisEntry.PlantId}_{34}_{primeUser.UserId}_75_{VisEntry.VisitorTypeId}_{dto.NextApprovalDetail.LevelId}"
                                                );
                                                var rejectLink = GenerateMailToken(
                                                    "ENCRYPT",
                                                    "",
                                                    "REJECT",
                                                    $"{VisEntry.VisitorEntryCode}_{VisEntry.CompanyId}_{VisEntry.PlantId}_{34}_{primeUser.UserId}_76_{VisEntry.VisitorTypeId}_{dto.NextApprovalDetail.LevelId}"
                                                );

                                                visitorEntryUpdated = VisEntry;
                                                dto.VisitorEntryHeader = visitorEntryUpdated;
                                                var PurposeName = dbContext
                                                    .Metadata.Where(x =>
                                                        x.MetaSubId == VisEntry.PurposeOfVisit
                                                    )
                                                    .SingleOrDefault();
                                                var visitorCompany = VisEntryDetail[0].VisitorCompany;
                                                MailText = MailText
                                                    .Replace(
                                                        "[WhomToVisit]",
                                                        Convert.ToString(VisitedEmp?.UserName)
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
                                                        "[VisitorCompany]",
                                                        Convert.ToString(visitorCompany ?? "-")
                                                    )
                                                    .Replace(
                                                        "[PurposeOfVisit]",
                                                        Convert.ToString(
                                                            PurposeName.MetaSubDescription
                                                        )
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
                                                        "{{serviceURL}}",
                                                        _mailSettings.Service
                                                    )
                                                    .Replace("{{siteURL}}", _mailSettings.Website)
                                                    .Replace("{{Logo}}", BrandLogo)
                                                    .Replace("{{BrandLogoBig}}", BrandLogoBig);
                                                object emailObj = new
                                                {
                                                    FromID = "reply-no@visitorManagement.com",
                                                    ToID = VisitedEmp.UserEmail,
                                                    Subject = $"Pending Approval for Visitor {VisEntry.PersonName} on {VisEntry.ValidFrom.Value.ToLongDateString()} {VisEntry.ValidFrom.Value.ToLongTimeString()} from {Convert.ToString(visitorCompany)} for {PurposeName.MetaSubDescription}",
                                                    Template = MailText,
                                                };

                                                JObject convertObj = (JObject)
                                                    JToken.FromObject(emailObj);
                                                var mail = mailService.SendApprovalReqEmail(
                                                    convertObj,
                                                    (long)dto.VisitorEntryHeader.CompanyId,
                                                    companyEmailConfig
                                                );

                                                var whatsApp = whatsAppService.SendWhatsAppApproval(
                                                        VisEntryDetail,
                                                        dto.VisitorEntryHeader,
                                                        PurposeName,
                                                        visitorCompany,
                                                        VisitedEmp,
                                                        approveLink,
                                                        rejectLink
                                                    );

                                                approvedLink = approveLink.Result;
                                                dto.tranStatus.result = true;

                                                dto.tranStatus.lstErrorItem.Add(
                                                    new ErrorItem
                                                    {
                                                        ErrorNo = "VMS000",
                                                        Message = "Approved Successfully.",
                                                    }
                                                );
                                            }
                                            else if (
                                                VisEntry != null
                                                && dto.NextApprovalDetail.Status == 75
                                            )
                                            {
                                                SendPassInternal(VisEntry, "true", company);

                                                JObject jObject = new JObject(
                                                    new JProperty(
                                                        "UserId",
                                                        VisEntry.VisitedEmployeeId
                                                    ),
                                                    new JProperty(
                                                        "VisitorEntryCode",
                                                        VisEntry.VisitorEntryCode
                                                    ),
                                                    new JProperty(
                                                        "VisitorEntryDetailId",
                                                        VisEntryDetail[0].VisitorEntryDetailId
                                                    ),
                                                    new JProperty("Checkintime", DateTime.Now),
                                                    new JProperty("type", "")
                                                );
                                                if (
                                                    VisEntry.ValidFrom.HasValue
                                                    && VisEntry.ValidFrom.Value.Date
                                                        == DateTime.Today
                                                    && VisEntry.ValidFrom.Value.TimeOfDay
                                                        <= DateTime.Now.TimeOfDay
                                                    && VisEntry.IsInternalAppointment == false
                                                )
                                                {
                                                    await CheckIn(jObject);
                                                }
                                                dto.tranStatus.result = true;

                                                dto.tranStatus.lstErrorItem.Add(
                                                    new ErrorItem
                                                    {
                                                        ErrorNo = "VMS000",
                                                        Message = "Approved Successfully.",
                                                    }
                                                );
                                            }
                                            else if (
                                                VisEntry != null
                                                && dto.NextApprovalDetail.Status == 76
                                            )
                                            {
                                                dto.tranStatus.result = true;
                                                dto.tranStatus.lstErrorItem.Add(
                                                    new ErrorItem
                                                    {
                                                        ErrorNo = "VMS000",
                                                        Message = "Rejected Successfully.",
                                                    }
                                                );
                                            }
                                        }
                                    }
                                    // }
                                    // else if (approvalHeader.Status == 75)
                                    // {
                                    //     dto.tranStatus.result = true;

                                    //     dto.tranStatus.lstErrorItem.Add(
                                    //         new ErrorItem
                                    //         {
                                    //             ErrorNo = "VMS000",
                                    //             Message = "Approved Successfully.",
                                    //         }
                                    //     );
                                    // }
                                    // else if (approvalHeader.Status == 76)
                                    // {
                                    //     dto.tranStatus.result = false;

                                    //     dto.tranStatus.lstErrorItem.Add(
                                    //         new ErrorItem
                                    //         {
                                    //             ErrorNo = "VMS000",
                                    //             Message = "Rejected Successfully.",
                                    //         }
                                    //     );
                                    // }
                                }
                            }
                            else
                            {
                                dto.tranStatus.result = true;
                                if (request.status == 75)
                                {
                                    dto.tranStatus.lstErrorItem.Add(
                                        new ErrorItem
                                        {
                                            ErrorNo = "VMS000",
                                            Message = "Approved Successfully.",
                                        }
                                    );
                                }
                                if (request.status == 76)
                                {
                                    dto.tranStatus.result = true;
                                    dto.tranStatus.lstErrorItem.Add(
                                        new ErrorItem
                                        {
                                            ErrorNo = "VMS000",
                                            Message = "Rejected Successfully.",
                                        }
                                    );
                                }
                            }
                        }
                        else if (dto.CurrLvlSts == 75)
                        {
                            dto.tranStatus.result = false;

                            dto.tranStatus.lstErrorItem.Add(
                                new ErrorItem
                                {
                                    ErrorNo = "VMS000",
                                    Message = $"{request.documentno} Already in Approved Status",
                                }
                            );
                        }
                        else if (dto.CurrLvlSts == 76)
                        {
                            dto.tranStatus.result = false;
                            dto.tranStatus.lstErrorItem.Add(
                                new ErrorItem
                                {
                                    ErrorNo = "VMS000",
                                    Message = $"{request.documentno} Already in Rejected Status",
                                }
                            );
                        }
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
            // }
            return dto;
        }

        public IDbContextTransaction GetTransaction()
        {
            return dbContext.Database.CurrentTransaction ?? dbContext.Database.BeginTransaction();
        }

        public async Task<ApprovalWorkFlowDTO> poppupupdate(JObject obj)
        {
            try
            {
                long UserId = obj["UserId"].ToObject<long>();
                string DocNo = obj["DocNo"].ToObject<string>();
                long ApprovalDetailId = obj["ApprovalDetailId"].ToObject<long>();
                var workflowdetail = dbContext
                    .ApprovalDetails.Where(w =>
                        (w.PrimaryUserId == UserId || w.SecondaryUserId == UserId)
                        && w.IsViewed == false
                        && w.ApprovalDetailId == ApprovalDetailId
                    )
                    .ToList();
                for (int i = 0; i < workflowdetail.Count(); i++)
                {
                    workflowdetail[i].IsViewed = true;
                }
                dbContext.ApprovalDetails.UpdateRange(workflowdetail);
                dbContext.SaveChanges();
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

        public async Task<ApprovalWorkFlowDTO> Popupfetch(JObject obj)
        {
            try
            {
                long UserId = obj["UserId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                string Type = obj["Type"].ToObject<string>();
                string DocumentCode = obj["DocumentCode"].ToObject<string>();

                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_WORKFLOW_POPPUP_FETCH",
                        new
                        {
                            UserId,
                            PlantId,
                            RoleId,
                            Type,
                            DocumentCode,
                        }
                    );
                    dto.workflowpopups = (await spcall.ReadAsync<dynamic>()).ToList();

                    dto.tranStatus.result = true;
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

        public async Task<ApprovalWorkFlowDTO> checkOutTimer(JObject obj)
        {
            try
            {
                long UserId = obj["UserId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                string Type = obj["Type"].ToObject<string>();
                string DocumentCode = obj["DocumentCode"].ToObject<string>();

                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_WORKFLOW_POPPUP_FETCH",
                        new
                        {
                            UserId,
                            PlantId,
                            RoleId,
                            Type,
                            DocumentCode,
                        }
                    );
                    dto.CheckoutTimerList = (await spcall.ReadAsync<dynamic>()).ToList();

                    dto.tranStatus.result = true;
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

        public async Task<ApprovalWorkFlowDTO> UserWorkFlowUpdateAsync(JObject obj)
        {
            try
            {
                ApprovalRequest request = obj["ApprovalRequest"].ToObject<ApprovalRequest>();
                Approval approvalHeader = new Approval();
                if (request.approvalid != null)
                {
                    approvalHeader = dbContext
                        .Approvals.Where(x =>
                            x.DocumentNo == request.documentno && x.ApprovalId == request.approvalid
                        )
                        .SingleOrDefault();
                }
                else
                {
                    approvalHeader = dbContext
                        .Approvals.Where(x => x.DocumentNo == request.documentno)
                        .SingleOrDefault();
                }
                VisitorEntry VisEntry = new VisitorEntry();
                if (request.documentid == 34)
                {
                    VisEntry = dbContext
                        .VisitorEntries.Where(x => x.VisitorEntryCode == request.documentno)
                        .SingleOrDefault();
                    var VisEntryDetail = dbContext
                        .VisitorEntryDetails.Where(x => x.VisitorEntryId == VisEntry.VisitorEntryId)
                        .ToList();
                    VisEntry.VisitorEntryDetails = VisEntryDetail;
                }
                if (approvalHeader.Status == 74)
                {
                    approvalHeader.Status = request.status ?? 0;
                    approvalHeader.ModifiedBy = (int)request.approverid;
                    approvalHeader.ModifiedOn = DateTime.Now;
                    List<ApprovalDetail> approvalDetail = new List<ApprovalDetail>();
                    if (request.approvaldetailid != null)
                    {
                        approvalDetail = dbContext
                            .ApprovalDetails.Where(x =>
                                x.ApprovalId == approvalHeader.ApprovalId
                                && x.ApprovalDetailId == request.approvaldetailid
                            )
                            .ToList();
                    }
                    else
                    {
                        approvalDetail = dbContext
                            .ApprovalDetails.Where(x => x.ApprovalId == approvalHeader.ApprovalId)
                            .ToList();
                    }
                    // var approvalDetailForRemove = dbContext.ApprovalDetails.Where(x => x.ApprovalId == approvalHeader.ApprovalId).ToList();
                    // dbContext.ApprovalDetails.RemoveRange(approvalDetailForRemove);
                    foreach (var item in approvalDetail)
                    {
                        item.Status = request.status ?? 0;
                        item.ModifiedBy = (int)request.approverid;
                        item.ModifiedOn = DateTime.Now;
                        item.IsViewed = true;
                        item.Remarks1 = request.remarks1;
                    }
                    approvalHeader.ApprovalDetails = approvalDetail;
                    dbContext.Approvals.Update(approvalHeader);
                    long? companyid = request.companyid ?? 0;
                    long? plantid = request.plantid ?? 0;
                    int? documentid = request.documentid;
                    string? documentno = request.documentno;
                    int? status = request.status;
                    long? approverid = request.approverid;
                    long? documentdetailid = request.documentdetailid;
                    long? userid = request.userid;
                    using (dapperContext)
                    {
                        var spcall = dapperContext.ExecuteStoredProcedureAsync(
                            spName: "SP_APPROVAL_WORKFLOW_TRANSACTION",
                            new
                            {
                                companyid,
                                plantid,
                                documentid,
                                documentno,
                                status,
                                approverid,
                                documentdetailid,
                                userid,
                            }
                        );
                    }
                    Company company = new Company();
                    company = dbContext
                        .Companies.Where(x => x.CompanyId == companyid)
                        .SingleOrDefault();

                    dbContext.SaveChanges();
                    dto.tranStatus.result = true;
                    if (request.status == 75)
                    {
                        if (request.documentid == 34)
                        {
                            await SendPassInternal(VisEntry, "true", company);
                            var VisEntryDetail = dbContext
                                .VisitorEntryDetails.Where(x =>
                                    x.VisitorEntryId == VisEntry.VisitorEntryId
                                )
                                .ToList();

                            JObject jObject = new JObject(
                                new JProperty("UserId", VisEntry.VisitedEmployeeId),
                                new JProperty("VisitorEntryCode", VisEntry.VisitorEntryCode),
                                new JProperty(
                                    "VisitorEntryDetailId",
                                    VisEntryDetail[0].VisitorEntryDetailId
                                ),
                                new JProperty("Checkintime", DateTime.Now),
                                new JProperty("type", "")
                            );
                            if (
                                VisEntry.ValidFrom.HasValue
                                && VisEntry.ValidFrom.Value.Date == DateTime.Today
                                && VisEntry.ValidFrom.Value.TimeOfDay <= DateTime.Now.TimeOfDay
                                && VisEntry.IsInternalAppointment == false
                            )
                            {
                                await CheckIn(jObject);
                            }
                        }
                        dto.tranStatus.result = true;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem { Message = "Approved Successfully" }
                        );
                    }
                    else if (request.status == 76)
                    {
                        dto.tranStatus.result = true;
                        if (request.documentid == 34)
                        {
                            SendPassInternal(VisEntry, "false", company);
                        }
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem { Message = "Rejected Successfully" }
                        );
                    }
                }
                else
                {
                    dto.tranStatus.result = false;
                    if (approvalHeader.Status == 75)
                    {
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                Message = $"{approvalHeader.DocumentNo} Already in Approved Status",
                            }
                        );
                    }
                    else if (approvalHeader.Status == 76)
                    {
                        dto.tranStatus.result = false;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                Message = $"{approvalHeader.DocumentNo} Already in Rejected Status",
                            }
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

        public async Task<ApprovalWorkFlowDTO> UserWorkFlowUpdateUsingToken(string token)
        {
            try
            {
                var decryptData = await GenerateMailToken("DECRYPT", token, "", "" + "");
                var decryptSplit = decryptData.Split("_");
                var approvalReq = dbContext
                    .Approvals.Where(a => a.DocumentNo == decryptSplit[0])
                    .SingleOrDefault();
                // ApprovalRequest request = JsonConvert.DeserializeObject<ApprovalRequest>(decryptData);

                var approvalHeader = dbContext
                    .Approvals.Where(x => x.DocumentNo == approvalReq.DocumentNo)
                    .SingleOrDefault();
                var VisEntry = dbContext
                    .VisitorEntries.Where(x => x.VisitorEntryCode == decryptSplit[0])
                    .SingleOrDefault();
                var VisEntryDetail = dbContext
                    .VisitorEntryDetails.Where(x => x.VisitorEntryId == VisEntry.VisitorEntryId)
                    .ToList();
                VisEntry.VisitorEntryDetails = VisEntryDetail;
                int reqStatus = int.Parse(decryptSplit[5]);
                if (approvalHeader.Status == 74)
                {
                    approvalHeader.Status = reqStatus;
                    approvalHeader.ModifiedBy = int.Parse(decryptSplit[4]);
                    approvalHeader.ModifiedOn = DateTime.Now;
                    var approvalDetail = dbContext
                        .ApprovalDetails.Where(x => x.ApprovalId == approvalHeader.ApprovalId)
                        .ToList();
                    // var approvalDetailForRemove = dbContext.ApprovalDetails.Where(x => x.ApprovalId == approvalHeader.ApprovalId).ToList();
                    // dbContext.ApprovalDetails.RemoveRange(approvalDetailForRemove);
                    foreach (var item in approvalDetail)
                    {
                        item.Status = reqStatus;
                        item.ModifiedBy = int.Parse(decryptSplit[4]);
                        item.ModifiedOn = DateTime.Now;
                        item.IsViewed = true;
                        item.Remarks1 = "";
                        // item.Remarks1 = request.remarks1;
                    }
                    approvalHeader.ApprovalDetails = approvalDetail;
                    dbContext.Approvals.Update(approvalHeader);
                    long? companyid = int.Parse(decryptSplit[1]);
                    long? plantid = int.Parse(decryptSplit[2]);
                    int? documentid = int.Parse(decryptSplit[3]);
                    string? documentno = approvalReq.DocumentNo;
                    int? status = reqStatus;
                    long? approverid = int.Parse(decryptSplit[4]);
                    long? documentdetailid = null;
                    long? userid = int.Parse(decryptSplit[4]);

                    using (dapperContext)
                    {
                        var spcall = dapperContext.ExecuteStoredProcedureAsync(
                            spName: "SP_APPROVAL_WORKFLOW_TRANSACTION",
                            new
                            {
                                companyid,
                                plantid,
                                documentid,
                                documentno,
                                status,
                                approverid,
                                documentdetailid,
                                userid,
                            }
                        );
                    }
                    Company company = new Company();
                    company = dbContext
                        .Companies.Where(x => x.CompanyId == companyid)
                        .SingleOrDefault();

                    dbContext.SaveChanges();
                    dto.tranStatus.result = true;
                    if (reqStatus == 75)
                    {
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem { Message = "Approved Successfully" }
                        );
                        await SendPassInternal(VisEntry, "true", company);
                        JObject jObject = new JObject(
                            new JProperty("UserId", VisEntry.VisitedEmployeeId),
                            new JProperty("VisitorEntryCode", VisEntry.VisitorEntryCode),
                            new JProperty(
                                "VisitorEntryDetailId",
                                VisEntryDetail[0].VisitorEntryDetailId
                            ),
                            new JProperty("Checkintime", DateTime.Now),
                            new JProperty("type", "")
                        );
                        if (
                            VisEntry.ValidFrom.HasValue
                            && VisEntry.ValidFrom.Value.Date == DateTime.Today
                            && VisEntry.ValidFrom.Value.TimeOfDay <= DateTime.Now.TimeOfDay
                            && VisEntry.IsInternalAppointment == false
                        )
                        {
                            await CheckIn(jObject);
                        }
                    }
                    else if (reqStatus == 76)
                    {
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem { Message = "Rejected Successfully" }
                        );
                        await SendPassInternal(VisEntry, "false", company);
                    }
                }
                else
                {
                    dto.tranStatus.result = false;
                    if (approvalHeader.Status == 75)
                    {
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                Message = $"{approvalHeader.DocumentNo} Already in Approved Status",
                            }
                        );
                    }
                    else if (approvalHeader.Status == 76)
                    {
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                Message = $"{approvalHeader.DocumentNo} Already in Rejected Status",
                            }
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

        public async Task<ApprovalWorkFlowDTO> SendPassInternal(
            VisitorEntry visitorEntry,
            string MailType,
            Company company
        )
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
                string type = "SendPass";
                string FilePath = "";
                if (MailType == "true")
                {
                    FilePath = Directory.GetCurrentDirectory() + "\\Templates\\VisitorPass.html";
                }
                else if (MailType == "false")
                {
                    FilePath = Directory.GetCurrentDirectory() + "\\Templates\\RejectMail.html";
                }
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();

                var VisitorEntryId = visitorEntry.VisitorEntryId;
                var VisitorEntryCode = visitorEntry.VisitorEntryCode;
                var VisitorTypeId = visitorEntry.VisitorTypeId;
                var DetailId = dbContext
                    .VisitorEntryDetails.Where(x => x.VisitorEntryId == VisitorEntryId)
                    .FirstOrDefault()
                    .VisitorEntryDetailId;

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
                            CompanyId = (object)null,
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
                    dto.VisitorEntryDetail = (
                        await spcall.ReadAsync<VisitorEntryDetail>()
                    ).ToList();
                    dto.UpdatedVisitorNameList = (await spcall.ReadAsync<Visitor>()).ToList(); //VisittorNameLis
                    dto.VisitorEntryBelongingDetail = (
                        await spcall.ReadAsync<VisitorEntryBelongingDetail>()
                    ).ToList();
                }

                Company createComp = dbContext
                    .Companies.Where(c => c.CompanyId == visitorEntry.CompanyId)
                    .SingleOrDefault();
                Plant currentPlant = dbContext
                    .Plants.Where(x => x.PlantId == visitorEntry.PlantId)
                    .SingleOrDefault();
                JObject licRes = new JObject();
                string apiresult = "";
                if (
                    createComp.CheckToken == null
                    || createComp.CheckToken == ""
                    || currentPlant.CheckToken == null
                    || currentPlant.CheckToken == ""
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
                    }

                    string companyLocToken = "";
                    JObject resLoc = JObject.Parse(
                        licRes?["transtatus"]?["lstErrorItem"][0]["Response"].ToString()
                    );
                    JArray licenseCompanyLocations = (JArray)resLoc?["LicenseCompanyLocations"];
                    List<object> companyLocTokenss = new List<object>();

                    if (licenseCompanyLocations.Count > 0)
                    {
                        var companyLocTokens = licenseCompanyLocations
                            .Select(loc => loc["CompanyLocToken"]?.ToString())
                            .ToList();
                        if (companyLocTokens.Count > 0)
                        {
                            // Plant currentPlantAct = dbContext
                            //     .Plants.Where(x =>
                            //         companyLocTokens.Contains(x.CheckToken)
                            //         && x.PlantId == visitorEntry.PlantId
                            //     )
                            //     .SingleOrDefault();
                            var currentPlantAct = companyLocTokens.Contains(
                                currentPlant.CheckToken
                            );
                            if (currentPlantAct)
                            {
                                companyLocTokenss = licenseCompanyLocations
                                    .Where(loc =>
                                        loc["CompanyLocToken"]?.ToString()
                                        == currentPlant.CheckToken
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
                            else
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
                        }
                        else
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
                    }

                    foreach (dynamic token in companyLocTokenss)
                    {
                        if (token.IsEmApprovalEnabled == true && _mailSettings.MSend)
                        {
                            ApprovalWorkFlowDTO emailPass = SendPassEmail(
                                dto.VisitorEntryDetail,
                                visitorEntry,
                                MailText,
                                MailType,
                                FilePath,
                                company
                            );
                        }
                    }
                    foreach (dynamic token in companyLocTokenss)
                    {
                        if (token.IsWaApprovalEnabled == true && _mailSettings.WSend)
                        {
                            ApprovalWorkFlowDTO whatsPass = SendPassWhatsApp(
                                dto.VisitorEntryDetail,
                                visitorEntry,
                                MailText,
                                MailType
                            );
                        }
                    }

                    dto.tranStatus.result = true;
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

        public async Task<ApprovalWorkFlowDTO> SendPass(VisitorEntry visitorEntry, string MailType)
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
                string type = "SendPass";
                string FilePath = "";
                if (MailType == "true")
                {
                    FilePath = Directory.GetCurrentDirectory() + "\\Templates\\VisitorPass.html";
                }
                else if (MailType == "false")
                {
                    FilePath = Directory.GetCurrentDirectory() + "\\Templates\\RejectMail.html";
                }
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();

                var VisitorEntryId = visitorEntry.VisitorEntryId;
                var VisitorEntryCode = visitorEntry.VisitorEntryCode;
                var VisitorTypeId = visitorEntry.VisitorTypeId;
                var DetailId = dbContext
                    .VisitorEntryDetails.Where(x => x.VisitorEntryId == VisitorEntryId)
                    .FirstOrDefault()
                    .VisitorEntryDetailId;
                Company company = new Company();
                company = dbContext
                    .Companies.Where(x => x.CompanyId == visitorEntry.CompanyId)
                    .SingleOrDefault();

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
                            VisitorEntryCode,
                            VisitorTypeId,
                            DetailId,
                        }
                    );

                    dto.VisitorEntryHeader = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.VisitorEntryDetail = (
                        await spcall.ReadAsync<VisitorEntryDetail>()
                    ).ToList();
                    dto.UpdatedVisitorNameList = (await spcall.ReadAsync<Visitor>()).ToList(); //VisittorNameLis
                    dto.VisitorEntryBelongingDetail = (
                        await spcall.ReadAsync<VisitorEntryBelongingDetail>()
                    ).ToList();
                }
                Company createComp = dbContext
                    .Companies.Where(c => c.CompanyId == visitorEntry.CompanyId)
                    .SingleOrDefault();
                Plant currentPlant = dbContext
                    .Plants.Where(x => x.PlantId == visitorEntry.PlantId)
                    .SingleOrDefault();
                JObject licRes = new JObject();

                string apiresult = "";
                if (
                    createComp.CheckToken == null
                    || createComp.CheckToken == ""
                    || currentPlant.CheckToken == null
                    || currentPlant.CheckToken == ""
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
                    }

                    string companyLocToken = "";
                    JObject resLoc = JObject.Parse(
                        licRes?["transtatus"]?["lstErrorItem"][0]["Response"].ToString()
                    );
                    JArray licenseCompanyLocations = (JArray)resLoc?["LicenseCompanyLocations"];
                    List<object> companyLocTokenss = new List<object>();

                    if (licenseCompanyLocations.Count > 0)
                    {
                        var companyLocTokens = licenseCompanyLocations
                            .Select(loc => loc["CompanyLocToken"]?.ToString())
                            .ToList();

                        Plant currentPlantAct = dbContext
                            .Plants.Where(x =>
                                companyLocTokens.Contains(x.CheckToken)
                                && x.PlantId == visitorEntry.PlantId
                            )
                            .SingleOrDefault();

                        companyLocTokenss = licenseCompanyLocations
                            .Where(loc =>
                                loc["CompanyLocToken"]?.ToString() == currentPlantAct.CheckToken
                            )
                            .Select(loc => new
                            {
                                CompanyLocToken = loc["CompanyLocToken"]?.ToString(),
                                IsWaApprovalEnabled = loc["IsWaApprovalEnabled"]?.ToObject<bool>()
                                    ?? false,
                                IsEmApprovalEnabled = loc["IsEmApprovalEnabled"]?.ToObject<bool>()
                                    ?? false,
                            })
                            .ToList<object>();
                        Console.WriteLine(companyLocTokenss);
                    }
                    else
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
                    foreach (dynamic token in companyLocTokenss)
                    {
                        if (token.IsEmApprovalEnabled == true && _mailSettings.MSend)
                        {
                            ApprovalWorkFlowDTO emailPass = SendPassEmail(
                                dto.VisitorEntryDetail,
                                visitorEntry,
                                MailText,
                                MailType,
                                FilePath,
                                company
                            );
                        }
                    }
                    foreach (dynamic token in companyLocTokenss)
                    {
                        if (token.IsWaApprovalEnabled == true && _mailSettings.WSend)
                        {
                            ApprovalWorkFlowDTO whatsPass = SendPassWhatsApp(
                                dto.VisitorEntryDetail,
                                visitorEntry,
                                MailText,
                                MailType
                            );
                        }
                    }
                    dto.tranStatus.result = true;
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
                TokenData =
                    $"{visitorEntry.CompanyId}_{item.VisitorEntryDetailId}_{visitorEntry.PlantId}_{dto.VisitorEntryHeader.VisitorEntryCodeHeader}_{dto.VisitorEntryHeader.VisitorTypeId}_{dto.VisitorEntryHeader.VisitorEntryId}";
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
                    .Replace("{{UserName}}", Convert.ToString(dto.VisitorEntryHeader.UserName))
                    .Replace("{{RoleName}}", Convert.ToString(dto.VisitorEntryHeader.RoleName))
                    .Replace("{{serviceURL}}", _mailSettings.Service)
                    .Replace("{{siteURL}}", _mailSettings.Website)
                    .Replace("{{Logo}}", BrandLogo)
                    .Replace("{{BrandLogoBig}}", BrandLogoBig);

                var stringObject = "";
                if (MailType == "true")
                {
                    stringObject =
                        $"{item.FirstName + " " + item.LastName} your Pass for your Visit on {dto.VisitorEntryHeader.VisitorEntryDate}";
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
                    (long)dto.VisitorEntryHeader.CompanyId,
                    company
                );
            }

            dto.tranStatus.result = true;
            return dto;
        }

        private ApprovalWorkFlowDTO SendPassWhatsApp(
            List<VisitorEntryDetail> visitorEntryDetail,
            VisitorEntry visitorEntry,
            string MailText,
            string MailType
        )
        {
            string visitorTypeClass = "";
            string visitorTypeName = "";
            string BrandLogo = "/upload/Logo/app-logo.png";
            string BrandLogoBig = "/upload/Logo/app-logo-big.png";

            foreach (var item in visitorEntryDetail)
            {
                dynamic jsonObject = new JObject();
                jsonObject.to_contact = "91" + Convert.ToString(item.MobileNo);
                if (MailType == "true")
                {
                    jsonObject.type = "template";

                    dynamic template = new JObject();
                    template.name = "visitor_pass_redirect_template";
                    template.language = "en";

                    JArray components = new JArray();
                    dynamic bodyComponent = new JObject();

                    bodyComponent.type = "body";
                    JArray parameters = new JArray();

                    dynamic fParam = new JObject();
                    dynamic sParam = new JObject();

                    fParam.type = "text";
                    // foreach (var item in visitorEntryDetail)
                    // {
                    fParam.text = Convert.ToString(item.FirstName);
                    // }
                    sParam.type = "text";
                    var resultValue = "";
                    var TokenData = "";
                    // foreach (var item in visitorEntryDetail)
                    // {
                    TokenData =
                        $"{visitorEntry.CompanyId}_{item.VisitorEntryDetailId}_{visitorEntry.PlantId}_{dto.VisitorEntryHeader.VisitorEntryCodeHeader}_{dto.VisitorEntryHeader.VisitorTypeId}_{dto.VisitorEntryHeader.VisitorEntryId}";
                    // TokenData =   $"/home/print?CompanyId={visitorEntry.CompanyId}&VisitorEntryDetailId={item.VisitorEntryDetailId}&PlantId={visitorEntry.PlantId}&VisitorEntryCode={dto.VisitorEntryHeader.VisitorEntryCode}&VisitorTypeId={dto.VisitorEntryHeader.VisitorTypeId}&VisitorEntryId={dto.VisitorEntryHeader.VisitorEntryId}";
                    // }
                    resultValue = ApproveTokenService.GenerateToken(TokenData);
                    sParam.text = Convert.ToString(
                        _mailSettings.Website + "/home/print?encrypted=" + resultValue
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
                    // foreach (var item in visitorEntryDetail)
                    // {
                    text.body =
                        $"Dear {Convert.ToString(item.FirstName)},We regret to inform you that your  gate pass request has been rejected.";
                    // }
                    jsonObject.text = text;
                }

                string jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObject);

                Console.WriteLine(jsonString);
                JObject tempObj = new JObject();
                tempObj = jsonObject;
                string FromContact = "917358112529";
                string ToContact = "91" + Convert.ToString(item.MobileNo);
                DateTime MessageTime = DateTime.Now;
                string Template = "ntn_approval";
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
            dto.tranStatus.result = true;
            // dto.tranStatus.lstErrorItem.Add(new ErrorItem
            // {
            //     ErrorNo = "VMS000",
            //     Message = ""
            // });
            return dto;
        }

        private string GenerateSvgQRCode(string data, string folder)
        {
            try
            {
                var decryptSplit = data.Split(":");
                IConfigurationSection section = _Configuration.GetSection("paths");
                string str = section.Value;
                var webRootPath = _webHostEnvironment.ContentRootPath + str + "\\" + folder;
                string fileName = GenerateRandomFileName(decryptSplit[0]);
                string qrCodeAsPng = "";

                if (!Directory.Exists(webRootPath))
                    Directory.CreateDirectory(webRootPath);

                var filePath = Path.Combine(webRootPath, fileName);

                // Generate QR code as PNG
                QRCodeGenerator qrGenerator = new QRCodeGenerator();
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
                QRCode qrCode = new QRCode(qrCodeData);
                Bitmap qrCodeAsBitmap = qrCode.GetGraphic(20);

                // Save the QR code as a PNG file
                filePath = Path.ChangeExtension(filePath, "png");
                qrCodeAsBitmap.Save(filePath, ImageFormat.Png);

                // Dispose of the Bitmap to release resources
                qrCodeAsBitmap.Dispose();

                return fileName;
            }
            catch (Exception ex)
            {
                throw new Exception("Error generating SVG QR code.", ex);
            }
        }

        static string GenerateRandomFileName(string visitorEntryCode)
        {
            // string randomString = Path.GetRandomFileName().Replace(".", "").Substring(0, 8);

            string timeStamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");

            string fileName = $"{visitorEntryCode}_{timeStamp}.png";

            return fileName;
        }

        public ApprovalWorkFlowDTO EncryptData(string value)
        {
            var resultValue = ApproveTokenService.GenerateToken(value);
            dto.VisitorEntryHeader = resultValue;

            dto.tranStatus.result = true;
            dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            return dto;
        }

        public ApprovalWorkFlowDTO DecryptData(string token)
        {
            var resultValue = ApproveTokenService.DecryptToken(token);
            dto.VisitorEntryHeader = resultValue;

            dto.tranStatus.result = true;
            dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            return dto;
        }

        public ApprovalWorkFlowDTO DSendPass(string token)
        {
            var resultValue = ApproveTokenService.DecryptToken(token);
            dto.VisitorEntryHeader = resultValue;

            dto.tranStatus.result = true;
            dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            return dto;
            // var resultValue = ApproveTokenService.DecryptToken(token);
            // var VisEntry = dbContext
            //     .VisitorEntries.Where(x => x.VisitorEntryCode == (string)resultValue[0])
            //     .SingleOrDefault();
            // dto.VisitorEntryHeader = resultValue;

            // var resultValue = ApproveTokenService.DecryptToken(token).ToCharArray();
            // int underscoreIndex = Array.IndexOf(resultValue, '_');

            // string comparisonValue;
            // if (underscoreIndex > 0)
            // {
            //     comparisonValue = new string(resultValue, 0, underscoreIndex);
            // }
            // else
            // {
            //     comparisonValue = new string(resultValue);
            // }
            // var visEntry = dbContext.VisitorEntries.SingleOrDefault(x =>
            //     x.VisitorEntryCode == comparisonValue
            // );
            // var approvalDetail = dbContext
            //     .ApprovalDetails.Where(x => x.DocumentNo == comparisonValue)
            //     .ToList();
            // var lastApprovalDetail = approvalDetail.Last();
            // if (visEntry != null && resultValue.Length > 0)
            // {
            //     List<char> resultList = resultValue.ToList();

            //     resultList.Add('_');
            //     resultList.AddRange(visEntry.VisitorTypeId.ToString().ToCharArray());
            //     resultList.Add('_');
            //     resultList.AddRange(lastApprovalDetail.LevelId.ToString().ToCharArray());
            //     dto.VisitorEntryHeader = new string(resultList.ToArray());
            // }
            // else
            // {
            //     // Handle case where visEntry is null if needed
            //     dto.VisitorEntryHeader = new string(resultValue);
            // }

            // dto.tranStatus.result = true;
            // dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            // return dto;
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
            return dto;
        }

        public async Task<ApprovalWorkFlowDTO> CheckIn(JObject obj)
        {
            try
            {
                int UserId = obj["UserId"].ToObject<int>();
                string VisitorEntryCode = obj["VisitorEntryCode"].ToObject<string>();
                long VisitorEntryDetailId = obj["VisitorEntryDetailId"].ToObject<long>();
                DateTime Checkintime = obj["Checkintime"].ToObject<DateTime>();
                string? type = obj["type"].ToObject<string?>();
                var VisEntry = dbContext
                    .VisitorEntries.Where(x => x.VisitorEntryCode == VisitorEntryCode)
                    .SingleOrDefault();
                using (var transaction = dbContext.Database.BeginTransaction())
                {
                    if (type == "SelfApproval")
                    {
                        VisEntry.Status = 75;
                        dbContext.VisitorEntries.Update(VisEntry);
                        dbContext.SaveChanges();
                    }
                    VisitorEntryLog log = new VisitorEntryLog();
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
