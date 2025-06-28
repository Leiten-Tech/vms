using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Salarystructureprint
    {
        public int Companyid { get; set; }
        public int Branchid { get; set; }
        public int Salstructprintdtlid { get; set; }
        public long Salstructid { get; set; }
        public long? Employeeid { get; set; }
        public string Employeename { get; set; }
        public string Contactno { get; set; }
        public long Issuerempid { get; set; }
        public long Issuerdesigid { get; set; }
        public bool Isnewemployee { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Salarystructure Salstruct { get; set; }
    }
}
