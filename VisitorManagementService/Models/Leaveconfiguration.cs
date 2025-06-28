using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Leaveconfiguration
    {
        public Leaveconfiguration()
        {
            Leaveconfigdetails = new HashSet<Leaveconfigdetail>();
        }

        public long Leaveconfigid { get; set; }
        public string Leaveconfigcode { get; set; }
        public string Leavename { get; set; }
        public DateTime Leaveconfigyear { get; set; }
        public int Employeetype { get; set; }
        public int Companyid { get; set; }
        public int Branchid { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public int Accountingyear { get; set; }
        public byte[] Rv { get; set; }

        public virtual ICollection<Leaveconfigdetail> Leaveconfigdetails { get; set; }
    }
}
