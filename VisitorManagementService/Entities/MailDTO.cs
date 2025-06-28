using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using VisitorManagementMySQL.Models;
using System.Linq;
using Microsoft.AspNetCore.Http;
using VisitorManagementMySQL.Utils;
namespace VisitorManagementMySQL.Entities
{
    public class MailDTO
    {
        public MailDTO()
        {
            tranStatus = new ErrorContext();
            tranStatus.result = false;
            tranStatus.lstErrorItem = new List<ErrorItem>();
        }

        public ErrorContext tranStatus { get; set; }
        public List<dynamic> Ecmaildetails { get; internal set; }
    }
    public class OrderConfirmationEmail
    {
        public string ToEmail { get; set; }
        public string UserName { get; set; }
        public string Logo { get; set; }
        public string Orderno { get; set; }
    }
    public class MailSettings
    {
        public bool MSend { get; set; }
        public bool WSend { get; set; }
        public bool LicCacheEnabled { get; set; }
        public string Mail { get; set; }
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public string Website { get; set; }
        public string Service { get; set; }
        public string WhatsAppAPIKey { get; set; }
        public string WhatsAppAPIUrl { get; set; }
        public string WACallApiService { get; set; }
        public string WhatsAppCallAPIPath { get; set; }
        public string CheckUrl { get; set; }
    }
    public class MailRequest
    {
        public string ToEmail { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public List<IFormFile> Attachments { get; set; }
    }

    public class SMSResponse
    {
        public string originator { get; set; }
        public string destination { get; set; }
        public string messageText { get; set; }
        public string messageId { get; set; }
        public string messageReference { get; set; }
        public string status { get; set; }
        public string messageDate { get; set; }
        public string charge { get; set; }
        public string scheduled { get; set; }
        public string messageValidity { get; set; }
        public string sendDateTime { get; set; }
    }
}