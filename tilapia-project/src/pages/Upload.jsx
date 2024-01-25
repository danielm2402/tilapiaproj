import React, { useEffect } from 'react'
import styles from './Upload.module.css'
import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Upload() {
    const [urlFile, setUrlFile] = useState(null);
    const [file, setFile] = useState(null);
    const [maskBase64, setMaskBase64] = useState(null);
    const [peso, setPeso] = useState([]);
    const [lago, setLago] = useState('lago1')
    const [fecha, setFecha] = useState([])

    const notify = (message) => toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",

    });

    useEffect(() => {
        var date = new Date();
        var y = date.getFullYear();
        var m = (date.getMonth() + 1).toString().padStart(2, '0');
        var d = date.getDate().toString().padStart(2, '0');
        var fdate = y + '-' + m + '-' + d;
        setFecha(fdate)

    }, [])

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setUrlFile(URL.createObjectURL(selectedFile))
        setFile(event.target.files[0]);
    };

    const saveInformation = async () => {
        try {
            console.log({
                fecha: fecha,
                id: lago,
                numero: peso.length,
                peso: peso.reduce((accumulator, currentValue) => accumulator + currentValue.peso, 0) / peso.length,
                longitud: peso.reduce((accumulator, currentValue) => accumulator + currentValue.longitud, 0) / peso.length,
            })
            const tilapiaRef = await addDoc(collection(db, "tilapias"), {
                fecha: fecha,
                id: lago,
                numero: peso.length,
                peso: peso.reduce((accumulator, currentValue) => accumulator + currentValue.peso, 0) / peso.length,
                longitud: peso.reduce((accumulator, currentValue) => accumulator + currentValue.longitud, 0) / peso.length,

            });
            notify('Información guardada correctamente')
            console.log(tilapiaRef)
        } catch (error) {
            console.log(error)
        }

    }

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
            setMaskBase64(data.mask_base64);
            setPeso(data.peso)

        } catch (error) {
            console.error('Error al realizar la predicción:', error);
        }
    };
    return (
        <div className={styles.container}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={'bounce'} />

            <ToastContainer />
            <div>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {urlFile && <a onClick={handleSubmit}>Predecir</a>}
            </div>

            {maskBase64 && <div className={styles.imageContainer}>
                <img src={urlFile} style={{ width: '45%', height: '100%', objectFit: 'scale-down' }}></img>
                <img src={`data:image/png;base64, ${maskBase64}`} alt="Máscara" style={{ width: '45%', height: '100%', objectFit: 'scale-down' }}></img>
            </div>}

            {maskBase64 && <div className={styles.resultContainer}>
                {maskBase64 && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem', height: '100%' }}>
                        {peso.map(peso => {
                            return <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                                <div style={{ width: '3rem', height: '3rem', backgroundColor: peso.color, marginRight: '2rem' }}></div>
                                <h2 style={{ paddingRight: '2rem' }}>Peso: {peso.peso}</h2>
                                <h2>Longitud: {peso.longitud}</h2>
                            </div>
                        })}
                    </div>
                )}
            </div>}
            {maskBase64 &&
                <div className={styles.processContainer}>
                    <div>
                        <h3>Numero de tilapias detectadas: {peso.length}</h3>
                        <h3>Peso promedio: {peso.reduce((accumulator, currentValue) => accumulator + currentValue.peso, 0) / peso.length}</h3>
                        <h3>Longitud promedio: {peso.reduce((accumulator, currentValue) => accumulator + currentValue.longitud, 0) / peso.length}</h3>
                    </div>
                    <div>
                        <select value={lago} name="select" onChange={(e) => { setLago(e.target.value) }}>
                            <option value="lago1" selected>Lago #1</option>
                            <option value="lago2">Lago #2</option>
                            <option value="lago3">Lago #3</option>
                            <option value="lago4">Lago #4</option>
                            <option value="lago5">Lago #5</option>
                        </select>
                    </div>
                    <div>
                        <input onChange={(e) => { setFecha(e.target.value) }} value={fecha} type="date" min="2023-01-01" />
                    </div>
                </div>}
            {maskBase64 &&
                <a onClick={saveInformation} className={styles.buttonSave} >Guardar información</a>
            }

        </div>
    )
}
