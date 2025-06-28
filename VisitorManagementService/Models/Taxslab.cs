using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxslab
    {
        public Taxslab()
        {
            Taxcessdetails = new HashSet<Taxcessdetail>();
            Taxrebatedetails = new HashSet<Taxrebatedetail>();
            Taxslabdetails = new HashSet<Taxslabdetail>();
        }

        public int Companyid { get; set; }
        public int Branchid { get; set; }
        public long Taxslabid { get; set; }
        public string Taxslabcode { get; set; }
        public int Regimetype { get; set; }
        public DateTime Taxyear { get; set; }
        public int Status { get; set; }
        public DateTime Createdon { get; set; }
        public int Createdby { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }

        public virtual ICollection<Taxcessdetail> Taxcessdetails { get; set; }
        public virtual ICollection<Taxrebatedetail> Taxrebatedetails { get; set; }
        public virtual ICollection<Taxslabdetail> Taxslabdetails { get; set; }
    }
}
