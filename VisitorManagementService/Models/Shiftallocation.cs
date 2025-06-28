using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Shiftallocation
    {
        public Shiftallocation()
        {
            Shiftallocationdetails = new HashSet<Shiftallocationdetail>();
        }

        public long Shiftallocid { get; set; }
        public long? Companyid { get; set; }
        public long? Branchid { get; set; }
        public DateTime? Shiftallocfrom { get; set; }
        public DateTime? Shiftallocto { get; set; }
        public int Status { get; set; }
        public int? Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public int? Accountingyear { get; set; }
        public byte[] Rv { get; set; }

        public virtual ICollection<Shiftallocationdetail> Shiftallocationdetails { get; set; }
    }
}
