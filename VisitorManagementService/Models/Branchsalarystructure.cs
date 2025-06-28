using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Branchsalarystructure
    {
        public long Branchsalarystructureid { get; set; }
        public long Branchcompanysalaryid { get; set; }
        public DateTime Fromdate { get; set; }
        public DateTime Todate { get; set; }
        public int Salarystructuretype { get; set; }
        public int Accountingyear { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Branchcompanysalaryconfig Branchcompanysalary { get; set; }
    }
}
