using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VisitInformationDetail
    {
        public VisitInformationDetail()
        {
            VisitLogs = new HashSet<VisitLog>();
        }

        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public long? GateId { get; set; }
        public long VisitorDetailId { get; set; }
        public long VisitId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public long? DepartmentId { get; set; }
        public DateTime? Dob { get; set; }
        public string MailId { get; set; }
        public string MobileNo { get; set; }
        public string Address { get; set; }
        public string DocumentName { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int? WorkSeverity { get; set; }
        public int Status { get; set; }

        public virtual VisitInformation VisitorDetail { get; set; }
        public virtual ICollection<VisitLog> VisitLogs { get; set; }
    }
}
