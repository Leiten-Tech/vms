using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Holidayweekoff
    {
        public long Weekoffid { get; set; }
        public long Holidayid { get; set; }
        public int Weekoffday { get; set; }
        public int Weekoffpreference { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }

        public virtual Holiday Holiday { get; set; }
    }
}
