import api from "../utils/api";

export const fetch = (data) => {
    return api.post("/CategoryCPMapping/SearchInitialize", data);
  };
  export const createInit = (data) => {
    return api.post("/CategoryCPMapping/CreateInitialize", data);
  };
export const create = (data) => {
    return api.post("/CategoryCPMapping/Create", data);
  };
  export const update = (data) => {
    return api.post("/CategoryCPMapping/Update", data);
  };
  export const changeStatus = (data) => {
    return api.post("/CategoryCPMapping/ChangeStatus", data);
  };
  export const filterCategory = (data) => {
    return api.post("/CategoryCPMapping/FilterCategory", data);
  };