using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace WhatsAppIntegration.Services.WhatsAppService
{
    public interface IWhatsAppService
    {
        Task<object> WCallApi(JObject input);
    }
}