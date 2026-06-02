import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getCustomers = async () => {
  const res = await API.get("/customers");
  return res.data;
};

export const createCustomer = async (data) => {
  const res = await API.post("/customers", data);
  return res.data;
};

export const deleteCustomer = async (id) => {
  const res = await API.delete(`/customers/${id}`);
  return res.data;
};