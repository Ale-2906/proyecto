import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const data = {
    labels: ["Red", "Blue", "Yellow"], // Etiquetas
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100], // Datos
        backgroundColor: ["#FF5733", "#3399FF", "#FFEB33"], // Colores
        hoverOffset: 4,
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default DoughnutChart;
