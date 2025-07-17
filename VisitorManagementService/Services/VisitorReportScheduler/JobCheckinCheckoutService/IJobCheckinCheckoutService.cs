using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace VisitorManagementService.Services.VisitorReportScheduler.JobCheckinCheckoutService
{
    public interface IJobCheckinCheckoutService
    {
        Task<object> SearchInitialize(JObject obj);
    }
}