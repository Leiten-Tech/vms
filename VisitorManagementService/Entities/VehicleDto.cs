using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class VehicleDto
    {
        public List<Vehicle> VehicleMasterList { get; set; }
        public Vehicle HdrTable { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public List<Metadatum> VehicleTypeList { get; set; }
        public List<Metadatum> PurposeList { get; set; }
        
        public List<Supplier> SupplierList { get; set; }
        public List<Employee> EmployeeList { get; set; }
        public List<Company> CompanyList { get; set; }
        public List<Plant> PlantList { get; set; }
        public List<User> DriverList { get; set; }
        public List<VehicleDocumentDetail> VehicleDocumentDetailList { get; set; }
        public List<dynamic> VehicleList { get; set; }
        public ErrorContext transtatus { get; set; }

    }
}