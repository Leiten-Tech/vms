using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using VisitorManagementMySQL.Utils;


namespace VisitorManagementMySQL.Entities
{
    public class VisitorDashboardDTO
    {
        public List<dynamic> VisitorList { get; set; }
        public List<dynamic> VechicleList { get; set; }

        public ErrorContext transtatus { get; set; }
    }
}