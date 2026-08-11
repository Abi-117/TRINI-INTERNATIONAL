import api from "./api";

export const getAddresses = () =>
  api.get("/address");

export const addAddress = (data:any) =>
  api.post("/address", data);

export const updateAddress = (
  id:string,
  data:any
) =>
  api.put(`/address/${id}`, data);

export const deleteAddress = (
  id:string
) =>
  api.delete(`/address/${id}`);

export const setDefaultAddress = (
  id:string
) =>
  api.put(`/address/default/${id}`);