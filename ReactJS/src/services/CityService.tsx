import api from "../utils/api";

export const fetch = (data) => {
  return api.post("/City/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/City/CreateInitialize", data);
};
export const create = (data) => {
  return api.post("/City/Create", data);
};
export const update = (data) => {
  return api.post("/City/Update", data);
};
export const changeStatus = (data) => {
  return api.post("/City/ChangeStatus", data);
};
export const OnChangeCountry = (data) => {
  return api.post("/City/OnChangeCountry", data);
};
