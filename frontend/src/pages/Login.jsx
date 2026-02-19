import React, { useState } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { loginUserApi } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const bgImage = "/loginbus.png";

const styles = {
  page: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  loginCard: {
    background: "rgba(15, 15, 15, 0.92)",
    padding: "30px",
    borderRadius: "12px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },
  title: {
    color: "#fff",
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "600",
  },
  subtitle: {
    color: "#bbb",
    marginBottom: "20px",
    fontSize: "14px",
  },
  link: {
    textDecoration: "none",
    color: "#00aaff",
    fontSize: "13px",
    display: "block",
    marginTop: "12px",
  },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      const response = await loginUserApi({
        email,
        password,
      });

      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);

        try {
          jwtDecode(response.data.token);
        } catch {
          toast.error("Invalid token");
          return;
        }

         toast.success("Login successful!");
        let decoded;
        try{
          decoded=jwtDecode(response?.data?.token);
            }catch{
         return toast.error("Invalid token received");
        }
        if(decoded.role==="admin"){
          navigate ("/admin");
        } else{
          navigate ("/userdashboard");
        }
        
      } else {
        toast.error(response?.data?.message || "Login failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.loginCard}>
        <h2 style={styles.title}>Hamro Yatra</h2>
        <p style={styles.subtitle}>Login to your account</p>

        <form onSubmit={handleSubmit}>
        
          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            />
          </div>

       
          <div style={{ marginBottom: "15px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
          >
            Login
          </button>
        </form>

        <Link to="/register" style={styles.link}>
          Don't have an account? Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
 