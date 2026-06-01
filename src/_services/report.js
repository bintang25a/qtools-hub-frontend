import API from "../_api";

export const getReports = async (query) => {
  const { data } = await API.get(`/reports?${query}`);
  return data;
};

export const showReport = async (id) => {
  try {
    const { data } = await API.get(`/reports/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const createReport = async (data) => {
  try {
    const response = await API.post("/reports", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const updateReport = async (id, data) => {
  try {
    const response = await API.path(`reports/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const deleteReport = async (id) => {
  try {
    const response = await API.delete(`reports/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
