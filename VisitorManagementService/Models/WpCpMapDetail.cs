using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class WpCpMapDetail
    {
        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public long? GateId { get; set; }
        public long WpCpMapDetailId { get; set; }
        public long WorkPermitId { get; set; }
        public long CategoryId { get; set; }
        public string CpDes { get; set; }
        public long CpMapId { get; set; }
        public long? Remarks { get; set; }

        public virtual WorkPermit WorkPermit { get; set; }
    }
}
