using System.Threading.Tasks;
using Entities;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.StateService
{
    public interface IStateService
    {
        Task<object> CreateInitialize(JObject input);
        Task<object> Create(JObject input);
        Task<object> Update(JObject input);
        Task<object> ChangeStatus(JObject input);
        Task<object> SearchInitialize(JObject input);
    }
}