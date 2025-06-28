using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Tax
    {
        public Tax()
        {
            Taxdetails = new HashSet<Taxdetail>();
        }

        public long Taxid { get; set; }
        public string Taxcode { get; set; }
        public int Regimeid { get; set; }
        public int Componentid { get; set; }
        public int Operationid { get; set; }
        public int Calculationtypeid { get; set; }
        public string Amountformula { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public int Accountingyear { get; set; }
        public byte[] Rv { get; set; }
        public int Companyid { get; set; }
        public int Branchid { get; set; }

        public virtual ICollection<Taxdetail> Taxdetails { get; set; }
    }
}
