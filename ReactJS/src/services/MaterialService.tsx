import api from "../utils/api";

export const fetchMaterial = (data) => {
  return api.post("/Material/SearchInitialize", data);
};
export const createInit = (data) => {
  return api.post("/Material/CreateInitialize", data);
};
export const OnChangeMaterialType = (data) => {
  return api.post("/Material/OnChangeMaterialType", data);
};
export const OnChangeMaterialCatagory = (data) => {
  return api.post("/Material/OnChangeMaterialCatagory", data);
};
export const OnChangeMaterialSubCatagory = (data) => {
  return api.post("/Material/OnChangeMaterialSubCatagory", data);
};
export const OnChangeBrand = (data) => {
  return api.post("/Material/OnChangeBrand", data);
};

export const createMaterial = (data) => {
  return api.post("/Material/Create", data);
};
export const updateMaterial = (data) => {
  return api.post("/Material/Update", data);
};
export const deleteMaterial = (data) => {
  return api.post("/Material/ChangeStatus", data);
};
