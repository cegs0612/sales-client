import React, {useState, useContext, useEffect} from 'react'
import Axios from "axios";
import "../css/LogIn.css";
import { ProfileContext } from "../contexts/ProfileContext";


export default function LogIn() {
  const [user, setUser] = useState("");
  const [password,setPassword]=useState("");
  const {setPerfil} = useContext(ProfileContext);

  const login = async(user,password) =>{
    if (user===""||password==="") {
      alert("Introduzca datos");
    } else{
      Axios.get("http://localhost:3001/login",{params:{usuario:user}})
      .then((response)=>{
        const datosUsuario = response.data[0];
        
        if (response.data.length===0) {
          alert("Usuario no encontrado");
        } else { 
          if (datosUsuario.clave===password) {
            setPerfil(datosUsuario);
          } else {
            alert("Contraseña incorrecta");            
          }
        }
      })
      .catch((error)=>{
        console.log(error);
      })
    }
  }
  useEffect(()=>{
    document.getElementById("user").focus();
  },[])
    
  return (
    <div className="login" onKeyDown={(e)=>{if(e.key==="Enter")login(user,password)}}>
      <div className='line'>
        <label htmlFor="user">Usuario</label>
        <input type="text" name="user" id="user" onChange={(event)=>{setUser(event.target.value);
        }} />
      </div>
      <div className='line'>
        <label htmlFor="password">Contraseña</label>
        <input type="password" name="password" id="password" onChange={(event)=>{setPassword(event.target.value)}}/>   
      </div>
      <button className="submit" onClick={()=>login(user,password)}>Ingresar</button>
    </div>
  )
}
