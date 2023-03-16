import React,{useContext,useEffect,useState} from 'react'
import {ProfileContext} from "../contexts/ProfileContext";
import "../css/Perfil.css";
import "../css/general.css";
import Axios from "axios";

function showModal(id,class1,class2) {
  const classList = document.getElementById(id).classList;
    
  if(classList.contains(class1)){
    document.getElementById(id).classList.replace(class1,class2);
  } else{
    document.getElementById(id).classList.replace(class2,class1);
  }
}

export default function Perfil() {
  const {perfil,setPerfil} = useContext(ProfileContext);
  const [refresh, setRefresh] = useState(true);
  const [nombres, setNombres] = useState(perfil.datos.nombres);
  const [apellidos, setApellidos] = useState(perfil.datos.apellidos);
  const [carnet, setCarnet] = useState(perfil.datos.carnet);
  const [direccion, setDireccion] = useState(perfil.contacto.direccion);
  const [telefono, setTelefono] = useState(perfil.contacto.telefono);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  
  
  const updatePassword=()=>{
    let sendInfo=true;
    if(oldPassword===""||newPassword1===""||newPassword2===""){
      alert("Los campos no pueden estar vacíos");
      sendInfo=false;
    } else{ 
      if(oldPassword!==perfil.clave){
        alert("La contraseña actual es incorrecta");
        sendInfo=false;
      } else{
        if(oldPassword===newPassword1){
          alert("La nueva contraseña no puede ser igual a la contraseña actual");
          sendInfo=false;
        } else{
          if(newPassword1!==newPassword2){
            alert("Los campos Nueva Contraseña y Confirmar Contraseña deben ser iguales");
            sendInfo=false;
          }
        }
      }
    }    
    if(sendInfo){
      Axios.put("http://localhost:3001/changePassword",{
        _id:perfil._id,
        clave:newPassword1,
      })
      .then((response)=>{
        if(response.status===200){
          alert("Contraseña cambiada con éxito");
          showModal("modal-password","mostrar","noMostrar");
          setOldPassword("");
          setNewPassword1("");
          setNewPassword2("");
          setRefresh(!refresh);
        }
      })
      .catch((error)=>{console.log(error)});
    }
  }

  const updateInfo = ()=>{
    let update=true;
    if(perfil.usuario==="admin1"||perfil.usuario==="ventas1")update=false;
    Axios.put("http://localhost:3001/updatePerfil",{
      _id: perfil._id,
      codigo: perfil.codigo,
      usuario: perfil.usuario,
      puesto: perfil.puesto,
      acceso: perfil.acceso,
      clave: perfil.clave,
      datos: {
        nombres: nombres,
        apellidos: apellidos,
        carnet: carnet,
      },
      contacto:{
        direccion: direccion,
        telefono: telefono,
      },
      update:update,
    }).then((response)=>{
      if(response.status===200){
        alert("Información cambiada con éxito");
        showModal("modal-perfil","mostrar","noMostrar");
        setRefresh(!refresh);
      }
    }).catch((error)=>{console.log(error)});
  }
  useEffect(()=>{
    Axios.get("http://localhost:3001/readPerfil",{params:{_id:perfil._id}})
    .then((response)=>{setPerfil(response.data[0])})
    .catch((error)=>{console.log(error)});

    if(perfil.update===false){
      document.getElementById("update-password").setAttribute("disabled","");
    }
  },[refresh]);
  
  return (
    <div className='perfil'>
      <div className="info">
        <table className='tabla-perfil'>
          <tbody>
            <tr><th className='d'>Código</th><td className='d'>{perfil.codigo}</td></tr>
            <tr><th className='d'>Usuario</th><td className='d'>{perfil.usuario}</td></tr>
            <tr><th className='d'>Nombres</th><td className='d'>{perfil.datos.nombres}</td></tr>
            <tr><th className='d'>Apellidos</th><td className='d'>{perfil.datos.apellidos}</td></tr>
            <tr><th className='d'>Carnet</th><td className='d'>{perfil.datos.carnet}</td></tr>
            <tr><th className='d'>Dirección</th><td className='d'>{perfil.contacto.direccion}</td></tr>
            <tr><th className='d'>Teléfono</th><td className='d'>{perfil.contacto.telefono}</td></tr>
          </tbody>          
        </table>
      </div>
      <div className="comandos-perfil">
        <button id='update-password' onClick={()=>{
          showModal("modal-password","mostrar","noMostrar");
          document.getElementById("oldPassword").focus()}}>Actualizar contraseña</button>
        <button onClick={()=>{
          showModal("modal-perfil","mostrar","noMostrar");
          document.getElementById("nombres").focus();}}>Actualizar datos</button>
      </div>
      <div className="modal noMostrar" id='modal-perfil' onKeyDown={(e)=>{
      if(e.key==="Escape")showModal("modal-perfil","mostrar","noMostrar");
      if(e.key==="Enter")updateInfo();
    }} >
        <div className='form'>
        <div className="line">
          <label htmlFor="codigo">Codigo</label>
          <input type="text" name="usuario" id="usuario" value={perfil.codigo} readOnly/>
        </div>
        <div className="line">
          <label htmlFor="usuario">Usuario</label>
          <input type="text" name="usuario" id="usuario" value={perfil.usuario} readOnly/>
        </div>
        <div className="line">
          <label htmlFor="nombres">Nombres</label>
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
          <button id='btn-modificar' className='btnMostrar' onClick={()=>{updateInfo()}} >Modificar</button>
          <button onClick={()=>{
            showModal("modal-perfil","mostrar","noMostrar");
          }}>Cancelar</button>
        </div>
        </div>
      </div>
      <div className="modal noMostrar" id='modal-password' onKeyDown={(e)=>{
      if(e.key==="Escape"){
        showModal("modal-password","mostrar","noMostrar");
        setOldPassword("");
        setNewPassword1("");
        setNewPassword2("");
      };
      if(e.key==="Enter")updatePassword();
      }} >
        <div className='form'>
        <div className="line">
          <label htmlFor="old Password">Contraseña Actual</label>
          <input type="password" name="oldPassword" id="oldPassword" value={oldPassword} onChange={(e)=>{setOldPassword(e.target.value)}}/>
        </div>
        <div className="line">
          <label htmlFor="newPassword1">Nueva Contraseña</label>
          <input type="password" name="newPassword1" id="newPassword1" value={newPassword1} onChange={(e)=>{setNewPassword1(e.target.value)}} />
        </div>
        <div className="line">
          <label htmlFor="newPassword2">Confirmar Contraseña</label>
          <input type="password" name="newPassword2" id="newPassword2" value={newPassword2} onChange={(e)=>{setNewPassword2(e.target.value)}}/>
        </div>
        <div className="line">
          <button id='btn-modificar' className='btnMostrar' onClick={()=>{updatePassword()}} >Modificar Contraseña</button>
          <button onClick={()=>{
            showModal("modal-password","mostrar","noMostrar");
            setOldPassword("");
            setNewPassword1("");
            setNewPassword2("");
          }}>Cancelar</button>
        </div>
        </div>
      </div>
    </div>
  )
}
