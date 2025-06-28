import api from "../utils/api";

export const CreateInitialize = (data) => {
  return api.post("/Department/CreateInitialize", data);
};
export const SearchInitialize = (data) => {
  return api.post("/Department/SearchInitialize", data);
};
export const Create = (data) => {
  return api.post("/Department/Create", data);
};
export const Update = (data) => {
    return api.post("/Department/Update", data);
  };
export const ChangeStatus = (data) => {
    return api.post("/Department/ChangeStatus", data);
  };
    
