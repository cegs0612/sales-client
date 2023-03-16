import React, {useState,useEffect} from 'react';
import Axios from "axios";
import "../css/general.css";
import "../css/AdminPerfiles.css"
function showModal(id,class1,class2) {
  const classList = document.getElementById(id).classList;
    
  if(classList.contains(class1)){
    document.getElementById(id).classList.replace(class1,class2);
  } else{
    document.getElementById(id).classList.replace(class2,class1);
  }
}

export default function AdminPerfiles() {
  const [perfiles, setperfiles] = useState(undefined);
  const [refresh, setRefresh] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [puesto, setPuesto] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [carnet, setCarnet] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [currentSelection, setCurrentSelection] = useState(undefined);  

  const limpiarCampos=()=>{
    setCodigo("");
    setUsuario("");
    setPuesto("");
    setNombres("");
    setApellidos("");
    setCarnet("");
    setDireccion("");
    setTelefono("");
    const radio=document.getElementById("p"+currentSelection);
    if(radio!==null){
      document.getElementById("p"+currentSelection).checked=false;
      setCurrentSelection(undefined);
    }
  }
  const selectPerfil=(id)=>{
    setCurrentSelection(id);
    setCodigo(perfiles[id].codigo);
    setUsuario(perfiles[id].usuario);
    setPuesto(perfiles[id].puesto);
    setNombres(perfiles[id].datos.nombres);
    setApellidos(perfiles[id].datos.apellidos);
    setCarnet(perfiles[id].datos.carnet);
    setDireccion(perfiles[id].contacto.direccion);
    setTelefono(perfiles[id].contacto.telefono);
  }
  const displayTable = (data)=>{
    return(
      <table className="tabla">
        <caption><span id='caption'>Perfiles</span></caption>
        <thead>
          <tr>
            <th>Código</th>
            <th>Usuario</th>
            <th>Puesto</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Carnet</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Seleccionar</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((element,index)=>{
              return(
                <tr key={"p"+index}>
                  <td>{element.codigo}</td>
                  <td>{element.usuario}</td>
                  <td>{element.puesto}</td>
                  <td>{element.datos.nombres}</td>
                  <td>{element.datos.apellidos}</td>
                  <td>{element.datos.carnet}</td>
                  <td>{element.contacto.direccion}</td>
                  <td>{element.contacto.telefono}</td>
                  <td>{element.update===true? <input type="radio" name="perfiles" id={"p"+index} onChange={()=>{selectPerfil(index)}}/> : <></>}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  };
  const showModificar=()=>{
    if(currentSelection===undefined){
      alert("Debe seleccionar un perfil");
    } else{
      document.getElementById("btn-modificar").classList.replace("btnNoMostrar","btnMostrar");
      showModal("modal","mostrar","noMostrar");
    }
  }
  const postInfo=(info)=>{
    let enviarDatos = true;
    if (info.includes("")){
      alert("Todos los campos son requeridos");
      enviarDatos=false;
    } else {
      for (let index = 0; index < perfiles.length; index++) {
        const e = perfiles[index];
        if (info[0]===e.codigo||info[1]===e.usuario) {
          alert("No se pueden repetir ni el campo Código ni el campo Usuario");
          enviarDatos=false;
          break;
        }        
      };
      if(enviarDatos){
        alert("La clave de ingreso para el nuevo perfil es igual al nombre de usuario, se recomienda al nuevo usuario cambiarla");
        let acceso="";
        if(info[2]==="admin")acceso=1;
        if(info[2]==="ventas")acceso=2;
        Axios.post("https://salescontrolserver.onrender.com/insertPerfil",{
          codigo: info[0],
          usuario: info[1],
          puesto: info[2],
          acceso: acceso,
          clave: info[1],
          datos: {
            nombres: info[3],
            apellidos: info[4],
            carnet: info[5],
          },
          contacto:{
            direccion: info[6],
            telefono: info[7],
          }
        }).then((response)=>{
          if (response.status===200) {
            alert("Datos ingresados correctamente");
            limpiarCampos();
            showModal("modal","mostrar","noMostrar");
            document.getElementById("btn-agregar").classList.replace("btnMostrar","btnNoMostrar");
            document.getElementById("btn-modificar").classList.replace("btnMostrar","btnNoMostrar");
            setRefresh(!refresh);
            }
        })
        .catch((error)=>{console.log(error)});
      }
    }
  }
  const updateInfo=(id,info)=>{
    let enviarDatos = true;
    let update=true;
    if(info[1]==="admin1"||info[1]==="ventas1")update=false;
    if(info.includes("")){
      alert("Todos los campos son requeridos");
      enviarDatos=false;
    };
    if(enviarDatos){
      let acceso="";
        if(info[2]==="admin")acceso=1;
        if(info[2]==="ventas")acceso=2;
        Axios.put("https://salescontrolserver.onrender.com/updatePerfil",{
          _id: id,
          codigo: info[0],
          usuario: info[1],
          puesto: info[2],
          acceso: acceso,
          clave: info[1],
          datos: {
            nombres: info[3],
            apellidos: info[4],
            carnet: info[5],
          },
          contacto:{
            direccion: info[6],
            telefono: info[7],
          },
          update:update,
        }).then((response)=>{
          if (response.status===200) {
            alert("Datos modificados correctamente");
            limpiarCampos();
            showModal("modal","mostrar","noMostrar");
            document.getElementById("btn-agregar").classList.replace("btnMostrar","btnNoMostrar");
            document.getElementById("btn-modificar").classList.replace("btnMostrar","btnNoMostrar");
            setRefresh(!refresh);
            }
        })
        .catch((error)=>{console.log(error)});
    };
  }
  const deleteInfo=()=>{
    if(currentSelection===undefined){
      alert("Debe seleccionar un perfil");
    } else{
      let confirm = window.confirm("¿Está seguro de eliminar el perfil del usuario "+ perfiles[currentSelection].usuario+"?");
      if(confirm===true){
        Axios.delete("https://salescontrolserver.onrender.com/deletePerfil",{data:{_id:perfiles[currentSelection]._id}})
      .then((response)=>{
        if (response.status===200) {
        alert("Perfil eliminada");
        setRefresh(!refresh);
        }})
      .catch((error)=>{console.log(error);})
      } else {
        limpiarCampos();
      }
    }
  }

  useEffect(()=>{
    Axios.get("https://salescontrolserver.onrender.com/readPerfiles")
    .then((response)=>{setperfiles(response.data)})
    .catch((error)=>{console.log(error)})
  },[refresh]);

  

  return (
    <div className='admin-perfiles'>
      <div className="comandos">
        <button onClick={()=>{setRefresh(!refresh)}}>Actualizar Tabla</button>
        <button onClick={()=>{
          limpiarCampos();
          document.getElementById("btn-agregar").classList.replace("btnNoMostrar","btnMostrar");
          showModal("modal","mostrar","noMostrar");
          document.getElementById("codPerfil").focus()}}>Agregar Perfil</button>
        <button onClick={()=>{
          showModificar();
          document.getElementById("codPerfil").focus();
        }}>Modificar Perfil</button>
        <button onClick={()=>{deleteInfo()}}>Eliminar Perfil</button>
      </div>
      <div className="modal noMostrar" id='modal' onKeyDown={(e)=>{
      if(e.key==="Escape"){
        limpiarCampos();
        showModal("modal","mostrar","noMostrar");
        document.getElementById("btn-agregar").classList.replace("btnMostrar","btnNoMostrar");
        document.getElementById("btn-modificar").classList.replace("btnMostrar","btnNoMostrar");
      }
    }} >
        <div className='form'>
        <div className="line">
          <label htmlFor="codPerfil">Código</label>
          <input type="text" name="codPerfil" id="codPerfil" value={codigo} onChange={(e)=>{setCodigo(e.target.value)}} />
        </div>
        <div className="line">
          <label htmlFor="usuario">Usuario</label>
          <input type="text" name="usuario" id="usuario" value={usuario} onChange={(e)=>{setUsuario(e.target.value)}} />
        </div>
        <div className="line">
          <label htmlFor="puesto">Puesto</label>
          <select name="puesto" id="puesto" onChange={(e)=>{setPuesto(e.target.value)}}>
            <option value=""></option>
            <option value="admin">Administración</option>
            <option value="ventas">Atención al cliente</option>
          </select>
        </div>
        <div className="line">
          <label htmlFor="nombre">Nombres</label>
          <input type="text" name="nombres" id="nombres" value={nombres} onChange={(e)=>{setNombres(e.target.value)}}/>
        </div>
        <div className="line">
          <label htmlFor="apellidos">Apellidos</label>
          <input type="text" name="apellidos" id="apellidos" value={apellidos} onChange={(e)=>{setApellidos(e.target.value)}}/>
        </div>
        <div className="line">
          <label htmlFor="carnet">Carnet</label>
          <input type="text" name="carnet" id="carnet" value={carnet} onChange={(e)=>{setCarnet(e.target.value)}} />
        </div>
        <div className="line">
          <label htmlFor="direccion">Dirección</label>
          <input type="text" name="direccion" id="direccion" value={direccion} onChange={(e)=>{setDireccion(e.target.value)}} />
        </div>
        <div className="line">
          <label htmlFor="telefono">Teléfono</label>
          <input type="text" name="telefono" id="telefono" value={telefono} onChange={(e)=>{setTelefono(e.target.value)}} />
        </div>
        <div className="line">
          <button id='btn-agregar' className='btnNoMostrar' onClick={()=>{postInfo([codigo,usuario,puesto,nombres,apellidos,carnet,direccion,telefono])}}>Agregar</button>
          <button id='btn-modificar' className='btnNoMostrar' onClick={()=>{updateInfo(perfiles[currentSelection]._id,[codigo,usuario,puesto,nombres,apellidos,carnet,direccion,telefono])}} >Modificar</button>
          <button onClick={()=>{
            limpiarCampos();
            showModal("modal","mostrar","noMostrar");
          }}>Cancelar</button>
        </div>
        </div>
      </div>
      <div className="contenedorTabla">
        {perfiles===undefined?<p>No data</p>:displayTable(perfiles)}
      </div>
      <div className="modal-Perfil">

      </div>
    </div>
  )
}
