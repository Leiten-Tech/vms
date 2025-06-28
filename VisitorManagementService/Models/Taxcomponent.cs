using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxcomponent
    {
        public Taxcomponent()
        {
            Taxcomponentdetails = new HashSet<Taxcomponentdetail>();
        }

        public long Taxcompid { get; set; }
        public int Companyid { get; set; }
        public int Branchid { get; set; }
        public string Taxcompcode { get; set; }
        public string Taxcompname { get; set; }
        public int Calculationtype { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }

        public virtual ICollection<Taxcomponentdetail> Taxcomponentdetails { get; set; }
    }
}
