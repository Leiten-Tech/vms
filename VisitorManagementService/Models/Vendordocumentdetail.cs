using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Vendordocumentdetail
    {
        public int Vendordocid { get; set; }
        public int? Vendorid { get; set; }
        public int? Documenttypeid { get; set; }
        public string Documentnumber { get; set; }
        public DateTime? Validitydate { get; set; }
        public string Documenturlname { get; set; }
        public string Documenturl { get; set; }
        public int Status { get; set; }
        public int? Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Vendor Vendor { get; set; }
    }
}
