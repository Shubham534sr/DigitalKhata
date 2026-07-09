import axios from "axios";

const API =
"http://localhost:5000/api/payments";

export const getPayments = () =>
  axios.get(API);

export const addPayment = (data) =>
  axios.post(`${API}/add`, data);

export const deletePayment = (id) =>
  axios.delete(`${API}/${id}`);