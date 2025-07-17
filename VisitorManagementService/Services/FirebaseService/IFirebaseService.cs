

using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.DTOs;


namespace VisitorManagementMySQL.Services.FirebaseService
{
    public interface IFirebaseService
    {
        Task SendPushNotificationAsync(FirebaseNotificationDto notification);
    }
}
