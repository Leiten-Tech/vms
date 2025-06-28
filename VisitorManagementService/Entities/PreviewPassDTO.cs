using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class PreviewPassDto
    {
        public List<dynamic> PlantList { get; set; }
        public ErrorContext transtatus { get; set; }
    }
}
