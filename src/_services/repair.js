import API from "../_api";

export const getRepairs = async (query) => {
  const { data } = await API.get(`/repairs?${query}`);
  return data;
};

export const showRepair = async (id) => {
  try {
    const { data } = await API.get(`/repairs/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const createRepair = async (data) => {
  try {
    const response = await API.post("/repairs", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const updateRepair = async (id, data) => {
  try {
    const response = await API.post(`repairs/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const deleteRepair = async (id) => {
  try {
    const response = await API.delete(`repairs/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
