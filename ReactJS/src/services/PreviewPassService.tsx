import api from "../utils/api";

export const CreateInitialize = (data) => {
  return api.post("/PreviewPass/CreateInitialize", data);
};