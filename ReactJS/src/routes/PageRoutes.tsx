import { Layouts } from "../layouts/Layout";
import { Pages } from "./Pages";

export const PageRoutes = [
  {
    path: "/",
    Component: Pages.LoginPage,
    index: true,
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vState",
        Component: Pages.vStatePage,
        exact: true,
      },
      {
        path: "/cState",
        Component: Pages.cStatePage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vCountry",
        Component: Pages.vCountryPage,
        exact: true,
      },
      {
        path: "/cCountry",
        Component: Pages.cCountryPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vCompany",
        Component: Pages.vCompanyPage,
        exact: true,
      },
      {
        path: "/cCompany",
        Component: Pages.cCompanyPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vCity",
        Component: Pages.vCityPage,
        exact: true,
      },
      {
        path: "/cCity",
        Component: Pages.cCityPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vEmployee",
        Component: Pages.vEmployeePage,
        exact: true,
      },
      {
        path: "/cEmployee",
        Component: Pages.cEmployeePage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vNumberingSchema",
        Component: Pages.vNumberingSchemaPage,
        exact: true,
      },
      {
        path: "/cNumberingSchema",
        Component: Pages.cNumberingSchemaPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vRole",
        Component: Pages.vRolePage,
        exact: true,
      },
      {
        path: "/cRole",
        Component: Pages.cRolePage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vRoleWiseScreenMapping",
        Component: Pages.vRoleWiseScreenPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vUser",
        Component: Pages.vUserPage,
        exact: true,
      },
      {
        path: "/cUser",
        Component: Pages.cUserPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vUserWiseScreenMapping",
        Component: Pages.vUserScreenMapping,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vGate",
        Component: Pages.vGatePage,
        exact: true,
      },
      {
        path: "/cGate",
        Component: Pages.cGatePage,
        exact: true,
      },
    ],
  },

  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vPlant",
        Component: Pages.vPlantPage,
        exact: true,
      },
      {
        path: "/cPlant",
        Component: Pages.cPlantPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vVisitor",
        Component: Pages.vVisitorPage,
        exact: true,
      },
      {
        path: "/cVisitor",
        Component: Pages.cVisitorPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vArea",
        Component: Pages.vAreaPage,
        exact: true,
      },
      {
        path: "/cArea",
        Component: Pages.cAreaPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vMaterial",
        Component: Pages.vMaterialPage,
        exact: true,
      },
      {
        path: "/cMaterial",
        Component: Pages.cMaterialPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vDepartment",
        Component: Pages.vDepartmentPage,
        exact: true,
      },
      {
        path: "/cDepartment",
        Component: Pages.cDepartmentPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vRoute",
        Component: Pages.vRoutePage,
        exact: true,
      },
      {
        path: "/cRoute",
        Component: Pages.cRoutePage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vCustomer",
        Component: Pages.vCustomerPage,
        exact: true,
      },
      {
        path: "/cCustomer",
        Component: Pages.cCustomerPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vSupplier",
        Component: Pages.vSupplier,
        exact: true,
      },
      {
        path: "/cSupplier",
        Component: Pages.cSupplier,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vVehicle",
        Component: Pages.vVehiclePage,
        exact: true,
      },
      {
        path: "/cVehicle",
        Component: Pages.cVehiclePage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vShift",
        Component: Pages.vShiftPage,
        exact: true,
      },
      {
        path: "/cShift",
        Component: Pages.cShiftPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vVisitorEntry",
        Component: Pages.vVisitorEntryPage,
        exact: true,
      },
      {
        path: "/cVisitorEntry",
        Component: Pages.cVisitorEntryPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.HomeLayout,
    modules: [
      {
        path: "/print",
        Component: Pages.vPrintPreviewPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.HomeLayout,
    modules: [
      {
        path: "/workpermit",
        Component: Pages.vWorkPermitPrevPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vCheckInOut",
        Component: Pages.vCheckInOutPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vApprovalConfiguration",
        Component: Pages.vApprovalPage,
        exact: true,
      },
      {
        path: "/cApprovalConfiguration",
        Component: Pages.cApprovalPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      // {
      //   path: "/vVisitorManagement",
      //   Component: Pages.vVisitorManagement,
      //   exact: true,
      // },
      {
        path: "/cVisitorManagement",
        Component: Pages.cVisitorManagement,
        exact: true,
      },
    ],
  },

  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vWorkFlow",
        Component: Pages.vWorkFlow,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/Individual",
        Component: Pages.DashBoard,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: false,
    Layout: Layouts.HomeLayout,
    modules: [
      {
        path: "/cAppointment",
        Component: Pages.BookExternalVisitor,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/RptCheckInCheckOut",
        Component: Pages.RptCheckInCheckOutPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.HomeLayout,
    modules: [
      {
        path: "/MailApproval",
        Component: Pages.MailApproval,
        exact: true,
      },
    ],
  },
    {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.HomeLayout,
    modules: [
      {
        path: "/MailReschedule",
        Component: Pages.MailReschedule,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vInstructions",
        Component: Pages.vInstructionsPage,
        exact: true,
      },
      {
        path: "/cInstructions",
        Component: Pages.cInstructionsPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vVendorRegistration",
        Component: Pages.vVendorRegistrationPage,
        exact: true,
      },
      {
        path: "/cVendorRegistration",
        Component: Pages.cVendorRegistrationPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vWorkPermit",
        Component: Pages.vWorkPermitPage,
        exact: true,
      },
      {
        path: "/cWorkPermit",
        Component: Pages.cWorkPermitPage,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: false,
    Layout: Layouts.HomeLayout,
    modules: [
      {
        path: "/vAppointment",
        Component: Pages.BookExternalMultipleVisitor,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vCheckPointMapping",
        Component: Pages.vCheckPointMapping,
        exact: true,
      },
      {
        path: "/cCheckPointMapping",
        Component: Pages.cCheckPointMapping,
        exact: true,
      },
    ],
  },

  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: false,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vFeedbackReport",
        Component: Pages.vFeedback,
        exact: true,
      },
      {
        path: "/cFeedbackReport",
        Component: Pages.cFeedback,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: false,
    Layout: Layouts.HomeLayout,
    modules: [
      {
        path: "/Feedback",
        Component: Pages.cFeedback,
        exact: true,
      },
    ],
  },
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: false,
    Layout: Layouts.HomeLayout,
    modules: [
      {
        path: "/cVehicleEntry",
        Component: Pages.BookExternalVehicle,
        exact: true,
      },
    ],
  },

  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: true,
    Layout: Layouts.HomeLayout,
    modules: [
      {
        path: "/vVisitorDashboard",
        Component: Pages.VisitorDashboard,
        exact: true,
      },
    ],
  },
  
  {
    path: "/home",
    Component: Pages.AdminPage,
    Private: false,
    Layout: Layouts.AppLayout,
    modules: [
      {
        path: "/vAppointmentCalendar",
        Component: Pages.vAppointmentCalendar,
        exact: true,
      }
    ],
  },
  {
    path: "",
    Component: Pages.NotFound,
    Layout: Layouts.AppLayout,
  },
];
