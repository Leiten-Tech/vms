import { combineReducers } from "redux";
import alertsSlice from "@/redux/slices/common/alertsSlice";
import authSlice from "@/redux/slices/common/authSlice";
import citySlice from "@/redux/slices/master/citySlice";
import companySlice from "@/redux/slices/master/companySlice";
import countrySlice from "@/redux/slices/master/countrySlice";
import employeeSlice from "@/redux/slices/master/employeeSlice";
import materialSlice from "@/redux/slices/master/materialSlice";
import numberingShemaSlice from "@/redux/slices/master/numberingShemaSlice";
import plantSlice from "@/redux/slices/master/plantSlice";
import roleSlice from "@/redux/slices/master/roleSlice";
import rolewisescreenSlice from "@/redux/slices/master/rolewisescreenSlice";
import stateSlice from "@/redux/slices/master/stateSlice";
import userScreenMapppingSlice from "@/redux/slices/master/userScreenMapppingSlice";
import userSlice from "@/redux/slices/master/userSlice";
import visitorSlice from "@/redux/slices/master/visitorSlice";
import gateSlice from "@/redux/slices/master/gateSlice";
import departmentSlice from "@/redux/slices/master/departmentSlice";
import routeSlice from "@/redux/slices/master/routeSlice";
import customerSlice from "@/redux/slices/master/customerSlice";
import supplierSlice from "@/redux/slices/master/supplierSlice";
import vehicleSlice from "@/redux/slices/master/vehicleSlice";
import shiftSlice from "@/redux/slices/master/shiftSlice";
import areaSlice from "@/redux/slices/master/areaSlice";
import visitorentrySlice from "@/redux/slices/visitorManagement/visitorentrySlice";
import checkInCheckOutSlice from "@/redux/slices/visitorManagement/checkInCheckOutSlice";
import ApprovalSlice from "@/redux/slices/master/ApprovalSlice";
import workFlowSlice from "@/redux/slices/master/workFlowSlice";
import RptCheckInCheckOutSlice from "../slices/Reports/RptCheckInCheckOutSlice";
import externalBookEntrySlice from "@/redux/slices/visitorManagement/externalBookEntrySlice";
import externalBookVisitorSlice from "@/redux/slices/master/externalBookVisitor";
import instructionsSlice from "@/redux/slices/master/instructionsSlice";
import workPermitSlice from "@/redux/slices/visitorManagement/workPermitSlice";
import vendorRegSlice from "@/redux/slices/WorkPermit/VendorRegSlice";
import categorySlice from "@/redux/slices/master/categorySlice";
import feedbackSlice from "@/redux/slices/master/feedbackSlice";

const RootReducer = combineReducers({
  states: stateSlice,
  auth: authSlice,
  alerts: alertsSlice,
  country: countrySlice,
  city: citySlice,
  area: areaSlice,
  role: roleSlice,
  numberingSchema: numberingShemaSlice,
  company: companySlice,
  employee: employeeSlice,
  plant: plantSlice,
  user: userSlice,
  userScreenMapping: userScreenMapppingSlice,
  roleWiseScreen: rolewisescreenSlice,
  material: materialSlice,
  visitor: visitorSlice,
  gate: gateSlice,
  department: departmentSlice,
  route: routeSlice,
  customer: customerSlice,
  supplier: supplierSlice,
  vehicle: vehicleSlice,
  shift: shiftSlice,
  visitorentry: visitorentrySlice,
  checkincheckout: checkInCheckOutSlice,
  approval: ApprovalSlice,
  workflow: workFlowSlice,
  rptcheckincheckout: RptCheckInCheckOutSlice,
  externalBookVisitor: externalBookVisitorSlice,
  externalBookEntry: externalBookEntrySlice,
  instructions: instructionsSlice,
  vendorReg: vendorRegSlice,
  workPermit: workPermitSlice,
  category: categorySlice,
  feedback: feedbackSlice,
});

export default RootReducer;
