import api from "../utils/api";

export const fetch = (data) => {
  return api.post("/VisitorEntry/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/VisitorEntry/CreateInitialize", data);
};
export const OnChangeCountry = (data) => {
  return api.post("/VisitorEntry/OnChangeCountry", data);
};
export const OnChangeState = (data) => {
  return api.post("/VisitorEntry/OnChangeState", data);
};

export const create = (data) => {
  return api.post("/VisitorEntry/Create", data);
};
export const update = (data) => {
  return api.post("/VisitorEntry/Update", data);
};
export const changestatus = (data) => {
  return api.post("/VisitorEntry/ChangeStatus", data);
};
export const CheckOut = (data) => {
  return api.post("/VisitorEntry/CheckOut", data);
};
export const CheckIn = (data) => {
  return api.post("/VisitorEntry/CheckIn", data);
};
export const CheckOutWp = (data) => {
  return api.post("/WorkPermit/CheckOutWp", data);
};
export const CheckInWp = (data) => {
  return api.post("/WorkPermit/CheckInWp", data);
};
export const CheckinCkeckoutPageLoad = (data) => {
  return api.post("/VisitorEntry/CheckinCkeckoutPageLoad", data);
};
export const FilterVisitorEntryCodeManual = (data) => {
  return api.post("/VisitorEntry/FilterVisitorEntryCodeManual", data);
};
export const FilterVisitorEntryCode = (data) => {
  return api.post("/VisitorEntry/FilterVisitorEntryCode", data);
};
export const FilterWorkPermitCode = (data) => {
  return api.post("/WorkPermit/FilterWorkPermitCode", data);
};
export const OnChangeVisitorEntryCode = (data) => {
  return api.post("/VisitorEntry/OnChangeVisitorEntryCode", data);
};
