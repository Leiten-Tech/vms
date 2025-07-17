import api from "../utils/api";

export const fetch = (data) => {
  return api.post("/IndividualDashBoard/SearchInitialize", data);
};
export const dashOnClick = (data) => {
  return api.post("/IndividualDashBoard/DashboardOnclick", data);
};
export const GetVisitor = (data) => {
  return api.post("/VisitorDashBoard/SearchInitialize", data);
};