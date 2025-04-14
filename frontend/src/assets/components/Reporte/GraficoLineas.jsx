import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraficoLineas = ({ valoresPadre }) => {
  const [meses, setMeses] = useState({
    enero: 0,
    febrero: 0,
    marzo: 0,
    abril: 0,
    mayo: 0,
    junio: 0,
    julio: 0,
    agosto: 0,
    septiembre: 0,
    octubre: 0,
    noviembre: 0,
    diciembre: 0,
  });

  useEffect(() => {
    // Solo proceder si los valoresPadre son un arreglo con datos
    if (Array.isArray(valoresPadre) && valoresPadre.length > 0) {
      console.log("Datos recibidos para el gráfico de líneas:", valoresPadre);

      const separarPorMes = () => {
        const nuevoEstadoMeses = { ...meses }; // Copia el estado actual de los meses
        valoresPadre.forEach((mantenimiento) => {
          const fechaInico = new Date(mantenimiento.fechaInico); // Convertimos fechaInico en un objeto Date
          const mes = fechaInico.getMonth(); // Extraemos el mes (0 - 11)
          
          // Actualiza el mes correspondiente
          switch (mes) {
            case 0: nuevoEstadoMeses.enero += 1; break;
            case 1: nuevoEstadoMeses.febrero += 1; break;
            case 2: nuevoEstadoMeses.marzo += 1; break;
            case 3: nuevoEstadoMeses.abril += 1; break;
            case 4: nuevoEstadoMeses.mayo += 1; break;
            case 5: nuevoEstadoMeses.junio += 1; break;
            case 6: nuevoEstadoMeses.julio += 1; break;
            case 7: nuevoEstadoMeses.agosto += 1; break;
            case 8: nuevoEstadoMeses.septiembre += 1; break;
            case 9: nuevoEstadoMeses.octubre += 1; break;
            case 10: nuevoEstadoMeses.noviembre += 1; break;
            case 11: nuevoEstadoMeses.diciembre += 1; break;
            default: break;
          }
        });

        // Actualiza el estado de los meses con los nuevos valores
        setMeses({ ...nuevoEstadoMeses });
      };

      separarPorMes();
    }
  }, [valoresPadre]); // Dependencia de valoresPadre

  const data = {
    labels: [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
      "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ],
    datasets: [
      {
        label: "Mantenimientos por mes",
        data: [
          meses.enero, meses.febrero, meses.marzo, meses.abril, meses.mayo, meses.junio,
          meses.julio, meses.agosto, meses.septiembre, meses.octubre, meses.noviembre, meses.diciembre
        ], // Datos de la línea
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return <Line data={data} />;
};

export default GraficoLineas;
