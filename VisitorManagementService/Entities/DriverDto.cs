using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class DriverDto
    {
        public List<Driver> DriverMasterList { get; set; }
        public Driver HdrTable { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public List<Employee> EmployeeList { get; set; }
        public List<Supplier> SupplierList { get; set; }
        public List<dynamic> DriverList { get; set; }
        public ErrorContext transtatus { get; set; }
    }
}