using System.Threading.Tasks;
using Entities;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.MaterialService
{
    public interface IMaterialService
    {
        Task<object> CreateInitialize(JObject input);
        Task<object> OnChangeMaterialType(JObject input);
        Task<object> OnChangeMaterialCatagory(JObject input);
        Task<object> OnChangeMaterialSubCatagory(JObject input);
        Task<object> SearchInitialize(JObject input);
        Task<object> Create(JObject input, IFormFile webfile);
        Task<object> Update(JObject input, IFormFile webfile);
        Task<object> ChangeStatus(JObject input);
    }
}