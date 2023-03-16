import React , {useState,useContext} from 'react';
import Axios from "axios";
import "../css/reportes.css";
import { ProfileContext } from "../contexts/ProfileContext";
import TableToExcel from "@linways/table-to-excel";
import  moment  from "moment";


export default function ReportesVentas() {
  const [tipoReporte, setTipoReporte] = useState(undefined);
  const [tipoRango, setTipoRango] = useState(undefined);
  const [inicio, setInicio] = useState(undefined);
  const [final, setFinal] = useState(undefined);
  const [showCabecera, setShowCabecera] = useState(true);
  const [showReporte, setShowReporte] = useState(false);
  const [showEstadisticas, setShowEstadisticas] = useState(false);
  const [datosReporte, setDatosReporte] = useState(undefined);
  const {perfil} = useContext(ProfileContext);
  const [today, setToday] = useState(undefined);
  
  
  const reset = ()=>{
    setTipoReporte(undefined);
    setTipoRango(undefined);
    setInicio(undefined);
    setFinal(undefined);
    setShowCabecera(true);
    setDatosReporte(undefined);
  }
  
  

  const generarReporte = ()=>{
    if(final<inicio){
      alert("La fecha final no puede ser menor a la fecha de inicio, elija las fechas nuevamente");
      setInicio(undefined);
      setFinal(undefined);
      setTipoRango(undefined);
      document.getElementById("rango-diario").checked = false;
      document.getElementById("rango-porFechas").checked = false;
    } else {
      const usuario = perfil.codigo;
      const query = {
        usuario : usuario,
        $and: [
          {fecha: {$gte:inicio}},
          {fecha: {$lte:final}},
        ]
      }
      Axios.get("http://localhost:3001/reporteVentas",{params:query})
      .then((response)=>{
        const datos = response.data;
        datos.map((element)=>{
          element.fechaFormat = moment(element.fecha).format('L'); 
          element.horaFormat = moment(element.fecha).format('LT');
        });        
        if(tipoReporte==="ventas"){
          setDatosReporte(datos);
          const hoy = new Date();
          setToday(hoy);
          setShowCabecera(false);
          setShowReporte(true);
        };
        if(tipoReporte==="estadisticas"){
          const fechasArr = [];
          let arrAux = [];
          let i = 0;
          let j = 0;
          let control = true
          while (control) {
            while (j<datos.length) {
              if(datos[i].fechaFormat===datos[j].fechaFormat){
                arrAux.push([datos[j].fechaFormat,datos[j].total]);
                j++
              } else {
                fechasArr.push(arrAux);
                arrAux=[];
                i=j;
              };
              if(j===(datos.length-1)){
                arrAux=[];
                for (let k = i; k < j; k++) {
                  arrAux.push([datos[k].fechaFormat,datos[k].total]);
                };
                fechasArr.push(arrAux);
                control=false;
              };
            }
          };
          const totalDiario = fechasArr.map((element)=>{
            let suma = 0;
            element.forEach(element => {
              suma += element[1];
            });
            return suma;
          });
          let totalVendido = 0 ;
          for (let i = 0; i < totalDiario.length; i++) {
            totalVendido += totalDiario[i];            
          }; 
          const datosEstadisticas = [ 
            ["Total Vendido",totalVendido],
            ["Jornadas totales",fechasArr.length],
            ["Promedio de ventas",totalVendido/fechasArr.length],
          ];
          setDatosReporte(datosEstadisticas);
          const hoy = new Date();
          setToday(hoy);
          setShowCabecera(false);
          setShowEstadisticas(true);
        }
      })
      .catch((error)=>{
        alert("Hubo un error, vuelva a intentarlo");
        console.log(error);
        reset();
      })
    }
    

  }

  return (
    <div className='reportesVentas'>
      {showCabecera && <div className="cabecera">
        <h2>Reportes</h2>
        <div className="linea">
          <label htmlFor="ventas">Reporte de ventas</label>
          <input type="radio" name="option-reporte" value="Reporte diario" onChange={()=>{setTipoReporte("ventas")}} />
          <label htmlFor="estadisticas">Reporte de estadísticas</label>
          <input type="radio" name='option-reporte' value="Reporte esdatístico" onChange={()=>{setTipoReporte("estadisticas")}} />
        </div>
        {tipoReporte!==undefined && <div className='linea'>
          {tipoReporte==="ventas" && <><label htmlFor="diario">Diario</label>
          <input type="radio" name="option-rango" id="rango-diario" onChange={()=>{
            setTipoRango("diario");
            const today = new Date();
            const inicio = new Date(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+" 00:00");
            setInicio(inicio);
            const final = new Date(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+" 23:59");
            setFinal(final);
            }}/></>}  
          <label htmlFor="porFechas">Por fechas</label>
          <input type="radio" name="option-rango" id="rango-porFechas" onChange={()=>{
            setInicio(undefined);
            setFinal(undefined);
            setTipoRango("fechas");}} />
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
                      <td>{element.fechaFormat+" "+element.horaFormat}</td>
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
      {showEstadisticas && <div className='reporte-tabla'>
      {datosReporte===undefined? <h2>Generando reporte</h2> : <div className="div-tabla">
          <table className='tabla' id='reporteVentas'>
            <caption><span id='caption'>Reporte</span></caption>
            <thead>
              <tr><th colSpan="2">Usuario: {perfil.datos.nombres+" "+perfil.datos.apellidos}</th></tr>
              <tr><th colSpan="2">Fecha: {today===undefined? <></>: moment(today).format('LLL')}</th></tr>
            </thead>
            <tbody>
              {
                datosReporte.map((element,index)=>{
                  return(
                    <tr key={"es"+index+1}>
                      <th>{element[0]}</th>
                      <td>{element[1]}</td>
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
          setShowEstadisticas(false);
          reset();
          }} >Nuevo Reporte</button>
        </div>
      </div>}
    </div>
  )
}
