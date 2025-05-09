import { useState } from 'react'
import axios from 'axios'
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccess(false);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a file");
    setLoading(true);
    const formData = new FormData();
    formData.append("file",file);

    try {
      const response = await axios.post("http://localhost:5000/convert",formData,{
        responseType: "blob", //imp to recieve pdf
      });
      const blob = new Blob([response.data], {type: "application/pdf"});
      const downloadURL = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadURL;
      link.download = "converted.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSuccess(true);
    }
    catch (err) {
      console.error(err);
      setError("Failed to convert file");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="app-container">
    <h1 className="title">Word to PDF Converter</h1>
    <input
      type="file"
      accept=".docx"
      onChange={handleFileChange}
    />
    <button
      onClick={handleUpload}
      disabled={loading}
    >
      {loading ? "Converting..." : "Convert to PDF"}
    </button>
    {success && <p className="success-message">Download Started!</p>}
    {error && <p className="error-message">{error}</p>}
  </div>
);

}
export default App;