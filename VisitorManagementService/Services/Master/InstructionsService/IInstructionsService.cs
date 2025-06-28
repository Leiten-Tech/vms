using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.InstructionsService
{
    public interface IInstructionsService
    {
        Task<object> CreateInitialize(JObject obj);
         Task<object> OnChangeCompany(JObject input);
        Task<object> Create(JObject input);
        Task<object> Update(JObject input);
         Task<object> ChangeStatus(JObject input);
         Task<object> SearchInitialize(JObject input);



    }
}