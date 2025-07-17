using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VisitorManagementService.Services.VisitorReportScheduler
{
    public interface IVisitorReportAutomationService
    {
         Task GenerateAndSendReportAsync();
    }
}