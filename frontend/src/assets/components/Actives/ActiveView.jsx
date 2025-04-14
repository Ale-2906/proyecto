import React, { useEffect,useState } from "react";
import ActiveCreateView from "./ActiveCreateView";
import styles from "./ActivoVistaEstilos.module.css"; // Importa los estilos específicos
import { useVistaActivo } from "./ActiveViewFun.js"; 
import mostrarMensaje from "../Mensajes/Mensaje.js";
import { useTokenVerification } from "../../Services/TokenVerification";
import ModalEditarActivo from "./ModalEditarActivo.jsx";
import stylesModal from "./ModalEdEstilos.module.css";
import ModalAgregarLotes  from "./ModalActivoLote.jsx";


const ActiveView = ({ onClose }) => {
  const [estadoAbrirModal, setEstadoAbrirModal] = useState(false);
  const [modalLotesAbierto, setModalLotesAbierto] = useState(false);
  const [actEditar,setActEditar]=useState("");
  const checkTokenAndRedirect = useTokenVerification(); // Verificar token
    const {
      form,
      setForm, // Asegúrate de importar setForm aquí
      cargarProcesosCompra ,
      cargarTipoActivo,
      cargarUbicacion,
      cargarEstado,
      cargarActivos,
      } = useVistaActivo();
      const [isLoading, setIsLoading] = useState(false);
      const [serie, setSerie] = useState("");

      const [datos, setDatos] = useState({
        procesoCompras: [],
        tipoActivos: [],
        ubicaciones: [],
        estados: [],
        activos:[],
       });

      // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  const obtenerDatos = async () => {
    setIsLoading(true);
    try {
      const [
        procesoCompras,
        tipoActivos,
        ubicaciones,
        estados,
      ] = await Promise.all([
        cargarProcesosCompra(),
        cargarTipoActivo(),
        cargarUbicacion(),
        cargarEstado(),
      ]);
      setDatos({ procesoCompras, tipoActivos, ubicaciones, estados, activos: [] });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };
  obtenerDatos();
}, []);


  const [isModalOpen, setIsModalOpen] = useState(false);

  const ProcesoCompChange = async (e) => {
    
  const tokenValid = checkTokenAndRedirect();
    if (!tokenValid) {
      mostrarMensaje({
       title: "Has excedido el tiempo de la sesión",
        text: "Inicia sesión nuevamente",
        icon: "error",
        timer: 3800,
      });
    }
    e.preventDefault();
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value, // Actualiza el select que se modificó
      procesoCompra: name === "procesoCompra" ? value : "", // Reinicia si no es el select actual
      tipoActivo: name === "tipoActivo" ? value : "",
      ubicacion: name === "ubicacion" ? value : "",
      estado: name === "estado" ? value : "",
    }));
  
    if (!value) {
      setDatos((prevDatos) => ({
        ...prevDatos,
        activos: [],
      }));
      return;
    }
  
    try {
      setIsLoading(true);
      const activosEncontrados = await cargarActivos(value, name);
      setDatos((prevDatos) => ({
        ...prevDatos,
        activos: activosEncontrados,
      }));
    } catch (error) {
      console.error("Error al cargar activos:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    setSerie(e.target.value); // Actualiza el estado con el valor del input
  };
  const handleBuscar = async (e) => {
    e.preventDefault();
    const valorSerie = serie.trim();
    if (!valorSerie) {
      mostrarMensaje({
        title: "No se puede buscar",
        text: "Ingrese el numero de serie del activo",
        icon: "error",
        timer: 2000,
      });
    }

    try {
      setIsLoading(true);
      const activosEncontrados = await cargarActivos(valorSerie, "serie");
      setDatos((prevDatos) => ({
        ...prevDatos,
        activos: activosEncontrados,
      }));
    } catch (error) {
      console.error("Error al buscar activos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    const tokenValid = checkTokenAndRedirect();
    if (!tokenValid) {
      mostrarMensaje({
       title: "Has excedido el tiempo de la sesión",
        text: "Inicia sesión nuevamente",
        icon: "error",
        timer: 3800,
      });
    }else{
    setIsModalOpen(true);
  }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const { procesoCompras,tipoActivos,ubicaciones,estados,activos} = datos;

  const abrirModal = (act,e) => {
    setActEditar(act);
    e.preventDefault()
    setEstadoAbrirModal(true); // Aquí sí puedes cambiar el estado de forma controlada
  };
  const cerrarModal = () => {
    setEstadoAbrirModal(false);
    setDatos((prevDatos) => ({
      ...prevDatos,
      activos: [],
    }));
  };
  const abrirModalLotes = () => {
    const tokenValid = checkTokenAndRedirect();
    if (!tokenValid) {
      mostrarMensaje({
        title: "Sesión expirada",
        text: "Inicia sesión nuevamente",
        icon: "error",
        timer: 3000,
      });
    } else {
      setModalLotesAbierto(true);
    }
  };
  
  const cerrarModalLotes = () => {
    setModalLotesAbierto(false);
  };
  

  return (
    <div className={styles.vistaActivo}>
      <h2 className={styles["form-title"]}>Gestión de Activos</h2>
      <form className={styles["active-form"]}>
        <div className={styles["filter-section"]}>
          <div className={styles["filter-group"]}>
            <label htmlFor="procesoCompra" className={styles.formLabel}>
              Proceso de compra</label>
            {isLoading ? (
              <p>Cargando Procesos de compra...</p>
            ) : (
              <select
                name="procesoCompra"
                id="procesoCompra"
                className={styles["filter-select"]}
                value={form.procesoCompra}
                onChange={ProcesoCompChange}
              >
                <option value="">Seleccione</option>
                {procesoCompras.map((procCompra) => (
                  <option key={procCompra.idCompra} value={procCompra.idCompra}>
                    {procCompra.idCompra}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className={styles["filter-group"]}>
            <label htmlFor="tipoActivo" className={styles.formLabel}>
              Tipo de Activo</label>
            {isLoading ? (
              <p>Cargando Procesos de compra...</p>
            ) : (
              <select
                name="tipoActivo"
                id="tipoActivo"
                className={styles["filter-select"]}
                value={form.tipoActivo}
                onChange={ProcesoCompChange}
              >
                <option value="">Seleccione</option>
                {tipoActivos.map((tipActivo) => (
                  <option key={tipActivo.idtipBien} value={tipActivo.idtipBien}>
                    {tipActivo.nomtipBien }
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className={styles["filter-group"]}>
            <label htmlFor="ubicacion" className={styles.formLabel}>
              Ubicacion</label>
            {isLoading ? (
              <p>Cargando Procesos de compra...</p>
            ) : (
              <select
                name="ubicacion"  
                id="ubicacion"
                className={styles["filter-select"]}
                value={form.ubicacion}
                onChange={ProcesoCompChange}
              >
                <option value="">Seleccione</option>
                {ubicaciones.map((ubicacion) => (
                  <option key={ubicacion.idUbic} value={ubicacion.idUbic}>
                    {ubicacion.nomUbic}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          
          <div className={styles["filter-group"]}>
            <label htmlFor="estado" className={styles.formLabel}>
            Estado</label>
            {isLoading ? (
              <p>Cargando Procesos de compra...</p>
            ) : (
              <select
                name="estado"
                id="estado"
                className={styles["filter-select"]}
                value={form.estado}
                onChange={ProcesoCompChange}
              >
                <option value="">Seleccione</option>
                {estados.map((estado) => (
                  <option key={estado.idEstado} value={estado.idEstado}>
                    {estado.nomEstado}
                  </option>
                ))}
              </select>
            )}
          </div>
          

        </div>

        <div className={styles["actions-section"]}>
          <label htmlFor="name-input">Ingrese la serie</label>
          <input
            id="name-input"
            type="text"
            placeholder="Serie"
            onChange={handleInputChange} 
            className={styles["text-input"]}
          />
          <div className={styles["action-buttons"]}>
            <button type="submit" className={styles["primary-button"]} onClick={handleBuscar} >Buscar</button>
            <button type="button" className={styles["secondary-button"]} onClick={handleOpenModal}>Agregar Activo</button>
            <button type="button" className={styles["secondary-button"]} onClick={abrirModalLotes}> Agregar por Lotes</button>
          </div>
        </div>

        <table className={styles["active-table"]}>
          <thead>
            <tr>
              <th>Proceso de compra</th>
              <th>Serie</th>
              <th>Código de barras</th>
              <th>Activo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Color</th>
              <th>Responsable</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
          {activos.length > 0 ? (
            activos.map((activo) => (
              <tr key={activo.serieAct}>
                <td>{activo.idCompra}</td>
                <td>{activo.serieAct}</td>
                <td>{activo.codigoBarraAct}</td>
                <td>{activo.nombien}</td>
                <td>{activo.marcaAct}</td>
                <td>{activo.modeloAct}</td>
                <td>{activo.colorAct}</td>
                <td>{activo.nomPers}</td>
                <td>{activo.nomUbic}</td>
                <td>{activo.nomEstado}</td>
                <td>
                <button className={styles["table-button"]} onClick={(e)=>abrirModal(activo,e)}>Editar</button> <br /><br />
              </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay procesos de compra disponibles</td>
            </tr>
          )}
        </tbody>
        </table>
      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">    
             <ActiveCreateView onClose={handleCloseModal} />
          </div>
        </div>
      )}

      {estadoAbrirModal && (
       <div className={stylesModal["modal-overlay"]}>
                 <div className={stylesModal.modal}>  
            <ModalEditarActivo
              onClose={cerrarModal}
              actEditar={actEditar}
            />
          </div>
        </div>
      )}
      {modalLotesAbierto && (
  <div className={stylesModal["modal-overlay"]}>
    <div className={stylesModal.modal}>
      <ModalAgregarLotes onClose={cerrarModalLotes} />
    </div>
  </div>
)}

      
    </div>
  );
}

export default ActiveView;
