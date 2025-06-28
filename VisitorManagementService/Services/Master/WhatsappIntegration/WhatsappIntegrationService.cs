using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Services.ApprovalWorkflow;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.Master.WIntegrationService
{
    public class WIntegrationService : IWIntegrationService
    {
        private readonly WIntegrationDTO dto;
        private readonly DbContextHelper dbContext;
        private readonly IDapperContext dapperContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IApprovalWorkFlow approvalWorkflow;

        public WIntegrationService(
            DbContextHelper _dbContextHelper,
            IDapperContext _dapperContext,
            IHttpContextAccessor _httpContextAccessor,
            IApprovalWorkFlow _approvalWorkflow
        )
        {
            dto = new WIntegrationDTO();
            dbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.tranStatus = new ErrorContext();
            dto.tranStatus.lstErrorItem = new List<ErrorItem>();
            httpContextAccessor = _httpContextAccessor;
            approvalWorkflow = _approvalWorkflow;
        }

        public async Task<object> WApproval(JObject obj)
        {
            // JObject custom = obj["custom"].ToObject<JObject>();
            string customString = obj["payload"]["message"]["context"]["custom"].ToObject<string>();

            JObject custom = JObject.Parse(customString);
            string ApproveToken = custom["ApproveToken"].ToObject<string>();
            string RejectToken = custom["RejectToken"].ToObject<string>();
            string buttonClick = obj["payload"]["message"]["button"]["text"].ToObject<string>();
            try
            {
                Newtonsoft.Json.Linq.JObject _WhatsAppJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();

                var decryptData = "";
                if (buttonClick == "Reject")
                {
                    decryptData = await approvalWorkflow.GenerateMailToken(
                        "DECRYPT",
                        RejectToken,
                        "",
                        "" + ""
                    );
                }
                else if (buttonClick == "Approve")
                {
                    decryptData = await approvalWorkflow.GenerateMailToken(
                        "DECRYPT",
                        ApproveToken,
                        "",
                        "" + ""
                    );
                }
                var decryptSplit = decryptData.Split("_");
                var approvalReq = dbContext
                    .Approvals.Where(a => a.DocumentNo == decryptSplit[0])
                    .SingleOrDefault();
                // ApprovalRequest request = JsonConvert.DeserializeObject<ApprovalRequest>(decryptData);
                string FromContact = "917358112529";
                DateTime MessageTime = DateTime.Now;
                string Template = "ntn_approval";
                long messageType = 104;
                string EntryRefCode = decryptSplit[0];
                string ToContact = obj["payload"]["contacts"][0]["to"].ToObject<string>();

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
                whatsAppLog.CompanyId = int.Parse(decryptSplit[1]);
                whatsAppLog.PlantId = int.Parse(decryptSplit[2]);
                whatsAppLog.CreatedBy = int.Parse(decryptSplit[4]);
                whatsAppLog.CreatedOn = DateTime.Now;
                whatsAppLog.ModifiedBy = null;
                whatsAppLog.ModifiedOn = null;
                // whatsAppLog.WhatsAppL ogData = (WhatsAppLog)serializer.Deserialize(new JTokenReader(_WhatsAppJSON), typeof(WhatsAppLog)).ToString();
                dbContext.WhatsAppLogs.Add(whatsAppLog);
                dbContext.SaveChanges();

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
                    // approvalHeader.Status = reqStatus;
                    // approvalHeader.ModifiedBy = int.Parse(decryptSplit[4]);
                    // approvalHeader.ModifiedOn = DateTime.Now;
                    // var approvalDetail = dbContext
                    //     .ApprovalDetails.Where(x => x.ApprovalId == approvalHeader.ApprovalId)
                    //     .ToList();
                    // // var approvalDetailForRemove = dbContext.ApprovalDetails.Where(x => x.ApprovalId == approvalHeader.ApprovalId).ToList();
                    // // dbContext.ApprovalDetails.RemoveRange(approvalDetailForRemove);
                    // foreach (var item in approvalDetail)
                    // {
                    //     item.Status = reqStatus;
                    //     item.ModifiedBy = int.Parse(decryptSplit[4]);
                    //     item.ModifiedOn = DateTime.Now;
                    //     item.IsViewed = true;
                    //     item.Remarks1 = "";
                    //     // item.Remarks1 = request.remarks1;
                    // }
                    // approvalHeader.ApprovalDetails = approvalDetail;
                    // dbContext.Approvals.Update(approvalHeader);

                    long? companyid = int.Parse(decryptSplit[1]);
                    long? plantid = int.Parse(decryptSplit[2]);
                    int? documentid = int.Parse(decryptSplit[3]);
                    string? documentno = approvalReq.DocumentNo;
                    int? status = reqStatus;
                    long? approverid = int.Parse(decryptSplit[4]);
                    long? documentdetailid = null;
                    long? userid = int.Parse(decryptSplit[4]);

                    ApprovalRequest approvalRequest = new ApprovalRequest
                    {
                        companyid = long.Parse(decryptSplit[1]),
                        plantid = long.Parse(decryptSplit[2]),
                        requesterid = null,
                        documentno = approvalReq.DocumentNo,
                        approvalid = (int?)approvalReq.ApprovalId,
                        approvaldetailid = null,
                        documentid = int.Parse(decryptSplit[3]),
                        documentactivityid = 70,
                        documentdetailid = null,
                        remarks1 = "",
                        remarks2 = "",
                        status = reqStatus,
                        approverid = long.Parse(decryptSplit[4]),
                        levelid = int.Parse(decryptSplit[7]),
                        alternateuser = null,
                        parentid = null,
                        userid = long.Parse(decryptSplit[4]),
                        requestfromdate = null,
                        requesttodate = null,
                        Isviewed = 1
                    };

                    JObject jObject = new JObject
                    {
                        ["ApprovalRequest"] = JObject.FromObject(approvalRequest)
                    };
                    await approvalWorkflow.ApprovalWorkFlowUpdate(jObject);

                    dto.tranStatus.result = true;
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
        // public async Task<object> WApproval(JObject obj)
        // {
        //     // JObject custom = obj["custom"].ToObject<JObject>();
        //     string customString = obj["payload"]["message"]["context"]["custom"].ToObject<string>();

        //     JObject custom = JObject.Parse(customString);
        //     string ApproveToken = custom["ApproveToken"].ToObject<string>();
        //     string RejectToken = custom["RejectToken"].ToObject<string>();
        //     string buttonClick = obj["payload"]["message"]["button"]["text"].ToObject<string>();
        //     try
        //     {
        //         Newtonsoft.Json.Linq.JObject _WhatsAppJSON = (Newtonsoft.Json.Linq.JObject)obj;
        //         Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();

        //         var decryptData = "";
        //         if (buttonClick == "Reject")
        //         {
        //             decryptData = await approvalWorkflow.GenerateMailToken(
        //                 "DECRYPT",
        //                 RejectToken,
        //                 "",
        //                 "" + ""
        //             );
        //         }
        //         else if (buttonClick == "Approve")
        //         {
        //             decryptData = await approvalWorkflow.GenerateMailToken(
        //                 "DECRYPT",
        //                 ApproveToken,
        //                 "",
        //                 "" + ""
        //             );
        //         }
        //         var decryptSplit = decryptData.Split("_");
        //         var approvalReq = dbContext
        //             .Approvals.Where(a => a.DocumentNo == decryptSplit[0])
        //             .SingleOrDefault();
        //         // ApprovalRequest request = JsonConvert.DeserializeObject<ApprovalRequest>(decryptData);
        //         string FromContact = "917358112529";
        //         DateTime MessageTime = DateTime.Now;
        //         string Template = "ntn_approval";
        //         long messageType = 104;
        //         string EntryRefCode = decryptSplit[0];
        //         string ToContact = obj["payload"]["contacts"][0]["to"].ToObject<string>();

        //         WhatsAppLog whatsAppLog = new WhatsAppLog();
        //         whatsAppLog.WhatsAppLogData = _WhatsAppJSON.ToString();
        //         whatsAppLog.TemplateId = Template;
        //         whatsAppLog.SentType = 103;
        //         whatsAppLog.FromContact = FromContact;
        //         whatsAppLog.ToContact = ToContact;
        //         whatsAppLog.MessageType = (int?)messageType;
        //         whatsAppLog.DeliveryStatus = null;
        //         whatsAppLog.MessageTime = MessageTime;
        //         whatsAppLog.RefCode = EntryRefCode;
        //         whatsAppLog.CompanyId = int.Parse(decryptSplit[1]);
        //         whatsAppLog.PlantId = int.Parse(decryptSplit[2]);
        //         whatsAppLog.CreatedBy = int.Parse(decryptSplit[4]);
        //         whatsAppLog.CreatedOn = DateTime.Now;
        //         whatsAppLog.ModifiedBy = null;
        //         whatsAppLog.ModifiedOn = null;
        //         // whatsAppLog.WhatsAppL ogData = (WhatsAppLog)serializer.Deserialize(new JTokenReader(_WhatsAppJSON), typeof(WhatsAppLog)).ToString();
        //         dbContext.WhatsAppLogs.Add(whatsAppLog);
        //         dbContext.SaveChanges();

        //         var approvalHeader = dbContext
        //             .Approvals.Where(x => x.DocumentNo == approvalReq.DocumentNo)
        //             .SingleOrDefault();
        //         var VisEntry = dbContext
        //             .VisitorEntries.Where(x => x.VisitorEntryCode == decryptSplit[0])
        //             .SingleOrDefault();
        //         var VisEntryDetail = dbContext
        //             .VisitorEntryDetails.Where(x => x.VisitorEntryId == VisEntry.VisitorEntryId)
        //             .ToList();
        //         VisEntry.VisitorEntryDetails = VisEntryDetail;
        //         int reqStatus = int.Parse(decryptSplit[5]);
        //         if (approvalHeader.Status == 74)
        //         {
        //             approvalHeader.Status = reqStatus;
        //             approvalHeader.ModifiedBy = int.Parse(decryptSplit[4]);
        //             approvalHeader.ModifiedOn = DateTime.Now;
        //             var approvalDetail = dbContext
        //                 .ApprovalDetails.Where(x => x.ApprovalId == approvalHeader.ApprovalId)
        //                 .ToList();
        //             // var approvalDetailForRemove = dbContext.ApprovalDetails.Where(x => x.ApprovalId == approvalHeader.ApprovalId).ToList();
        //             // dbContext.ApprovalDetails.RemoveRange(approvalDetailForRemove);
        //             foreach (var item in approvalDetail)
        //             {
        //                 item.Status = reqStatus;
        //                 item.ModifiedBy = int.Parse(decryptSplit[4]);
        //                 item.ModifiedOn = DateTime.Now;
        //                 item.IsViewed = true;
        //                 item.Remarks1 = "";
        //                 // item.Remarks1 = request.remarks1;
        //             }
        //             approvalHeader.ApprovalDetails = approvalDetail;
        //             dbContext.Approvals.Update(approvalHeader);
        //             long? companyid = int.Parse(decryptSplit[1]);
        //             long? plantid = int.Parse(decryptSplit[2]);
        //             int? documentid = int.Parse(decryptSplit[3]);
        //             string? documentno = approvalReq.DocumentNo;
        //             int? status = reqStatus;
        //             long? approverid = int.Parse(decryptSplit[4]);
        //             long? documentdetailid = null;
        //             long? userid = int.Parse(decryptSplit[4]);
        //             using (dapperContext)
        //             {
        //                 var spcall = dapperContext.ExecuteStoredProcedureAsync(
        //                     spName: "SP_APPROVAL_WORKFLOW_TRANSACTION",
        //                     new
        //                     {
        //                         companyid,
        //                         plantid,
        //                         documentid,
        //                         documentno,
        //                         status,
        //                         approverid,
        //                         documentdetailid,
        //                         userid,
        //                     }
        //                 );
        //             }
        //             Company company = new Company();
        //             company = dbContext
        //                 .Companies.Where(x => x.CompanyId == companyid)
        //                 .SingleOrDefault();

        //             dbContext.SaveChanges();
        //             dto.tranStatus.result = true;
        //             if (reqStatus == 75)
        //             {
        //                 dto.tranStatus.lstErrorItem.Add(
        //                     new ErrorItem { Message = "Approved Successfully" }
        //                 );
        //                 await approvalWorkflow.SendPassInternal(VisEntry, "true", company);
        //                 JObject jObject = new JObject(
        //                     new JProperty("UserId", VisEntry.VisitedEmployeeId),
        //                     new JProperty("VisitorEntryCode", VisEntry.VisitorEntryCode),
        //                     new JProperty(
        //                         "VisitorEntryDetailId",
        //                         VisEntryDetail[0].VisitorEntryDetailId
        //                     ),
        //                     new JProperty("Checkintime", DateTime.Now),
        //                     new JProperty("type", "")
        //                 );
        //                 if (
        //                     VisEntry.ValidFrom.HasValue
        //                     && VisEntry.ValidFrom.Value.Date == DateTime.Today
        //                     && VisEntry.ValidFrom.Value.TimeOfDay <= DateTime.Now.TimeOfDay
        //                     && VisEntry.IsInternalAppointment == false
        //                 )
        //                 {
        //                     await CheckIn(jObject);
        //                 }
        //             }
        //             else if (reqStatus == 76)
        //             {
        //                 dto.tranStatus.lstErrorItem.Add(
        //                     new ErrorItem { Message = "Rejected Successfully" }
        //                 );
        //                 await approvalWorkflow.SendPassInternal(VisEntry, "false", company);
        //             }
        //             dto.tranStatus.result = true;
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         dto.tranStatus.result = false;
        //         dto.tranStatus.lstErrorItem.Add(
        //             new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
        //         );
        //     }
        //     return dto;
        // }

        public WIntegrationDTO WhatsAppLogSave(JObject obj, int CompanyId, int PlantId, int UserId)
        {
            try
            {
                var MessageTypeList = dbContext
                    .Metadata.Where(x => x.MetaTypeCode == "MET")
                    .ToList();
                long messageType = 0;

                foreach (var item in MessageTypeList)
                {
                    if (
                        obj["payload"]["message"]["type"].ToObject<string>()
                        == item.MetaSubDescription.ToLower()
                    )
                    {
                        messageType = item.MetaSubId;
                    }
                    else
                    {
                        messageType = 104;
                    }
                }
                // if (obj["payload"]["message"]["type"].ToObject<string>() == "button")
                // {
                //     messageType = 104;
                // }
                // else if (obj["payload"]["message"]["type"].ToObject<string>() == "text")
                // {
                //     messageType = 105;
                // }

                Newtonsoft.Json.Linq.JObject _WhatsAppJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();

                WhatsAppLog whatsAppLog = new WhatsAppLog();
                whatsAppLog.WhatsAppLogData = _WhatsAppJSON.ToString();
                whatsAppLog.TemplateId = null;
                whatsAppLog.SentType = 102;
                whatsAppLog.FromContact = obj["payload"]["message"]["from"].ToObject<string>();
                whatsAppLog.ToContact = obj["payload"]["contacts"][0]["to"].ToObject<string>();
                whatsAppLog.MessageType = (int?)messageType;
                whatsAppLog.DeliveryStatus = null;
                whatsAppLog.MessageTime = obj["payload"]
                    ["message"]["timestamp"]
                    .ToObject<DateTime>();
                whatsAppLog.CompanyId = CompanyId;
                whatsAppLog.PlantId = PlantId;
                whatsAppLog.CreatedBy = UserId;
                whatsAppLog.CreatedOn = DateTime.Now;
                whatsAppLog.ModifiedBy = null;
                whatsAppLog.ModifiedOn = null;
                dbContext.WhatsAppLogs.Add(whatsAppLog);
                dbContext.SaveChanges();

                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { Message = "Something Went Wrong, Please Try Again." }
                );
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

        public async Task<WIntegrationDTO> CheckIn(JObject obj)
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
