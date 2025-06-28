using System.Threading.Tasks;
using Entities;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.DashBoard.IndividualService
{
    public interface IIndividualService
    {
        Task<object> SearchInitialize(JObject input);
        Task<object> DashboardOnclick(JObject input);

    }
}