import api from "../utils/api";

export const SearchInitialize = (data) => {
  return api.post("/Role/SearchInitialize", data);
};
export const CreateInitialize = (data) => {
  return api.post("/Role/CreateInitialize", data);
};

export const Create = (data) => {
  return api.post("/Role/Create", data);
};
export const Update = (data) => {
  return api.post("/Role/Update", data);
};
export const ChangeStatus = (data) => {
  return api.post("/Role/ChangeStatus", data);
};
