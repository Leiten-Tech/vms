using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.UserService
{
    public interface IUserService
    {
        Task<object> CreateInitialize(JObject obj);
        Task<object> Create(JObject input, IFormFile webfile, IFormFile digitalSign);
        Task<object> Update(JObject input, IFormFile webfile, IFormFile digitalSign);
        Task<object> ChangeStatus(JObject input);
        Task<object> SearchInitialize(JObject input);
        Task<object> OnChangeCompany(JObject input);
        Task<object> OnChangePlant(JObject input);
        Task<object> ScreenMapping(JObject input);
    }
}