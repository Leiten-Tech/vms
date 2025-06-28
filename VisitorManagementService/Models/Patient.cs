using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Patient
    {
        public Patient()
        {
            PatientDocs = new HashSet<PatientDoc>();
        }

        public long PatientId { get; set; }
        public int CompanyId { get; set; }
        public int BranchId { get; set; }
        public string PatientCode { get; set; }
        public string PatientName { get; set; }
        public DateTime? Dob { get; set; }
        public int? Age { get; set; }
        public int? Gender { get; set; }
        public string ContactNumber { get; set; }
        public string EmergencyContact { get; set; }
        public int? BloodGroup { get; set; }
        public string Email { get; set; }
        public int? PatientType { get; set; }
        public int? Nationality { get; set; }
        public string Address { get; set; }
        public string InsuranceProvider { get; set; }
        public string InsurancePolicyNo { get; set; }
        public DateTime? LastVisitDate { get; set; }
        public long Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual ICollection<PatientDoc> PatientDocs { get; set; }
    }
}
