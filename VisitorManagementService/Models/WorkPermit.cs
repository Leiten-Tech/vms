using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class WorkPermit
    {
        public WorkPermit()
        {
            WpApprovalDetails = new HashSet<WpApprovalDetail>();
            WpCategoryDetails = new HashSet<WpCategoryDetail>();
            WpCompanyDocs = new HashSet<WpCompanyDoc>();
            WpCpMapDetails = new HashSet<WpCpMapDetail>();
            WpWorkerDetails = new HashSet<WpWorkerDetail>();
        }

        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public long? GateId { get; set; }
        public long WorkPermitId { get; set; }
        public string WorkPermitCode { get; set; }
        public DateTime WorkPermitDate { get; set; }
        public long? DeptId { get; set; }
        public long? VendorRegId { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public string ContractName { get; set; }
        public long? WorkOrganizer { get; set; }
        public string PoNo { get; set; }
        public string StatusRemarks { get; set; }
        public long DocStatus { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual ICollection<WpApprovalDetail> WpApprovalDetails { get; set; }
        public virtual ICollection<WpCategoryDetail> WpCategoryDetails { get; set; }
        public virtual ICollection<WpCompanyDoc> WpCompanyDocs { get; set; }
        public virtual ICollection<WpCpMapDetail> WpCpMapDetails { get; set; }
        public virtual ICollection<WpWorkerDetail> WpWorkerDetails { get; set; }
    }
}
