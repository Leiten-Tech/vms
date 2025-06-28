using System.Collections.Generic;
using System.Threading.Tasks;
using Entities;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.VehicleService
{
    public interface IVehicleService
    {
         Task<object> CreateInitialize(JObject input);
         Task<object> SearchInitialize(JObject input);
         Task<object> Create(object obj,List<IFormFile> webfiles);
         Task<object> Update(object obj,List<IFormFile> webfiles);
         Task<object> ChangeStatus(JObject input);
    }
}