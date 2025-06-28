using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VisitLog
    {
        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public long? GateId { get; set; }
        public long VisitLogId { get; set; }
        public long VisitorDetailId { get; set; }
        public string VisitCode { get; set; }
        public DateTime CheckedIn { get; set; }
        public DateTime? CheckedOut { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual VisitInformationDetail VisitorDetail { get; set; }
    }
}
