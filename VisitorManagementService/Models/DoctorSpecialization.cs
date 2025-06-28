using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class DoctorSpecialization
    {
        public long DoctorSpecId { get; set; }
        public long DoctorId { get; set; }
        public int CompanyId { get; set; }
        public int BranchId { get; set; }
        public int SpecializeType { get; set; }
        public DateTime StartYear { get; set; }
        public DateTime? EndYear { get; set; }
        public int? SpecializeExp { get; set; }
        public long? Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual Doctor Doctor { get; set; }
    }
}
