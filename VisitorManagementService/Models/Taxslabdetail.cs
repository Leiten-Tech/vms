using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxslabdetail
    {
        public long Taxslabdtlid { get; set; }
        public long Taxslabid { get; set; }
        public decimal Slabfrom { get; set; }
        public decimal Slabto { get; set; }
        public decimal Taxpercentage { get; set; }
        public decimal Taxamount { get; set; }
        public int Status { get; set; }
        public DateTime Createdon { get; set; }
        public int Createdby { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Taxslab Taxslab { get; set; }
    }
}
