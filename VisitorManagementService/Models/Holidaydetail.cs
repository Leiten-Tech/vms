using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Holidaydetail
    {
        public long Holidaydetailsid { get; set; }
        public long Holidayid { get; set; }
        public int Holidaydetailtype { get; set; }
        public string Holidaydetailname { get; set; }
        public DateTime Holidaydetaildate { get; set; }
        public DateTime? Holidaydetailalterdate { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }

        public virtual Holiday Holiday { get; set; }
    }
}
