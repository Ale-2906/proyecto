import { useState } from "react";
import Styles from "./ActivoNuevoEstilos.module.css"; // Importa tus estilos
import { useGuardarActivo } from "./useGuardarActivo"; // Usa el hook de guardar
import * as XLSX from "xlsx"; // Importa la librería para manejar archivos Excel

const CrearLoteActivo = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    procesoCompra: "",
    tipoBien: "",
    bien: "",
    serie: "",
    marca: "",
    modelo: "",
    color: "",
    codigoBarra: "",
    responsable: "",
    estado: "",
    ubicacion: "",
  });
  const { lote, setLote, actionButtonGuardarLote } = useGuardarActivo();

  // Función para manejar el archivo Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      alert("Por favor, sube un archivo de Excel (.xlsx).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Suponiendo que los datos están en la primera hoja
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convertir la hoja en un array de objetos
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Verificar que los datos tengan la estructura correcta
      if (jsonData.length > 0) {
        const activos = jsonData.map((item) => ({
          procesoCompra: item["Proceso de Compra"] || "",
          tipoBien: item["Tipo de Bien"] || "",
          bien: item["Bien"] || "",
          serie: item["Serie"] || "",
          marca: item["Marca"] || "",
          modelo: item["Modelo"] || "",
          color: item["Color"] || "",
          codigoBarra: item["Código de Barra"] || "",
          responsable: item["Responsable"] || "",
          estado: item["Estado"] || "",
          ubicacion: item["Ubicación"] || "",
        }));
        setLote(activos); // Añadir los activos al lote
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCreateLote = async () => {
    if (lote.length === 0) {
      alert("Por favor, sube un archivo de Excel primero.");
      return;
    }

    setIsLoading(true);
    try {
      // Enviar los activos al backend para guardarlos
      const response = await fetch("http://localhost/api/crearLote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activos: lote }), // Enviar el lote con los activos
      });

      const result = await response.json();

      if (result.success) {
        alert("Lote creado exitosamente.");
        onClose(); // Cierra el modal después de guardar
      } else {
        alert("Error al crear el lote: " + result.message);
      }
    } catch (error) {
      console.error("Error al crear el lote:", error);
      alert("Hubo un problema al guardar el lote. Inténtalo nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={Styles.modalGlobal}>
      <div className={Styles.NuevoActivo}>
        <h3 className={Styles.formTitle}>Crear Lote de Activos</h3>
        <form className={Styles.form} onSubmit={(e) => e.preventDefault()}>
          {/* Subir archivo de Excel */}
          <div className={Styles.inputGroup}>
            <label htmlFor="fileUpload">Subir archivo Excel</label>
            <input
              type="file"
              id="fileUpload"
              accept=".xlsx"
              onChange={handleFileUpload}
            />
          </div>

          {/* Mostrar activos en el lote */}
          <div>
            <h4>Activos en el Lote:</h4>
            <ul>
              {lote.map((item, index) => (
                <li key={index}>{item.bien}</li> // Muestra el nombre o cualquier propiedad del activo
              ))}
            </ul>
          </div>

          <div className={Styles.formActions}>
            <button
              className={`${Styles.btn} ${Styles.btnPrimary}`}
              onClick={handleCreateLote}
              disabled={isLoading || lote.length === 0}
            >
              {isLoading ? "Creando Lote..." : "Crear Lote"}
            </button>
            <button
              type="button"
              className={`${Styles.btn} ${Styles.btnSecondary}`}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearLoteActivo;
