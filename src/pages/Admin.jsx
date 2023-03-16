import React,{useContext} from 'react';
import { ControllerContext } from "../contexts/ControllerContext";
import Navbar from "./Navbar";
import "../css/Admin.css"
import Perfil from "./Perfil";
import ReportesAdmin from "./ReportesAdmin";
import Sucursales from "./Sucursales";
import Productos from "./Productos";
import AdminPerfiles from "./AdminPerfiles";

function renderBody(current) {
  switch (current) {
    case "Perfil":
      return(<Perfil/>)
    case "ReportesAdmin":
      return(<ReportesAdmin/>)
    case "Sucursales":
      return(<Sucursales/>)
    case "Productos":
      return(<Productos/>)
    case "AdminPerfiles":
      return(<AdminPerfiles/>)
    default:
      return(<ReportesAdmin/>)
  }
}

export default function Admin() {
  const {current} = useContext(ControllerContext);
  return (
    <div className='admin'>
        <Navbar/>
        {renderBody(current)}
    </div>
  )
}
