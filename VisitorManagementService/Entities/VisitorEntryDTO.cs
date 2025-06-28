using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class VisitorEntryDTO
    {
        public VisitorEntryDTO()
        {
        }
        public ErrorContext tranStatus { get; set; }
        public List<dynamic> EmployeeList { get; set; }
        public List<dynamic> OnchangePlantList { get; set; }
        public List<Department> DepartmentList { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public List<Metadatum> TitleList { get; set; }
        public List<Metadatum> IsPreBookingList { get; set; }
        public List<Metadatum> VisitorTypeList { get; set; }
        public List<Metadatum> VehicleTypeList { get; set; }
        public List<Metadatum> RefList { get; set; }
        public List<Metadatum> ProofList { get; set; }
        public List<Metadatum> VisitorEntryTypeList { get; set; }
        public dynamic VisitorEntryHeader { get; set; }
        public List<dynamic> VisitorEntryDetails { get; set; }
        public List<dynamic> VISENT { get; set; }
        public List<VisitorEntryDetail> VisitorEntryDetail { get; set; }
        public List<VisitorEntryBelongingDetail> VisitorEntryBelongingDetail { get; set; }
        public List<VisitorEntryMaterialDetail> VisitorEntryMaterialDetail { get; set; }
        public List<VisitorEntryAtvDetail> VisitorEntryAtvDetail { get; set; }
        public List<dynamic> VisitorEntryList { get; set; }
        public List<dynamic> WorkPermitList { get; set; }
        public List<dynamic> LastVisitorEntryList { get; set; }
        public List<VisitorEntryBelongingDetail> LastVisitorEntryBelongList { get; set; }
        public List<dynamic> VisitorEntryCheckedInOutCodeList { get; set; }
        public List<dynamic> VisitorEntryCheckInCodeList { get; set; }
        public List<dynamic> VisitorEntryCheckOutLCodeList { get; set; }
        public List<dynamic> VisitorEntryCheckOutMCodeList { get; set; }
        public List<dynamic> VisitorEmployeeList { get; set; }
        public List<dynamic> VisitorNameList { get; set; }
        public List<dynamic> UpdatedVisitorNameList { get; set; }
        public List<dynamic> VisitorWorkerList { get; set; }
        public List<dynamic> VisitorEntryLogList { get; set; }
        public List<dynamic> VisitorEntryAppovalList { get; set; }
        public List<dynamic> VehicleDataList { get; set; }
        public List<VisitorEntry> PreBookingList { get; set; }
        public List<dynamic> VehicleNoList { get; set; }
        public List<Metadatum> PartyTypeList { get; set; }
        public List<Area> AreaList { get; set; }
        public List<Route> RouteList { get; set; }
        public List<dynamic> PartyNameList { get; set; }
        public List<dynamic> DriverList { get; set; }
        public List<dynamic> VehicleList { get; set; }
        public List<dynamic> OnChangeEntryDetailList { get; set; }
        public List<Plant> PlantList { get; set; }
        public List<Material> MaterialList { get; set; }
        public List<Metadatum> PurposeList { get; set; }
        public List<Metadatum> ChallanTypeList { get; set; }
        public dynamic WorkPermitHeader { get; set; }
        public Instruction TermsConditions { get; set; }
        public List<dynamic> WorkPermitWorkerDetails { get; set; }
        public List<dynamic> WorkPermitEntryDetails { get; set; }
    }
}