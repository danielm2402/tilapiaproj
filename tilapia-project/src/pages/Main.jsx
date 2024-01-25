import React from 'react'
import styles from './Main.module.css'
import { Link } from "react-router-dom";

export default function Main() {
    return (
        <div className={styles.container}>
            <div className={styles.bg} >
                <h1>Detecta y predice <br></br> tus tilapias</h1>
                <Link to="/upload">Comienza</Link>
                <Link to="/overview">Compara</Link>

                <div className={styles.items}>
                    <div>
                        <h3>Detecta Tilapias</h3>
                        <p>Lorem ipsum dolor sit amet, </p>
                    </div>
                    <div>
                        <h3>Predice Peso/Longitud</h3>
                        <p>Lorem ipsum dolor sit amet, </p>
                    </div>
                    <div>
                        <h3>Visualiza</h3>
                        <p>Lorem ipsum dolor sit amet, </p>
                    </div>
                </div>
            </div>

        </div>
    )
}
