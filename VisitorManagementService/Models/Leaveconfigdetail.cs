using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Leaveconfigdetail
    {
        public long Leaveconfigdetailid { get; set; }
        public long Leaveconfigid { get; set; }
        public int Leavetype { get; set; }
        public int? Maxleavedays { get; set; }
        public int? Maxlimitperrequest { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Leaveconfiguration Leaveconfig { get; set; }
    }
}
