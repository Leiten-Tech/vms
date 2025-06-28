import { IMAGES } from "@/assets/images/Images";
import AppTable from "../components/AppTable";

import { lazy } from "react";
import VControlApp from "@/pages/ControlApp/vControlApp";
import CControlApp from "@/pages/ControlApp/cControlApp";

export const Pages = {
  LoginPage: lazy(() => import("../pages/Auth/Login")),

  vStatePage: lazy(() => import("../pages/master/State/vState")),
  cStatePage: lazy(() => import("../pages/master/State/cState")),

  vCountryPage: lazy(() => import("../pages/master/Country/vCountry")),
  cCountryPage: lazy(() => import("../pages/master/Country/cCountry")),

  vCompanyPage: lazy(() => import("../pages/master/Company/vCompany")),
  cCompanyPage: lazy(() => import("../pages/master/Company/cCompany")),

  vEmployeePage: lazy(() => import("../pages/master/Employee/vEmployee")),
  cEmployeePage: lazy(() => import("../pages/master/Employee/cEmployee")),

  vCityPage: lazy(() => import("../pages/master/City/vCity")),
  cCityPage: lazy(() => import("../pages/master/City/cCity")),

  vRolePage: lazy(() => import("../pages/master/Role/vRole")),
  cRolePage: lazy(() => import("../pages/master/Role/cRole")),

  vNumberingSchemaPage: lazy(
    () => import("../pages/master/NumberShema/vNumberingSchema")
  ),
  cNumberingSchemaPage: lazy(
    () => import("../pages/master/NumberShema/cNumberingSchema")
  ),

  vRoleWiseScreenPage: lazy(
    () => import("../pages/master/RoleWiseScreen/vRoleWiseScreen")
  ),

  vUserPage: lazy(() => import("../pages/master/User/vUser")),
  cUserPage: lazy(() => import("../pages/master/User/cUser")),

  vGatePage: lazy(() => import("../pages/master/Gate/vGate")),
  cGatePage: lazy(() => import("../pages/master/Gate/cGate")),

  vPlantPage: lazy(() => import("../pages/master/Plant/vPlant")),
  cPlantPage: lazy(() => import("../pages/master/Plant/cPlant")),

  vUserScreenMapping: lazy(
    () => import("../pages/master/userScreenMapping/vUserScreenMapping")
  ),

  vVisitorPage: lazy(() => import("../pages/master/Visitor/vVisitor")),
  cVisitorPage: lazy(() => import("../pages/master/Visitor/cVisitor")),

  vAreaPage: lazy(() => import("../pages/master/Area/vArea")),
  cAreaPage: lazy(() => import("../pages/master/Area/cArea")),

  vMaterialPage: lazy(() => import("../pages/master/Material/vMaterial")),
  cMaterialPage: lazy(() => import("../pages/master/Material/cMaterial")),

  vDepartmentPage: lazy(() => import("../pages/master/Department/vDepartment")),
  cDepartmentPage: lazy(() => import("../pages/master/Department/cDepartment")),

  vRoutePage: lazy(() => import("../pages/master/Route/vRoute")),
  cRoutePage: lazy(() => import("../pages/master/Route/cRoute")),

  vCustomerPage: lazy(() => import("../pages/master/Customer/vCustomer")),
  cCustomerPage: lazy(() => import("../pages/master/Customer/cCustomer")),

  vSupplier: lazy(() => import("../pages/master/Supplier/vSupplier")),
  cSupplier: lazy(() => import("../pages/master/Supplier/cSupplier")),

  vVehiclePage: lazy(() => import("../pages/master/Vehicle/vVehicle")),
  cVehiclePage: lazy(() => import("../pages/master/Vehicle/cVehicle")),

  vShiftPage: lazy(() => import("../pages/master/Shift/vShift")),
  cShiftPage: lazy(() => import("../pages/master/Shift/cShift")),

  vVisitorEntryPage: lazy(
    () => import("../pages/VisitorManagement/VisitorEntry/vVisitorEntry")
  ),
  cVisitorEntryPage: lazy(
    () => import("../pages/VisitorManagement/VisitorEntry/cVisitorEntry")
  ),

  cVisitorManagement: lazy(
    () => import("../pages/VisitorManagement/VisitorManage/cVisitorManagement")
  ),
  vVisitorManagement: lazy(
    () => import("../pages/VisitorManagement/VisitorManage/cVisitorManagement")
  ),

  vPrintPage: lazy(() => import("../components/PrintPass")),
  vPrintPreviewPage: lazy(() => import("../components/PrintPassPreview")),
  vWorkPermitPrevPage: lazy(() => import("../components/WPPrintPass")),

  vCheckInOutPage: lazy(
    () => import("../pages/VisitorManagement/CheckInCheckOut/vCheckInCheckOut")
  ),
  vApprovalPage: lazy(
    () => import("../pages/master/Approval/vApprovalConfiguration")
  ),
  cApprovalPage: lazy(
    () => import("../pages/master/Approval/cApprovalConfiguration")
  ),
  vWorkFlow: lazy(() => import("../pages/master/WorkFlow/vWorkFlow")),
  DashBoard: lazy(() => import("../pages/DashBoard/DashBoard")),

  RptCheckInCheckOutPage: lazy(
    () => import("../pages/Reports/RptCheckInCheckOut")
  ),
  BookExternalVisitor: lazy(
    () =>
      import("../pages/VisitorManagement/ExternalVisitorManage/BookExternal")
  ),
  BookExternalVehicle: lazy(
    () =>
      import(
        "../pages/VisitorManagement/ExternalVehicleManage/BookExternalVehicle"
      )
  ),
  BookExternalMultipleVisitor: lazy(
    () =>
      import(
        "../pages/VisitorManagement/ExternalMultipleVisitorManage/BookExternalMultiple"
      )
  ),
  MailApproval: lazy(
    () =>
      import("../pages/VisitorManagement/ExternalVisitorManage/MailApproval")
  ),

  vInstructionsPage: lazy(
    () => import("../pages/master/Instructions/vInstructions")
  ),
  cInstructionsPage: lazy(
    () => import("../pages/master/Instructions/cInstructions")
  ),

  vVendorRegistrationPage: lazy(
    () =>
      import(
        "../pages/VisitorManagement/VendorRegistration/vVendorRegistration"
      )
  ),
  cVendorRegistrationPage: lazy(
    () =>
      import(
        "../pages/VisitorManagement/VendorRegistration/cVendorRegistration"
      )
  ),

  vWorkPermitPage: lazy(
    () => import("../pages/VisitorManagement/WorkPermit/vWorkPermit")
  ),
  cWorkPermitPage: lazy(
    () => import("../pages/VisitorManagement/WorkPermit/cWorkPermit")
  ),
  vCheckPointMapping: lazy(
    () => import("../pages/master/CategoryCPMapping/VCategoryCPMapping")
  ),
  cCheckPointMapping: lazy(
    () => import("../pages/master/CategoryCPMapping/CCategoryCPMapping")
  ),
  vAppointmentCalendar: lazy(
    () => import("../pages/VisitorManagement/AppointmentCalendar/vAppointmentCalendar")
  ),
  cAppointmentCalendar: lazy(
    () => import("../pages/ControlApp/cControlApp")
  ),
  vFeedback: lazy(() => import("../pages/master/Feedback/vFeedback")),
  cFeedback: lazy(() => import("../pages/master/Feedback/cFeedback")),
  AdminPage: () => <div>Admin Page</div>,
  NotFound: () => (
    <div>
      <div className="page-container">
        <div className="inner-page-container">
          <div className="text-center" style={{ marginTop: "50px" }}>
            <img
              src={IMAGES.ACCESS_DENIED}
              alt="Access Denied"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
