using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Doctor
    {
        public Doctor()
        {
            DoctorSpecializations = new HashSet<DoctorSpecialization>();
        }

        public long DoctorId { get; set; }
        public int CompanyId { get; set; }
        public int BranchId { get; set; }
        public string RegId { get; set; }
        public string DoctorCode { get; set; }
        public string DoctorName { get; set; }
        public string Desc { get; set; }
        public DateTime Dob { get; set; }
        public int? Age { get; set; }
        public int? WorkExp { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }
        public long? AvailabilityStatus { get; set; }
        public long? ConsultationAmt { get; set; }
        public DateTime? Doj { get; set; }
        public string DoctorImageName { get; set; }
        public string DoctorImageUrl { get; set; }
        public int? Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual ICollection<DoctorSpecialization> DoctorSpecializations { get; set; }
    }
}
