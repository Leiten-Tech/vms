using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Fafsetrequest
    {
        public Fafsetrequest()
        {
            Fafsetrequestdocdetails = new HashSet<Fafsetrequestdocdetail>();
        }

        public long Fafid { get; set; }
        public string Fafcode { get; set; }
        public int Companyid { get; set; }
        public int? Branchid { get; set; }
        public int? Departmentid { get; set; }
        public int? Employeeid { get; set; }
        public int? Relievingtype { get; set; }
        public DateTime? Resignationdate { get; set; }
        public DateTime? Relievingdate { get; set; }
        public DateTime? Finalsetdate { get; set; }
        public int? Paymentstatus { get; set; }
        public string Remarks { get; set; }
        public int? Approvalstatus { get; set; }
        public int? Approvedby { get; set; }
        public DateTime? Approvedon { get; set; }
        public string Approvalremarks { get; set; }
        public int? Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }

        public virtual ICollection<Fafsetrequestdocdetail> Fafsetrequestdocdetails { get; set; }
    }
}
