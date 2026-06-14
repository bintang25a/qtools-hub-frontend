import API from "../_api";

export const getTools = async (query) => {
  const { data } = await API.get(`/tools?${query}`);
  return data;
};

export const showTool = async (id) => {
  try {
    const { data } = await API.get(`/tools/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const createTool = async (data) => {
  try {
    const response = await API.post("/tools", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const updateTool = async (id, data) => {
  try {
    const response = await API.patch(`tools/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const deleteTool = async (id) => {
  try {
    const response = await API.delete(`tools/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
