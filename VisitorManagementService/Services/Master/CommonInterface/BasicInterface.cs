using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
namespace VisitorManagementMySQL.Services.Master.CommonInterface
{
    public interface BasicInterface
    {
        Task<object> CreateInitialize(JObject input);
        Task<object> Create(JObject input);
        Task<object> Update(JObject input);
        Task<object> ChangeStatus(JObject input);
        Task<object> SearchInitialize(JObject input);
    }
}