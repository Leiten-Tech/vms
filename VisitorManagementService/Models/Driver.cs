using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Driver
    {
        public long DriverId { get; set; }
        public string DriverCode { get; set; }
        public long EmpId { get; set; }
        public long SuppId { get; set; }
        public DateTime Dob { get; set; }
        public int Age { get; set; }
        public string DrivingLicenceNo { get; set; }
        public DateTime LicenseValidity { get; set; }
        public string HeavyBatchNo { get; set; }
        public DateTime BatchValidity { get; set; }
        public int DriverMobileNo { get; set; }
        public string NationalIdNo { get; set; }
        public string ContactAddress { get; set; }
        public string EmergencyContactName { get; set; }
        public int EmergencyContactNo { get; set; }
        public string DocumentRefrenceName { get; set; }
        public string UploadDocument { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
