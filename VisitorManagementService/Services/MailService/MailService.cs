using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using Dapper;
using Microsoft.Extensions.Options;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using System.Reflection;
using System.Runtime.Serialization;
using Microsoft.VisualBasic.CompilerServices;
using System.Security.AccessControl;
using System.Transactions;
using System.IO;
using System.Threading.Tasks;
using VisitorManagementMySQL.ContextHelper;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.Text;
// using HtmlAgilityPack;
using System.Net.Http;
using Microsoft.EntityFrameworkCore.Storage;
using System.Net;
using VisitorManagementMySQL.Services.MailService;

namespace VisitorManagementMySQL.Services.MailService
{
    public class MailService : IMailService
    {
        private readonly DbContextHelper DbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private MailDTO dto;
        private IConfiguration configuration;
        private string Erpzapiurl = "";
        private string bholaProductpath = "";
        private string bholaAdManagementpath = "";
        private string bholaSlideManagementpath = "";
        private string SMSUserPass = "";
        private string SMSport = "";
        private string RegLogo = "";

        private readonly IWebHostEnvironment _webHostEnvironment;

        private readonly MailSettings _mailSettings;

        public MailService(DbContextHelper _dbContextHelper, IWebHostEnvironment webHostEnvironment, IOptions<MailSettings> mailSettings, IHttpContextAccessor httpContextAccessor, IConfiguration _configuration)
        {

            this._webHostEnvironment = webHostEnvironment;
            DbContext = _dbContextHelper;
            _httpContextAccessor = httpContextAccessor;
            dto = new MailDTO();
            configuration = _configuration;
            Erpzapiurl = configuration["Erpzapiurl"];
            bholaProductpath = configuration["bholaProductpath"];
            bholaAdManagementpath = configuration["bholaAdManagementpath"];
            bholaSlideManagementpath = configuration["bholaSlideManagementpath"];
            RegLogo = configuration["RegLogo"];
            SMSUserPass = configuration["SMSUserPass"];
            SMSport = configuration["SMSapiURL"];
            _mailSettings = mailSettings.Value;
        }
        public async Task SendApprovalReqEmail(object obj, long? companyId, Company company)
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _VisitorEntryEmail = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();
                string fromid = serializer.Deserialize<string>(new JTokenReader(_VisitorEntryEmail["FromID"]));
                string toId = serializer.Deserialize<string>(new JTokenReader(_VisitorEntryEmail["ToID"]));
                string subject = serializer.Deserialize<string>(new JTokenReader(_VisitorEntryEmail["Subject"]));
                string template = serializer.Deserialize<string>(new JTokenReader(_VisitorEntryEmail["Template"]));

                Company CompanyConfig = new Company();
                CompanyConfig = company;

                var email = new MimeMessage();
                if (companyId != null)
                {
                    email.From.Add(MailboxAddress.Parse(CompanyConfig.Mail));
                }
                else
                {
                    email.From.Add(MailboxAddress.Parse(_mailSettings.Mail));
                }
                email.To.Add(MailboxAddress.Parse(toId));
                email.Subject = subject;

                var builder = new BodyBuilder();
                builder.HtmlBody = template;
                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                smtp.ServerCertificateValidationCallback = (s, c, h, e) => true; // bypass SSL certificate validation
                if (companyId != null)
                {
                    smtp.Connect(CompanyConfig.Host, int.Parse(CompanyConfig.Port), SecureSocketOptions.StartTls);
                    smtp.Authenticate(CompanyConfig.Mail, CompanyConfig.Password);
                }
                else
                {
                    smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                    smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                }
                await smtp.SendAsync(email);
                smtp.Disconnect(true);

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }
        // public void SendOrderStatusEmailAsync(DbContextHelper dbContext, List<long> orderids)
        // {
        //     try
        //     {
        //         var Orderstatusemaillogs = dbContext.Orderstatusemaillogs.FirstOrDefault(s => s.Logstatusid == 1 && s.Tomail != null);
        //         List<Myordershistoryview> Myordershistoryviews = dbContext.Myordershistoryviews.Where(s => orderids.Contains(s.Orderid)).OrderBy(s => s.Orderid).ToList();
        //         var order = dbContext.Myordershistoryheaders.SingleOrDefault(s => s.Orderno == Myordershistoryviews[0].Orderno);
        //         string paymentStatus = "COD";
        //         if (order.Paymentmode == "ECO00052")
        //             paymentStatus = "Amount Paid";

        //         string MailText = string.Empty;
        //         string FilePath = Directory.GetCurrentDirectory() + "\\Templates\\email-templates\\order-confirmation-status.html";
        //         using (StreamReader str = new StreamReader(FilePath))
        //         {
        //             MailText = str.ReadToEnd();
        //         }
        //         string branchLogo = Directory.GetCurrentDirectory() + "\\upload\\branch\\BholaLogo.png";
        //         string orderdate = Myordershistoryviews.Count > 0 ? Convert.ToString(Myordershistoryviews[0].Orderdate.ToString("dd-MMM-yyyy h:mm tt")) : null;
        //         string orderno = Myordershistoryviews.Count > 0 ? Myordershistoryviews[0].Orderno : null;
        //         string da = Myordershistoryviews.Count > 0 ? Myordershistoryviews[0].Deliveryaddress : null;
        //         decimal? Totalamount = Myordershistoryviews.Count > 0 ? Myordershistoryviews.Select(t => t.Netamount).Sum() : 0;
        //         decimal? Shippingcharges = Myordershistoryviews.Count > 0 ? Myordershistoryviews.Select(t => t.Shippingcharges).Sum() : 0;
        //         decimal Grandtotal = (Totalamount ?? 0);
        //         //  var tomail = dbContext.Orderstatusemaillogs.FirstOrDefault(s => s.Logstatusid == 1 && s.Tomail != null && s.Orderno == orderno);
        //         var tomail = dbContext.Customers.FirstOrDefault(s => s.Customerid == Myordershistoryviews[0].Customerid);

        //         StringBuilder tblbodyreplace = new StringBuilder();

        //         if (Myordershistoryviews.Count > 0)
        //         {
        //             decimal Taxpercentage = 14.5M;
        //             Myordershistoryviews.ForEach(f =>
        //             {
        //                 var x_Amount = ((f.Grossamount ?? 0) / (1 + (Taxpercentage / 100)));
        //                 var x_Price = ((f.Unitprice ?? 0) / (1 + (Taxpercentage / 100)));
        //                 var taxAmount = ((Taxpercentage / 100) * x_Amount);
        //                 var u_taxamount = ((Taxpercentage / 100) * x_Price);

        //                 f.Taxamount = decimal.Round(taxAmount, 2, MidpointRounding.AwayFromZero);
        //                 f.Unitprice -= decimal.Round(u_taxamount, 2, MidpointRounding.AwayFromZero);
        //                 f.Grossamount = decimal.Round(x_Amount, 2, MidpointRounding.AwayFromZero);

        //                 tblbodyreplace.Append("<tr>");
        //                 tblbodyreplace.Append("<td style='margin:0;padding:10px;vertical-align:top;border:1px solid #ddd;background-color:#fff;font-family:Arial,Helvetica,Sans-serif; font-size:12px;border-collapse:collapse;'>" + f.Productname + "</td>");
        //                 tblbodyreplace.Append("<td style='text-align:center;margin:0;padding:10px;vertical-align:top;border:1px solid #ddd;background-color:#fff;font-family:Arial,Helvetica,Sans-serif; font-size:12px;border-collapse:collapse;'>" + f.Quantity + "</td>");
        //                 tblbodyreplace.Append("<td style='text-align:right;margin:0;padding:10px;vertical-align:top;border:1px solid #ddd;background-color:#fff;font-family:Arial,Helvetica,Sans-serif; font-size:12px;border-collapse:collapse;'>" + f.Unitprice + "</td>");
        //                 tblbodyreplace.Append("<td style='text-align:right;margin:0;padding:10px;vertical-align:top;border:1px solid #ddd;background-color:#fff;font-family:Arial,Helvetica,Sans-serif; font-size:12px;border-collapse:collapse;'>-" + f.Discountamount + "</td>");
        //                 tblbodyreplace.Append("<td style='text-align:right;margin:0;padding:10px;vertical-align:top;border:1px solid #ddd;background-color:#fff;font-family:Arial,Helvetica,Sans-serif; font-size:12px;border-collapse:collapse;'>" + f.Taxamount + "</td>");
        //                 tblbodyreplace.Append("<td style='text-align:right;margin:0;padding:10px;vertical-align:top;border:1px solid #ddd;background-color:#fff;font-family:Arial,Helvetica,Sans-serif; font-size:12px;border-collapse:collapse;'>" + f.Shippingcharges + "</td>");
        //                 tblbodyreplace.Append("<td style='text-align:right;margin:0;padding:10px;vertical-align:top;border:1px solid #ddd;background-color:#fff;font-family:Arial,Helvetica,Sans-serif; font-size:12px;border-collapse:collapse;'>" + f.Netamount + "</td>");
        //                 tblbodyreplace.Append("</tr>");
        //             });
        //         }

        //         MailText = MailText.Replace("[username]", Myordershistoryviews.Count > 0 ? Myordershistoryviews[0].Customername : null).Replace("[email]", tomail.Ecdefaultmailid).Replace("{{siteURL}}", _mailSettings.Website).Replace("{{image}}", branchLogo)
        //         .Replace("[OrderItem]", Convert.ToString(tblbodyreplace)).Replace("[orderdate]", orderdate)
        //         .Replace("[orderno]", orderno).Replace("[da]", da).Replace("[totalamount]", Convert.ToString(Totalamount))
        //         .Replace("[grandtotal]", Convert.ToString(Grandtotal)).Replace("[orderstatus]", Myordershistoryviews[0].Orderstatusname)
        //         .Replace("[shipmentno]", Myordershistoryviews[0].Shipmentno)
        //         .Replace("[dm]", Myordershistoryviews.Count > 0 ? Myordershistoryviews[0].Deliverymodename : null)
        //         .Replace("[deliveryaddresstypename]", Myordershistoryviews.Count > 0 ? Myordershistoryviews[0].Deliverymode == "MSC00270" ? "Pickup Address" : "Delivery Address" : null)
        //         .Replace("[amountstatus]", paymentStatus);
        //         var email = new MimeMessage();
        //         email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));
        //         email.To.Add(new MailboxAddress(Myordershistoryviews.Count > 0 ? Myordershistoryviews[0].Customername : null, tomail.Ecdefaultmailid));
        //         email.Subject = $"Order Status Mail";
        //         var builder = new BodyBuilder();
        //         builder.HtmlBody = MailText;
        //         email.Body = builder.ToMessageBody();
        //         using (var smtp = new SmtpClient())
        //         {
        //             smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;
        //             smtp.Connect(_mailSettings.Host, _mailSettings.Port, true);
        //             smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
        //             smtp.Send(email);
        //             smtp.Disconnect(true);
        //         }

        //         var Orderstatusemaillog = dbContext.Orderstatusemaillogs.Where(s => orderids.Contains(s.Orderid ?? 0)).ToList();
        //         Orderstatusemaillog.ForEach(f =>
        //         {
        //             f.Logstatusid = 2;
        //             f.Logstatus = "Yes";
        //         });
        //         dbContext.Orderstatusemaillogs.UpdateRange(Orderstatusemaillog);
        //         dbContext.SaveChanges();

        //     }
        //     catch (Exception ex)
        //     {
        //         dto.tranStatus.result = false;
        //         dto.tranStatus.lstErrorItem.Add(
        //             new ErrorItem
        //             {
        //                 ErrorNo = "VMS000",
        //                 Message = ex.Message
        //             }
        //         );

        //     }
        // }
        // public void SendECMail(object obj)
        // {
        //     try
        //     {
        //         Newtonsoft.Json.Linq.JObject _VisitorEntryEmail = (Newtonsoft.Json.Linq.JObject)obj;
        //         Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();
        //         //string fromid = serializer.Deserialize<string>(new JTokenReader(_VisitorEntryEmail["FromID"]));
        //         List<string> toid = serializer.Deserialize<List<string>>(new JTokenReader(_VisitorEntryEmail["Recipientlist"]));
        //         string toids = string.Join(",", toid);
        //         using (var cnn = dbContext.Database.GetDbConnection())
        //         {
        //             IDbTransaction transaction = null;

        //             if (dbContext.Database.CurrentTransaction != null)
        //                 transaction = dbContext.GetTransaction().GetDbTransaction();

        //             var p = new DynamicParameters();
        //             p.Add("@TOMAILID", toids, DbType.String);


        //             dbContext.Database.OpenConnection();

        //             var result = cnn.QueryMultiple(sql: "SPGETECMAILDETAILS", param: p,
        //                            commandType: CommandType.StoredProcedure, transaction: transaction);

        //             dto.Ecmaildetails = result.Read<dynamic>().ToList();
        //             dbContext.Database.CloseConnection();



        //         }
        //         string template = serializer.Deserialize<string>(new JTokenReader(_VisitorEntryEmail["Template"]));


        //         HtmlDocument document = new HtmlDocument();
        //         document.LoadHtml(template);
        //         document.DocumentNode.Descendants("img")
        //                             .Where(e =>
        //                             {
        //                                 string src = e.GetAttributeValue("src", null) ?? "";
        //                                 return !string.IsNullOrEmpty(src) && src.StartsWith("data:image");
        //                             })
        //                             .ToList()
        //                             .ForEach(x =>
        //                             {
        //                                 string currentSrcValue = x.GetAttributeValue("src", null);
        //                                 currentSrcValue = currentSrcValue.Split(',')[1];//Base64 part of string
        //                                 byte[] imageData = Convert.FromBase64String(currentSrcValue);
        //                                 string contentId = Guid.NewGuid().ToString();
        //                                 System.Net.Mail.LinkedResource inline = new System.Net.Mail.LinkedResource(new MemoryStream(imageData), "image/jpeg");
        //                                 inline.ContentId = contentId;
        //                                 inline.TransferEncoding = System.Net.Mime.TransferEncoding.Base64;
        //                                 MemoryStream ms = new MemoryStream(imageData);

        //                                 FileStream file = new FileStream(Directory.GetCurrentDirectory() + "\\upload\\Newsletter\\" + inline.ContentId + ".png", FileMode.Create, FileAccess.Write);

        //                                 ms.WriteTo(file);
        //                                 file.Close();
        //                                 ms.Close();
        //                                 string imageurl = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host.Value.ToString()}/upload/Newsletter/{inline.ContentId + ".png"}";

        //                                 x.SetAttributeValue("src", imageurl);
        //                             });


        //         string resultimages = document.DocumentNode.OuterHtml;

        //         foreach (var i in dto.Ecmaildetails)
        //         {

        //             var branchLogo = Erpzapiurl + RegLogo;
        //             string FilePath = Directory.GetCurrentDirectory() + "\\Templates\\email-templates\\Newslettertemplate.html";
        //             StreamReader str = new StreamReader(FilePath);
        //             string MailText = str.ReadToEnd();
        //             str.Close();
        //             MailText = MailText.Replace("[newslettertemplate]", resultimages);
        //             var email = new MimeMessage();
        //             email.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));
        //             email.To.Add(new MailboxAddress(i.toname, i.tomail));
        //             email.Subject = $"Newsletter";
        //             var builder = new BodyBuilder();
        //             builder.HtmlBody = MailText;
        //             email.Body = builder.ToMessageBody();
        //             using var smtp = new SmtpClient();
        //             smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;
        //             smtp.Connect(_mailSettings.Host, _mailSettings.Port, true);
        //             smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
        //             smtp.Send(email);
        //             smtp.Disconnect(true);
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         throw new Exception(ex.Message);
        //     }

        // }
        // public async Task SendSMSAsync(JObject obj)
        // {
        //     try
        //     {
        //         //  var name = obj["username"].ToObject<string>();
        //         var receivers = obj["destinations"].ToObject<string>();
        //         var msg = obj["message"].ToObject<string>();
        //         using (var client = new HttpClient())
        //         {
        //             string username = "bholahardware";
        //             // Webservices token for above Webservice username
        //             string token = "a952bab97afb8fd6eb99a87690ac8b35";
        //             // BulkSMS Webservices URL
        //             string bulksms_ws = "http://portal.bulksmsweb.com/index.php?app=ws";
        //             // destination numbers, comma seperated or use #groupcode for sending to group
        //             // $destinations = '#devteam,263071077072,26370229338';
        //             // $destinations = '26300123123123,26300456456456'; for multiple recipients
        //             //  string destinations = "263772268353,263732268353,263773098427";
        //             string destinations = receivers;
        //             // SMS Message to send
        //             string message = msg;
        //             // send via BulkSMS HTTP API
        //             string ws_str = bulksms_ws + "&u=" + username + "&h=" + token + "&op=pv";
        //             ws_str += "&to=" + Uri.EscapeDataString(destinations) + "&msg=" +
        //             Uri.EscapeDataString(message);
        //             HttpResponseMessage response = await client.GetAsync(ws_str);
        //             response.EnsureSuccessStatusCode();
        //             using (HttpContent content = response.Content)
        //             {
        //                 string responseBody = await response.Content.ReadAsStringAsync();
        //                 var result = JsonConvert.DeserializeObject<ResultSMS>(responseBody);
        //                 if (result.status == "ERR")
        //                 {
        //                     Smslog newlog = new Smslog();
        //                     newlog.Mobileno = receivers;
        //                     //newlog.Reciepentname
        //                     //newlog.Subject=
        //                     newlog.Bodymessage = msg;
        //                     newlog.Messagestatus = result.status;
        //                     newlog.Errormessage = result.error_string;
        //                     newlog.Createdon = DateTime.Now;
        //                     dbContext.Smslogs.Add(newlog);
        //                     dbContext.SaveChanges();
        //                 }
        //             }
        //         }

        //     }
        //     catch (Exception ex)
        //     {
        //         throw new Exception(ex.Message);
        //     }
        // }
        // public async Task EcommmerceSendSMSAsync(string destination, string msg)
        // {
        //     try
        //     {
        //         //--BHOLA Esolution API
        //         var client = new WebClient();
        //         string destinations = destination;
        //         string message = msg;
        //         object obj = new
        //         {
        //             originator = "BHOLA",
        //             destination = "0" + destinations,
        //             messageText = msg,
        //             messageReference = Guid.NewGuid().ToString()
        //         };

        //         string apiUrl = SMSport;
        //         string inputJson = JsonConvert.SerializeObject(obj, Formatting.Indented);
        //         client.Headers["Content-type"] = "application/json";
        //         string credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes(SMSUserPass));
        //         client.Headers[HttpRequestHeader.Authorization] = "Basic " + credentials;
        //         client.Encoding = Encoding.UTF8;
        //         Uri uri = new Uri(apiUrl);
        //         string json = await client.UploadStringTaskAsync(uri, inputJson);
        //         JObject ResultJSON = (JObject)JsonConvert.DeserializeObject(json);
        //         if (ResultJSON != null)
        //         {
        //             SMSResponse sms = ResultJSON.ToObject<SMSResponse>();
        //             Smslog newlog = new Smslog();
        //             newlog.Mobileno = destination;
        //             newlog.Bodymessage = msg;
        //             newlog.Messagestatus = sms.status;
        //             newlog.Errormessage = sms.status;
        //             newlog.Referenceno = sms.messageReference;
        //             newlog.Referenceno2 = sms.messageId;
        //             newlog.Createdon = DateTime.Now;
        //             dbContext.Smslogs.Add(newlog);
        //             dbContext.SaveChanges();
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         throw new Exception(ex.Message);
        //     }

        // }
        // public object smslogfetchall(JObject obj)
        // {
        //     try
        //     {
        //         dto.smslogs = dbContext.Smslogs.Where(w => w.Createdon.Value.Date >= DateTime.Now.AddDays(-31).Date).OrderByDescending(N => N.Alertid).ToList();
        //         dto.tranStatus.result = true;
        //     }
        //     catch (Exception ex)
        //     {
        //         dto.tranStatus.result = false;
        //         dto.tranStatus.lstErrorItem.Add(
        //             new ErrorItem
        //             {
        //                 ErrorNo = "VMS000",
        //                 Message = ex.Message
        //             }
        //         );
        //     }
        //     return dto;
        // }

    }
}