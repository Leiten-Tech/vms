using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Shiftchangerequest
    {
        public long Shiftchangereqid { get; set; }
        public string Shiftrequestcode { get; set; }
        public long Companyid { get; set; }
        public long Branchid { get; set; }
        public int Departmentid { get; set; }
        public int Empid { get; set; }
        public DateTime Shiftfromdate { get; set; }
        public DateTime Shifttodate { get; set; }
        public int Currentshiftid { get; set; }
        public int Changereqshiftid { get; set; }
        public int? Changebetweenemp { get; set; }
        public int? Approvalstatus { get; set; }
        public int? Approvedby { get; set; }
        public DateTime? Approvedon { get; set; }
        public string Approvalremarks { get; set; }
        public int Status { get; set; }
        public int? Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public int? Accountingyear { get; set; }
        public byte[] Rv { get; set; }
    }
}
