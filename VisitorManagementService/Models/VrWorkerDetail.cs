using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VrWorkerDetail
    {
        public VrWorkerDetail()
        {
            VrWorkerDocs = new HashSet<VrWorkerDoc>();
        }

        public long VrWorkerDetailId { get; set; }
        public long VendorRegId { get; set; }
        public string WorkerName { get; set; }
        public string MailId { get; set; }
        public string MobileNo { get; set; }
        public long IsIncharge { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public int Status { get; set; }

        public virtual VendorRegistration VendorReg { get; set; }
        public virtual ICollection<VrWorkerDoc> VrWorkerDocs { get; set; }
    }
}
