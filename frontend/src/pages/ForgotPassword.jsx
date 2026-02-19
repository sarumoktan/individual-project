import React from "react";
import { useNavigate, Link } from "react-router-dom";

const bgImage = "/loginbus.png"; // same background image

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    
    // After reset, navigate to login
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Enter your email"
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Reset Password
          </button>
        </form>
        <div style={styles.options}>
          <Link to="/" style={styles.link}>
            Back to Login
          </Link>
          <Link to="/signup" style={styles.link}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

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
  card: {
    background: "rgba(15, 15, 15, 0.92)",
    padding: "30px",
    borderRadius: "12px",
    width: "350px",
    textAlign: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },
  title: {
    color: "#fff",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "none",
    fontSize: "14px",
  },
  options: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  link: {
    textDecoration: "none",
    color: "#00aaff",
    fontSize: "13px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#00aaff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
  },
};

export default ForgotPassword;
