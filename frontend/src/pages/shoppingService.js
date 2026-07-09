import api from "../services/api";

export const getShoppingProducts = async () => {
  const response = await api.get("/shopping/products");
  return response.data;
};

export const getShoppingOrders = async () => {
  const response = await api.get("/shopping/orders");
  return response.data;
};

export const createShoppingOrder = async (data) => {
  const response = await api.post("/shopping/orders", data);
  return response.data;
};

export const updateShoppingOrderStatus = async (id, status) => {
  const response = await api.patch(`/shopping/orders/${id}/status`, { status });
  return response.data;
};
