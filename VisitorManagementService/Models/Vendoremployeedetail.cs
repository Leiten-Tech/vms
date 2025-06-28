using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Vendoremployeedetail
    {
        public int Vendorempdtlid { get; set; }
        public int? Vendorid { get; set; }
        public long? Empid { get; set; }
        public string Empcode { get; set; }
        public int? Status { get; set; }
        public int? Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Vendor Vendor { get; set; }
    }
}
