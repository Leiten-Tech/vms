using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxcomponentdetail
    {
        public long Taxcompdtlid { get; set; }
        public long Taxcompid { get; set; }
        public int Companyid { get; set; }
        public int Branchid { get; set; }
        public string Subcompname { get; set; }
        public int Subcalculationtype { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }

        public virtual Taxcomponent Taxcomp { get; set; }
    }
}
