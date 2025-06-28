using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VrCompanyDoc
    {
        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public long? GateId { get; set; }
        public long VrCompanyDocId { get; set; }
        public long VendorRegId { get; set; }
        public string DocumentName { get; set; }
        public long? DocumentType { get; set; }
        public string DocumentNo { get; set; }
        public string DocumentUrl { get; set; }
        public string Remarks { get; set; }
        public long Status { get; set; }

        public virtual VendorRegistration VendorReg { get; set; }
    }
}
