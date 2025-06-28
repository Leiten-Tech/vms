using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxcessdetail
    {
        public long Taxcessdtlid { get; set; }
        public long Taxslabid { get; set; }
        public string Taxcessname { get; set; }
        public decimal Taxcesspercent { get; set; }
        public int Status { get; set; }
        public DateTime Createdon { get; set; }
        public int Createdby { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Taxslab Taxslab { get; set; }
    }
}
