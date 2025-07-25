using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Employee
    {
        public Employee()
        {
            EmployeeDocumentDetails = new HashSet<EmployeeDocumentDetail>();
        }

        public long EmployeeId { get; set; }
        public long PlantId { get; set; }
        public string EmployeeCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? Dob { get; set; }
        public short Age { get; set; }
        public long DesignationId { get; set; }
        public long DeptId { get; set; }
        public string Email { get; set; }
        public string PrimaryMobileNo { get; set; }
        public string SecondaryMobileNo { get; set; }
        public int MaritalStatus { get; set; }
        public int Gender { get; set; }
        public int EmpTypeId { get; set; }
        public int? BiometricId { get; set; }
        public string IdcardNo { get; set; }
        public int BloodGroup { get; set; }
        public DateTime? DateOfJoining { get; set; }
        public DateTime? ReleavingDate { get; set; }
        public long ReportingPerson { get; set; }
        public string ImageName { get; set; }
        public string ImageUrl { get; set; }
        public int? Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public long? CompanyId { get; set; }
        public string Address { get; set; }

        public virtual ICollection<EmployeeDocumentDetail> EmployeeDocumentDetails { get; set; }
    }
}
