import api from "../utils/api";

export const fetchCountries = (data) => {
  return api.post("/Country/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/Country/CreateInitialize", data);
};

export const createCountries = (data) => {
  return api.post("/Country/Create", data);
};
export const updateCountries = (data) => {
  return api.post("/Country/Update", data);
};
export const deleteCountries = (data) => {
  return api.post("/Country/ChangeStatus", data);
};
