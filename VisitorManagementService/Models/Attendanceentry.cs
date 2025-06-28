using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Attendanceentry
    {
        public Attendanceentry()
        {
            Biometricdetails = new HashSet<Biometricdetail>();
        }

        public long Attid { get; set; }
        public string Attcode { get; set; }
        public int? Entrytype { get; set; }
        public long? Companyid { get; set; }
        public long? Branchid { get; set; }
        public long? Departmentid { get; set; }
        public long? Employeetypeid { get; set; }
        public long? Vendorid { get; set; }
        public long? Employeeid { get; set; }
        public string Employeename { get; set; }
        public string Employeecode { get; set; }
        public long? Shiftid { get; set; }
        public DateTime? Attendancedate { get; set; }
        public DateTime? Checkin { get; set; }
        public DateTime? Checkout { get; set; }
        public decimal? Totalhoursworked { get; set; }
        public decimal? Actualhoursworked { get; set; }
        public decimal? Shiftbreakhours { get; set; }
        public decimal? Breakhourstakentoday { get; set; }
        public bool? Breakhoursexceeded { get; set; }
        public bool? Isbreakgranted { get; set; }
        public decimal? Grantedbreakhours { get; set; }
        public bool? Isoteligible { get; set; }
        public decimal? Shiftotperday { get; set; }
        public decimal? Othourstakentoday { get; set; }
        public bool? Othoursexceeded { get; set; }
        public bool? Isotgranted { get; set; }
        public decimal? Grantedothours { get; set; }
        public bool? Isearlyentry { get; set; }
        public bool? Isearlyexit { get; set; }
        public bool? Earlyexitpermissionstatus { get; set; }
        public bool? Islateentry { get; set; }
        public bool? Islateexit { get; set; }
        public bool? Lateentrypermissionstatus { get; set; }
        public long? Leavestatus { get; set; }
        public bool? Isleavegranted { get; set; }
        public long? Leavetype { get; set; }
        public bool? Iscompoffexists { get; set; }
        public DateTime? Compoffdate { get; set; }
        public bool? Ispayrollgenerated { get; set; }
        public bool? Issystemupdated { get; set; }
        public bool? Ishalfday { get; set; }
        public bool? Islop { get; set; }
        public bool? Isfine { get; set; }
        public decimal? Fineamount { get; set; }
        public decimal? Otamount { get; set; }
        public bool? Isweekoff { get; set; }
        public bool? Isholiday { get; set; }
        public int? Approvedby { get; set; }
        public int? Approvalstatus { get; set; }
        public string Approvalremarks { get; set; }
        public DateTime? Approvedon { get; set; }
        public string Remarks { get; set; }
        public int? Status { get; set; }
        public int? Createdby { get; set; }
        public DateTime? Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }
        public int? Compensationtypeid { get; set; }

        public virtual ICollection<Biometricdetail> Biometricdetails { get; set; }
    }
}
