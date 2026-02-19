export default function BusBooking() {
  return (
    <div
      style={{
        background: "#2f4f6f",
        minHeight: "1vh",
        width: "100vw",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
     
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#faf5f5ff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "60px", height: "60px", marginRight: "10px" }}
          />
          <h2>Hamro Yatra</h2>
        </div>

        <div>
          <span style={{ marginRight: "15px" }}>Home</span>
          <span style={{ marginRight: "15px" }}>My Tickets</span>
          <span style={{ marginRight: "15px" }}>My Bookings</span>
          <span style={{ marginRight: "15px" }}>Driver Details</span>
          <span style={{ marginRight: "15px" }}>Dashboard</span>
        </div>
      </div>

     
      <div style={{ display: "flex", marginTop: "5px" }}>
       
        <div style={{ flex: 5}}>
          <h3 style={{ color: "#f4f1f1ff" }}>Bus List</h3>

          <div
            style={{
              background: "#7eb9b7",
              padding: "10px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/bus1.png"
              alt="Bus"
              style={{
                width: "120px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "6px",
                marginRight: "12px",
              }}
            />
            <div style={{ flex: 1 }}>
              <h4>Nepal Yatayat</h4>
              <p>10:00 PM - 06:00 AM</p>
              <strong>Rs 999</strong>
              <button style={{ float: "right" }}>Book Now</button>
            </div>
          </div>

         
          <div
            style={{
              background: "#7eb9b7",
              color: "#f5eaeaff",
              padding: "10px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/bus1.png"
              alt="Bus"
              style={{
                width: "120px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "6px",
                marginRight: "12px",
              }}
            />
            <div style={{ flex: 1 }}>

              <p>AC Sleeper</p>
              <p>10:30 PM - 06:30 AM</p>
              <strong>Rs1000</strong>
              <button style={{ float: "right" }}>Book Now</button>
            </div>
          </div>

         
          <div
            style={{
              background: "#7eb9b7",
              padding: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/bus1.png"
              alt="Bus"
              style={{
                width: "120px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "6px",
                marginRight: "12px",
              }}
            />
            <div style={{ flex: 1 }}>
              <h4>Laxmi Deluxe</h4>
              <p>11:00 PM - 06:00 AM</p>
              <strong>Rs 999</strong>
              <button style={{ float: "right" }}>Book Now</button>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <div
          style={{
            flex: 1,
            background: "#090909ff",
            padding: "15px",
            marginLeft: "15px",
          }}
        >
          <h3>Enter Passenger Details</h3>

          <input
            placeholder="Name"
            style={{ width: "100%", marginBottom: "30px" }}
          />
          <input
            placeholder="Age"
            style={{ width: "100%", marginBottom: "30px" }}
          />

          <select style={{ width: "100%", marginBottom: "30px" }}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            placeholder="Email"
            style={{ width: "100%", marginBottom: "50px" }}
          />

          <button
            style={{
              width: "100%",
              background: "orange",
              color: "#000",
              padding: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
