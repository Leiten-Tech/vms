using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class EventDocumentDetail
    {
        public long EventDocumentDetailId { get; set; }
        public long EventId { get; set; }
        public string DocumentName { get; set; }
        public string DocumentNo { get; set; }
        public string AttachmentUrl { get; set; }
        public string AttachmentName { get; set; }
        public string Remarks { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual Event Event { get; set; }
    }
}
