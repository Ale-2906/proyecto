import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VentanaPrincipalEstilos.module.css";
import VentanaPrincipalFun from "./VentanaPrincipalFun.js";
import { useTokenVerification } from "../../Services/TokenVerification";
import mostrarMensaje from "../Mensajes/Mensaje.js";

function VentanaPrincipal() {
  const [activeView, setActiveView] = useState(null); // Estado para la vista activa
  const [sessionClosed, setSessionClosed] = useState(false); // Estado para verificar si la sesión fue cerrada manualmente
  const checkTokenAndRedirect = useTokenVerification(); // Hook para verificar token
  const navigate = useNavigate();

  // Validar token al cargar, excepto si la sesión fue cerrada manualmente
  useEffect(() => {
    if (!sessionClosed) {
      const tokenValid = checkTokenAndRedirect();
      if (!tokenValid) {
        mostrarMensaje({
          title: "Has excedido el tiempo de la sesión",
          text: "Inicia sesión nuevamente",
          icon: "error",
          timer: 3800,
        });
        navigate("/"); // Redirigir si no hay token válido
      }
    }
  }, [checkTokenAndRedirect, navigate, sessionClosed]);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Elimina el token
    setActiveView(null); // Restablecer la vista activa
    setSessionClosed(true); // Marcar la sesión como cerrada
    navigate("/"); // Redirigir al login
  };

  return (
    <div>
      <div className={styles.banner}></div>
      <div className={styles.VentanaPrinc}>
        <aside className={styles.Sidebar}>
          <ul className={styles.SidebarList}>
            <li className={styles.SidebarItem}>
              <a
                href="#"
                className={`${styles.SidebarLink} ${activeView === "activo" ? styles.active : ""
                  }`}
                onClick={() => setActiveView("activo")}
              >
                Activos
              </a>
            </li>
            <li className={styles.SidebarItem}>
              <a
                href="#"
                className={`${styles.SidebarLink} ${activeView === "procesoCompra" ? styles.active : ""
                  }`}
                onClick={() => setActiveView("procesoCompra")}
              >
                Procesos de compra
              </a>
            </li>
            <li className={styles.SidebarItem}>
              <a
                href="#"
                className={styles.SidebarLink}
                onClick={() => setActiveView("mantenimiento")}
              >
                Mantenimientos
              </a>
            </li>
            <li className={styles.SidebarItem}>
              <a
                href="#"
                className={styles.SidebarLink}
                onClick={() => setActiveView("reportes")}
              >
                Reportes
              </a>
            </li>
            <li className={styles.SidebarItem}>
              <a
                href="#"
                className={styles.SidebarLink}
                onClick={handleLogout} // Llamar al manejador de cierre de sesión
              >
                Cerrar Sesión
              </a>
            </li>
          </ul>
        </aside>
        <main className={styles.Content}>
          {activeView === null && (
            <>
              <h1 className={styles.ContentTitle}>
                Bienvenido a la vista principal
              </h1>
              <p className={styles.ContentText}>
                Aquí puedes gestionar los activos, mantenimientos y reportes de la UTA.
              </p>
            </>
          )}
          <VentanaPrincipalFun activeView={activeView} setActiveView={setActiveView} />
        </main>
      </div>
    </div>
  );
}

export default VentanaPrincipal;
