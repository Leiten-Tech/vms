using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Employeepreviouscompany
    {
        public long Employeeid { get; set; }
        public string Employeecode { get; set; }
        public long Employeeprecompid { get; set; }
        public string Companyname { get; set; }
        public string Designation { get; set; }
        public int? Employeetype { get; set; }
        public DateTime? Startdate { get; set; }
        public DateTime? Enddate { get; set; }
        public int? Totalyearofexperience { get; set; }
        public int? Lastdrawnsalary { get; set; }
        public string Reasonforrelieving { get; set; }
        public string Reportingpersonname { get; set; }
        public string Reportingpersoncontactnumber { get; set; }
        public string Hrcontactnumber { get; set; }
        public string Attachmentname { get; set; }
        public string Attachmenturl { get; set; }
        public int? Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Employee Employee { get; set; }
    }
}
