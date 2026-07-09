import api from "../services/api";

export const getCreditSummary = async () => {
  const response = await api.get("/credit/summary");
  return response.data;
};

export const getSupplierPurchases = async () => {
  const response = await api.get("/credit/supplier-purchases");
  return response.data;
};

export const addSupplierPurchase = async (purchaseData) => {
  const response = await api.post("/credit/supplier-purchases", purchaseData);
  return response.data;
};

export const updateSupplierPurchase = async (id, purchaseData) => {
  const response = await api.put(`/credit/supplier-purchases/${id}`, purchaseData);
  return response.data;
};

export const deleteSupplierPurchase = async (id) => {
  const response = await api.delete(`/credit/supplier-purchases/${id}`);
  return response.data;
};

export const getCredits = async () => {
  const response = await api.get("/credit/customer-credits");
  return response.data;
};

export const addCredit = async (creditData) => {
  const response = await api.post("/credit/customer-credits", creditData);
  return response.data;
};

export const updateCredit = async (id, creditData) => {
  const response = await api.put(`/credit/customer-credits/${id}`, creditData);
  return response.data;
};

export const deleteCredit = async (id) => {
  const response = await api.delete(`/credit/customer-credits/${id}`);
  return response.data;
};
