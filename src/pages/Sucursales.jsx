import React,{useState, useEffect} from 'react'
import "../css/general.css";
import "../css/Sucursales.css"
import Axios from "axios";

function showModal(id,class1,class2) {
  const classList = document.getElementById(id).classList;
    
  if(classList.contains(class1)){
    document.getElementById(id).classList.replace(class1,class2);
  } else{
    document.getElementById(id).classList.replace(class2,class1);
  }
}

export default function Sucursales() {
  const [codigo, setCodigo] = useState("");
  const [denominacion, setDenominacion] = useState("");
  const [pais, setPais] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [dataSucursales,setDataSucursales] = useState(undefined);
  const [refresh,setRefresh] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(undefined);
  const limpiarCampos=()=>{
    setCodigo("");
    setDenominacion("");
    setPais("");
    setCiudad("");
    setCalle("");
    setNumero("");
    const radio =document.getElementById("s"+currentSelection);
    if(radio!==null){
      document.getElementById("s"+currentSelection).checked=false;
    }
    setCurrentSelection(undefined);
  };

  const displayTable = (data)=>{
    return (
      <table className='tabla'>
          <caption><span id='caption'>Sucursales</span></caption>
          <thead>
            <tr>
              <th>Código</th>
              <th>Denominación</th>
              <th>Pais</th>
              <th>Ciudad</th>
              <th>Calle/Avenida</th>
              <th>Número</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((element,index)=>{
                return(
                  <tr key={"s"+index}>
                    <td>{element.codSucursal}</td>
                    <td>{element.denominacion}</td>
                    <td>{element.pais}</td>
                    <td>{element.ciudad}</td>
                    <td>{element.calle}</td>
                    <td>{element.numero}</td>
                    <td>{element.update? <input type="radio" name="sucursales" id={"s"+index} onChange={()=>{selectSucursal(index)}}/> : <></>}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

    );
  }
  
  const selectSucursal = (id)=>{
    setCurrentSelection(id);
    setCodigo(dataSucursales[id].codSucursal);
    setDenominacion(dataSucursales[id].denominacion);
    setPais(dataSucursales[id].pais);
    setCiudad(dataSucursales[id].ciudad);
    setCalle(dataSucursales[id].calle);
    setNumero(dataSucursales[id].numero);
  }

  const postInfo=(info)=>{    
    let enviarDatos=true;
    
    if(info.includes("")){
      alert("Todos los campos son requeridos");
      enviarDatos=false;
    } else{     
      for (let index = 0; index < dataSucursales.length; index++) {
        const e = dataSucursales[index];
        if (info[0]===e.codSucursal||info[1]===e.denominacion) {
          alert("No se pueden repetir ni el campo Código ni el campo Denominación");
          enviarDatos=false;
          break;
        }        
      }
      if (enviarDatos===true) {
        Axios.post("http://localhost:3001/insertSucursal",{
          codSucursal: info[0],
          denominacion: info[1],
          pais: info[2],
          ciudad: info[3],
          calle: info[4],
          numero: info[5]
        })
        .then((response)=>{
          if (response.status===200) {
          alert("Datos ingresados correctamente");
          limpiarCampos();
          showModal("agregar","mostrar","noMostrar");
          document.getElementById("btn-agregar").classList.replace("btnMostrar","btnNoMostrar");
          document.getElementById("btn-modificar").classList.replace("btnMostrar","btnNoMostrar");
          setRefresh(!refresh);
          }})
        .catch((error)=>{console.log(error);})
      } 
    }
  };

  const updateInfo=(id,info)=>{
    let enviarDatos=true;
    
    if(info.includes("")){
      alert("Todos los campos son requeridos");
      enviarDatos=false;
    };
    if (enviarDatos===true) {
      Axios.put("http://localhost:3001/updateSucursal",{
        _id:id,
        codSucursal: info[0],
        denominacion: info[1],
        pais: info[2],
        ciudad: info[3],
        calle: info[4],
        numero: info[5]
      })
      .then((response)=>{
        if (response.status===200) {
        alert("Datos modificados correctamente");
        limpiarCampos();
        showModal("agregar","mostrar","noMostrar");
        document.getElementById("btn-agregar").classList.replace("btnMostrar","btnNoMostrar");
        document.getElementById("btn-modificar").classList.replace("btnMostrar","btnNoMostrar");
        setRefresh(!refresh);
        }})
      .catch((error)=>{console.log(error);})
    } 
  }

  const deleteInfo=()=>{
    if(currentSelection===undefined){
      alert("Debe seleccionar una sucursal");
    } else{
      let confirm = window.confirm("¿Está seguro de eliminar la sucursal "+ dataSucursales[currentSelection].denominacion+"?");
      if(confirm===true){
        Axios.delete("http://localhost:3001/deleteSucursal",{data:{_id:dataSucursales[currentSelection]._id}})
      .then((response)=>{
        if (response.status===200) {
        alert("Sucursal eliminada");
        setRefresh(!refresh);
        }})
      .catch((error)=>{console.log(error);})
      } else {
        limpiarCampos();
      }
    }
  }

  const showModificar=()=>{
    if(currentSelection===undefined){
      alert("Debe seleccionar una sucursal");
    } else{
      document.getElementById("btn-modificar").classList.replace("btnNoMostrar","btnMostrar");
      showModal("agregar","mostrar","noMostrar");
    }
  }
  useEffect(() => {
    Axios.get("http://localhost:3001/readSucursales")
    .then((response)=>{setDataSucursales(response.data)})
    .catch((error)=>{console.log(error)})
  }, [refresh]);
  

  return(
    <div className='sucursales' >
      <div className="comandos">
        <button onClick={()=>{setRefresh(!refresh)}}>Actualizar Tabla</button>
        <button onClick={()=>{
          limpiarCampos();
          document.getElementById("btn-agregar").classList.replace("btnNoMostrar","btnMostrar");
          showModal("agregar","mostrar","noMostrar");
          document.getElementById("codSucursal").focus()}}>Agregar Sucursal</button>
        <button onClick={()=>{showModificar();
        document.getElementById("codSucursal").focus()}}>Modificar Sucursal</button>
        <button onClick={()=>{deleteInfo()}}>Eliminar Sucursal</button>
      </div>
      <div className="modal noMostrar" id='agregar' onKeyDown={(e)=>{
      if(e.key==="Escape"){
        limpiarCampos();
        showModal("agregar","mostrar","noMostrar");
        document.getElementById("btn-agregar").classList.replace("btnMostrar","btnNoMostrar");
        document.getElementById("btn-modificar").classList.replace("btnMostrar","btnNoMostrar");
      }
    }} >
        <div className='form'>
        <div className="line">
          <label htmlFor="codSucursal">Código</label>
          <input type="text" name="codSucursal" id="codSucursal" value={codigo} onChange={(e)=>{setCodigo(e.target.value)}} />
        </div>
        <div className="line">
          <label htmlFor="denominacion">Denominación</label>
          <input type="text" name="denominacion" id="denominacion" value={denominacion} onChange={(e)=>{setDenominacion(e.target.value)}} />
        </div>
        <div className="line">
          <label htmlFor="pais">País</label>
          <input type="text" name="pais" id="pais" value={pais} onChange={(e)=>{setPais(e.target.value)}} />
        </div>
        <div className="line">
          <label htmlFor="ciudad">Ciudad</label>
          <input type="text" name="ciudad" id="ciudad" value={ciudad} onChange={(e)=>{setCiudad(e.target.value)}}/>
        </div>
        <div className="line">
          <label htmlFor="calle">Calle/Avenida</label>
          <input type="text" name="calle" id="calle" value={calle} onChange={(e)=>{setCalle(e.target.value)}}/>
        </div>
        <div className="line">
          <label htmlFor="numero">Número</label>
          <input type="text" name="numero" id="numero" value={numero} onChange={(e)=>{setNumero(e.target.value)}} />
        </div>
        <div className="line">
          <button id='btn-agregar' className='btnNoMostrar' onClick={()=>{postInfo([codigo,denominacion,pais,ciudad,calle,numero])}}>Agregar</button>
          <button id='btn-modificar' className='btnNoMostrar' onClick={()=>{updateInfo(dataSucursales[currentSelection]._id,[codigo,denominacion,pais,ciudad,calle,numero])}} >Modificar</button>
          <button onClick={()=>{
            limpiarCampos();
            showModal("agregar","mostrar","noMostrar");
          }}>Cancelar</button>
        </div>
        </div>
      </div>
      <div className="contenedorTabla">
          {dataSucursales===undefined? <p>No Data</p>:displayTable(dataSucursales)}
      </div>
    </div>
  )
}