import api from "../utils/api";

export const fetch = (data) => {
  return api.post("/ExternalBookVisitor/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/ExternalBookVisitor/CreateInitialize", data);
};
export const OnChangeCountry = (data) => {
  return api.post("/ExternalBookVisitor/OnChangeCountry", data);
};
export const OnChangeState = (data) => {
  return api.post("/ExternalBookVisitor/OnChangeState", data);
};

export const create = (data) => {
  return api.post("/ExternalBookVisitor/Create", data);
};
export const update = (data) => {
  return api.post("/ExternalBookVisitor/Update", data);
};
export const changestatus = (data) => {
  return api.post("/ExternalBookVisitor/ChangeStatus", data);
};
