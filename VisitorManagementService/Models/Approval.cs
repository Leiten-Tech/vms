using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Approval
    {
        public Approval()
        {
            ApprovalDetails = new HashSet<ApprovalDetail>();
        }

        public long ApprovalId { get; set; }
        public long PlantId { get; set; }
        public long DocumentId { get; set; }
        public string DocumentNo { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public long? ApprovalActivityId { get; set; }

        public virtual ICollection<ApprovalDetail> ApprovalDetails { get; set; }
    }
}
