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

export const pdfDownload = async (data) => {
  try {
    const response = await API.post(`actions/pdf-download`, data, {
      responseType: "blob",
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const inspectionDownload = async (id) => {
  try {
    const response = await API.get(`actions/inspection-download/${id}`, {
      responseType: "blob",
    });

    return response;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
