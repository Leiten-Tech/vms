using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class DepartmentDto
    {
        public List<Department> DepartmentMasterList { get; set; }
        public Department HdrTable { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public List<dynamic> DepartmentList { get; set; }
        public List<dynamic> UserList { get; set; }
        public ErrorContext transtatus { get; set; }
        
    }
}