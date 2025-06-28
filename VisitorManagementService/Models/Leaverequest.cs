using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Leaverequest
    {
        public long Companyid { get; set; }
        public long Branchid { get; set; }
        public long Leaverequestid { get; set; }
        public string Leaverequestcode { get; set; }
        public long Employeeid { get; set; }
        public long Departmentid { get; set; }
        public string Emergencycontactno { get; set; }
        public int Leavetype { get; set; }
        public DateTime Leavestartdate { get; set; }
        public DateTime Leaveenddate { get; set; }
        public int Leavedayscount { get; set; }
        public int Leaveavailability { get; set; }
        public DateTime? Compoffdate { get; set; }
        public string Reasonforleave { get; set; }
        public string Fileuploadurl { get; set; }
        public string Fileuploadname { get; set; }
        public int Accountingyear { get; set; }
        public int? Approvalstatus { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }
    }
}
