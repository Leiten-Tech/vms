using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Holiday
    {
        public Holiday()
        {
            Holidaydetails = new HashSet<Holidaydetail>();
            Holidayweekoffs = new HashSet<Holidayweekoff>();
        }

        public long Holidayid { get; set; }
        public int Companyid { get; set; }
        public int Branchid { get; set; }
        public int Holidayyear { get; set; }
        public string Holidaycode { get; set; }
        public int? Approvalstatus { get; set; }
        public int? Approvedby { get; set; }
        public DateTime? Approvedon { get; set; }
        public string Approvalremarks { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }

        public virtual ICollection<Holidaydetail> Holidaydetails { get; set; }
        public virtual ICollection<Holidayweekoff> Holidayweekoffs { get; set; }
    }
}
