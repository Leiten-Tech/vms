import api from "../utils/api";

export const SearchInitialize = (data) => {
  return api.post("/Shift/SearchInitialize", data);
};
export const CreateInitialize = (data) => {
  return api.post("/Shift/CreateInitialize", data);
  };
export const Create = (data) => {
  return api.post("/Shift/Create", data);
};
export const Update = (data) => {
  return api.post("/Shift/Update", data);
};
export const ChangeStatus = (data) => {
  return api.post("/Shift/ChangeStatus", data);
};
