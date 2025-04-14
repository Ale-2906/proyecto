import React, { useState } from 'react';

function CargarExcelActivos() {
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
        setMensaje(msg);
      } else {
        setMensaje("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error al subir el archivo. Verifica la consola del backend.");
    }
  };

  return (
    <div>
      <h2>Cargar Activos desde Excel</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx, .xls" onChange={handleChange} />
        <button type="submit">Subir</button>
      </form>
      {mensaje && <pre>{mensaje}</pre>}
    </div>
  );
}

export default CargarExcelActivos;
