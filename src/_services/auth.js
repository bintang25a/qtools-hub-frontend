import API from "../_api";

// Fungsi Register
export const register = async (data) => {
  try {
    const response = await API.post("/register", data);
    const resData = response?.data?.data;

    localStorage.setItem("user", JSON.stringify(resData));

    return response;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

// Fungsi Login
export const login = async (data) => {
  try {
    const response = await API.post("/login", data);
    const resData = response?.data?.data;
    const token = resData?.token;
    const user = {
      name: resData?.name,
      nrp: resData?.nrp,
      role: resData?.role,
      photo: resData?.photo,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return resData;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

export const me = async () => {
  try {
    const response = await API.get("/me");

    return response?.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};

// Fungsi Validasi token
export const validateToken = async () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await API.get("/validate-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.success;
  } catch (error) {
    console.error("Token tidak valid:", error.response?.data || error.message);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return false;
  }
};
export const isAuthenticated = async () => {
  return await validateToken();
};

// Fungsi Logout
export const logout = async () => {
  try {
    const response = await API.delete("/logout");

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data;
  }
};
