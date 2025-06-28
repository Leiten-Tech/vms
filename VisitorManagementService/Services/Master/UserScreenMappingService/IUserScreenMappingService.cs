using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.UserScreenMappingService
{
    public interface IUserScreenMappingService
    {
        Task<object> CreateInitialize(JObject obj);
        Task<object> Create(JObject obj);
        Task<object> Update(JObject obj);
        Task<object> GetUser(JObject obj);
        Task<object> GetModuleAndFunction(JObject obj);
        Task<object> SearchInitialize(JObject obj);
    }
}