import React ,{useEffect, useState}from "react";
import DataTable from "react-data-table-component";
import styles from './ModalDetallesMantenestilos.module.css'; // Importa el CSS Module
import ApiService from "../../Services/ApiMetodos";
import { TiArrowBack } from "react-icons/ti";


function ModalHisManten({onClose,datosHistorial}) {
    const [datosMantenimiento, setDatosMantenimiento] = useState([]);
    useEffect(()=>{
        const cargarInformacion=async()=>{
            const activo = await ApiService.buscarDatos("historialManten", datosHistorial[0].idManten)
            setDatosMantenimiento(activo);
        }
        cargarInformacion();
    },[]);
    
    const datosColumna = [
        { name: "Serie", selector: row => row.serieAct, width: "90px" },
        {
          name: "Actividades",width: "200px",
          cell: (row) => (
            <div>
              <ul>
                {row.actividad
                  ? row.actividad.split(", ").map((a, index) => (
                    <li key={index}>{a}</li> // Aquí se añadió el key
                  ))
                  : <li>No hay actividades</li>}
              </ul>
            </div>
          ),
        },
        {
          name: "Componentes", width: "200px",
          cell: (row) => (
            <div>
              <ul>
                {row.componente
                  ? row.componente.split(", ").map((a, index) => (
                    <li key={index}>{a}</li> // Aquí también se añadió el key
                  ))
                  : <li>No hay componentes</li>}
              </ul>
            </div>
          ),
        },
        {
          name: "Observacion",width: "200px",
          cell: (row) => (
            <div>
              <ul>
                {row.observacion
                  ? <li>{row.observacion}</li>
                  : <li>No hay observaciones</li>}
              </ul>
            </div>
          ),
        },
    ];
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
          fontSize: '10px',
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
        <div className={styles.modalContainer}>
            <TiArrowBack size={30} onClick={()=>onClose()} />
            <DataTable
                columns={datosColumna}
                data={datosMantenimiento}
                pagination
                paginationPerPage={4}
                noDataComponent="No hay activo registrados"
                customStyles={customStyles}
                persistTableHead
            />
        </div>
    );
}

export default ModalHisManten; // Solo exportar la referencia a la función, no su ejecución.
