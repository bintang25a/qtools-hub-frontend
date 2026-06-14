import API from "../_api";

export const getInspections = async (query) => {
  const { data } = await API.get(`/inspections?${query}`);
  return data;
};

export const getInspectionsByUser = async (query) => {
  const { data } = await API.get(`/inspections/byUser?${query}`);
  return data;
};

export const showInspection = async (id) => {
  try {
    const { data } = await API.get(`/inspections/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const createInspection = async (data) => {
  try {
    const response = await API.post("/inspections", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const updateInspection = async (id, data) => {
  try {
    const response = await API.patch(`inspections/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const deleteInspection = async (id) => {
  try {
    const response = await API.delete(`inspections/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
