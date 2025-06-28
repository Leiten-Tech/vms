using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.CompanyService
{
    public interface ICompanyService
    {
        Task<object> CreateInitialize(JObject obj);
         Task<object> OnChangeCountry(JObject input);
        Task<object> OnChangeState(JObject input);
        Task<object> Create(JObject input);
        Task<object> Update(JObject input);
         Task<object> ChangeStatus(JObject input);
         Task<object> SearchInitialize(JObject input);



    }
}