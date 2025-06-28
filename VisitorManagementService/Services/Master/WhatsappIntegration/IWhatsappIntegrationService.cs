using System.Collections.Generic;
using System.Threading.Tasks;
using Entities;
using VisitorManagementMySQL.Entities;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.WIntegrationService
{
    public interface IWIntegrationService
    {
        Task<object> WApproval(JObject input);
        Task<WIntegrationDTO> CheckIn(JObject obj);

    }
}