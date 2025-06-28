using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Notification
    {
        public long NotificationId { get; set; }
        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public long? GateId { get; set; }
        public string EntryCode { get; set; }
        public long? VisitorId { get; set; }
        public long? InchargeId { get; set; }
        public string VisitorName { get; set; }
        public string MobileNo { get; set; }
        public string MailId { get; set; }
        public bool? NotificationSent { get; set; }
        public DateTime? SentTimestamp { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int? Status { get; set; }
    }
}
