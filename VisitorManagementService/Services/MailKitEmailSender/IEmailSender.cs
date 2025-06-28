using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
//using WebApi.Helpers;

namespace VisitorManagementMySQL.Services.MailKitEmailSender
{
    public interface IEmailService
    {
        void Send(string from, string to, string subject, string html);
    }


}