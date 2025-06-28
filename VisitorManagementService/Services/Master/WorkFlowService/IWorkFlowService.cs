using System.Collections.Generic;
using System.Threading.Tasks;
using Entities;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.WorkFlowService
{
    public interface IWorkFlowService
    {
         Task<object> SearchInitialize(JObject input);
         Task<object> ApprovalView(JObject input);
    }
}