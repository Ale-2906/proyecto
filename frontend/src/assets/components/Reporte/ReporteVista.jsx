import React, { useEffect, useState } from "react";
import GraficoBarras from "./GraficoBarras";
import GraficoPastel from "./GraficoPastel";
import GraficoLineas from "./GraficoLineas";
import styles from "./estilosGrafico.module.css";  // Importar los estilos
import ApiService from "../../Services/ApiMetodos";
import { TiArrowBack } from "react-icons/ti";
import mostrarMensaje from "../Mensajes/Mensaje";
import Select from "react-select";
import GraficoBurbuja from "./GraficoBurbuja";
import Doughnut from "./Doughnut";
import GraficoArea from "./GraficoArea";
import GraficoPastelComAct from "./GraficoPastelComAct";



function ReporteVista({ setActiveView }) {
  const [mantenientos, setMantemientos] = useState([]);
  const [mantenientosTabla, setMantemientosTabla] = useState([]);
  const [mantenientosTemp, setMantemientosTemp] = useState([]);
  const [valorFechaInicio, setValorFechaInicio] = useState("");
  const [valorFechaFinal, setValorFechaFinal] = useState("");
  const [datosCodManten, setdatosCodManten] = useState("")
  const [actividades, setActividades] = useState([])
  const [componentes, setComponentes] = useState([])
  const [contadores, setContadores] = useState({ act: "", com: "" })


  useEffect(() => {
    const cargarValores = async () => {
      const mant = await ApiService.traerDatos("datosManten");
      const activid = await ApiService.traerDatos("actividad");
      const com = await ApiService.traerDatos("componen");
      setComponentes(com);
      setActividades(activid);

      if (Array.isArray(mant)) {
        setMantemientos(mant);
        setMantemientosTabla(mant)
      }
    };
    cargarValores();

    // buscarCantidadComponentes
    //     buscarCantidadAcciones
  }, []);
  const volver = () => {
    setActiveView("reportes")
  }

  const buscarFechaInicio = (e) => {
    setValorFechaInicio(e.target.value);
    const fechaSeleccionada = new Date(e.target.value);
    const datosFiltrados = mantenientos.filter((item) => {
      const fechaInico = new Date(item.fechaInico); // Convertir la fechaInico a un objeto Date
      return fechaInico >= fechaSeleccionada;
    });
    setMantemientosTabla(datosFiltrados);
    setMantemientosTemp(datosFiltrados)
  };

  const buscarFechaFinal = (e) => {
    if (valorFechaInicio === "") {
      mostrarMensaje({ title: "Fecha Inicial", text: "Selecione una fecha de partida", icon: "info", timer: 2000 });
      setValorFechaFinal("");
    } else {
      setValorFechaFinal(e.target.value);
      const fechaInicioFiltro = new Date(valorFechaInicio);
      const fechaFinFiltro = new Date(e.target.value);
      if (fechaInicioFiltro > fechaFinFiltro) {
        mostrarMensaje({ title: "Fechas invalidas", text: "Seleccione un rango de fechas Valido", timer: 2000, icon: "info" });
        setValorFechaFinal("");
      } else {
        buscarRangoFechas(valorFechaInicio, e.target.value)
      }

    }
  }
  const buscarRangoFechas = (fechaInicio, fechaFin) => {
    const fechaInicioFiltro = new Date(fechaInicio); // Fecha de inicio proporcionada
    let fechaFinFiltro = null;

    if (fechaFin && fechaFin !== "S/N" && fechaFin !== "fecha ampliada") {
      fechaFinFiltro = new Date(fechaFin); // Si la fecha es válida, la convertimos
    }

    if (!fechaFinFiltro) {
      fechaFinFiltro = fechaInicioFiltro;
    }

    const datosFiltrados = mantenientos.filter((item) => {
      const fechaInico = new Date(item.fechaInico); // Convertir fechaInico del mantenimiento
      let fechaFinItem = null;

      if (item.fechaFin && item.fechaFin !== "S/N" && item.fechaFin !== "ampliada") {
        fechaFinItem = new Date(item.fechaFin); // Si la fechaFin es válida, convertirla
      }

      if (!fechaFinItem) {
        fechaFinItem = fechaInico;
      }
      return (
        (fechaInico >= fechaInicioFiltro && fechaInico <= fechaFinFiltro) ||
        (fechaFinItem >= fechaInicioFiltro && fechaFinItem <= fechaFinFiltro) ||
        (fechaInico <= fechaInicioFiltro && fechaFinItem >= fechaFinFiltro)
      );
    });
    setMantemientosTabla(datosFiltrados);

    setMantemientosTemp(datosFiltrados);
  };

  const verDatos = (e) => {
    setdatosCodManten(e.value)
  }
  const verNumAct = (e) => {
    console.log(e.value);
    setContadores({ ...contadores, act: e.value });
    console.log(contadores);

  }
  const verNumCompo = (e) => {
    console.log(e.value);
    setContadores({ ...contadores, com: e.value });
    console.log(contadores);
  }

  return (
    <div className={styles["reporte-container"]}>

      <div>
        <TiArrowBack size={30} onClick={volver} />
        <h2>Reportes de Mantenimientos</h2>
        <div>
          <label htmlFor="">Mantenimientos</label>
          <Select
            placeholder="Seleccione tipo"
            options={mantenientos.map((acti) => ({
              value: acti.idManten,
              label: acti.codManten,
            }))}
            onChange={verDatos}
          ></Select>
        </div>

        <div className={styles["grafico-container"]}>
          <div className={styles["grafico-item"]}>
            <GraficoPastelComAct valoresPadre={datosCodManten} />
          </div>
        </div>
        <div>

          <div className={styles["container-barra"]}>
            <label htmlFor="">Actividades</label>
            <Select
              placeholder="Seleccione Actividad"
              options={actividades.map((acti) => ({
                value: acti.idActi,
                label: acti.nomActi,
              }))}
              onChange={verNumAct}

            ></Select>
            <label htmlFor="">Componentes</label>

            <Select
              placeholder="Seleccione componente"
              options={componentes.map((acti) => ({
                value: acti.idCompo,
                label: acti.nomCompo,
              }))}
              onChange={verNumCompo}
            ></Select>
            <GraficoBarras valoresPadre={contadores} ></GraficoBarras>

          </div>

        </div>
        <div className={styles["options"]}>
        <div className={styles["options-calendar"]}>
          <label>Fecha inicial</label>
          <input type="date" onChange={buscarFechaInicio} value={valorFechaInicio} />
        </div>
        <div className={styles["options-calendar"]}>

          <label>Fecha Final</label>
          <input type="date" onChange={buscarFechaFinal} value={valorFechaFinal} />
        </div>
        </div>
      </div>

      <div className={styles["grafico-container"]}>

        <div className={styles["grafico-item"]}>
          <GraficoPastel valoresPadre={mantenientosTabla} />
        </div>
        <div className={styles["grafico-item"]}>
          <GraficoLineas valoresPadre={mantenientosTabla} />
        </div>
      </div>

    </div>
  );
}

export default ReporteVista;
