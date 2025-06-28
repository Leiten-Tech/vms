using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Bank
    {
        public long Bankid { get; set; }
        public string Bankcode { get; set; }
        public string Bankname { get; set; }
        public int Status { get; set; }
        public int Companyid { get; set; }
        public int Branchid { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }
    }
}
