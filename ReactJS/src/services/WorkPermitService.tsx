import api from "../utils/api";

export const createInit = (data) => {
  return api.post("/WorkPermit/CreateInitialize", data);
};

export const create = (data) => {
  return api.post("/WorkPermit/Create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const update = (data) => {
  return api.post("/WorkPermit/Update", data);
};
export const updateImage = (data) => {
  return api.post("/WorkPermit/UpdateImage", data);
};

export const fetch = (data) => {
  return api.post("/WorkPermit/SearchInitialize", data);
};
export const changestatus = (data) => {
  return api.post("/WorkPermit/ChangeStatus", data);
};
export const fetchVendor = (data) => {
  return api.post("/WorkPermit/FetchVendor", data);
};
export const onChangeVendor = (data) => {
  return api.post("/WorkPermit/OnChangeVendor", data);
};
export const fetchCheckPoints = (data) => {
  return api.post("/WorkPermit/fetchCheckPoints", data);
};
export const GetWpPass = (data) => {
  return api.post("/WorkPermit/GetWpPass", data);
};
