import { useState } from 'react'
import './App.css'

function App() {
  const [urlFile, setUrlFile] = useState(null);
  const [file, setFile] = useState(null);
  const [maskBase64, setMaskBase64] = useState(null);
  const [peso, setPeso] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setUrlFile(URL.createObjectURL(selectedFile))
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Suponiendo que la respuesta contiene la máscara en base64
      setMaskBase64(data.mask_base64);
      setPeso(data.peso[0])
    } catch (error) {
      console.error('Error al realizar la predicción:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit">Predecir</button>

      {maskBase64 && (
        <div>
          <h2>Máscara generada:</h2>
          {urlFile && <img src={urlFile} alt="a" />}
          <img src={`data:image/png;base64, ${maskBase64}`} alt="Máscara" />
          <h1>Peso estimado: {peso}</h1>
        </div>
      )}
    </form>
  );
}

export default App
