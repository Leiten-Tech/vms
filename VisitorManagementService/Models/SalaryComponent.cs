using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class SalaryComponent
    {
        public long Salcompid { get; set; }
        public int? Companyid { get; set; }
        public int? Branchid { get; set; }
        public string Salcompcode { get; set; }
        public string Compname { get; set; }
        public string Compcode { get; set; }
        public int? Comptype { get; set; }
        public int? Calculationtype { get; set; }
        public int? Calculationcycle { get; set; }
        public string Calculationmonth { get; set; }
        public bool? Istaxable { get; set; }
        public string Description { get; set; }
        public int? Status { get; set; }
        public int? Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime Modifiedon { get; set; }
        public byte[] Rv { get; set; }
    }
}
