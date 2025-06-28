import api from "../utils/api";
import { v4 as uuidv4 } from "uuid";

const generateHeaders = () => {
  let headers = {
    headers: {
      SessionId: uuidv4(),
    },
  };
  return headers;
};

export const login = (data) => {
  return api.post("/Login/Login", data, generateHeaders());
};
export const getHeadGate = (data) => {
  return api.post("/Login/GetHeaderGate", data);
};
export const logout = (data) => {
  return api.post("/Login/Logout", data);
};
export const checkAuthTrial = (data) => {
  return api.post("/Trial/CheckTrial", data);
};
