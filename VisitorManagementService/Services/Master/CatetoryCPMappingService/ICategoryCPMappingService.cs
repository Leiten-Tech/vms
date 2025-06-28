using System.Threading.Tasks;
using Entities;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Entities;


namespace VisitorManagementMySQL.Services.Master.CatetoryCPMappingService
{
    public interface ICategoryCPMappingService
    {
        Task<object> CreateInitialize(JObject input);
        Task<object> SearchInitialize(JObject input);
        Task<object> Create(JObject input);
        Task<object> Update(JObject input);
        Task<object> ChangeStatus(JObject input);
        Task<CategoryCPMappingDto> FilterCategory(JObject obj);

        
    }
}