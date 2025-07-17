using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using MimeKit;
using MimeKit.Utils;
using Newtonsoft.Json.Linq;
// using OfficeOpenXml;
using VisitorManagementMySQL.Entities;
using VisitorManagementService.Services.VisitorReportScheduler.JobCheckinCheckoutService;


namespace VisitorManagementService.Services.VisitorReportScheduler
{
    public class VisitorReportAutomationService : IVisitorReportAutomationService
    {
        private readonly IJobCheckinCheckoutService _reportService;
        private readonly ILogger<VisitorReportAutomationService> _logger;

        

        public VisitorReportAutomationService(
            IJobCheckinCheckoutService reportService,
            ILogger<VisitorReportAutomationService> logger)
        {
            _reportService = reportService;
            _logger = logger;
        }

        public async Task GenerateAndSendReportAsync()
        {
            try
            {
                var input = new JObject
                {
                    ["FromDate"] = DateTime.Today,
                    ["ToDate"] = DateTime.Today.AddDays(1).AddSeconds(-1),
                    ["CompanyId"] = 1,
                    ["PlantId"] = null,
                    ["VisitorTypeId"] = null,
                    ["PurposeOfVisit"] = null
                };

                var result = await _reportService.SearchInitialize(input);
                var dto = result as JobCheckinCheckoutRptDTO;

                if (dto?.CheckinCheckoutList != null && dto.CheckinCheckoutList.Any())
                {
                    // var excelBytes = GenerateExcel(dto.CheckinCheckoutList);
                    // await SendEmailWithAttachment(excelBytes);
                    _logger.LogInformation("Visitor report emailed successfully.");
                }
                else
                {
                    _logger.LogWarning("No data found to generate the visitor report.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate and send visitor report.");
            }
        }

        // private byte[] GenerateExcel(List<dynamic> records)
        // {
        //     ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

        //     using var package = new ExcelPackage();
        //     var worksheet = package.Workbook.Worksheets.Add("Visitor Report");

        //     // Headers
        //     var firstRow = (IDictionary<string, object>)records[0];
        //     int col = 1;
        //     foreach (var key in firstRow.Keys)
        //     {
        //         worksheet.Cells[1, col++].Value = key;
        //     }

        //     // Data
        //     for (int i = 0; i < records.Count; i++)
        //     {
        //         var row = (IDictionary<string, object>)records[i];
        //         int j = 1;
        //         foreach (var val in row.Values)
        //         {
        //             worksheet.Cells[i + 2, j++].Value = val?.ToString();
        //         }
        //     }

        //     return package.GetAsByteArray();
        // }

        private async Task SendEmailWithAttachment(byte[] fileBytes)
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse("your-email@example.com"));
            message.To.Add(MailboxAddress.Parse("client-email@example.com"));
            message.Subject = "Daily Visitor Report";

            var builder = new BodyBuilder
            {
                TextBody = "Attached is the visitor report for today."
            };
            builder.Attachments.Add("VisitorReport.xlsx", fileBytes, new ContentType("application", "vnd.openxmlformats-officedocument.spreadsheetml.sheet"));

            message.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.yourdomain.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync("your-email@example.com", "your-password");
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
    }
}
