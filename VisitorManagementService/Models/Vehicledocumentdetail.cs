using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VehicleDocumentDetail
    {
        public long VehicleDocumentDetailId { get; set; }
        public long VehicleId { get; set; }
        public string DocumentName { get; set; }
        public string DocumentNo { get; set; }
        public string AttachmentUrl { get; set; }
        public string AttachmentName { get; set; }
        public string Remarks { get; set; }

        public virtual Vehicle Vehicle { get; set; }
    }
}
