using System;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using VisitorManagementMySQL.ContextHelper;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.WhatsAppService
{
    public interface IWhatsAppService
    {
        Task<string> SendApprovalReqWhatsApp(object obj);
        public VisitorEntryDTO SendWhatsAppApproval(
            List<VisitorEntryDetail> visEntrydetail,
            dynamic visitorEntry,
            dynamic PurposeName,
            dynamic visComp,
            dynamic VisitedEmp,
            Task<string> approveLink,
            Task<string> rejectLink,
            // Task<string> rescheduleLink,
            string levelParam
        );
    }
}