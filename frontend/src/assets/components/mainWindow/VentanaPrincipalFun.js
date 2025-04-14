import React, { useEffect,useState } from "react";
import { useTokenVerification } from "../../Services/TokenVerification"; // Importa el hook
import ProcesoCompraView from "../compra/ProcesoCompraView";
import ActiveView from "../Actives/ActiveView";
import MantenPrincipal from "../Manten/MantenPrincipal";
import MantenProceso from "../Manten/MantenProceso";
import ReporteVista from "../Reporte/ReporteVista";
import ReportePrincipal from "../Reporte/ReportePrincipal";
import CargarExcelActivos from "../ActivosLotes/CargarExcelActivos";


const VentanaPrincipalFun = ({ activeView, setActiveView }) => {
  const checkTokenAndRedirect = useTokenVerification(); // Usa el hook
  const [datosMantenimiento, setDatosMantenimiento] = useState("");
 
  useEffect(() => {
    if (activeView === "cerrarsecion") {
      setActiveView(null);
      localStorage.removeItem("authToken"); // Elimina el token
    }
  }, [activeView, setActiveView]);

  useEffect(() => {
    checkTokenAndRedirect(); // Verifica el token al cargar el componente
  }, [activeView, checkTokenAndRedirect]);

  return (
    <section className="content">
      {activeView === "activo" && <ActiveView />}
      {activeView === "procesoCompra" && <ProcesoCompraView />}
      {activeView === "reportes" && <ReportePrincipal setActiveView={setActiveView}/>}
      {activeView === "mantenimiento" && (<MantenPrincipal setActiveView={setActiveView} setDatosMantenimiento={setDatosMantenimiento} datosMantenimiento={datosMantenimiento} />)}
      {activeView === "MantenProceso" && (<MantenProceso setActiveView={setActiveView} datosMantenimiento={datosMantenimiento} />)}
      {activeView === "reporteGeneral" && (<ReporteVista setActiveView={setActiveView} datosMantenimiento={datosMantenimiento} />)}
      {activeView === "cargarExcelActivos" && <CargarExcelActivos />}

      
    </section>
  );
};

export default VentanaPrincipalFun;
