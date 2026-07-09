import api from "../services/api";

export const getPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
};

export const getPaymentCustomers = async () => {
  const response = await api.get("/payments/customers");
  return response.data;
};

export const addPayment = async (data) => {
  const response = await api.post("/payments/add", data);
  return response.data;
};

export const updatePayment = async (id, data) => {
  const response = await api.put(`/payments/${id}`, data);
  return response.data;
};

export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};

export const getPaymentSummary = async () => {
  const response = await api.get("/payments/summary");
  return response.data;
};
