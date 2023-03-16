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
      break;
    case "ReportesAdmin":
      return(<ReportesAdmin/>)
      break;
    case "Sucursales":
      return(<Sucursales/>)
      break;
    case "Productos":
      return(<Productos/>)
      break;
    case "AdminPerfiles":
      return(<AdminPerfiles/>)
    default:
      return(<ReportesAdmin/>)
      break;
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
