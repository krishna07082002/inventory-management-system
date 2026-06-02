import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getOrders = async () => {
  const res = await API.get("/orders");
  return res.data;
};

export const createOrder = async (data) => {
  const res = await API.post("/orders", data);
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await API.delete(`/orders/${id}`);
  return res.data;
};