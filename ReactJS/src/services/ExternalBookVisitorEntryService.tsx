import api from "../utils/api";

export const fetch = (data) => {
  return api.post("/ExternalBookEntry/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/ExternalBookEntry/CreateInitialize", data);
};
export const onEnterMobileNo = (data) => {
  return api.post("/ExternalBookEntry/OnEnterMobileNo", data);
};
export const FilterVehicleNo = (data) => {
  return api.post("/ExternalBookEntry/FilterVehicleNo", data);
};
export const FilterDriver = (data) => {
  return api.post("/ExternalBookEntry/FilterDriver", data);
};
export const OnChangeVehicleNo = (data) => {
  return api.post("/ExternalBookEntry/OnChangeVehicleNo", data);
};
export const OnChangeExistVehicleNo = (data) => {
  return api.post("/ExternalBookEntry/OnChangeExistVehicleNo", data);
};
export const OnChangeVisitorType = (data) => {
  return api.post("/ExternalBookEntry/OnChangeVisitorType", data);
};
export const OnChangeVisitor = (data) => {
  return api.post("/ExternalBookEntry/OnChangeVisitor", data);
};
export const OnChangePartyType = (data) => {
  return api.post("/ExternalBookEntry/OnChangePartyType", data);
};
export const create = (data) => {
  return api.post("/ExternalBookEntry/Create", data);
};
export const update = (data) => {
  return api.post("/ExternalBookEntry/Update", data);
};
export const updateImage = (data) => {
  return api.post("/ExternalBookEntry/UpdateImage", data);
};
export const changestatus = (data) => {
  return api.post("/ExternalBookEntry/ChangeStatus", data);
};
export const OnChangePlant = (data) => {
  return api.post("/ExternalBookEntry/OnChangePlant", data);
};
export const OnChangeDepartment = (data) => {
  return api.post("/ExternalBookEntry/OnChangeDepartment", data);
};
