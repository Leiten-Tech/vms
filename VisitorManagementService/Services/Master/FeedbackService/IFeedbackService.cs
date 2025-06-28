using System.Threading.Tasks;
using Entities;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Entities;

namespace VisitorManagementMySQL.Services.Master.FeedbackService
{
    public interface IFeedbackService
    {
        Task<object> CreateInitialize(JObject input);
        Task<object> SearchInitialize(JObject input);
        Task<object> Create(JObject input);
        Task<object> Update(JObject input);
        Task<object> ChangeStatus(JObject input);
    }
}