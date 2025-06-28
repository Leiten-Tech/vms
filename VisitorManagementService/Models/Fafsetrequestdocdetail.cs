using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Fafsetrequestdocdetail
    {
        public long Fafid { get; set; }
        public long Fafdocid { get; set; }
        public int Documenttype { get; set; }
        public string Documentnumber { get; set; }
        public string Documenturlname { get; set; }
        public string Documenturl { get; set; }
        public int? Documentstatus { get; set; }
        public int? Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Fafsetrequest Faf { get; set; }
    }
}
