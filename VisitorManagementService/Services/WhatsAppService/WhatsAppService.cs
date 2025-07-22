using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Runtime.Serialization;
using System.Security.AccessControl;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Transactions;
using Dapper;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic.CompilerServices;
using MimeKit;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Services.ApprovalWorkflow;
using VisitorManagementMySQL.Services.WhatsAppService;
using VisitorManagementMySQL.Utils;
using HtmlAgilityPack;

namespace VisitorManagementMySQL.Services.WhatsAppService
{
    public class WhatsAppService : IWhatsAppService
    {
        private readonly DbContextHelper dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private WhatsAppDTO dto;
        private VisitorEntryDTO VisitorEntryDTO;
        private ApprovalWorkFlowDTO ApprovalWorkFlowDTO;
        private IConfiguration configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly MailSettings _mailSettings;

        public WhatsAppService(
            DbContextHelper dbContext,
            IWebHostEnvironment webHostEnvironment,
            IOptions<MailSettings> mailSettings,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration _configuration
        )
        {
            this._webHostEnvironment = webHostEnvironment;
            this.dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
            dto = new WhatsAppDTO();
            VisitorEntryDTO = new VisitorEntryDTO();
            ApprovalWorkFlowDTO = new ApprovalWorkFlowDTO();
            configuration = _configuration;
            _mailSettings = mailSettings.Value;
        }

        public async Task<string> SendApprovalReqWhatsApp(object obj)
        {
            try
            {
                // Serialize the request object to JSON
                string requestBody = (string)obj;
                string result = "";

                // Newtonsoft.Json.Linq.JObject _VisitorEntryEmail = (Newtonsoft.Json.Linq.JObject)obj;
                // Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();
                // string fromid = serializer.Deserialize<string>(new JTokenReader(_VisitorEntryEmail["FromID"]));
                // string toid = serializer.Deserialize<string>(new JTokenReader(_VisitorEntryEmail["ToID"]));
                // string subject = serializer.Deserialize<string>(new JTokenReader(_VisitorEntryEmail["Subject"]));
                // string template = serializer.Deserialize<string>(new JTokenReader(_VisitorEntryEmail["Template"]));
                // Console.WriteLine(_VisitorEntryEmail);

                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Add(
                        "QIKCHAT-API-KEY",
                        _mailSettings.WhatsAppAPIKey
                    );

                    StringContent content = new StringContent(
                        requestBody,
                        Encoding.UTF8,
                        "application/json"
                    );
                    HttpResponseMessage response = await client.PostAsync(
                        _mailSettings.WhatsAppAPIUrl,
                        content
                    );

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

        public VisitorEntryDTO SendWhatsAppApproval(List<VisitorEntryDetail> visEntrydetail, dynamic visitorEntry, dynamic PurposeName,
        dynamic visComp, dynamic VisitedEmp, Task<string> approveLink, Task<string> rejectLink,string ?levelParam)
        {
            try
            {
                dynamic jsonObject = new JObject();
                jsonObject.to_contact = "91" + Convert.ToString(VisitedEmp.UserTelNo);
                jsonObject.type = "template";

                jsonObject.custom = new JObject();
                dynamic customJsonObject = new JObject();

                customJsonObject.ApproveToken = Convert.ToString(approveLink.Result);
                customJsonObject.RejectToken = Convert.ToString(rejectLink.Result);
                // customJsonObject.RescheduleToken = Convert.ToString(rescheduleLink.Result);
                customJsonObject.WhatsAppCallApi = Convert.ToString(
                    _mailSettings.Service + _mailSettings.WhatsAppCallAPIPath
                );

                jsonObject.custom = Newtonsoft.Json.JsonConvert.SerializeObject(customJsonObject);

                dynamic template = new JObject();
                template.name = "versuni_app_info_template";
                template.language = "en";

                JArray components = new JArray();
                dynamic headComponent = new JObject();
                dynamic bodyComponent = new JObject();

                headComponent.type = "header";
                bodyComponent.type = "body";

                JArray hParameters = new JArray();
                JArray parameters = new JArray();

                dynamic hParam = new JObject();

                dynamic fParam = new JObject();
                dynamic sParam = new JObject();
                dynamic tParam = new JObject();
                dynamic foParam = new JObject();
                dynamic fiParam = new JObject();
                dynamic lParam = new JObject();

                hParam.type = "image";
                lParam.type = "text";
                fParam.type = "text";
                sParam.type = "text";
                tParam.type = "text";
                foParam.type = "text";
                fiParam.type = "text";

                hParam.image = new JObject();
                string Scheme = 
                    _httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + _httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorEntry/";
                string SchemeUpload =
                    _httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + _httpContextAccessor.HttpContext.Request.Host.Value.ToString();
                if (visitorEntry.IsInternalAppointment)
                {
                    string BrandLogoBig = "/upload/Logo/avatar.png";
                //    string BrandLogoBig =  "https://www.leitenindia.com/assets/images/newsletter/welcome-img.jpg";
                    hParam.image.link = SchemeUpload + BrandLogoBig;
                }
                else
                {
                    foreach (var entry in visEntrydetail)
                    {
                        if (entry.DocumentUrl == "" || entry.DocumentUrl == null)
                        {
                            string BrandLogoBig = "/upload/Logo/avatar.png";
                            hParam.image.link = SchemeUpload + BrandLogoBig;
                        }
                        else
                        {
                            hParam.image.link = Scheme + entry.DocumentUrl;
                        }
                    }
                }

                fParam.text = Convert.ToString(VisitedEmp?.UserName);
                List<string> namesList = new List<string>();
                foreach (var entry in visEntrydetail)
                {
                    namesList.Add(entry.FirstName);
                }
                sParam.text = string.Join(", ", namesList);

                // tParam.text = Convert.ToString(visitorEntry.ValidFrom.Date.ToShortDateString() + " " + visitorEntry.ValidFrom.Date.ToShortTimeString());
                tParam.text = Convert.ToString(
                    visitorEntry.ValidFrom.ToShortDateString()
                        + " "
                        + visitorEntry.ValidFrom.ToShortTimeString()
                );
                foParam.text = Convert.ToString(
                    string.IsNullOrWhiteSpace(visComp) || visComp.Length == 0 ? "-" : visComp
                );
                fiParam.text = Convert.ToString(PurposeName.MetaSubDescription);


                var leveldetail = ConvertHtmlToWhatsAppMarkdown(
                            levelParam ?? "-");
                lParam.text = leveldetail.Result;

                parameters.Add(fParam);
                parameters.Add(lParam);
               
                parameters.Add(sParam);
                parameters.Add(tParam);
                parameters.Add(foParam);
                parameters.Add(fiParam);

                hParameters.Add(hParam);

                headComponent.parameters = hParameters;
                bodyComponent.parameters = parameters;

                components.Add(headComponent);
                components.Add(bodyComponent);

                template.components = components;
                jsonObject.template = template;

                string jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObject);
                Console.WriteLine(jsonString);
                JObject tempObj = new JObject();
                tempObj = jsonObject;
                string FromContact = "917358112529";
                string ToContact = "91" + Convert.ToString(VisitedEmp.UserTelNo);
                DateTime MessageTime = DateTime.Now;
                string Template = "approval_template_vms";
                string EntryRefCode = visitorEntry.VisitorEntryCode;

                WhatsAppLogSaveOut(
                    tempObj,
                    (int)visitorEntry.CompanyId,
                    (int)visitorEntry.PlantId,
                    (int)visitorEntry.VisitedEmployeeId,
                    FromContact,
                    ToContact,
                    MessageTime,
                    Template,
                    EntryRefCode
                );

                var mail = SendApprovalReqWhatsApp(jsonString);

                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return VisitorEntryDTO;
        }

         public async Task<string> ConvertHtmlToWhatsAppMarkdown(string html)
        {
            if (string.IsNullOrWhiteSpace(html))
                return string.Empty;

            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(html);

            // Convert <strong> and <b> to WhatsApp Bold (*text*)
            foreach (var node in doc.DocumentNode.SelectNodes("//strong|//b") ?? new HtmlNodeCollection(null))
            {
                node.ParentNode.ReplaceChild(HtmlTextNode.CreateNode($"*{node.InnerText.Trim()}*"), node);
            }

            // Convert <em> and <i> to WhatsApp Italic (_text_)
            foreach (var node in doc.DocumentNode.SelectNodes("//em|//i") ?? new HtmlNodeCollection(null))
            {
                node.ParentNode.ReplaceChild(HtmlTextNode.CreateNode($"_{node.InnerText.Trim()}_"), node);
            }

            // Replace <p> with " - " instead of newlines
            foreach (var node in doc.DocumentNode.SelectNodes("//p") ?? new HtmlNodeCollection(null))
            {
                node.ParentNode.ReplaceChild(HtmlTextNode.CreateNode($"{node.InnerText.Trim()} - "), node);
            }

            // Decode HTML entities like &amp; → &, &quot; → "
            string text = WebUtility.HtmlDecode(doc.DocumentNode.InnerText);

            // Remove all newlines, tabs, and limit excessive spaces
            text = text.Replace("\r", "")
                    .Replace("\n", "")
                    .Replace("\t", "")
                    .Trim();

            // Optionally replace multiple spaces with a single space
            text = Regex.Replace(text, @" {2,}", " ");

            // Trim trailing hyphens or spaces
            text = text.Trim('-', ' ');

            return text;
        }


        public ApprovalWorkFlowDTO WhatsAppLogSaveOut(
           JObject obj,
           int CompanyId,
           int PlantId,
           int UserId,
           string FromContact,
           string ToContact,
           DateTime MessageTime,
           string Template,
           string EntryRefCode
       )
        {
            try
            {
                long messageType = 104;

                Newtonsoft.Json.Linq.JObject _WhatsAppJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();

                WhatsAppLog whatsAppLog = new WhatsAppLog();
                whatsAppLog.WhatsAppLogData = _WhatsAppJSON.ToString();
                whatsAppLog.TemplateId = Template;
                whatsAppLog.SentType = 103;
                whatsAppLog.FromContact = FromContact;
                whatsAppLog.ToContact = ToContact;
                whatsAppLog.MessageType = (int?)messageType;
                whatsAppLog.DeliveryStatus = null;
                whatsAppLog.MessageTime = MessageTime;
                whatsAppLog.RefCode = EntryRefCode;
                whatsAppLog.CompanyId = CompanyId;
                whatsAppLog.PlantId = PlantId;
                whatsAppLog.CreatedBy = UserId;
                whatsAppLog.CreatedOn = DateTime.Now;
                whatsAppLog.ModifiedBy = null;
                whatsAppLog.ModifiedOn = null;
                dbContext.WhatsAppLogs.Add(whatsAppLog);
                dbContext.SaveChanges();

                dto.tranStatus.result = true;
                //     dto.tranStatus.lstErrorItem.Add(
                //        new ErrorItem
                //        {
                //            Message = "Something Went Wrong, Please Try Again."
                //        }
                //    );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return ApprovalWorkFlowDTO;
        }


    }
}
