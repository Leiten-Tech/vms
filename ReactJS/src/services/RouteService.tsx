import api from "../utils/api";

export const SearchInitialize = (data) => {
  return api.post("/Route/SearchInitialize", data);
};
export const CreateInitialize = (data) => {
  return api.post("/Route/CreateInitialize", data);
};

export const Create = (data) => {
  return api.post("/Route/Create", data);
};
export const Update = (data) => {
  return api.post("/Route/Update", data);
};
export const ChangeStatus = (data) => {
  return api.post("/Route/ChangeStatus", data);
};
