import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginVista from "./assets/components/login/LoginVista";
import "./App.css";
import VentanaPrincipal from "./assets/components/mainWindow/VentanaPrincipal";
import index from "./assets/components/ActivosLotes/index.php";

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginVista />} />
          <Route path="/main" element={<VentanaPrincipal />} />
          <Route path="/lotes" element={<index />} />


        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
