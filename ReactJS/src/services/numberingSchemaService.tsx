import api from "../utils/api";

export const fetchNumberingSchema = (data) => {
  return api.post("/NumberingSchema/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/NumberingSchema/CreateInitialize", data);
};

export const createNumberingSchema = (data) => {
  return api.post("/NumberingSchema/Create", data);
};
export const updateNumberingSchema = (data) => {
  return api.post("/NumberingSchema/Update", data);
};
export const deleteNumberingSchema = (data) => {
  return api.post("/NumberingSchema/ChangeStatus", data);
};
