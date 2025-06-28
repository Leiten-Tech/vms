using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class IndividualDashBoardDto
    {
        public List<dynamic> VisitorList { get; set; }
        public List<dynamic> HeaderList { get; set; }
        public dynamic VisitorCountList { get; set; }
        public dynamic ContractorCountList { get; set; }
        public dynamic InvoicedCountList { get; set; }
        public dynamic VehicleTripCountList { get; set; }
        public dynamic WorkpermitCountList { get; set; }
        public dynamic PurposeOfVisitList { get; set; }
        public dynamic ViewList { get; set; }
        public ErrorContext transtatus { get; set; }
    }
}