using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VisitorEntryBelongingDetail
    {
        public long VisitorEntryBelongingDetailId { get; set; }
        public long VisitorEntryId { get; set; }
        public string DeviceNo { get; set; }
        public string DeviceName { get; set; }

        public virtual VisitorEntry VisitorEntry { get; set; }
    }
}
