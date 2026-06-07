import API from "../_api";

export const assetReturn = async (id, data) => {
  try {
    const response = await API.patch(`actions/asset-return/${id}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
