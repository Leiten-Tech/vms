using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class WpApprovalDetail
    {
        public long WpApprovalDetailId { get; set; }
        public long WorkPermitId { get; set; }
        public long DeptId { get; set; }
        public int LevelId { get; set; }
        public long PrimaryUserId { get; set; }
        public long? SecondaryUserId { get; set; }
        public string DigitalSign { get; set; }
        public string DigitalSignUrl { get; set; }
        public int Status { get; set; }
        public string Remarks1 { get; set; }
        public string Remarks2 { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual WorkPermit WorkPermit { get; set; }
    }
}
