import React, { useState, useEffect } from 'react'
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        },
        title: {
            display: true,
            text: 'Peso y Longitud',
        },
    },
};



export default function Overview() {
    const [tilapias, setTilapias] = useState([]);
    const [data, setData] = useState(null)

    useEffect(() => {
        getTilapias();
    }, [])
    const getTilapias = async () => {

        await getDocs(collection(db, "tilapias"))
            .then((querySnapshot) => {
                const newData = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                setTilapias(newData);
                setData({
                    labels: newData.map((item) => item.fecha),
                    datasets: [
                        {

                            label: 'Peso (g)',
                            data: newData.map((item) => item.peso * 1000),
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                        {
                            label: 'Longitud (cm)',
                            data: newData.map((item) => item.longitud),
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        }]
                })
            })

    }
    return (
        <div>
            {data !== null && <Bar options={options} data={data} />}
        </div>
    )
}
