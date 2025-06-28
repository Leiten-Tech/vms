using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class WIntegrationDTO
    {
        public List<dynamic> WorkFlowList { get; set; }
        public List<dynamic> WorkFlowCountList { get; set; }
        public List<dynamic> ApprovalViewList { get; set; }
        public ErrorContext tranStatus { get; set; }
    }
}