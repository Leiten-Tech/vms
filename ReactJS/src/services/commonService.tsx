import api from "../utils/api";

export const sendCheckOutTimer = (data) => {
  return api.post("/Common/CheckOutTimer", data);
};