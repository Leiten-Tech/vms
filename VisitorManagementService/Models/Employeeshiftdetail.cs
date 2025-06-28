using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Employeeshiftdetail
    {
        public int Empshiftdtlid { get; set; }
        public int? Empid { get; set; }
        public int? Shiftid { get; set; }
        public int? Shifttypeid { get; set; }
        public int Status { get; set; }
        public int? Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
    }
}
