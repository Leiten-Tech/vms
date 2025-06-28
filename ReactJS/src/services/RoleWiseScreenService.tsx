import api from "../utils/api";

export const CreateInitialize = (data) => {
  return api.post("/RoleScreenMapping/CreateInitialize", data);
};
export const Create = (data) => {
  return api.post("/RoleScreenMapping/Create", data);
};
export const GetDefaultModules = (data) => {
  return api.post("/RoleScreenMapping/GetDefaultModules", data);
};
export const GetFunctions = (data) => {
  return api.post("/RoleScreenMapping/GetFunctions", data);
};
