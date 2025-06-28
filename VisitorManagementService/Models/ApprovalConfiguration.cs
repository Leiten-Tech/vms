using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class ApprovalConfiguration
    {
        public ApprovalConfiguration()
        {
            ApprovalConfigurationDetails = new HashSet<ApprovalConfigurationDetail>();
        }

        public long ApprovalConfigurationId { get; set; }
        public long CompanyId { get; set; }
        public long PlantId { get; set; }
        public long DocumentId { get; set; }
        public int ApprovalActivityId { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual ICollection<ApprovalConfigurationDetail> ApprovalConfigurationDetails { get; set; }
    }
}
