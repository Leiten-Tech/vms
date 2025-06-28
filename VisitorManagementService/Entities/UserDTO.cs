using System.Collections.Generic;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class UserDTO
    {
        public List<Metadatum> StatusList { get; set; }
        public List<Company> CompanyList { get; set; }
        public List<Plant> PlantList { get; set; }
        public List<Gate> GateList { get; set; }
        public List<Plant> OnChangeCompany { get; set; }
        public List<Role> RoleList { get; set; }
        public List<Department> DepartmentList { get; set; }
        public List<Employee> EmployeeList { get; set; }
        public User HdrTable { get; set; }
        public User LoggedUser { get; set; }
        public List<dynamic> UserList { get; set; }
        public ErrorContext transtatus { get; set; }
        public List<UserRoleMap> UserRoleMapList { get; set; }
        public List<UserCompanyMap> UserCompanyMapList { get; set; }
        public List<UserPlantMap> UserPlantMapList { get; set; }
        public List<UserGateMap> UserGateMapList { get; set; }
    }
}