import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficoPastel = ({ valoresPadre }) => {
  const [porcProceso, setProcProceso] = useState(0);
  const [porcTerminado, setProcTerminado] = useState(0);

  useEffect(() => {
    const medirProsentaje = () => {
      if (Array.isArray(valoresPadre)) {
        const proceso = valoresPadre.filter((p) => p.nomEstado === "En proceso");
        const terminado = valoresPadre.filter((p) => p.nomEstado === "Terminado");
        setProcTerminado(terminado.length);
        setProcProceso(proceso.length);
      } else {
        console.warn("valoresPadre no es un array");
      }
    };
    
    medirProsentaje();
  }, [valoresPadre]); // Depende de valoresPadre

  const data = {
    labels: ["En proceso: "+porcProceso, "Terminado: "+porcTerminado], // Etiquetas
    datasets: [
      {
        label: "Estados Mantenimientos",
        data: [porcProceso, porcTerminado], // Datos
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FFEB33"], // Colores
      },
    ],
  };

  return <Pie data={data} />;
};

export default GraficoPastel;
