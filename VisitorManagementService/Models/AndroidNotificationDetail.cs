using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class AndroidNotificationDetail
    {
        public long NotificationId { get; set; }
        public string NotificationType { get; set; }
        public string VisitorOrHostId { get; set; }
        public string MobileNo { get; set; }
        public string NotificationMessage { get; set; }
        public string VisitorAddress { get; set; }
        public string VisitorEntryDate { get; set; }
        public string Imageurl { get; set; }
        public string VisitorEntryCode { get; set; }
        public int NotificationStatus { get; set; }
    }
}
