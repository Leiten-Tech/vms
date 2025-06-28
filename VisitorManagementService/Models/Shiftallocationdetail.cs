using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Shiftallocationdetail
    {
        public int Shiftallocdtlid { get; set; }
        public long Shiftallocid { get; set; }
        public int Shiftid { get; set; }
        public int Shifttypeid { get; set; }
        public int? Empid { get; set; }
        public int? Empdeptid { get; set; }
        public DateTime? Shiftallocfrom { get; set; }
        public DateTime? Shiftallocto { get; set; }
        public DateTime? Shiftdate { get; set; }
        public bool? Isshiftchanged { get; set; }
        public int? Changeshiftid { get; set; }
        public int? Changeempid { get; set; }
        public int Status { get; set; }
        public int? Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Shiftallocation Shiftalloc { get; set; }
    }
}
