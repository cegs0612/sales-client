import React, {useContext} from 'react'
import { ControllerContext } from '../contexts/ControllerContext';
import { ProfileContext } from "../contexts/ProfileContext";
import "../css/Navbar.css"


function navbarAdmin(setCurrent) {
    return ( 
        <ul className='list'>
            <button className="listElement" onClick={()=>{setCurrent("ReportesAdmin")}}>Reportes</button>
            <button className="listElement" onClick={()=>{setCurrent("Sucursales")}}>Sucursales</button>
            <button className="listElement" onClick={()=>{setCurrent("Productos")}}>Productos</button>
            <button className="listElement" onClick={()=>{setCurrent("AdminPerfiles")}}>Administrar Perfiles</button>
        </ul>    
    )
};

function navbarAtCliente(setCurrent) {
    return ( 
        <ul className='list'>
            <button className="listElement" onClick={()=>{setCurrent("Ventas")}}>Ventas</button>
            <button className="listElement" onClick={()=>{setCurrent("ReportesVentas")}}>Reportes</button>
        </ul>
    )
};


export default function Navbar() {
  const {perfil,setPerfil} = useContext(ProfileContext);
  const {setCurrent} = useContext(ControllerContext)
  return (
    <div className='navbar'>
        <div className="seccion1">
            <h2>{perfil.datos.nombres+" "+perfil.datos.apellidos}</h2> 
            <button className="listElement" onClick={()=>{setCurrent("Perfil")}}>Perfil</button>
            <button className="listElement" onClick={()=>{setPerfil(undefined)}}>Cerrar Sesión</button>
        </div>
        <div className="seccion2">
            {perfil.acceso===1? navbarAdmin(setCurrent):navbarAtCliente(setCurrent)}
        </div>
    </div>
  )
}
