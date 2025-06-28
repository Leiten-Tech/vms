using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class EmployeeDocumentDetail
    {
        public long EmployeeDocumentDetailId { get; set; }
        public long EmployeeId { get; set; }
        public string DocumentName { get; set; }
        public string DocumentNo { get; set; }
        public string AttachmentUrl { get; set; }
        public string AttachmentName { get; set; }
        public string Remarks { get; set; }

        public virtual Employee Employee { get; set; }
    }
}
