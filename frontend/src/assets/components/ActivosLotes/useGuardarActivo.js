import { useState } from "react";
import ApiService from "../../Services/ApiMetodos.js";
import mostrarMensaje from "../Mensajes/Mensaje.js";

export const useGuardarActivo = () => {
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

  const [lote, setLote] = useState([]); // Estado para almacenar el lote de activos

  const nameChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const cargarBienesPorTipo = async (idTipoBien) => {
    try {
      const bienes = await ApiService.buscarDatos("busBines", idTipoBien);
      return bienes;
    } catch (error) {
      console.error("Error al cargar bienes:", error);
      throw error;
    }
  };

  const cargarProcesosCompra = async () => ApiService.traerDatos("procompras");
  const cargarTipoBiem = async () => ApiService.traerDatos("tipobien");
  const cargarUbicacion = async () => ApiService.traerDatos("ubicacion");
  const cargarResponsable = async () => ApiService.traerDatos("responsable");
  const cargarEstado = async () => ApiService.traerDatos("estado");

  // Definición de la función de validación
  const validarFormulario = (form) => {
    const camposRequeridos = [
      "procesoCompra",
      "tipoBien",
      "bien",
      "serie",
      "marca",
      "modelo",
      "color",
      "codigoBarra",
      "responsable",
      "estado",
      "ubicacion",
    ];

    for (const campo of camposRequeridos) {
      if (!form[campo] || form[campo].trim() === "") {
        return `El campo ${campo} es obligatorio.`;
      }
    }
    return null; // Si no hay error, retorna null
  };

  const actionButtonGuardarLote = async (lote, onClose) => {
    if (!lote || lote.length === 0) {
      mostrarMensaje({
        title: "Lote vacío",
        text: "No se han agregado activos al lote.",
        icon: "info",
        timer: 3500,
      });
      return;
    }

    // Validación para cada activo en el lote
    for (let i = 0; i < lote.length; i++) {
      const error = validarFormulario(lote[i]);

      if (error) {
        mostrarMensaje({
          title: "Campos faltantes",
          text: error,
          icon: "info",
          timer: 3500,
        });
        return; // Detener si un activo en el lote tiene errores
      }
    }

    try {
      // Enviar el lote completo de activos
      await ApiService.enviarDatos("nuevoLote", { activos: lote });
      mostrarMensaje({
        title: "Éxito",
        text: `Se ha creado un nuevo lote con ${lote.length} activos.`,
        icon: "success",
        timer: 3500,
      });
      onClose(); // Cierra el modal después de guardar
    } catch (error) {
      console.error("Error al guardar el lote:", error);
      mostrarMensaje({
        title: "Error",
        text: "Hubo un problema al guardar el lote. Por favor, inténtalo nuevamente.",
        icon: "error",
        timer: 3500,
      });
    }
  };

  return {
    form,
    setForm,
    nameChange,
    actionButtonGuardarLote,
    cargarProcesosCompra,
    cargarTipoBiem,
    cargarBienesPorTipo,
    cargarUbicacion,
    cargarResponsable,
    cargarEstado,
    setLote,
    lote, // El lote actual
  };
};
