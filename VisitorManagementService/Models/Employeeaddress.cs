using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Employeeaddress
    {
        public long Employeeid { get; set; }
        public long Employeeaddressid { get; set; }
        public int Countryid { get; set; }
        public int Stateid { get; set; }
        public int Cityid { get; set; }
        public string Personalmailid { get; set; }
        public string Primarycontactnumber { get; set; }
        public string Emergencycontactnumber { get; set; }
        public int? Relation { get; set; }
        public string Address { get; set; }
        public int? Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual Employee Employee { get; set; }
    }
}
