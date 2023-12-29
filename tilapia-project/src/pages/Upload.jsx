import React from 'react'
import styles from './Upload.module.css'
import { useState } from 'react';
export default function Upload() {
    const [urlFile, setUrlFile] = useState(null);
    const [file, setFile] = useState(null);
    const [maskBase64, setMaskBase64] = useState(null);
    const [peso, setPeso] = useState([]);

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
            setPeso(data.peso)
        } catch (error) {
            console.error('Error al realizar la predicción:', error);
        }
    };
    return (
        <div className={styles.container}>
            <div>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {urlFile && <a onClick={handleSubmit}>Predecir</a>}
            </div>

            <div className={styles.imageContainer}>
                <img src={urlFile} style={{ width: '45%', height: '100%', objectFit: 'scale-down' }}></img>
                <img src={`data:image/png;base64, ${maskBase64}`} alt="Máscara" style={{ width: '45%', height: '100%', objectFit: 'scale-down' }}></img>
            </div>

            <div className={styles.resultContainer}>
                {maskBase64 && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem', height: '100%' }}>
                        {peso.map(peso => {
                            return <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                                <div style={{ width: '3rem', height: '3rem', backgroundColor: peso.color, marginRight: '2rem' }}></div>
                                <h2>Peso: {peso.peso}</h2>
                            </div>
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
