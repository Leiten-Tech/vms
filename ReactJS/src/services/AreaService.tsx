import api from "../utils/api";

export const CreateInitialize = (data) => {
  return api.post("/Area/CreateInitialize", data);
};
export const SearchInitialize = (data) => {
  return api.post("/Area/SearchInitialize", data);
};
export const Create = (data) => {
  return api.post("/Area/Create", data);
};
export const Update = (data) => {
    return api.post("/Area/Update", data);
  };
export const ChangeStatus = (data) => {
    return api.post("/Area/ChangeStatus", data);
  };
export const OnChangeCompany = (data) => {
  return api.post("/Area/OnChangeCompany", data);
  };
    
