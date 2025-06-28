using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Branchcompanysalaryconfig
    {
        public Branchcompanysalaryconfig()
        {
            Branchsalarystructures = new HashSet<Branchsalarystructure>();
        }

        public long Branchcompanysalaryid { get; set; }
        public long Branchid { get; set; }
        public DateTime Financialyearfrom { get; set; }
        public DateTime Financialyearto { get; set; }
        public DateTime Accountingyearfrom { get; set; }
        public DateTime Accountingyearto { get; set; }
        public int Salaryperiod { get; set; }
        public int? Salarymonthtype { get; set; }
        public int? Salaryperiodfrom { get; set; }
        public int? Salaryperiodto { get; set; }
        public string Pfcodeno { get; set; }
        public string Esicodeno { get; set; }
        public DateTime? Lastdateoftaxdeclaration { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public int? Calculatemonth { get; set; }
        public bool? Ispfeligible { get; set; }
        public bool? Isesieligible { get; set; }
        public bool? Isholidaypayeligible { get; set; }
        public int? Holidaypayeligibility { get; set; }

        public virtual Branch Branch { get; set; }
        public virtual ICollection<Branchsalarystructure> Branchsalarystructures { get; set; }
    }
}
