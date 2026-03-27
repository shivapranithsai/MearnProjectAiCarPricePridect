import React from "react";

const PredictionForm = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Car Details Form</h2>

        <form style={styles.form}>
          <input type="text" placeholder="Enter Brand" style={styles.input} />
          <input type="text" placeholder="Enter Model" style={styles.input} />
          <input type="number" placeholder="Enter Year" style={styles.input} />
          <input type="number" placeholder="Mileage (km)" style={styles.input} />
          <input type="text" placeholder="Fuel Type" style={styles.input} />
          <input type="text" placeholder="Transmission" style={styles.input} />

          <button type="submit" style={styles.button}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#1e293b",
    padding: "40px",
    borderRadius: "12px",
    width: "400px",
  },
  title: {
    color: "white",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
  },
  button: {
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default PredictionForm;
