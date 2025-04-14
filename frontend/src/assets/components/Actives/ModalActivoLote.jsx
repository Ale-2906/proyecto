import React, { useState } from 'react';
import styles from "./ModalActivoLoteEstilos.module.css"; // Correcto ✅
import mostrarMensaje from "../Mensajes/Mensaje.js";


import { TiArrowBack } from "react-icons/ti";

function CargarExcelActivos({ onClose }) { // ← Añadido onClose como prop
    const [file, setFile] = useState(null);
    const [mensaje, setMensaje] = useState('');

    const handleChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setMensaje("Por favor selecciona un archivo.");
            return;
        }

        const formData = new FormData();
        formData.append("archivo", file);

        try {
            const response = await fetch("http://localhost/Sexto-Proyecto/Proyecto/backend/Controllers/ApiRest.php?cargarExcelActivos", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
           
            if (data.success) {
                let msg = `Insertados: ${data.insertados}, Duplicados: ${data.duplicados}`;
                if (data.detallesDuplicados?.length > 0) {
                    msg += "\n\nDuplicados detectados:\n" + data.detallesDuplicados.join("\n");
                }
            
                mostrarMensaje({
                    title: data.message,
                    text: msg,
                    icon: "success",
                    timer: 5000,
                });
            } else {
                mostrarMensaje({
                    title: data.message,
                    text: "Hubo un error en subir los activos",
                    icon: "error",
                    timer: 2200,
                });
            }
            
        } catch (err) {
            console.error(err);
            setMensaje("Error al subir el archivo.");
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <TiArrowBack size={30} onClick={onClose} className={styles.iconClickable} />
            <h2 className={styles.tittle}>Cargar Activos por lote</h2>
            <label className={styles.label}>Selecciona un archivo</label>
            <div className={styles["inputContainer"]}>
                <label className={styles.inputLabel}>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleChange}
                        className={styles.inputFile}
                    />
                </label>
            </div>

            <div className={styles["buttonGroup"]}>
                <button className={styles.button} type="submit">Subir</button>
            </div>
            {mensaje && <div className={styles.messageBox}>{mensaje}</div>}

        </form>
    );
}

export default CargarExcelActivos;
