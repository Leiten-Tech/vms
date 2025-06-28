import api from "../utils/api";

export const SearchInitialize = (data) => {
  return api.post("/Company/SearchInitialize", data);
};
export const CreateInitialize = (data) => {
  return api.post("/Company/CreateInitialize", data);
};
export const OnChangeCountry = (data) => {
  return api.post("/Plant/OnChangeCountry", data);
};

export const OnChangeState = (data) => {
  return api.post("/Plant/OnChangeState", data);
};
export const Create = (data) => {
  return api.post("/Company/Create", data);
};
export const Update = (data) => {
  return api.post("/Company/Update", data);
};
export const ChangeStatus = (data) => {
  return api.post("/Company/ChangeStatus", data);
};
