using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Branchcompanyleaveconfig
    {
        public long Branchcompanyleaveid { get; set; }
        public long Branchid { get; set; }
        public int? Maxleaveperyear { get; set; }
        public int? Maxholidaysperyear { get; set; }
        public bool? Carryforwardleave { get; set; }
        public int? Maxcarryforwardlimit { get; set; }
        public bool? Leaveencashment { get; set; }
        public int? Compoffdays { get; set; }
        public int? Maxsickleavedays { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Branch Branch { get; set; }
    }
}
