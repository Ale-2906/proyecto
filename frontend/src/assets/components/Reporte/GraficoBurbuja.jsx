import React from "react";
import { Chart as ChartJS, BubbleController, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bubble } from "react-chartjs-2";

// Registra los elementos necesarios para el gráfico de burbuja
ChartJS.register(BubbleController, CategoryScale, LinearScale, Tooltip, Legend);

const GraficoBurbuja = () => {
  const data = {
    datasets: [
      {
        label: "My Bubble Chart",
        data: [
          { x: 10, y: 20, r: 15 },  // Datos de la burbuja
          { x: 25, y: 30, r: 10 },
          { x: 35, y: 45, r: 20 },
        ],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return <Bubble data={data} />;
};

export default GraficoBurbuja;
