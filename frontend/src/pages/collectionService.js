import api from "../services/api";

export const getCollectionSummary = async () => {
  const response = await api.get("/collections/summary");
  return response.data;
};

export const getCollectionProducts = async () => {
  const response = await api.get("/collections/products");
  return response.data;
};

export const addCollectionProduct = async (data) => {
  const response = await api.post("/collections/products", data);
  return response.data;
};

export const updateCollectionProduct = async (id, data) => {
  const response = await api.put(`/collections/products/${id}`, data);
  return response.data;
};

export const updateProductStock = async (id, data) => {
  const response = await api.patch(`/collections/products/${id}/stock`, data);
  return response.data;
};

export const deleteCollectionProduct = async (id) => {
  const response = await api.delete(`/collections/products/${id}`);
  return response.data;
};

export const getStockHistory = async () => {
  const response = await api.get("/collections/history");
  return response.data;
};
