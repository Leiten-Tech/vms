import api from "../utils/api";

export const fetch = (data) => {
    return api.post("/Feedback/SearchInitialize", data);
  };
  export const createInit = (data) => {
    return api.post("/Feedback/CreateInitialize", data);
  };
export const create = (data) => {
    return api.post("/Feedback/Create", data);
  };
  export const update = (data) => {
    return api.post("/Feedback/Update", data);
  };
  export const changeStatus = (data) => {
    return api.post("/Feedback/ChangeStatus", data);
  };
  