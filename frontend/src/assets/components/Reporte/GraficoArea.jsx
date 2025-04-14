import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraficoArea = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May"], // Etiquetas
    datasets: [
      {
        label: "Revenue",
        data: [120, 150, 180, 210, 250], // Datos del área
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  return <Line data={data} />;
};

export default GraficoArea;
