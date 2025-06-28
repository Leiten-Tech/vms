using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Approvallog
    {
        public Approvallog()
        {
            Approvallogdetails = new HashSet<Approvallogdetail>();
        }

        public long Approvallogid { get; set; }
        public long? Companyid { get; set; }
        public long? Branchid { get; set; }
        public int Documentnameid { get; set; }
        public int Operationid { get; set; }
        public string Documentno { get; set; }
        public long Documentdetailid { get; set; }
        public int Status { get; set; }
        public int? Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public int? Accountingyear { get; set; }
        public byte[] Rv { get; set; }

        public virtual ICollection<Approvallogdetail> Approvallogdetails { get; set; }
    }
}
