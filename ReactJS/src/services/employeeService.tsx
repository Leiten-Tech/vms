import api from "../utils/api";

export const fetchEmployee = (data) => {
  return api.post("/Employee/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/Employee/CreateInitialize", data);
};

export const createEmployee = (data) => {
  return api.post("/Employee/Create", data);
};
export const updateEmployee = (data) => {
  return api.post("/Employee/Update", data);
};
export const deleteEmployee = (data) => {
  return api.post("/Employee/ChangeStatus", data);
};
