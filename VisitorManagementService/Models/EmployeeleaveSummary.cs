using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class EmployeeleaveSummary
    {
        public long Leavesummaryid { get; set; }
        public long Employeeid { get; set; }
        public int? Leavetype { get; set; }
        public int? Maxleavedays { get; set; }
        public int? Leavetaken { get; set; }
        public int? Year { get; set; }
        public int? Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Employee Employee { get; set; }
    }
}
