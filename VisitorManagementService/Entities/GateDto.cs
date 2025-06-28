using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class GateDto
    {
        public List<Gate> GateMasterList { get; set; }
        public ErrorContext transtatus { get; set; }
        public Gate HdrTable { get; set; }
        public List<dynamic> GateList { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public List<Role> RoleList { get; set; }
        public List<User> EmployeeList { get; set; }
        public List<User> SecurityList { get; set; }
        public List<Company> CompanyList { get; set; }
        public List<Plant> PlantList { get; set; }
        public List<Plant> OnChangeCompanyList { get; set; }
        public List<GateDetail> GateDetailList { get; set; }
    }
}