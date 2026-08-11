export const saveToken = (token: string) => {
  localStorage.setItem("adminToken", token);
};

export const getToken = () => {
  return localStorage.getItem("adminToken");
};

export const removeToken = () => {
  localStorage.removeItem("adminToken");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("adminToken");
};