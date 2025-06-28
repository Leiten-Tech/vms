using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using VisitorManagementMySQL.Models;
using System.Linq;
using Microsoft.AspNetCore.Http;
using VisitorManagementMySQL.Utils;
namespace VisitorManagementMySQL.Entities
{
    public class WhatsAppDTO
    {
        public WhatsAppDTO()
        {
            tranStatus = new ErrorContext();
            tranStatus.result = false;
            tranStatus.lstErrorItem = new List<ErrorItem>();
        }

        public ErrorContext tranStatus { get; set; }
        public List<dynamic> Ecmaildetails { get; internal set; }
    }

    public class WhatsAppSettings
    {
        public string Mail { get; set; }
        public string DisplayName { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public string Website { get; set; }
        public string Service { get; set; }
    }


}