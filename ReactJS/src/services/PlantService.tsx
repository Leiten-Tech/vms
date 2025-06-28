import api from "../utils/api";

export const CreateInitialize = (data) => {
  return api.post("/Plant/CreateInitialize", data);
};
export const OnChangeCountry = (data) => {
  return api.post("/Plant/OnChangeCountry", data);
};

export const OnChangeState = (data) => {
  return api.post("/Plant/OnChangeState", data);
};
export const SearchInitialize = (data) => {
  return api.post("/Plant/SearchInitialize", data);
};
export const Create = (data) => {
  return api.post("/Plant/Create", data);
};
export const Update = (data) => {
    return api.post("/Plant/Update", data);
  };
export const ChangeStatus = (data) => {
    return api.post("/Plant/ChangeStatus", data);
  };
    
