import api from "../utils/api";

export const fetch = (data) => {
  return api.post("/Gate/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/Gate/CreateInitialize", data);
};
export const create = (data) => {
  return api.post("/Gate/Create", data);
};
export const update = (data) => {
  return api.post("/Gate/Update", data);
};
export const changeStatus = (data) => {
  return api.post("/Gate/ChangeStatus", data);
};
export const OnChangeCompany = (data) => {
  return api.post("/Gate/OnChangeCompany", data);
};
