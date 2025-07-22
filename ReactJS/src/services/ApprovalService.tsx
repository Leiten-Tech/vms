import api from "../utils/api";

export const fetch = (data) => {
  return api.post("/Approval/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/Approval/CreateInitialize", data);
};
export const create = (data) => {
  return api.post("/Approval/Create", data);
};
export const update = (data) => {
  return api.post("/Approval/Update", data);
};
export const changeStatus = (data) => {
  return api.post("/Approval/ChangeStatus", data);
};
export const OnChangeRole = (data) => {
  return api.post("/Approval/OnChangeRole", data);
};
export const OnChangeDepartment = (data) => {
  return api.post("/Approval/OnChangeDepartment", data);
};

export const sendPass = (data) => {
  return api.post("/ApprovalWorkFlow/SendPass", data);
};
