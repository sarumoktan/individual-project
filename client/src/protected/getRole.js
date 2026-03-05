import { jwtDecode } from "jwt-decode";

const getToken = () => localStorage.getItem("token");

// Returns true if token IS expired, false if still valid
const isExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now(); 
  } catch {
    return true;
  }
};

const getUserRole = () => {
  const token = getToken();

  if (!token) return null;

  if (isExpired(token)) { 
    localStorage.removeItem("token");
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    return decoded.role ?? null;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

export default getUserRole;