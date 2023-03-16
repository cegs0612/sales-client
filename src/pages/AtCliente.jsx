import React, { useContext } from 'react'
import Navbar from "./Navbar";
import { ControllerContext } from "../contexts/ControllerContext";
import Perfil from "./Perfil";
import Ventas from "./Ventas";
import ReportesVentas from "./ReportesVentas";
import "../css/AtCliente.css"

function renderBody(current) {
  switch (current) {
    case "Ventas":
      return(<Ventas/>)
      break;
    case "Perfil":
      return(<Perfil/>)
      break;
    case "ReportesVentas":
      return(<ReportesVentas/>)
      break;
    default:
      return(<Ventas/>)
      break;
  }
}

export default function AtCliente() {
  const {current} = useContext(ControllerContext)
  return (
    <div className='AtCliente'>
        <Navbar/>
        {renderBody(current)}
    </div>
  )
}
