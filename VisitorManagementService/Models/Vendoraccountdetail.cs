using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Vendoraccountdetail
    {
        public int Vendoraccountid { get; set; }
        public int? Vendorid { get; set; }
        public int? Accounttypeid { get; set; }
        public int? Bankid { get; set; }
        public string Bankbranchname { get; set; }
        public string Accountholdername { get; set; }
        public string Accountno { get; set; }
        public string Ifsccode { get; set; }
        public bool? Isdefault { get; set; }
        public int Status { get; set; }
        public int? Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Vendor Vendor { get; set; }
    }
}
