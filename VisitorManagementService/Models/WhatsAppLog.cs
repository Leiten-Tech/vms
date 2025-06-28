using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class WhatsAppLog
    {
        public long WhatsAppLogId { get; set; }
        public string WhatsAppLogData { get; set; }
        public string RefCode { get; set; }
        public string TemplateId { get; set; }
        public int? SentType { get; set; }
        public string FromContact { get; set; }
        public string ToContact { get; set; }
        public int? MessageType { get; set; }
        public int? DeliveryStatus { get; set; }
        public DateTime? MessageTime { get; set; }
        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
