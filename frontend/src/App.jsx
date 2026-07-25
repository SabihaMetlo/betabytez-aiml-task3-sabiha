import { useState } from "react";
import "./App.css";

function App() {
  // Form state - holds all 7 input values together
  const [formData, setFormData] = useState({
    OverallQual: "",
    GrLivArea: "",
    GarageCars: "",
    TotalBsmtSF: "",
    FullBath: "",
    YearBuilt: "",
    Neighborhood: "",
  });

  // Prediction result and error state
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  // Called every time any input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Called when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          OverallQual: Number(formData.OverallQual),
          GrLivArea: Number(formData.GrLivArea),
          GarageCars: Number(formData.GarageCars),
          TotalBsmtSF: Number(formData.TotalBsmtSF),
          FullBath: Number(formData.FullBath),
          YearBuilt: Number(formData.YearBuilt),
          Neighborhood: formData.Neighborhood,
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction failed. Please check your inputs.");
      }

      const data = await response.json();
      setPrediction(data.predicted_price);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <h1>House Price Predictor</h1>
      <form onSubmit={handleSubmit}>
        <label>Overall Quality (1-10)</label>
        <input
          type="number"
          name="OverallQual"
          value={formData.OverallQual}
          onChange={handleChange}
        />

        <label>Living Area (sq ft)</label>
        <input
          type="number"
          name="GrLivArea"
          value={formData.GrLivArea}
          onChange={handleChange}
        />

        <label>Garage Cars</label>
        <input
          type="number"
          name="GarageCars"
          value={formData.GarageCars}
          onChange={handleChange}
        />

        <label>Basement Area (sq ft)</label>
        <input
          type="number"
          name="TotalBsmtSF"
          value={formData.TotalBsmtSF}
          onChange={handleChange}
        />

        <label>Full Bathrooms</label>
        <input
          type="number"
          name="FullBath"
          value={formData.FullBath}
          onChange={handleChange}
        />

        <label>Year Built</label>
        <input
          type="number"
          name="YearBuilt"
          value={formData.YearBuilt}
          onChange={handleChange}
        />

        <label>Neighborhood (e.g., CollgCr)</label>
        <input
          type="text"
          name="Neighborhood"
          value={formData.Neighborhood}
          onChange={handleChange}
        />

        <button type="submit">Predict Price</button>
      </form>

      {prediction && (
        <h2>Predicted Price: ${prediction.toLocaleString()}</h2>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;