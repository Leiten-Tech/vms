import api from "../utils/api";

export const fetchCustomer = (data) => {
  return api.post("/Customer/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/Customer/CreateInitialize", data);
};
export const OnChangeCountry = (data) => {
    return api.post("/Customer/OnChangeCountry", data);
  };
export const OnChangeState = (data) => {
    return api.post("/Customer/OnChangeState", data);
  };
export const createCustomer = (data) => {
  return api.post("/Customer/Create", data);
};
export const updateCustomer = (data) => {
  return api.post("/Customer/Update", data);
};
export const deleteCustomer = (data) => {
  return api.post("/Customer/ChangeStatus", data);
};
