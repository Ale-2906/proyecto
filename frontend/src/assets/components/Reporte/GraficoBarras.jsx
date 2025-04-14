import React,{useState,useEffect} from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import ApiService from "../../Services/ApiMetodos";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficoBarras = ({ valoresPadre }) => {
    const [contActividades,setContadorActividades]=useState(0);
    const [contComponentes,setContadorComponentes]=useState(0);

    useEffect(()=>{
        const buscarDatos=async()=>{
            if (valoresPadre.act!=="") {
                const act =await ApiService.buscarDatos("buscarCantidadActividades",valoresPadre.act);
                if (act.length!==0) {
                setContadorActividades(act[0].cantidad);
                        
                    }else{
                        setContadorActividades(0);
                    }
            }else{
                setContadorActividades(0);
            }
            if (valoresPadre.com!=="") {
                const cont =await ApiService.buscarDatos("buscarCantidadComponentes",valoresPadre.com);
                if (cont.length!==0) {
                setContadorComponentes(cont[0].cantidad_mantenimientos);
                    
                }else{
                setContadorComponentes(0);

                }
            }else{
                setContadorComponentes(0);
            }
                // buscarCantidadComponentes
    //     buscarCantidadAcciones

        }
        buscarDatos();

    },[valoresPadre]);

  const data = {
    labels: ["Actividades", "Componentes"], // Etiquetas
    datasets: [
      {
        label: "Estados de Mantenimientos",
        data: [contActividades, contComponentes], // Datos de las barras
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={data} />;
};

export default GraficoBarras;
