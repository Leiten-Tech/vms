using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class ApprovalConfigurationDetail
    {
        public long ApprovalConfigurationDetailId { get; set; }
        public long ApprovalConfigurationId { get; set; }
        public int LevelId { get; set; }
        public long? RoleId { get; set; }
        public long PrimaryUserId { get; set; }
        public long? SecondaryUserId { get; set; }
        public byte? IsNotifyApprove { get; set; }
        public long? DepartmentId { get; set; }

        public virtual ApprovalConfiguration ApprovalConfiguration { get; set; }
    }
}
