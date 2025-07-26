// Required NuGet Package: DinkToPdf and native wkhtmltox must be configured

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Models;

using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Entities;
using Wkhtmltopdf.NetCore;

namespace VisitorManagementService.Services.VisitorReportScheduler.JobCheckinCheckoutService
{
    public class JobCheckinCheckoutService : IJobCheckinCheckoutService
    {
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly MailSettings _mailSettings;
        private readonly ILogger<JobCheckinCheckoutService> _logger;
        private readonly IGeneratePdf _generatePdf;

        public JobCheckinCheckoutService(
            
            DbContextHelper dbContextHelper,
            IHttpContextAccessor _httpContextAccessor,
            IDapperContext _dapperContext,
            IOptions<MailSettings> mailSettings,
            ILogger<JobCheckinCheckoutService> logger,           
            IGeneratePdf generatePdf
        )
        {
            DbContext = dbContextHelper;
            httpContextAccessor = _httpContextAccessor;
            dapperContext = _dapperContext;
            _mailSettings = mailSettings.Value;
            _logger = logger;
            _generatePdf = generatePdf;
        }

        public async Task<object> SearchInitialize(JObject obj)
        {
            try
            {
                DateTime? FromDate = DateTime.Now.AddDays(-1);
                DateTime? ToDate = DateTime.Now.AddDays(-1);

                string CompanyId = "1";
                string Scheme = $"{_mailSettings.Service}/upload/VisitorEntry/";
                string SignScheme = $"{_mailSettings.Service}/upload/VisitorDigSigns/";

                var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                    "SP_JOB_VISITOR_CHECKIN_CHECKOUT_REPORT",
                    new
                    {
                        FromDate,
                        ToDate,
                        PlantIds = (object)null,
                        VisitorTypeId = (object)null,
                        PurposeOfVisit = (object)null,
                        PlantId = (object)null,
                        CompanyId,
                        Scheme,
                        SignScheme
                    });

                var checkinCheckoutList = (await spcall.ReadAsync<dynamic>()).ToList();

                if (checkinCheckoutList != null && checkinCheckoutList.Count > 0)
                {
                    byte[] pdfBytes = await GeneratePdfFromRazorTemplate(checkinCheckoutList);
                    await SendEmailWithAttachment(pdfBytes);
                    _logger.LogInformation("Visitor PDF report generated and emailed.");
                    return "Visitor report generated and emailed.";
                }

                return "No data found";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating and sending visitor report.");
                return $"Error: {ex.Message}";
            }
        }

        private async Task<byte[]> GeneratePdfFromRazorTemplate(List<dynamic> records)
        {
            var options = new ConvertOptions
            {
                PageOrientation = Wkhtmltopdf.NetCore.Options.Orientation.Landscape,
                PageMargins = new Wkhtmltopdf.NetCore.Options.Margins { Top = 10, Bottom = 10, Left = 10, Right = 10 },
                PageSize = Wkhtmltopdf.NetCore.Options.Size.A4,
                PageWidth = 210,
                PageHeight = 297,
                
            };

            _generatePdf.SetConvertOptions(options);
            return await _generatePdf.GetByteArray("Templates/CheckinCheckoutReport.cshtml", records);
        }

        private async Task SendEmailWithAttachment(byte[] fileBytes)
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_mailSettings.Mail));
            message.To.Add(MailboxAddress.Parse("vmssupport@gmail.com"));
            // message.Bcc.Add(MailboxAddress.Parse("cvenumadhav10@gmail.com"));
            // message.Cc.Add(MailboxAddress.Parse("jaganeditz@gmail.com"));
            message.Subject = "Daily Visitor Report";

            var builder = new BodyBuilder
            {
                TextBody = "Attached is the visitor report for today."
            };

            builder.Attachments.Add("VisitorReport.pdf", fileBytes, ContentType.Parse("application/pdf"));
            message.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;
            await smtp.ConnectAsync(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_mailSettings.Mail, _mailSettings.Password);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
    }
}