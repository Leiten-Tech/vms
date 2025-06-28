import api from "../utils/api";

export const fetch = (data) => {
  return api.post("/Calendar/FetchAppointment", data);
};

