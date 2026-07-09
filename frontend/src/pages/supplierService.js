import axios from "axios";

const API =
  "http://localhost:5000/api/suppliers";

export const getSuppliers = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const addSupplier = async (data) => {
  const res = await axios.post(API, data);
  return res.data;
};

export const deleteSupplier = async (id) => {
  const res = await axios.delete(
    `${API}/${id}`
  );
  return res.data;
};