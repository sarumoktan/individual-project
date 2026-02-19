import React from "react";

const HomePage = () => {
  const popularRoutes = [
    { from: "Kathmandu", to: "Pokhara" },
    { from: "Kathmandu", to: "Chitwan" },
    { from: "Pokhara", to: "Butwal" },
    { from: "Kathmandu", to: "Dharan" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    alert("Search clicked!");
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <img src="/logo.png" alt="BusSewa" style={styles.logoImg} />
          <span style={styles.logoText}>BusSewa</span>
        </div>

        <ul style={styles.navLinks}>
          <li style={styles.navItem}>Home</li>
          <li style={styles.navItem}>My Ticket</li>
          <li style={styles.navItem}>Driver Details</li>
          <li style={styles.navItem}>Dashboard</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Book Your Bus Ticket Easily</h1>

        <form style={styles.searchForm} onSubmit={handleSearch}>
          <select style={styles.input}>
            <option value="">From</option>
            <option>Kathmandu</option>
            <option>Pokhara</option>
            <option>Dharan</option>
            <option>Butwal</option>
          </select>

          <select style={styles.input}>
            <option value="">To</option>
            <option>Kathmandu</option>
            <option>Pokhara</option>
            <option>Dharan</option>
            <option>Butwal</option>
          </select>

          <input type="date" style={styles.input} />

          <button type="submit" style={styles.searchButton}>
            Search Buses
          </button>
        </form>
      </section>

      {/* Popular Routes */}
      <section style={styles.routesSection}>
        <h2 style={styles.sectionTitle}>Popular Routes</h2>

        <div style={styles.routesGrid}>
          {popularRoutes.map((route, index) => (
            <div key={index} style={styles.routeCard}>
              <img src="/bus.png" alt="Bus" style={styles.busImage} />
              <p style={styles.routeText}>
                {route.from} → {route.to}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: {
    width: "100vw",
    minHeight: "100vh",
    overflowX: "hidden",
    color: "#333",
    backgroundColor: "#fff",
  },

  navbar: {
    width: "100vw",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 50px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logoImg: {
    height: "40px",
  },

  logoText: {
    fontWeight: "bold",
    fontSize: "20px",
    color: "#0055cc",
  },

  navLinks: {
    display: "flex",
    listStyle: "none",
    gap: "20px",
  },

  navItem: {
    cursor: "pointer",
    fontWeight: "500",
  },

  hero: {
    width: "100vw",
    minHeight: "100vh",
    backgroundImage: `url('/hero-bg.png')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    textAlign: "center",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },

  heroTitle: {
    fontSize: "36px",
    marginBottom: "30px",
    textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
  },

  searchForm: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    minWidth: "150px",
  },

  searchButton: {
    padding: "10px 20px",
    backgroundColor: "#0055cc",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  routesSection: {
    width: "100vw",
    padding: "50px",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: "28px",
    marginBottom: "30px",
  },

  routesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },

  routeCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    padding: "20px",
    textAlign: "center",
  },

  busImage: {
    width: "100%",
    height: "100px",
    objectFit: "contain",
    marginBottom: "10px",
  },

  routeText: {
    fontWeight: "500",
  },
};

export default HomePage;
