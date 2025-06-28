using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Overtimerequest
    {
        public long Companyid { get; set; }
        public long Branchid { get; set; }
        public long Overtimerequestid { get; set; }
        public string Overtimerequestcode { get; set; }
        public long Employeeid { get; set; }
        public long Departmentid { get; set; }
        public int Shiftid { get; set; }
        public long Otid { get; set; }
        public DateTime Otstartdatetime { get; set; }
        public DateTime Otenddatetime { get; set; }
        public decimal Actualothours { get; set; }
        public decimal Workedothours { get; set; }
        public decimal Approvedothours { get; set; }
        public int Compensationtypeid { get; set; }
        public DateTime? Dayoffdate { get; set; }
        public decimal? Otamount { get; set; }
        public string Fileuploadurl { get; set; }
        public string Fileuploadname { get; set; }
        public string Reason { get; set; }
        public bool Ismultirequest { get; set; }
        public int Status { get; set; }
        public int Approvalstatus { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }
    }
}
