import React, { useState } from "react";
import toast from "react-hot-toast";
import { createUserApi } from "../services/api";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    fontFamily: "Arial, sans-serif",
  },

  left: {
    flex: 1,
   backgroundImage: "url('/background.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    color: "#fff",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "60px",
  },

  leftTitle: {
    fontSize: "36px",
    fontWeight: "700",
  },

  leftSub: {
    marginTop: "10px",
    fontSize: "14px",
    opacity: 0.9,
  },

  right: {
    flex: 1,
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  formCard: {
    width: "380px",
  },

  formTitle: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#1aa3a3",
    marginBottom: "6px",
  },

  subtitle: {
    fontSize: "13px",
    color: "#777",
    marginBottom: "24px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#1aa3a3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "15px",
    marginTop: "8px",
  },

  link: {
    marginTop: "14px",
    display: "block",
    textAlign: "center",
    fontSize: "13px",
    color: "#1aa3a3",
    textDecoration: "none",
  },
};

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.username) return toast.error("Username required");
    if (!formData.email) return toast.error("Email required");
    if (!formData.password) return toast.error("Password required");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: "user",
    };

    toast.promise(createUserApi(data), {
      loading: "Creating account...",
      success: (res) => {
        setTimeout(() => navigate("/login"), 1200);
        return res.data.message;
      },
      error: "Registration failed",
    });
  };

  return (
    <div style={styles.page}>
      {/* LEFT IMAGE SECTION */}
      <div style={styles.left}>
        <div style={styles.overlay}>
          <h1 style={styles.leftTitle}>Hamro Yatra</h1>
          <p style={styles.leftSub}>Your journey starts here</p>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div style={styles.right}>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Registration</h2>
          <p style={styles.subtitle}>Create your account</p>

          <form onSubmit={handleSubmit}>
            <input
              style={styles.input}
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <input
              style={styles.input}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button style={styles.button}>Confirm</button>
          </form>

          <a href="/login" style={styles.link}>
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Registration;
