import api from "../utils/api";

export const getTable = (data) => {
  return api.post("/UserScreenMapping/GetModuleAndFunction", data);
};
export const createInit = (data) => {
  return api.post("/UserScreenMapping/CreateInitialize", data);
};

export const GetUser = (data) => {
  return api.post("/UserScreenMapping/GetUser", data);
};
export const saveUserScreen = (data) => {
  return api.post("/UserScreenMapping/Create", data);
};
export const deleteUserScreenMapping = (data) => {
  return api.post("/UserScreenMapping/ChangeStatus", data);
};
