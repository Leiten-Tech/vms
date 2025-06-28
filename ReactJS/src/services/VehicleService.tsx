import api from "../utils/api";

export const fetch = (data) => {
  return api.post("/Vehicle/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/Vehicle/CreateInitialize", data);
};
export const create = (data) => {
  return api.post("/Vehicle/Create", data);
};
export const update = (data) => {
  return api.post("/Vehicle/Update", data);
};
export const changeStatus = (data) => {
  return api.post("/Vehicle/ChangeStatus", data);
};
export const OnChangeCompany = (data) => {
  return api.post("/Vehicle/OnChangeCompany", data);
};
