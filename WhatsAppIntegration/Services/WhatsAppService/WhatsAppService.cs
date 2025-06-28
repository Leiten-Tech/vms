using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using WhatsAppIntegration.Services.WhatsAppService;

namespace WhatsAppIntegration.Services.WhatsAppService
{
    public class WhatsAppService : IWhatsAppService
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public WhatsAppService(IHttpContextAccessor _httpContextAccessor)
        {
            httpContextAccessor = _httpContextAccessor;
        }

        public async Task<object> WCallApi(JObject obj)
        {
            try
            {
                string customString = obj["payload"]
                    ["message"]["context"]["custom"]
                    .ToObject<string>();

                JObject custom = JObject.Parse(customString);
                string ApproveToken = custom["ApproveToken"].ToObject<string>();
                string RejectToken = custom["RejectToken"].ToObject<string>();
                string WhatsAppCallApi = custom["WhatsAppCallApi"].ToObject<string>();

                string requestBody = obj.ToString();
                string result = "";

                using (HttpClient client = new HttpClient())
                {
                    StringContent content = new StringContent(
                        requestBody,
                        Encoding.UTF8,
                        "application/json"
                    );
                    HttpResponseMessage response = await client.PostAsync(WhatsAppCallApi, content);

                    if (response.IsSuccessStatusCode)
                    {
                        result = await response.Content.ReadAsStringAsync();
                    }
                    else
                    {
                        Console.WriteLine($"Error: {response.StatusCode}");
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
