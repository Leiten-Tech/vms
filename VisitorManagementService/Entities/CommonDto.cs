using System.Collections.Generic;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class CommonDto
    {
        public List<dynamic> CheckOutVisitors { get; set; }
        public ErrorContext tranStatus { get; set; }
    }
}
