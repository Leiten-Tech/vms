using System.Threading.Tasks;
using Entities;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.SupplierService
{
    public interface ISupplierService
    {
        Task<object> CreateInitialize(JObject input);
        Task<object> Create(JObject input);
        Task<object> ChangeStatus(JObject input);
        Task<object> Update(JObject input);
        Task<object> SearchInitialize(JObject input);
        Task<object> OnChangeCountry(JObject input);
        Task<object> OnChangeState(JObject input);
    }
}
