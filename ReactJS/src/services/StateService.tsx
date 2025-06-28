import api from "../utils/api";

export const fetchStates = (data) => {
  return api.post("/State/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/State/CreateInitialize", data);
};

export const createStates = (data) => {
  return api.post("/State/Create", data);
};
export const updateStates = (data) => {
  return api.post("/State/Update", data);
};
export const deleteStates = (data) => {
  return api.post("/State/ChangeStatus", data);
};
