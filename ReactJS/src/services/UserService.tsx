import api from "../utils/api";

export const fetchUsers = (data) => {
  return api.post("/User/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/User/CreateInitialize", data);
};

export const createUsers = (data) => {
  return api.post("/User/Create", data);
};
export const ScreenMapping = (data) => {
  return api.post("/User/ScreenMapping", data);
};
export const OnChangeCompany = (data) => {
  return api.post("/User/OnChangeCompany", data);
};
export const OnChangePlant = (data) => {
  return api.post("/User/OnChangePlant", data);
};
export const updateUsers = (data) => {
  return api.post("/User/Update", data);
};
export const deleteUsers = (data) => {
  return api.post("/User/ChangeStatus", data);
};
