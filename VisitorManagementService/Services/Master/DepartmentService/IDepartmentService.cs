using System.Threading.Tasks;
using Entities;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.DepartmentService
{
    public interface IDepartmentService
    {
        Task<object> CreateInitialize(JObject input);
        Task<object> SearchInitialize(JObject input);
        Task<object> Create(JObject input);
        Task<object> Update(JObject input);
        Task<object> ChangeStatus(JObject input);
    }
}