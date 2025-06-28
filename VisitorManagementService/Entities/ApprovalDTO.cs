using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class ApprovalDTO
    {
        public List<Metadatum> StatusList { get; set; }
        public List<Plant> PlantList { get; set; }
        public List<Function> DocumentList { get; set; }
        public List<Metadatum> ActivityList { get; set; }
        public List<Metadatum> LevelList { get; set; }
        public List<Role> RoleList { get; set; }
        public List<User> PrimaryUserList { get; set; }
        public List<User> SecondaryUserList { get; set; }
        public ApprovalConfiguration HdrTable { get; set; }
        public List<ApprovalConfigurationDetail> DetailList { get; set; }
        public List<dynamic> ApprovalList { get; set; }
        public ErrorContext transtatus { get; set; }
    }
}