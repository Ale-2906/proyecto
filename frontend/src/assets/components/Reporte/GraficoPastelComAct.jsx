import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ApiService from "../../Services/ApiMetodos";

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficoPastelComAct = ({ valoresPadre }) => {
  const [actividad, setActividad] = useState(0);
  const [componente, setComponente] = useState(0);
  const [observacion, setObservacion] = useState(0);

  useEffect(() => {
    const medirProsentaje = async () => {
      try {
        const val = await ApiService.buscarDatos("buscarCantidadAcciones", valoresPadre);

        // Ensure val is an array and contains valid data
        if (Array.isArray(val)) {
          setActividad(val[0]?.cantidad || 0); // Safe optional chaining
          setComponente(val[1]?.cantidad || 0); // Safe optional chaining
          setObservacion(val[2]?.cantidad || 0); // Safe optional chaining
        } else {
          // Handle case where val is not an array
          setActividad(0);
          setComponente(0);
          setObservacion(0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setActividad(0);
        setComponente(0);
        setObservacion(0);
      }
    };

    medirProsentaje();
  }, [valoresPadre]); // Depende de valoresPadre

  const data = {
    labels: [
      "Actividades: " + actividad,
      "Componentes: " + componente,
      "Observaciones: " + observacion,
    ], // Etiquetas
    datasets: [
      {
        label: "Estados Mantenimientos",
        data: [actividad, componente, observacion], // Datos
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FFEB33"], // Colores
      },
    ],
  };

  return <Pie data={data} />;
};

export default GraficoPastelComAct;
