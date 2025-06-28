using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Approvallogdetail
    {
        public int Approvallogdetailid { get; set; }
        public long? Approvallogid { get; set; }
        public int? Levelid { get; set; }
        public int? Assignedtoprimary { get; set; }
        public int? Assignedtosecondary { get; set; }
        public string Remarks { get; set; }
        public int? Raisedby { get; set; }
        public int Status { get; set; }
        public int? Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Approvallog Approvallog { get; set; }
    }
}
