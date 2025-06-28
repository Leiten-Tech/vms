using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Biometrictemp
    {
        public long Biotempid { get; set; }
        public int? Companyid { get; set; }
        public int? Branchid { get; set; }
        public long? Attbioid { get; set; }
        public string Attbiocode { get; set; }
        public int? Attdeptid { get; set; }
        public int? Attempid { get; set; }
        public string Attempname { get; set; }
        public string Attempcode { get; set; }
        public DateTime? Attindate { get; set; }
        public DateTime? Attintime { get; set; }
        public DateTime? Attoutdate { get; set; }
        public DateTime? Attouttime { get; set; }
        public int? Attworkedhours { get; set; }
        public int? Attsumid { get; set; }
        public string Attshiftname { get; set; }
        public int? Attshiftid { get; set; }
        public int? Createdby { get; set; }
        public DateTime? Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
    }
}
