import api from "../utils/api";

export const createInit = (data) => {
  return api.post("/Supplier/CreateInitialize", data);
};
export const create = (data) => {
    return api.post("/Supplier/Create", data);
};
export const update = (data) => {
    return api.post("/Supplier/Update", data);
};
export const changestatus = (data) => {
    return api.post("/Supplier/ChangeStatus", data);
};
export const OnChangeCountry = (data) => {
    return api.post("/Supplier/OnChangeCountry", data);
};
export const OnChangeState = (data) => {
    return api.post("/Supplier/OnChangeState", data);
};
export const fetch = (data) => {
    return api.post("/Supplier/SearchInitialize", data);
};