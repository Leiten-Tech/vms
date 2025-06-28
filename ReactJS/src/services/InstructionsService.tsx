import api from "../utils/api";

export const SearchInitialize = (data) => {
  return api.post("/Instructions/SearchInitialize", data);
};
export const CreateInitialize = (data) => {
  return api.post("/Instructions/CreateInitialize", data);
};
export const OnChangeCompany = (data) => {
  return api.post("/Instructions/OnChangeCompany", data);
};

export const Create = (data) => {
  return api.post("/Instructions/Create", data);
};
export const Update = (data) => {
  return api.post("/Instructions/Update", data);
};
export const ChangeStatus = (data) => {
  return api.post("/Instructions/ChangeStatus", data);
};
