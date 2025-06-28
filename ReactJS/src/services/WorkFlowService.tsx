import api from "../utils/api";

export const fetch = (data) => {
  return api.post("/WorkFlow/SearchInitialize", data);
};
export const ApprovalView = (data) => {
  return api.post("/WorkFlow/ApprovalView", data);
};

export const approvalUpdateLevel = (data) => {
  return api.post("/ApprovalWorkFlow/ApprovalWorkFlowUpdate", data);
};
export const approvalupdate = (data) => {
  // return api.post("/ApprovalWorkFlow/ApprovalWorkFlowUpdate", data);
  return api.post("/ApprovalWorkFlow/UserWorkFlowUpdate", data);
};
export const mailApproval = (data) => {
  return api.post(`/ApprovalWorkFlow/MailApproval/${data}`);
};
export const EncryptData = (data) => {
  return api.post(`/ApprovalWorkFlow/Encrypt/${data}`);
};
export const DecryptData = (data) => {
  return api.post(`/ApprovalWorkFlow/DecryptData/${data}`);
};
export const DSendPass = (data) => {
  return api.post(`/ApprovalWorkFlow/DSendPass/${data}`);
};
export const poppupfetch = (data) => {
  return api.post("/ApprovalWorkFlow/poppupfetch", data);
};
export const CheckOutTimer = (data) => {
  return api.post("/ApprovalWorkFlow/checkOutTimer", data);
};
export const poppupupdate = (data) => {
  return api.post("/ApprovalWorkFlow/poppupupdate", data);
};
