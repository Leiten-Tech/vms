using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Designation
    {
        public long Designationid { get; set; }
        public string Designationcode { get; set; }
        public string Designationname { get; set; }
        public int Company { get; set; }
        public int Branch { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }
    }
}
