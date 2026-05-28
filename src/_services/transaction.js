import API from "../_api";

export const getTransactions = async (query) => {
  const { data } = await API.get(`/transactions?${query}`);
  return data;
};

export const showTransaction = async (id) => {
  try {
    const { data } = await API.get(`/transactions/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const createTransaction = async (data) => {
  try {
    const response = await API.post("/transactions", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const updateTransaction = async (id, data) => {
  try {
    const response = await API.post(`transactions/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await API.delete(`transactions/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
