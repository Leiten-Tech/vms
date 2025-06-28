using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Employeesalarydetail
    {
        public long Employeeid { get; set; }
        public string Employeecode { get; set; }
        public long Employeesalaryid { get; set; }
        public int Salarycode { get; set; }
        public int Salaryprocess { get; set; }
        public int? Joiningbonus { get; set; }
        public int? Loaneligibilityamount { get; set; }
        public int Taxregime { get; set; }
        public DateTime? Lastpaymentdate { get; set; }
        public int? Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public DateTime? Salaryprocessstopdate { get; set; }

        public virtual Employee Employee { get; set; }
    }
}
