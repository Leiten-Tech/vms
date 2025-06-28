using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class UserDoctorMap
    {
        public long UserDoctorId { get; set; }
        public int DoctorId { get; set; }
        public long CompanyId { get; set; }
        public long UserId { get; set; }
        public int Status { get; set; }
        public int AccountingYear { get; set; }
        public bool? IsDefault { get; set; }

        public virtual User User { get; set; }
    }
}
