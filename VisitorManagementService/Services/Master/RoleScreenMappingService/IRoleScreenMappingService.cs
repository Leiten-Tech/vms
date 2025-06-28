using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.RoleScreenMappingService
{
    public interface IRoleScreenMappingService
    {
        Task<object> CreateInitialize(JObject obj);
        Task<object> Create(JObject obj);
        Task<object> Update(JObject obj);
        Task<object> GetDefaultModules(JObject obj);
        Task<object> GetFunctions(JObject obj);
    }
}