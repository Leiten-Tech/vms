import api from "../utils/api";

export const fetch = (data) => {
    return api.post("/Visitor/SearchInitialize", data);
};
export const createInit = (data) => {
    return api.post("/Visitor/CreateInitialize", data);
};
export const OnChangeCountry = (data) => {
    return api.post("/Visitor/OnChangeCountry", data);
};
export const OnChangeState = (data) => {
    return api.post("/Visitor/OnChangeState", data);
};

export const create = (data) => {
    return api.post("/Visitor/Create", data);
};
export const update = (data) => {
    return api.post("/Visitor/Update", data);
};
export const changestatus = (data) => {
    return api.post("/Visitor/ChangeStatus", data);
};
