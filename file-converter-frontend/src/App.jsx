import { useState } from 'react'
import axios from 'axios'

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
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4'>
      <h1 className='text-2x1 font-bold mb-6'>Word to pdf converter</h1>
      <input
        type='file'
        accept='.docx'
        onChange={handleFileChange}
        className='mb-4'
      />
      <button
        onClick={handleUpload}
        className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50'
        disabled={loading}
      >
        {loading ? "Converting...": "Convert to PDF"}
      </button>
      {success && <p className='text-green-600 mt-4'>Download Started!</p>}
      {error && <p className='text-red-600 mt-4'>{error}</p>}
    </div>
  );
}
export default App;