using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class ApprovalHeader
    {
        public ApprovalHeader()
        {
            ApprovalDetails = new HashSet<ApprovalDetail>();
        }

        public long ApprovalHeaderId { get; set; }
        public long DocumentId { get; set; }
        public string DocumentNo { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual ICollection<ApprovalDetail> ApprovalDetails { get; set; }
    }
}
