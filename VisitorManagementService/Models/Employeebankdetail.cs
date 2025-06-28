using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Employeebankdetail
    {
        public long Employeeid { get; set; }
        public long Employeebankid { get; set; }
        public int Bankid { get; set; }
        public string Bankbranch { get; set; }
        public int Accounttype { get; set; }
        public string Accountholdername { get; set; }
        public string Accountnumber { get; set; }
        public bool? Isdefault { get; set; }
        public string Ifsccode { get; set; }
        public int? Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Employee Employee { get; set; }
    }
}
