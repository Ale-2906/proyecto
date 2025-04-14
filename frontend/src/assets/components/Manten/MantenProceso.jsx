import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import styles from "./CrearMantenimientoEstilos.module.css";
import styles1 from "./MantenProcesoEstilos.module.css";
import ApiService from "../../Services/ApiMetodos.js";
import ModalAgregarActivos from "./ModalAgregarActivos.jsx";
import ModalDetallesManten from "./ModalDetallesManten.jsx";
import mostrarMensaje from "../Mensajes/Mensaje.js";
import { FcApproval, FcCancel, FcFullTrash, FcDocument, FcSupport } from "react-icons/fc";
import ModalHisManten from "./ModalHisManten.jsx";
import ModalEdInfManten from "./ModalEdInfManten.jsx";


function MantenProceso({ datosMantenimiento }) {
  const [estadoAbrirModal, setEstadoAbrirModal] = useState(false);
  const [estadoAbrirModalDetalles, setEstadoAbrirModalDetalles] = useState(false);
  const [estadoAbrirModalHistorial, setEstadoAbrirModalHistorial] = useState(false);
  const [estadoAbrirModalEditarInf, setEstadoAbrirModalEditarInf] = useState(false);
  const [inforMantenimiento, setInforMantenimiento] = useState([]);
  const [activos, setActivos] = useState([]);
  const [activosProceso, setaActivosProceso] = useState([]);
  const [idActivoDetalle, setIdActivoDetalle] = useState([]);
  const [actividadBase, setActividades] = useState([]);
  const [componentBase, SetComponentes] = useState([]);
  const [referescar, setRefrescar] = useState(false);
  const [editarDetalles, setEditarDetalles] = useState(false);
  const [datosHistorial, setDatosHistorial] = useState([]);


  useEffect(() => {
    const cargarDatosPadre = async () => {
      setActivos(datosMantenimiento[0]);
      console.log(datosMantenimiento[0]);
      setActividades(datosMantenimiento[3]);
      SetComponentes(datosMantenimiento[4]);
      setInforMantenimiento(datosMantenimiento[5]);
      const comprob = datosMantenimiento[5];
      if (comprob[0].edit) {
        const actMan = await ApiService.buscarDatos("activosManten", comprob[0].idManten);
        setaActivosProceso(actMan);
      }
    };
    cargarDatosPadre();
  }, [datosMantenimiento]);  // Solo se ejecutará cuando datosPadre cambie

  const columasActivos = [
    {
      name: "Estado",
      cell: (row) => (
        <div>
          {row.idEstado === 4 ? (<FcApproval size={25} />) : (<FcCancel size={25} />)}
        </div>
      ),
    },
    { name: "Serie", selector: row => row.serieAct },
    { name: "Codigo", selector: row => row.codigoBarraAct },
    ...(inforMantenimiento && inforMantenimiento.length > 0 && inforMantenimiento[0]?.nomEstado === "En proceso"
      ? [{
        name: "Opciones",
        cell: (row) => (
          <div style={{ display: "flex", gap: "10px" }}>
            {row.idEstado === 4 ? (<div>
              <FcSupport size={25} onClick={() => abrirModalDetallesEdit(row.idmanAct)} />
              <FcFullTrash size={25} onClick={() => eliminarActivoProceso(row.idmanAct)} /></div>)
              : (<div>
                <FcDocument size={25} onClick={() => abrirModalDetalles(row.idmanAct)} />
                <FcFullTrash size={25} onClick={() => eliminarActivoProceso(row.idmanAct)} /></div>)}
          </div>
        ),
        ignoreRowClick: true
      }]
      : []
    )
  ];

  const abrirModalHistorial = () => {
    setDatosHistorial(inforMantenimiento);
    setEstadoAbrirModalHistorial(true);
  };

  const cerrarModalHistorial = async () => {
    setEstadoAbrirModalHistorial(false);
  };

  const abrirModalAgregarAct = () => {
    setEstadoAbrirModal(true);
  };

  const cerrarModalAgregarAct = async () => {
    setEstadoAbrirModal(false);
  };
  const abrirModalEditarInf = () => {
    setEstadoAbrirModalEditarInf(true);
  };

  const cerrarModalEditarInf = async () => {
    setEstadoAbrirModalEditarInf(false);
    datosMantenimiento[5] = inforMantenimiento;
  };

  useEffect(() => {
    const refre = async () => {
      if (referescar) {
        const val = await ApiService.buscarDatos("activosManten", inforMantenimiento[0].idManten);
        setaActivosProceso(val);
        setRefrescar(false);
      }
    }
    refre();

  }, [referescar]);

  const abrirModalDetalles = (val) => {
    setIdActivoDetalle(val);
    setEstadoAbrirModalDetalles(true);
  };

  const abrirModalDetallesEdit = (val) => {
    setIdActivoDetalle(val);
    setEditarDetalles(true);
    setEstadoAbrirModalDetalles(true);
  };

  const cerrarModalDetalles = () => {
    setEstadoAbrirModalDetalles(false);
    setEditarDetalles(false);

  };

  const eliminarActivoProceso = async (id) => {
    const res = await mostrarMensaje({
      icon: "info",
      title: "Eliminar del Proceso",
      text: "Esta seguro de eliminar el activo del processo",
      buttons: { cancel: "Cancelar", confirm: { text: "Elimiar", }, },
    });

    if (res) {
      const eliminar = { idManten: id }
      const res = await ApiService.borrarDatos("borrarDatosMantenimiento", eliminar);
      mostrarMensaje({ title: "Eliminado", text: "Activo eliminado del mantenimiento", icon: "success", timer: 2000 });
      const datos = activosProceso.filter((a) => a.idmanAct !== id);
      setaActivosProceso(datos);
    }
  }
  const cambioEstado = async () => {

    if (inforMantenimiento[0]?.nomEstado === "En proceso") {
      if (activosProceso.length === 0) {
        mostrarMensaje({ icon: "error", title: "Sin activos ", text: "No se puede finalizar si no se ha agregado ningun activo ", timer: 2000 });

      } else {
        const verf = activosProceso.filter((a) => a.idEstado === 3);
        if (verf.length !== 0) {
          mostrarMensaje({ icon: "error", title: "Manteminiento Incompleto ", text: "Hay activos que aun no se han dado un manteniemto ", timer: 2000 });

        } else {
          const res = await mostrarMensaje({
            icon: "info",
            title: "Terminar Mantenimiento ",
            text: "Estas seguro que deseas finalizar",
            buttons: {
              cancel: "Cancelar", confirm: { text: "Finalizar", },
            },
          });
          if (res) {
            const fech = asigarFecha();
            const dat = { idManten: inforMantenimiento[0]?.idManten, estado: 4, fecha: fech }
            const res = await ApiService.actualizarDatos("actuMantenimiento", dat);
            mostrarMensaje({ icon: "success", title: "Mantenimiento terminado ", text: "Ha finalizado con exito", timer: 2000 });
            setInforMantenimiento((prevState) => {
              const updatedState = [...prevState];
              updatedState[0].nomEstado = "Terminado"; // Modificamos solo el `nomEstado`
              updatedState[0].fechaFin = fech; // Modificamos solo el `nomEstado`

              return updatedState; // Actualizamos el estado con la nueva copia
            });
          }
        }
      }
    } else {
      const res = await mostrarMensaje({
        icon: "info",
        title: "Cambiar estado ",
        text: "Podra modificar datos del presente mantenimiento",
        buttons: { cancel: "Cancelar", confirm: { text: "De acuedo", }, },
      });
      if (res) {
        const dat = { idManten: inforMantenimiento[0]?.idManten, estado: 3, fecha: "fecha ampliada" }
        const res = await ApiService.actualizarDatos("actuMantenimiento", dat);
        mostrarMensaje({ icon: "success", title: "Mantenimiento habilitado ", text: "El estado se modificado con exito", timer: 2000 });
        setInforMantenimiento((prevState) => {
          const updatedState = [...prevState];
          updatedState[0].nomEstado = "En proceso";
          updatedState[0].fechaFin = "fecha ampliada";
          return updatedState;
        });

      }
    }

  }

  const asigarFecha = () => {
    const fechaActual = new Date();
    const año = fechaActual.getFullYear();
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const fechaFormateada = `${año}-${mes}-${dia}`;
    return fechaFormateada;
  }

  const customStyles = {
    header: {
      style: {
        minHeight: '56px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#7c181a',
        
      },
    },
    headRow: {
      style: {
        backgroundColor: '#7c181a',
        borderTop: '1px solid #dddddd',
  
      },
    },
    headCells: {
      style: {
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'uppercase',
        paddingLeft: '8px',
        paddingRight: '8px',
        color: '#ffffff',
  
      },
    },
    rows: {
      style: {
        backgroundColor: '#ffffff',
        '&:nth-of-type(even)': {
          backgroundColor: '#f9f9f9', // Color alternativo para filas pares
        },
        '&:hover': {
          backgroundColor: '#ffe3e3', // Color al pasar el cursor
        },
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    pagination: {
      style: {
        borderTop: '1px solid #dddddd',
        backgroundColor: '#ffffff',
        padding: '8px',
      },
      
    },
  };
  
  return (
    <div className={styles1.MantenProceso}>
      <h2 className={styles1.tittle}>Proceso de Mantenimiento</h2>
      
        <div className={styles1.options}>
          <label htmlFor="">Mantenimiento: {inforMantenimiento[0]?.codManten || "No disponible"}</label>
          <label htmlFor="">Fecha inicial: {inforMantenimiento[0]?.fechaInico || "No disponible"}</label>
          <label htmlFor="">Fecha final: {inforMantenimiento[0]?.fechaFin || "No disponible"}</label>
          <label htmlFor="">Estado: {inforMantenimiento[0]?.nomEstado || "No disponible"}</label>
          <label htmlFor="">Responsable: {inforMantenimiento[0]?.nombreResponsable || "No disponible"}</label>
        </div>

      <div >
        {inforMantenimiento[0]?.nomEstado === "En proceso" ? (<div className={styles1["action-buttons"]}>
          <button className={styles1["primary-button"]} onClick={cambioEstado}>Terminar Mantentiento</button>
          <button className={styles1["primary-button"]} onClick={abrirModalEditarInf}>Editar Informacion</button>
          <button className={styles1["primary-button"]} onClick={abrirModalHistorial}>Detalles</button>
          <button className={styles1["primary-button"]} onClick={abrirModalAgregarAct}>Agregar Activos</button>
        </div>
        ) : (
          <div className={styles1["action-buttons"]}>
            <button className={styles1["primary-button"]} onClick={cambioEstado}>Cambiar Estado</button>
            <button className={styles1["primary-button"]} onClick={abrirModalHistorial}>Detalles</button>
          </div>)}


      </div>

      <div className={styles1["data-table-container"]}>
        <DataTable
          pagination
          paginationPerPage={5}
          columns={columasActivos}
          data={activosProceso}
          noDataComponent="Ningún Activo Agregado"
          customStyles={customStyles}
          persistTableHead
        />
      </div>

      {estadoAbrirModal && (
        <div className={styles["modal-overlay"]}>
          <div className={styles.modal}>
            <ModalAgregarActivos onClose={cerrarModalAgregarAct}
              inforMantenimiento={inforMantenimiento}
              activos={activos}
              setRefrescar={setRefrescar}
              activosProceso={activosProceso} />
          </div>
        </div>
      )}

      {estadoAbrirModalDetalles && (
        <div className={styles["modal-overlay"]}>
          <div className={styles.modal}>
            <ModalDetallesManten onClose={cerrarModalDetalles}
              idActivoDetalle={idActivoDetalle}
              actividadBase={actividadBase}
              componentBase={componentBase}
              editarDetalles={editarDetalles}
              setRefrescar={setRefrescar}
              setEditarDetalles={setEditarDetalles}
            />
          </div>
        </div>
      )}
      {estadoAbrirModalHistorial && (
        <div className={styles["modal-overlay"]}>
          <div className={styles.modal}>
            <ModalHisManten
              onClose={cerrarModalHistorial}
              datosHistorial={datosHistorial}
            />
          </div>
        </div>
      )}

      {estadoAbrirModalEditarInf && (
        <div className={styles["modal-overlay"]}>
          <div className={styles.modal}>
            <ModalEdInfManten
              onClose={cerrarModalEditarInf}
              datosPadre={datosMantenimiento}
              setInforMantenimiento={setInforMantenimiento}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default MantenProceso;
