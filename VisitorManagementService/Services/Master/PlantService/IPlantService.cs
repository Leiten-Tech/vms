using System.Threading.Tasks;
using VisitorManagementMySQL.Entities;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.PlantService
{
    public interface IPlantService
    {
        Task<object> CreateInitialize(JObject input);
        Task<object> OnChangeCountry(JObject input);
        Task<object> OnChangeState(JObject input);
        Task<object> OnChangeDepartment(JObject input);
        Task<object> SearchInitialize(JObject input);
        Task<object> Create(JObject input);
        Task<object> Update(JObject input);
        Task<object> ChangeStatus(JObject input);
    }
}