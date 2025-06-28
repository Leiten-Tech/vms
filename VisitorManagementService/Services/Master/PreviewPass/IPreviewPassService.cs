using System.Threading.Tasks;
using Entities;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.PreviewPassService
{
    public interface IPreviewPassService
    {
        Task<object> CreateInitialize(JObject input);
       
    }
}