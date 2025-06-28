using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Overtime
    {
        public int Companyid { get; set; }
        public int Branchid { get; set; }
        public long Otid { get; set; }
        public string Otcode { get; set; }
        public string Otname { get; set; }
        public decimal Otrateperhr { get; set; }
        public decimal Maxothrperday { get; set; }
        public decimal Maxothrpermonth { get; set; }
        public decimal Dayotmul { get; set; }
        public decimal Nightotmul { get; set; }
        public decimal Weekendotmul { get; set; }
        public decimal Holidayotmul { get; set; }
        public int Maxcompoffreq { get; set; }
        public decimal Minoteligibilityhrs { get; set; }
        public int Status { get; set; }
        public DateTime Createdon { get; set; }
        public int Createdby { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }
    }
}
