using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Services.Authentication;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.Helper
{
    [ApiController]
    [Route("[Controller]")]
    public class TrialController : ControllerBase
    {
        private LoginDTO dto = new LoginDTO();

        // Define the trial start date and period duration
        // private static readonly DateTime TrialStartDate = new DateTime(
        //     15,
        //     9,
        //     2024,
        //     9,
        //     0,
        //     0,
        //     DateTimeKind.Utc
        // );
        // private static readonly int TrialPeriodDays = 720;
        private readonly MailSettings _mailSettings;

        public TrialController(IOptions<MailSettings> mailSettings)
        {
            dto = new LoginDTO();
            dto.tranStatus = new ErrorContext();
            dto.tranStatus.result = false;
            _mailSettings = mailSettings.Value;
            dto.tranStatus.lstErrorItem = new List<ErrorItem>();
        }

        [HttpPost("CheckTrial")]
        public async Task<LoginDTO> CheckTrialPeriod(JObject obj)
        {
            try
            {
                string requestToken = obj["accessToken"].ToObject<string>();

                var resultValue = ApproveTokenService.DecryptToken(requestToken);

                string requestBody = resultValue;
                string apiresult = "";

                using (HttpClient client = new HttpClient())
                {
                    StringContent content = new StringContent(
                        requestBody,
                        Encoding.UTF8,
                        "application/json"
                    );
                    HttpResponseMessage response = await client.PostAsync(
                        _mailSettings.CheckUrl,
                        content
                    );

                    if (response.IsSuccessStatusCode)
                    {
                        apiresult = await response.Content.ReadAsStringAsync();
                    }
                    else
                    {
                        Console.WriteLine($"Error: {response.StatusCode}");
                    }
                }
                JObject jsonRes = JObject.Parse(apiresult);
                dto.tranStatus.result = Convert.ToBoolean(jsonRes["transtatus"]["result"]);
                dto.tranStatus.lstErrorItem = jsonRes["transtatus"]["lstErrorItem"]?.ToObject<List<ErrorItem>>();
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }

            return dto;
        }
    }
}
