using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.DashBoard.VisitorDashboardService
{
    public interface IVisitorDashboardService
    {
        Task<object> SearchInitialize(JObject input);
        // Task<object> DashboardOnclick(JObject input);
    }
}