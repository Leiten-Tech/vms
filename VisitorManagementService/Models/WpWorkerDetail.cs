using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class WpWorkerDetail
    {
        public WpWorkerDetail()
        {
            WpWorkerDocs = new HashSet<WpWorkerDoc>();
        }

        public long WpWorkerDetailId { get; set; }
        public long WorkPermitId { get; set; }
        public string WorkerName { get; set; }
        public string MailId { get; set; }
        public string MobileNo { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public string ProfileImgName { get; set; }
        public string ProfileImgUrl { get; set; }
        public long IsIncharge { get; set; }
        public bool? IsEditedImage { get; set; }
        public bool? IsWorking { get; set; }
        public int Status { get; set; }

        public virtual WorkPermit WorkPermit { get; set; }
        public virtual ICollection<WpWorkerDoc> WpWorkerDocs { get; set; }
    }
}
