import api from "../utils/api";

export const createInit = (data) => {
  return api.post("/VendorReg/CreateInitialize", data);
};

export const create = (data) => {
  return api.post("/VendorReg/Create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const update = (data) => {
  return api.post("/VendorReg/Update", data);
};

export const fetch = (data) => {
  return api.post("/VendorReg/SearchInitialize", data);
};
export const changestatus = (data) => {
  return api.post("/VendorReg/ChangeStatus", data);
};
