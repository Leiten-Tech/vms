using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class ApprovalDetail
    {
        public long ApprovalDetailId { get; set; }
        public long ApprovalId { get; set; }
        public long DocumentId { get; set; }
        public string DocumentNo { get; set; }
        public int LevelId { get; set; }
        public long PrimaryUserId { get; set; }
        public long? SecondaryUserId { get; set; }
        public bool? IsViewed { get; set; }
        public int Status { get; set; }
        public string Remarks1 { get; set; }
        public string Remarks2 { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual Approval Approval { get; set; }
    }
}
