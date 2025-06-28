using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class AreaDTO
    {
        public ErrorContext transtatus { get; set; }

        public Area HdrTable { get; set; }
        public List<Metadatum> StatusList { get; set; }

        public List<Company> CompanyList {get; set;}

        public List<Plant> PlantList {get; set;}

        public List<dynamic> AreaList { get; set; }


    }
}