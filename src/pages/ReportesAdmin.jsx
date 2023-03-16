import React,{useState,useEffect,useContext} from 'react';
import Axios from "axios";
import "../css/reportes.css";
import { ProfileContext } from "../contexts/ProfileContext";
import TableToExcel from "@linways/table-to-excel";
import  moment  from "moment";


export default function ReportesAdmin() {
  const [showCabecera, setShowCabecera] = useState(true);
  const [showReporte, setShowReporte] = useState(false);
  const [tipoRango, setTipoRango] = useState(undefined);
  const [inicio, setInicio] = useState(undefined);
  const [final, setFinal] = useState(undefined);
  const [filtro, setFiltro] = useState(undefined);
  const [listaSucursales, setListaSucursales] = useState(undefined);
  const [listaPerfiles, setListaPerfiles] = useState(undefined);
  const [parametros, setParametros] = useState(undefined);
  const [datosReporte, setDatosReporte] = useState(undefined);
  const [today, setToday] = useState(undefined);
  const {perfil} = useContext(ProfileContext);

  const reset = ()=>{
    setShowCabecera(true);
    setTipoRango(undefined);
    setInicio(undefined);
    setFinal(undefined);
    setFiltro(undefined);
    setParametros(undefined);
    setDatosReporte(undefined);
  };

  const generarReporte = ()=>{
    if(inicio===undefined||final===undefined){
      alert("Elija fechas para el reporte");
    } else {
      if(final<inicio){
        alert("La fecha final no puede ser menor a la fecha de inicio, elija las fechas nuevamente");
        reset();
        document.getElementById("rdiario").checked = false;
        document.getElementById("rfechas").checked = false;
      } else {
        if(parametros[0]==="sucursal"){
          const query = {
            sucursal : parametros[1],
            $and: [
              {fecha: {$gte:inicio}},
              {fecha: {$lte:final}},
            ],
          }
          Axios.get("https://salescontrolserver.onrender.com/reporteAdmin",{params:{query,sort:{usuario:1,fecha:1}}})
          .then((response)=>{
            if(response.data===[]){
              alert("No hay datos en la(s) fecha(s) señalada(s)");
            } else {
              setDatosReporte(response.data);
              const hoy = new Date();
              setToday(hoy);
              setShowCabecera(false);
              setShowReporte(true);
            }})
          .catch((error)=>{
            alert("Ocurrió un error, inténtelo de nuevo");
            reset();
            console.log(error)})
        };
        if(parametros[0]==="vendedor"){
          const query = {
            usuario : parametros[1],
            $and: [
              {fecha: {$gte:inicio}},
              {fecha: {$lte:final}},
            ],
          }
          Axios.get("https://salescontrolserver.onrender.com/reporteAdmin",{params:{query,sort:{sucursal:1,fecha:1}}})
          .then((response)=>{
            if(response.data===[]){
              alert("No hay datos en la(s) fecha(s) señalada(s)");
            } else {
              const hoy = new Date();
              setToday(hoy);
              setDatosReporte(response.data);
              setShowCabecera(false);
              setShowReporte(true)}})
          .catch((error)=>{
            alert("Ocurrió un error, inténtelo de nuevo");
            reset();
            console.log(error)})
        };
        if(parametros[0]==="general"){
          const query = {
            $and: [
              {fecha: {$gte:inicio}},
              {fecha: {$lte:final}},
            ],
          }
          Axios.get("https://salescontrolserver.onrender.com/reporteAdmin",{params:{query,sort:{sucursal:1,fecha:1}}})
          .then((response)=>{
            if(response.data===[]){
              alert("No hay datos en la(s) fecha(s) señalada(s)");
            } else {
              const hoy = new Date();
              setToday(hoy);
              setDatosReporte(response.data);
              setShowCabecera(false);
              setShowReporte(true);
            }})
          .catch((error)=>{
            alert("Ocurrió un error, inténtelo de nuevo");
            reset();
            console.log(error)})
        }
      }
    }
  }


  useEffect(()=>{
    Axios.get("https://salescontrolserver.onrender.com/readSucursales")
    .then((response)=>{setListaSucursales(response.data)})
    .catch((error)=>{console.log(error)});

    Axios.get("https://salescontrolserver.onrender.com/readPerfiles")
    .then((response)=>{setListaPerfiles(response.data)})
    .catch((error)=>{console.log(error)});
  },[])


  return (
    <div className='reportesAdmin'>
      {showCabecera && <div className="cabecera">
        <h2>Reportes</h2>
        <div className="linea">
          <label htmlFor="reporte diario">Reporte diario</label>
          <input type="radio" name="option-reporte" value="Reporte diario" id='rdiario' onChange={()=>{
            setTipoRango("diario");
            const today = new Date();
            const inicio = new Date(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+" 00:00");
            setInicio(inicio);
            const final = new Date(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+" 23:59");
            setFinal(final);
            }} />
          <label htmlFor="reporte por fechas">Reporte por fechas</label>
          <input type="radio" name='option-reporte' value="Reporte por fechas" id='rfechas' onChange={()=>{setTipoRango("fechas")}} />
        </div>
        {tipoRango!==undefined && <div className='columna'>
          <div className="linea">
            <input type="radio" name="option-filtro" id="por-sucursal" onChange={()=>{setFiltro("sucursal")}} />
            <label htmlFor="sucursal">Por sucursal</label>
            {filtro==="sucursal" && <>{ listaSucursales===undefined? <></> : <select name="sucursales" id="selectedSucursal" onChange={(e)=>{setParametros([filtro,e.target.value])}}>
                <option value={undefined}> </option>
                {
                  listaSucursales.map((element,index)=>{
                    return(
                      <option key={"s"+index} value={element.codSucursal}>{element.denominacion}</option>
                    )
                  })
                }
            </select>}</>}
          </div>  
          <div className="linea">
            <input type="radio" name="option-filtro" id="por-vendedor" onChange={()=>{setFiltro("vendedor")}} />
            <label htmlFor="vendedor">Por vendedor</label>
            {filtro==="vendedor" && <>{ listaPerfiles===undefined? <></> : <select name="vendedores" id="selectedVendedor" onChange={(e)=>{setParametros([filtro,e.target.value])}}>
                <option value={undefined}> </option>
                {
                  listaPerfiles.map((element,index)=>{
                    if(element.puesto==="ventas"){
                      return(
                      <option key={"p"+index} value={element.codigo}>{element.datos.nombres+" "+element.datos.apellidos}</option>
                    )}
                  })
                }
            </select>}</>}
          </div>
          <div className="linea">
            <input type="radio" name="option-filtro" id="general" onChange={()=>{
              setFiltro("general");
              setParametros(["general"])}}/>
            <label htmlFor="general">General</label>
          </div>
        </div>}
        {tipoRango==="fechas" && <div className='linea'>
          <label htmlFor="inicio">Desde:</label>
          <input type="date" name="inicio" id="inicio" min="2023-02-01" onChange={(e)=>{
            const inicio = new Date(e.target.value + " 00:00");
            setInicio(inicio)}}/> 
          <label htmlFor="fin">Hasta:</label>
          <input type="date" name="final" id="final" min="2023-02-01" onChange={(e)=>{
            const final = new Date(e.target.value+" 23:59");
            setFinal(final)}}/> 
          </div>}
        
        {inicio!==undefined & final!== undefined?<div className="linea">
          <button onClick={()=>{generarReporte()}} >Generar Reporte</button>
        </div> :<></>}
      </div>}
      {showReporte && <div className="reporte-tabla">
        {datosReporte===undefined? <h2>Generando reporte</h2> : <div className="div-tabla">
          <table className='tabla' id='reporteVentas'>
            <caption><span id='caption'>Reporte</span></caption>
            <thead>
              <tr><th colSpan="3">Usuario: {perfil.datos.nombres+" "+perfil.datos.apellidos}</th></tr>
              <tr><th colSpan="3">Fecha: {today===undefined? <></>: moment(today).format('LLL')}</th></tr>
              <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Sucursal</th>
                <th>Fecha</th>
                <th>Factura</th>
                <th>Nombre</th>
                <th>NIT</th>
                <th>- Productos - Item / Cantidad / Precio /Subtotal -</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {
                datosReporte.map((element,index)=>{
                  return(
                    <tr key={"v"+index+1}>
                      <td>{index+1}</td>
                      <td>{element.usuario}</td>
                      <td>{element.sucursal}</td> 
                      <td>{moment(element.fecha).format('L')  +" "+moment(element.fecha).format('LT')}</td>
                      <td>{element.factura}</td>
                      <td>{element.nombre}</td>
                      <td>{element.nit}</td>
                      <td>{element.productos.map((element,index)=>{
                              return(
                                <p key={"vi"+index}>--  {element.item} / {element.cantidad} /  {element.precio} /  {element.subTotal
                                }</p>)
                            })}
                      </td>
                      <td>{element.total}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>}
        <div className="linea">
          <button onClick={()=>{
            TableToExcel.convert(document.getElementById("reporteVentas"));;
            }}>Exportar a Excel</button>
          <button onClick={()=>{
            setShowReporte(false);
            reset();
          }} >Nuevo Reporte</button>
        </div>
      </div>}
    </div>
  )
}
