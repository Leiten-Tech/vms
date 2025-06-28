using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VendorRegistration
    {
        public VendorRegistration()
        {
            VrCompanyDocs = new HashSet<VrCompanyDoc>();
            VrWorkerDetails = new HashSet<VrWorkerDetail>();
        }

        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public long? GateId { get; set; }
        public long VendorRegId { get; set; }
        public string VendorRegCode { get; set; }
        public string VendorName { get; set; }
        public DateTime VendorRegDate { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public DateTime? InsuranceValidFrom { get; set; }
        public DateTime? InsuranceValidTo { get; set; }
        public string StatusRemarks { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public long DocStatus { get; set; }

        public virtual ICollection<VrCompanyDoc> VrCompanyDocs { get; set; }
        public virtual ICollection<VrWorkerDetail> VrWorkerDetails { get; set; }
    }
}
