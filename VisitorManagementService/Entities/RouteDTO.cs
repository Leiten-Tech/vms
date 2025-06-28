using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class RouteDTO
    {
        public ErrorContext transtatus { get; set; }
        public Route HdrTable { get; set; }
        public List<Metadatum> StatusList {get; set;} 

        public List<dynamic> Route { get; set; }
        public List<dynamic> RouteList { get; set; }

    }
}