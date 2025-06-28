using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class VendorRegDTO
    {
        public VendorRegDTO()
        {
        }
        public ErrorContext tranStatus { get; set; }
        public List<dynamic> VendorRegList { get; set; }
        public dynamic VendorRegHeader { get; set; }
        public List<dynamic> VrWorkerDetail { get; set; }
        public List<dynamic> VrWorkerDocDetail { get; set; }
        public List<ApprovalConfiguration> ApprovalConfig { get; set; }
        public List<dynamic> VrCompanyDocDetail { get; set; }
        public List<dynamic> WorkOrganiser { get; set; }
        public List<Metadatum> WorkerStatusList { get; set; }
        public List<Metadatum> VendorStatusList { get; set; }
        public List<Metadatum> CompanyDocs { get; set; }
        public List<Metadatum> WorkDocs { get; set; }

    }
}