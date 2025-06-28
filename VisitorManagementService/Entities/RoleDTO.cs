using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;
using System.Collections.Generic;
namespace VisitorManagementMySQL.Entities
{   
    public class RoleDTO
    {
      public Role Role {get;set;}
      public List<dynamic> RoleList {get;set;}
        public ErrorContext transtatus { get; set; }
         public Role HdrTable { get; set; }

        public List<Metadatum>  StatusList {get;set;}
    }
}