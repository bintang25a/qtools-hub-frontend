import API from "../_api";

export const getAssets = async (query) => {
  const { data } = await API.get(`/assets?${query}`);
  return data;
};

export const showAsset = async (id) => {
  try {
    const { data } = await API.get(`/assets/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const createAsset = async (data) => {
  try {
    const response = await API.post("/assets", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const updateAsset = async (id, data) => {
  try {
    const response = await API.patch(`assets/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const deleteAsset = async (id) => {
  try {
    const response = await API.delete(`assets/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
