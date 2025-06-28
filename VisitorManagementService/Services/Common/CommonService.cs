using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using QRCoder;
using SkiaSharp;
using Svg.Skia;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Services.MailService;
using VisitorManagementMySQL.Services.Master.FileUploadService;
using VisitorManagementMySQL.Services.Notification;
using VisitorManagementMySQL.Services.WhatsAppService;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.Common
{
    public class CommonService : ICommonService
    {
        private readonly IMailService mailService;
        private readonly IMemoryCache _cache;
        public static readonly CommonDto dto;
        private readonly MailSettings _mailSettings;
        private readonly IWhatsAppService whatsAppService;

        private readonly DbContextHelper dbContext;
        private readonly IDapperContext dapperContext;
        private readonly ILogger<NotificationCheckService> _logger;

        public CommonService(
            IOptions<MailSettings> mailSettings,
            IWhatsAppService whatsAppService,
            DbContextHelper _dbContext,
            IDapperContext _dapperContext,
            ILogger<NotificationCheckService> logger,
            IMailService _mailService,
            IMemoryCache cache
        )
        {
            dbContext = _dbContext;
            _logger = logger;
            _mailSettings = mailSettings.Value;
            mailService = _mailService;
            this.whatsAppService = whatsAppService;
            dapperContext = _dapperContext;
            _cache = cache;
        }

        public object VisitorLogSave(Visitor visitor, DbContextHelper dbContext)
        {
            try
            {
                VisitorLog visitorLog = new VisitorLog
                {
                    VisitorLogId = 0,
                    VisitorId = visitor.VisitorId,
                    VisitorCode = visitor.VisitorCode,
                    VisitorTypeId = visitor.VisitorTypeId,
                    CompanyId = visitor.CompanyId,
                    PlantId = visitor.PlantId,
                    CountryId = visitor.CountryId,
                    StateId = visitor.StateId,
                    CityId = visitor.CityId,
                    TitleId = visitor.TitleId,
                    FirstName = visitor.FirstName,
                    LastName = visitor.LastName,
                    Dob = visitor.Dob,
                    VisitorCompany = visitor.VisitorCompany,
                    Address = visitor.Address,
                    MailId = visitor.MailId,
                    MobileNo = visitor.MobileNo,
                    IdCardType = visitor.IdCardType,
                    IdCardNo = visitor.IdCardNo,
                    DocumentName = visitor.DocumentName,
                    DocumentUrl = visitor.DocumentUrl,
                    VisitorDocumentName = visitor.VisitorDocumentName,
                    VisitorDocumentUrl = visitor.VisitorDocumentUrl,
                    IsLatest = false,
                    Status = visitor.Status,
                    CreatedBy = visitor.CreatedBy,
                    CreatedOn = visitor.CreatedOn,
                    ModifiedBy = visitor.ModifiedBy,
                    ModifiedOn = visitor.ModifiedOn,
                };

                foreach (var detail in visitor.VisitorDetails)
                {
                    VisitorDetailLog detailLog = new VisitorDetailLog
                    {
                        VisitorDetailLogId = 0,
                        VisitorDetailId = detail.VisitorDetailId,
                        VisitorDetailCode = detail.VisitorDetailCode,
                        VisitorId = detail.VisitorId,
                        VisitorLogId = 0,
                        TitleId = detail.TitleId,
                        FirstName = detail.FirstName,
                        LastName = detail.LastName,
                        DepartmentId = detail.DepartmentId,
                        Dob = detail.Dob,
                        MailId = detail.MailId,
                        MobileNo = detail.MobileNo,
                        IdCardType = detail.IdCardType,
                        IdCardNo = detail.IdCardNo,
                        DocumentName = detail.DocumentName,
                        DocumentUrl = detail.DocumentUrl,
                        ExpirryDate = detail.ExpirryDate,
                        WorkSeverity = detail.WorkSeverity,
                        Status = detail.Status,
                        TagNo = detail.TagNo,
                    };

                    visitorLog.VisitorDetailLogs.Add(detailLog);
                }

                dbContext.VisitorLogs.Add(visitorLog);
                dbContext.SaveChanges();
            }
            catch (Exception ex) { }
            return visitor;
        }

        public async Task<CommonDto> SendCheckOutTimer(List<dynamic> NotifyData)
        {
            try
            {
                if (NotifyData.Count > 0)
                {
                    var groupedVisitors = NotifyData
                        .GroupBy(visitor => new
                        {
                            visitor.InchargeMail,
                            visitor.InchargeMobile,
                            visitor.InchargeName,
                            visitor.NotificationId,
                        })
                        .Select(group => new
                        {
                            InchargeMail = group.Key.InchargeMail,
                            InchargeMobile = group.Key.InchargeMobile,
                            InchargeName = group.Key.InchargeName,
                            NotificationId = group.Key.NotificationId,
                            Visitors = group.ToList(),
                        })
                        .ToList();
                    var companyId = (long)NotifyData[0].CompanyId;

                    // List<string> namesList = new List<string>();
                    // foreach (var entry in VisEntrydetail)
                    // {
                    //     namesList.Add(entry.FirstName);
                    // }
                    // string names = string.Join(", ", namesList);
                    // visitorEntryUpdated = VisEntry;
                    // dto.VisitorEntryHeader = visitorEntryUpdated;
                    // MailText = MailText
                    //     .Replace("[WhomToVisit]", Convert.ToString(VisitedEmp?.UserName))
                    //     .Replace("[Visitor]", Convert.ToString(names))
                    //     .Replace(
                    //         "[VisitDate]",
                    //         Convert.ToString(VisEntry.ValidFrom.Value.ToShortDateString())
                    //     )
                    //     .Replace(
                    //         "[VisitTime]",
                    //         Convert.ToString(VisEntry.ValidFrom.Value.ToShortTimeString())
                    //     )
                    //     .Replace("[PurposeOfVisit]", Convert.ToString(PurposeName.MetaSubDescription))
                    //     .Replace("{{ApproveLink}}", Convert.ToString(approveLink.Result))
                    //     .Replace("{{RejectLink}}", Convert.ToString(rejectLink.Result))
                    //     .Replace("{{siteURL}}", _mailSettings.Website)
                    //     .Replace("{{Logo}}", BrandLogo)
                    //     .Replace("{{BrandLogoBig}}", BrandLogoBig);

                    // object emailObj = new
                    // {
                    //     FromID = "reply-no@visitorManagement.com",
                    //     ToID = VisitedEmp.UserEmail,
                    //     Subject = $"Pending Approval for Visitor {Convert.ToString(names)} on {VisEntry.ValidFrom.Value.ToLongDateString()} {VisEntry.ValidFrom.Value.ToLongTimeString()} for {PurposeName.MetaSubDescription}",
                    //     Template = MailText,
                    // };
                    // Create a list of visitor details for the email body

                    string BrandLogo =
                        Directory.GetCurrentDirectory() + "\\upload\\Logo\\app-logo.png";
                    string BrandLogoBig = "/upload/Logo/app-logo-big.png";
                    string FilePath =
                        Directory.GetCurrentDirectory() + "\\Templates\\ContentTemplate.html";
                    StreamReader str = new StreamReader(FilePath);
                    string MailText = str.ReadToEnd();

                    foreach (var group in groupedVisitors)
                    {
                        StringBuilder visitorListBuilder = new StringBuilder();
                        visitorListBuilder.AppendLine(
                            "<p>The following visitors have not checked out and are still within the company premises:</p>"
                        );
                        visitorListBuilder.AppendLine("<ul>");

                        // Iterate through each visitor in the group
                        foreach (var entry in group.Visitors)
                        {
                            visitorListBuilder.AppendLine(
                                $"<li>{entry.VisitorName}, Gate: {entry.GateName}, Plant: {entry.PlantName}, Mobile: {entry.MobileNo}</li>"
                            );
                        }

                        visitorListBuilder.AppendLine("</ul>");
                        visitorListBuilder.AppendLine(
                            "<p>Please ensure they check out at the earliest opportunity.</p>"
                        );
                        visitorListBuilder.AppendLine("");

                        // Embed the visitor list into the MailText template
                        MailText = MailText
                            .Replace("[Content]", visitorListBuilder.ToString())
                            .Replace("[PersonName]", group.InchargeName)
                            .Replace("{{siteURL}}", _mailSettings.Website)
                            .Replace("{{serviceURL}}", _mailSettings.Service)
                            .Replace("{{Logo}}", BrandLogo)
                            .Replace("{{BrandLogoBig}}", BrandLogoBig);

                        // Set up the email object with the in-charge's email
                        object emailObj = new
                        {
                            FromID = "reply-no@visitorManagement.com",
                            ToID = group.InchargeMail,
                            Subject = $"Alert: Visitors Pending Checkout",
                            Template = MailText,
                        };

                        // Fetch company details (if needed for email sending)

                        Company company = dbContext
                            .Companies.Where(x => x.CompanyId == companyId)
                            .SingleOrDefault();

                        JObject convertObj = (JObject)JToken.FromObject(emailObj);

                        // WhatsApp
                        dynamic jsonObject = new JObject();
                        jsonObject.type = "text";

                        dynamic text = new JObject();
                        jsonObject.to_contact = "91" + Convert.ToString(group.InchargeMobile);

                        StringBuilder messageBuilder = new StringBuilder();
                        messageBuilder.AppendLine(
                            "Attention: The following visitors have not checked out and are still within the company premises:"
                        );

                        foreach (var item in NotifyData)
                        {
                            messageBuilder.AppendLine(
                                $"- {item.VisitorName}, Gate: {item.GateName}, Plant: {item.PlantName}, Mobile: {item.MobileNo}"
                            );
                        }

                        string whatsappMessage = messageBuilder.ToString();
                        // foreach (var item in NotifyData)
                        // {
                        //     text.body =
                        //         $"Dear {Convert.ToString(item.FirstName)},We regret to inform you that your  gate pass request has been rejected.";
                        // }
                        text.body = whatsappMessage;
                        jsonObject.text = text;
                        string jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObject);

                        var mail = mailService.SendApprovalReqEmail(
                            convertObj,
                            (long)companyId,
                            company
                        );
                        var whatsapp = whatsAppService.SendApprovalReqWhatsApp(jsonString);

                        foreach (var entry in group.Visitors)
                        {
                            int nId = (int)group.NotificationId;
                            var existingNotification =
                                await dbContext.Notifications.FirstOrDefaultAsync(n =>
                                    n.NotificationId == nId
                                );
                            if (existingNotification != null)
                            {
                                existingNotification.NotificationSent = true;
                                dbContext.Notifications.Update(existingNotification);
                                await dbContext.SaveChangesAsync();
                            }
                        }
                        dto.tranStatus.result = true;
                    }

                    // var mail = mailService.SendApprovalReqEmail(convertObj, (long)CompanyId, company);
                }
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task CheckForUnsentNotifications(object state)
        {
            try
            {
                string Type = "CheckOutTimer";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_WORKFLOW_POPPUP_FETCH",
                        new
                        {
                            UserId = (object)null,
                            PlantId = (object)null,
                            RoleId = (object)null,
                            Type,
                            DocumentCode = (object)null,
                        }
                    );
                    var CheckoutTimerList = (await spcall.ReadAsync<dynamic>()).ToList();
                    await SendCheckOutTimer(CheckoutTimerList);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error checking for unsent notifications: {ex.Message}");
            }
        }

        private async Task SendEmailToIncharge(JObject visitor)
        {
            try
            {
                Console.WriteLine(visitor);
                // var inchargeEmail = visitor.ApproveUser.Email; // Assuming incharge email is stored in ApproveUser
                // var subject = "Visitor Not Checked Out Notification";
                // var body =
                //     $"Dear {visitor.ApproveUser.UserName},\n\n"
                //     + $"The visitor {visitor.VisitorDetail.FirstName} has not checked out after the gate close time.\n"
                //     + $"Visitor Entry Code: {visitor.VisitorEntryCode}\n"
                //     + $"Please take appropriate action.\n\n"
                //     + "Best regards,\nYour System";

                // var mailMessage = new MailMessage
                // {
                //     From = new MailAddress("your-email@example.com"), // Replace with your email
                //     Subject = subject,
                //     Body = body,
                //     IsBodyHtml = false,
                // };

                // mailMessage.To.Add(inchargeEmail);

                // // Send the email asynchronously
                // await _smtpClient.SendMailAsync(mailMessage);
                // _logger.LogInformation(
                //     $"Email sent to {inchargeEmail} about visitor {visitor.VisitorDetail.FirstName}"
                // );
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error sending email: {ex.Message}");
            }
        }

        public void SetCache<T>(string key, T value, TimeSpan expiration)
        {
            _cache.Set(key, value, expiration);
        }

        public T GetCache<T>(string key)
        {
            return _cache.TryGetValue(key, out T value) ? value : default;
        }

        public void RemoveCache(string key)
        {
            _cache.Remove(key);
        }

        public async Task<JObject> GetLicData(JObject checkObj)
        {
            var cachedResult = "";
            JObject response = new JObject();
            if (_mailSettings.LicCacheEnabled)
            {
                cachedResult = GetCache<string>("VerifyToken")?.ToString();
            }

            if (string.IsNullOrEmpty(cachedResult))
            {
                string requestBody = checkObj.ToString();
                string apiresult = "";

                using (HttpClient client = new HttpClient())
                {
                    StringContent content = new StringContent(
                        requestBody,
                        Encoding.UTF8,
                        "application/json"
                    );
                    try
                    {
                        HttpResponseMessage apiResponse = await client.PostAsync(
                            _mailSettings.CheckUrl,
                            content
                        );

                        if (apiResponse.IsSuccessStatusCode)
                        {
                            apiresult = await apiResponse.Content.ReadAsStringAsync();
                            SetCache("VerifyToken", apiresult, TimeSpan.FromHours(8));
                            response = JObject.Parse(apiresult);
                        }
                        else
                        {
                            response = new JObject
                            {
                                {
                                    "transtatus",
                                    new JObject
                                    {
                                        { "result", false },
                                        {
                                            "lstErrorItem",
                                            new JArray
                                            {
                                                new JObject
                                                {
                                                    { "Title", "Unable to Login." },
                                                    {
                                                        "Message",
                                                        "We're unable to Verify your license at the moment. Please try again later."
                                                    },
                                                    {
                                                        "Response",
                                                        new JObject
                                                        {
                                                            { "LicenseCode", "" },
                                                            {
                                                                "LicenseCompanyLocations",
                                                                new JArray()
                                                            },
                                                        }
                                                    },
                                                },
                                            }
                                        },
                                    }
                                },
                            };

                            return response;
                        }
                    }
                    catch (HttpRequestException ex)
                    {
                        response = new JObject
                        {
                            {
                                "transtatus",
                                new JObject
                                {
                                    { "result", false },
                                    {
                                        "lstErrorItem",
                                        new JArray
                                        {
                                            new JObject
                                            {
                                                { "Title", "Unable to Login." },
                                                {
                                                    "Message",
                                                    "The server is currently unreachable. Please check your internet connection or try again later."
                                                },
                                                {
                                                    "Response",
                                                    new JObject
                                                    {
                                                        { "LicenseCode", "" },
                                                        { "LicenseCompanyLocations", new JArray() },
                                                    }
                                                },
                                            },
                                        }
                                    },
                                }
                            },
                        };
                        return response;
                    }
                    catch (TaskCanceledException ex)
                    {
                        response = new JObject
                        {
                            {
                                "transtatus",
                                new JObject
                                {
                                    { "result", false },
                                    {
                                        "lstErrorItem",
                                        new JArray
                                        {
                                            new JObject
                                            {
                                                { "Title", "Unable to Login." },
                                                {
                                                    "Message",
                                                    "The request timed out. Please ensure you have a stable connection and try again."
                                                },
                                                {
                                                    "Response",
                                                    new JObject
                                                    {
                                                        { "LicenseCode", "" },
                                                        { "LicenseCompanyLocations", new JArray() },
                                                    }
                                                },
                                            },
                                        }
                                    },
                                }
                            },
                        };
                        return response;
                    }
                }
            }
            if (!string.IsNullOrEmpty(cachedResult))
            {
                JObject parsedResult = JObject.Parse(cachedResult);
                string responseString = parsedResult["transtatus"]
                    .SelectToken("lstErrorItem[0].Response")
                    ?.ToString();
                string responseTit = parsedResult["transtatus"]
                    .SelectToken("lstErrorItem[0].Title")
                    ?.ToString();
                string responseMes = parsedResult["transtatus"]
                    .SelectToken("lstErrorItem[0].Message")
                    ?.ToString();
                bool responseRes = (bool)parsedResult["transtatus"].SelectToken("result");
                if (responseString != null && responseString != "")
                {
                    JObject responseObject = JObject.Parse(responseString);

                    string licenseCode = responseObject["LicenseCode"]?.ToString();
                    JArray licenseCompanyLocations = (JArray)
                        responseObject["LicenseCompanyLocations"];

                    if (licenseCompanyLocations != null)
                    {
                        var companyLocData = new List<JObject>();

                        foreach (var loc in licenseCompanyLocations)
                        {
                            JObject locObject = (JObject)loc;

                            bool isWaApprovalEnabled =
                                locObject["IsWaApprovalEnabled"]?.ToObject<bool>() ?? false;
                            bool isEmApprovalEnabled =
                                locObject["IsEmApprovalEnabled"]?.ToObject<bool>() ?? false;
                            string companyLocToken = locObject["CompanyLocToken"]
                                ?.ToObject<string>();

                            // Add the location info to the list
                            companyLocData.Add(
                                new JObject
                                {
                                    { "IsWaApprovalEnabled", isWaApprovalEnabled },
                                    { "IsEmApprovalEnabled", isEmApprovalEnabled },
                                    { "CompanyLocToken", companyLocToken },
                                }
                            );
                        }

                        response = new JObject
                        {
                            {
                                "transtatus",
                                new JObject
                                {
                                    { "result", responseRes },
                                    {
                                        "lstErrorItem",
                                        new JArray
                                        {
                                            new JObject
                                            {
                                                { "Title", responseTit },
                                                { "Message", responseMes },
                                                {
                                                    "Response",
                                                    new JObject
                                                    {
                                                        { "LicenseCode", licenseCode },
                                                        {
                                                            "LicenseCompanyLocations",
                                                            new JArray(companyLocData)
                                                        },
                                                    }
                                                },
                                            },
                                        }
                                    },
                                }
                            },
                        };
                    }
                    else
                    {
                        response = new JObject
                        {
                            {
                                "transtatus",
                                new JObject
                                {
                                    { "result", responseRes },
                                    {
                                        "lstErrorItem",
                                        new JArray
                                        {
                                            new JObject
                                            {
                                                { "Title", responseTit },
                                                { "Message", responseMes },
                                                {
                                                    "Response",
                                                    new JObject
                                                    {
                                                        { "LicenseCode", licenseCode },
                                                        { "LicenseCompanyLocations", new JArray() },
                                                    }
                                                },
                                            },
                                        }
                                    },
                                }
                            },
                        };
                    }
                }
            }

            return response;
        }
        // public async Task<JObject> GetLicData(
        //     string cachedResult,
        //     Company company,
        //     MailSettings _mailSettings
        // )
        // {
        //     JObject response = new JObject();

        //     if (string.IsNullOrEmpty(cachedResult))
        //     {
        //         string requestBody = System.Text.Json.JsonSerializer.Serialize(company);
        //         string apiresult = "";

        //         using (HttpClient client = new HttpClient())
        //         {
        //             StringContent content = new StringContent(
        //                 requestBody,
        //                 Encoding.UTF8,
        //                 "application/json"
        //             );
        //             try
        //             {
        //                 HttpResponseMessage apiResponse = await client.PostAsync(
        //                     _mailSettings.CheckUrl,
        //                     content
        //                 );

        //                 if (apiResponse.IsSuccessStatusCode)
        //                 {
        //                     apiresult = await apiResponse.Content.ReadAsStringAsync();
        //                     SetCache("VerifyToken", apiresult, TimeSpan.FromHours(12));
        //                 }
        //                 else
        //                 {
        //                     bool result = false;
        //                     string licenseCode =
        //                         "We're unable to Verify your license at the moment. Please try again later.";
        //                     response = new JObject
        //                     {
        //                         { "Result", result },
        //                         { "LicenseCode", licenseCode },
        //                         { "LicenseCompanyLocations", new JArray() },
        //                     };
        //                     return response;
        //                 }
        //             }
        //             catch (HttpRequestException ex)
        //             {
        //                 bool result = false;
        //                 string licenseCode =
        //                     "The server is currently unreachable. Please check your internet connection or try again later.";
        //                 response = new JObject
        //                 {
        //                     { "Result", result },
        //                     { "LicenseCode", licenseCode },
        //                     { "LicenseCompanyLocations", new JArray() },
        //                 };
        //                 return response;
        //             }
        //             catch (TaskCanceledException ex)
        //             {
        //                 bool result = false;
        //                 string licenseCode =
        //                     "The request timed out. Please ensure you have a stable connection and try again.";
        //                 response = new JObject
        //                 {
        //                     { "Result", result },
        //                     { "LicenseCode", licenseCode },
        //                     { "LicenseCompanyLocations", new JArray() },
        //                 };
        //                 return response;
        //             }
        //         }
        //     }
        //     if (!string.IsNullOrEmpty(cachedResult))
        //     {
        //         JObject parsedResult = JObject.Parse(cachedResult);
        //         string responseString = parsedResult["transtatus"]
        //             .SelectToken("lstErrorItem[0].Response")
        //             ?.ToString();

        //         if (responseString != null)
        //         {
        //             JObject responseObject = JObject.Parse(responseString);

        //             string licenseCode = responseObject["LicenseCode"]?.ToString();
        //             JArray licenseCompanyLocations = (JArray)
        //                 responseObject["LicenseCompanyLocations"];

        //             if (licenseCompanyLocations != null)
        //             {
        //                 var companyLocData = new List<JObject>();

        //                 foreach (var loc in licenseCompanyLocations)
        //                 {
        //                     JObject locObject = (JObject)loc;

        //                     bool isWaApprovalEnabled =
        //                         locObject["IsWaApprovalEnabled"]?.ToObject<bool>() ?? false;
        //                     bool isEmApprovalEnabled =
        //                         locObject["IsEmApprovalEnabled"]?.ToObject<bool>() ?? false;
        //                     string companyLocToken = locObject["CompanyLocToken"]
        //                         ?.ToObject<string>();

        //                     // Add the location info to the list
        //                     companyLocData.Add(
        //                         new JObject
        //                         {
        //                             { "IsWaApprovalEnabled", isWaApprovalEnabled },
        //                             { "IsEmApprovalEnabled", isEmApprovalEnabled },
        //                             { "CompanyLocToken", companyLocToken },
        //                         }
        //                     );
        //                 }

        //                 // Populate the response object with license data
        //                 response = new JObject
        //                 {
        //                     { "LicenseCode", licenseCode },
        //                     { "LicenseCompanyLocations", new JArray(companyLocData) },
        //                 };
        //             }
        //         }
        //     }

        //     return response;
        // }
    }
}
