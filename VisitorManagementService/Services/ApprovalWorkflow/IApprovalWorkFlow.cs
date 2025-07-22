using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.ApprovalWorkflow
{
    public interface IApprovalWorkFlow
    {
        Task<object> ApprovalWorkFlowInsert(ApprovalRequest request);
        Task<object> ApprovalWorkFlowUpdate(JObject obj);
        Task<ApprovalWorkFlowDTO> Popupfetch(JObject obj);
        Task<ApprovalWorkFlowDTO> checkOutTimer(JObject obj);
        Task<ApprovalWorkFlowDTO> poppupupdate(JObject obj);
        Task<ApprovalWorkFlowDTO> UserWorkFlowUpdateAsync(JObject obj);
        Task<ApprovalWorkFlowDTO> CheckIn(JObject obj);
        Task<ApprovalWorkFlowDTO> UserWorkFlowUpdateUsingToken(string token);
        ApprovalWorkFlowDTO DSendPass(string token);
        ApprovalWorkFlowDTO EncryptData(string value);
        ApprovalWorkFlowDTO DecryptData(string value);
        Task<ApprovalWorkFlowDTO> SendPassInternal(VisitorEntry passTxt, string SendMail, Company company, string UserName, string RoleName);
        Task<ApprovalWorkFlowDTO> SendPass(VisitorEntry passTxt, string SendMail, String UserName, string RoleName);
        Task<string> GenerateMailToken(string tokenType, string encryptedToken, string ApprovalType, string ApprovalText);
        ApprovalWorkFlowDTO WhatsAppLogSaveOut(JObject obj, int CompanyId, int PlantId, int UserId, string FromContact, string ToContact, DateTime MessageTime, string Template, string EntryRefCode);

    }
}