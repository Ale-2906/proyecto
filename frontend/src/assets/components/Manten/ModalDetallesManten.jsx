import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Select from "react-select";
import mostrarMensaje from "../Mensajes/Mensaje";
import styles from './ModalDetallesMantenestilos.module.css'; // Importa el CSS Module
import ApiService from "../../Services/ApiMetodos";

function ModalDetallesManten({ onClose,idActivoDetalle,actividadBase,componentBase,editarDetalles,setEditarDetalles,setRefrescar}) {
  const [observacion, setObservacion] = useState("");

  const [actividades, setActividades] = useState([]);
  const [componentes, SetComponentes] = useState([]);
  const [selectActividades,setSelectActividades]= useState([]);
  const [selectComponentes,setSelectComponentes]= useState([]);

  const [recopilacionDetalles,setRecopilacionDetalles]= useState([]);

  const [dataActividad, setDataActividad] = useState([]);
  const [dataComponentes, setDataComponentes] = useState([]);

  const [formalario,setFormulario]= useState({obs:"",datos:"",idManAct:""});
  const [modificarDetalles,setModificarDetalles]=useState(false);

  const data = [{ label: "dsd", value: "we" }];
useEffect(() => {
    const cargarDatosPadre = () => {
      setActividades(actividadBase);
      SetComponentes(componentBase);
      
    };
    const cargarDatosEditar= async()=>{
      if (editarDetalles) {
        await procesoEditar();
      }
    }
    cargarDatosPadre();
    cargarDatosEditar();
  }, []);

  const columnasActividades = [
    { name: "Actividad", selector: (row) => row.label },
    {
      name: "Opciones",
      cell: (row) => <button className={styles.button} onClick={()=>eliminarActividad(row.value)}>Retirar</button>,
      ignoreRowClick: true,
    },
  ];
  const columnasComponentes = [
    { name: "Componente", selector: (row) => row.label },
    { name: "Opciones",
      cell: (row) => <button className={styles.button} onClick={()=>eliminarComponente(row.value)}>Retirar</button>,
      ignoreRowClick: true,},];

  const cerrarModal = async () => {
    if (onClose) {
      onClose();
    }
  };

  const eliminarActividad = async (id) => {
    const res = await mostrarMensaje({
      icon: "info",
      title: "Retirar",
      text: "Desea retirar esta actividad",
      buttons: { cancel: "No", confirm: { text: "Sí" } },
    });

    if (res) {
        const n= dataActividad.filter((row)=>row.value!==id);
        setDataActividad(n);
        const nd= dataActividad.filter((row)=>row.value===id);
        setActividades((datos)=>[...datos,...nd]);
        eliminarDetalle("act",id);
    }
  };

  const eliminarComponente = async (id) => {
    const res = await mostrarMensaje({
      icon: "info",
      title: "Retirar",
      text: "Desea retirar este componente",
      buttons: { cancel: "No", confirm: { text: "Sí" } },
    });

    if (res) {
      const n= dataComponentes.filter((row)=>row.value!==id);
      setDataComponentes(n);
      const nd= dataComponentes.filter((row)=>row.value===id);
      SetComponentes((datos)=>[...datos,...nd]);
      eliminarDetalle("act",id);
    }
  };

  const agregarActividad = () => {
    if (selectActividades.length===0) {
        mostrarMensaje(
            {title: "Vacio", text: "Primero selecione alguna actividad",icon: "error", timer:2000}
          );
      }else{
        
        const act=selectActividades.map(({value})=>({tipo:"act",valor:value}));
        setRecopilacionDetalles((ac)=>[...ac, ...act]);
        setDataActividad((datos)=>[...datos,...selectActividades])
        const idsEnvio = selectActividades.map((item) => item.value); 
        const n = actividades.filter((acti) => !idsEnvio.includes(acti.value));
        setActividades(n);
        setSelectActividades([]);
      }

  };

  const agregarComponente = () => {
    if (selectComponentes.length===0) {
        mostrarMensaje(
          {title: "Vacio", text: "Primero selecione algun componente",icon: "error", timer:2000}
        );
      }else{
        const com=selectComponentes.map(({value})=>({tipo:"com",valor:value}));
        setRecopilacionDetalles((ac)=>[...ac, ...com]);
        setDataComponentes((datos)=>[...datos,...selectComponentes])
        const idsEnvio = selectComponentes.map((item) => item.value); 
        const n = componentes.filter((acti) => !idsEnvio.includes(acti.value));
        SetComponentes(n);
        setSelectComponentes([]);

      }

  };

const eliminarDetalle = (tipo, valor) => {
    const eliminar = recopilacionDetalles.filter(
      (d) => !(d.tipo.includes(tipo) && String(d.valor).includes(valor)));
    setRecopilacionDetalles(eliminar);
};

const valSelectActividad = (val) => {setSelectActividades(val)};
const valSelectComponente = (val) => {setSelectComponentes(val)};

const guardarDetalle=()=>{
  if (recopilacionDetalles.length!==0) {
    const envio=recopilacionDetalles.map(({ tipo,valor }) => `( '${idActivoDetalle}','${tipo}', '${valor}')`)
    .join(", ");

    setFormulario({...formalario,obs:observacion,datos:envio,idManAct:idActivoDetalle})
    
  }else{
    mostrarMensaje({title:"Sin datos para enviar",text:"Debe de agregar minimo una actitividad o conponente",icon:"error",timer:2000});
  }
}

useEffect(()=>{
  const enviar= async()=>{
  if (formalario.datos!=="") {
    if (editarDetalles) {
      const eliminar={idManten:idActivoDetalle,edit:"si"};
      const act= await ApiService.borrarDatos("borrarDatosMantenimiento",eliminar);
    }
    const res=  await ApiService.enviarDatos("nuevoDetalleMantenimiento",formalario);
    console.log(res);
      if (!editarDetalles) {
        mostrarMensaje({title:"Guardado",text:"Guardado todos los datos",icon:"success",timer:2000});
      }else{
        mostrarMensaje({title:"Actualizado",text:"Se ha actualizado la informacion",icon:"success",timer:2000});
      }
    setEditarDetalles(false);
    setRefrescar(true);
    onClose(); // Llama a la función onClose para cerrar el modal
    borrarDatos();
  }
}
 enviar();  
},[formalario]);

/////////////////Editar 
const procesoEditar = async()=>{
  const formulario={idman:idActivoDetalle};
  const valores = await ApiService.enviarDatos("histManEditAct",formulario);
  for (const val of valores) {
    if (val.tipoMD === "act") {
      const bus= actividadBase.filter((a)=>a.value===val.idReferencia);
      setSelectActividades((act)=>[...act,...bus]);

    } else if (val.tipoMD === "com") {
      const bus= componentBase.filter((a)=>a.value===val.idReferencia);
      setSelectComponentes((com)=>[...com,...bus]);

    } else {
       const obs = await ApiService.buscarDatos("busobserva", idActivoDetalle);
       setObservacion(obs[0].campObvs);
    }
}
setModificarDetalles(true)

} 

useEffect(()=>{
  if (modificarDetalles) {
    if (selectActividades.length!==0) {
    agregarActividad();
    
    }
    if (selectComponentes.length!==0) {
    agregarComponente();
    }
    setSelectActividades([])
    setSelectComponentes([])

  }
},[modificarDetalles]);

const actualizarDetalle= async ()=>{
  const res = await mostrarMensaje({
    icon: "info",
    title: "Actualizar",
    text: "Desea actualizar los detalles del mantenimiento",
    buttons: { cancel: "No", confirm: { text: "Sí" } },
  });

  if (res) {
     guardarDetalle();
  }

}
 const borrarDatos=()=>{
  setSelectActividades([]);
  setSelectActividades([]);
  setDataActividad([]);
  setDataComponentes([]);
  setObservacion([]);
  setModificarDetalles(false);
  setFormulario("");
 }

  return (
    <div className={styles.modalContainer}>
      <div className={styles.row}>
        <div className={styles.column}>
          <label htmlFor="">Actividades</label>
          <Select
            isMulti
            closeMenuOnSelect={false}
            options={actividades.map((acti) => ({
              value: acti.value,
              label: acti.label,
            }))}
            placeholder="Seleccione actividades"
            onChange={valSelectActividad}
            value={selectActividades}
          />
          <div className={styles["buttonContainer"]}>
          <button className={styles.button} onClick={agregarActividad}>Agregar</button>
          </div>
          <DataTable
            pagination
            paginationPerPage={5}
            columns={columnasActividades}
            data={dataActividad}
            noDataComponent="Ningún Activo Agregado"
            persistTableHead
          />
        </div>

        <div className={styles.column}>
          <label htmlFor="">Componentes</label>
          <Select
            isMulti
            closeMenuOnSelect={false}
            options={componentes.map((acti) => ({
              value: acti.value,
              label: acti.label,
            }))}
            placeholder="Selecciona componentes"
            onChange={valSelectComponente}
            value={selectComponentes}
          />
          <div className={styles["buttonContainer"]}>
          <button className={styles.button} onClick={agregarComponente}>Agregar</button>
          </div>
          <DataTable
            pagination
            paginationPerPage={5}
            columns={columnasComponentes}
            data={dataComponentes}
            noDataComponent="Ningún Activo Agregado"
            persistTableHead
          />
        </div>
      </div>

      <div className={styles.textAreaContainer}>
        <label htmlFor="">Observación:</label>
        <textarea
          id="observacion"
          name="observacion"
          rows="5"
          cols="80"
          placeholder="Detalle alguna observación"
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
        ></textarea>

        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={cerrarModal}>Cancelar</button>
          {editarDetalles ? (<div><button className={styles.button} onClick={actualizarDetalle}>Actualizar</button></div>
          ) : (<div><button className={styles.button} onClick={guardarDetalle}>Finalizar</button></div> )}

        </div>
      </div>
    </div>
  );
}

export default ModalDetallesManten;
