using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class WorkPermitDTO
    {
        public WorkPermitDTO()
        {
        }
        public ErrorContext tranStatus { get; set; }
        public List<dynamic> WorkPermitList { get; set; }
        public dynamic WorkPermitHeader { get; set; }
        public List<dynamic> WpWorkerDetail { get; set; }
        public List<dynamic> WpWorkerDocDetail { get; set; }
        public List<dynamic> WpCompanyDocDetail { get; set; }
        public List<dynamic> WpApprovalList { get; set; }
        public List<dynamic> WpCategoryDetail { get; set; }
        public List<dynamic> VendorRegs { get; set; }
        public List<dynamic> WorkOrganiser { get; set; }
        public List<Metadatum> WorkerStatusList { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public List<Metadatum> CompanyDocs { get; set; }
        public List<VendorRegistration> VendorList { get; set; }
        public List<dynamic> WpCheckPoints { get; set; }
        public dynamic WpPassHead { get; set; }
        public List<Metadatum> WorkDocs { get; set; }
        public List<Category> Categories { get; set; }
        public List<Department> Departments { get; set; }
        public List<VrWorkerDetail> VendorWorkersList { get; set; }
        public List<dynamic> WorkPermitCheckedInOutCodeList { get; set; }
        public List<dynamic> WorkPermitCheckInCodeList { get; set; }
        public List<dynamic> WorkPermitCheckOutLCodeList { get; set; }
        public List<dynamic> WorkPermitCheckOutMCodeList { get; set; }
        public List<dynamic> WorkPermitAppovalList { get; set; }

    }
}