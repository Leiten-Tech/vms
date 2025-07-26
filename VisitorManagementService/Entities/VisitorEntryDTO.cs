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
        public List<dynamic> VisitorDocDetailsList { get; set; }
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
        public List<dynamic> reScheduleVisiorList { get; set; }
        public dynamic VisitorEntry { get; set; }
        public List<dynamic> VisitorDocDetailList { get; set; }



        //***ANDROID START 

        //ANDROID
        public List<User> PersonDetails { get; set; }
        public string visitorentrycode { get; set; }
        public List<AndroidHostAppointmentDetails> HostRequestDetails { get; set; }
        public List<SecurityDashboardResponse> SecurityDashboardResponse { get; set; }
        public List<AndroidHostAppointmentDetails> HostApprovedDetails { get; set; }
        public List<AndroidHostAppointmentDetails> HostRejectedDetails { get; set; }
        public List<AndroidHostAppointmentDetails> HostCompletedDetails { get; set; }
        public List<AndroidVisitorAppointmentDetails> VisitorRequestDetails { get; set; }
        public List<AndroidVisitorAppointmentDetails> VisitorApprovedDetails { get; set; }
        public List<AndroidVisitorAppointmentDetails> VisitorRejectedDetails { get; set; }
        public List<AndroidVisitorAppointmentDetails> VisitorCompletedDetails { get; set; }

        public AndroidVisitorPassDetails AndroidVisitorPassDetails { get; set; }
        public AndroidDashBoardDetails AndroidDashBoardDetails { get; set; }

        public List<AndroidVisitorPassBelonginDetails> AndroidVisitorPassBelonginDetails { get; set; }
        public List<dynamic> MobileExists { get; set; }

        public List<AndroidNotificationDetails> NewNotification { get; set; }
        public List<AndroidNotificationDetails> OldNotification { get; set; }

    }
    public class AndroidHostAppointmentDetails
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public int PlantId { get; set; }
        public string PlantName { get; set; }
        public string VisitorEntryCode { get; set; }
        public string RequestDate { get; set; }
        public int VisitorId { get; set; }
        public string VisitorName { get; set; }
        public int HostId { get; set; }
        public string HostName { get; set; }
        public string PurposeOfVisit { get; set; }
        public string Address { get; set; }
        public int status { get; set; }
        public string CheckIn { get; set; }
        public string Imageurl { get; set; }
        public string CheckOut { get; set; }
        public string Visitorcheckout { get; set; }
        public string meetingclose { get; set; }
        public string VisitEndTime { get; set; }
        public string AlterAfterMins { get; set; }

    }
    public class SecurityDashboardResponse
    {
        public string PersonName { get; set; }
        public string HostName { get; set; }
        public string VisitorEntryCode { get; set; }
        public string MobileNo { get; set; }
        public string ValidFrom { get; set; }
        public string VisitorImageUrl { get; set; } // Nullable
        public int VisitorTypeId { get; set; }
        public string Statusname { get; set; }
        public string PurposeOfVisitName { get; set; }
        public string VisitorTypeName { get; set; }
        public string VisitedEmployeeName { get; set; }
        public string AreaToVisitName { get; set; }

    }
    public class AndroidVisitorAppointmentDetails
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public int PlantId { get; set; }
        public string PlantName { get; set; }
        public string VisitorEntryCode { get; set; }
        public string RequestDate { get; set; }
        public int VisitorId { get; set; }
        public string VisitorName { get; set; }
        public int HostId { get; set; }
        public string HostName { get; set; }
        public string PurposeOfVisit { get; set; }
        public string Address { get; set; }
        public int status { get; set; }
        public string CheckIn { get; set; }



    }
    public class AndroidVisitorPassDetails
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public int PlantId { get; set; }
        public string PlantName { get; set; }
        public string VisitorEntryCode { get; set; }
        public string RequestDate { get; set; }
        public int VisitorId { get; set; }
        public string VisitorName { get; set; }
        public int HostId { get; set; }
        public string HostName { get; set; }
        public string HostContactNo { get; set; }
        public string PurposeOfVisit { get; set; }
        public string Address { get; set; }
        public int status { get; set; }
        public bool CheckIn { get; set; }
        public bool CheckOut { get; set; }
        public string VisitorImageUrl { get; set; }
        public string VisitorContactNo { get; set; }
         public string CheckedInDate { get; set; }
        public string CheckedOutDate { get; set; }


    }
    public class visitorcheckincheckoutrequest
    {
        public string VisitorRequestNo { get; set; }
        public int qrcodecompanyid { get; set; }
        public int qrcodeplantid { get; set; }
        public int qrcoderoleid { get; set; }
    }
    public class AndroidVisitorPassBelonginDetails
    {
        public string DeviceName { get; set; }
        public string DeviceNo { get; set; }

    }
    public class AndroidDashBoardDetails
    {
        public int TOTALVISITORSCOUNT { get; set; }
        public int TOTALAPPROVEDCOUNT { get; set; }
        public int TOTALREJECTEDCOUNT { get; set; }
        public int TODAYSMEETINGCOUNT { get; set; }
        public int TOTALNOTIFICATIONCOUNT { get; set; }
        public int TOTALCHECKINCOUNT { get; set; }
        public int TOTALCHECKOUTCOUNT { get; set; }
        public int TOTALVISITORREQUESTCOUNT { get; set; }
        public int TOTALVISITORAPPROVEDCOUNT { get; set; }
        public int TOTALVISITORREJECTEDCOUNT { get; set; }
        public int TOTALVISITORCHECKINCOUNT { get; set; }
        public int TOTALVISITORCHECKOUTCOUNT { get; set; }

    }
    public class AndroidNotificationDetails
    {
        public int NotificationId { get; set; }
        public string Notificationtype { get; set; }
        public int HostId { get; set; }
        public string HostName { get; set; }
        public string VisitorEntryCode { get; set; }
        public string RequestDate { get; set; }
        public int VisitorId { get; set; }
        public string VisitorName { get; set; }
        public string PurposeOfVisit { get; set; }
        public string imageurl { get; set; }
        public string Address { get; set; }
        public int status { get; set; }
        public string CheckIn { get; set; }
        public string CheckOut { get; set; }

    }

///ANDROID END *******
}