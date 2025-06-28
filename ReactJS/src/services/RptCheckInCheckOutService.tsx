import api from "../utils/api";

export const CreateInitialize = (data) => {
  return api.post("/RptCheckInCheckOut/CreateInitialize", data);
};
// export const OnChangeVisitor = (data) => {
//   return api.post("/RptCheckInCheckOut/OnChangeVisitor", data);
// };
export const SearchInitialize = (data) => {
  return api.post("/RptCheckInCheckOut/SearchInitialize", data);
};

