import api from "../utils/api";

export const fetch = (data) => {
    return api.post("/VisitorEntry/SearchInitialize", data);
};
export const createInit = (data) => {
    return api.post("/VisitorEntry/CreateInitialize", data);
};
export const OnChangeWorkPermit = (data) => {
    return api.post("/VisitorEntry/OnChangeWorkPermit", data);
};
export const OnChangeVisitorType = (data) => {
    return api.post("/VisitorEntry/OnChangeVisitorType", data);
};
export const OnChangeVisitor = (data) => {
    return api.post("/VisitorEntry/OnChangeVisitor", data);
};
export const OnChangeVisHost = (data) => {
    return api.post("/VisitorEntry/OnChangeVisHost", data);
};
export const OnChangePartyType = (data) => {
    return api.post("/VisitorEntry/OnChangePartyType", data);
};
export const create = (data) => {
    return api.post("/VisitorEntry/Create", data);
};
export const update = (data) => {
    return api.post("/VisitorEntry/Update", data);
};
export const changestatus = (data) => {
    return api.post("/VisitorEntry/ChangeStatus", data);
}
export const VehicleData = (data) => {
    return api.post("/VisitorEntry/VehicleData", data);
}
export const OnChangeEntryDetail = (data) => {
    return api.post("/VisitorEntry/OnChangeEntryDetail", data);
}
export const ShowPass = (data) => {
    return api.post("/VisitorEntry/ShowPass", data);
}