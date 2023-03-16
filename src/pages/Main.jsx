import React, {useContext,useState} from 'react'
import {ProfileContext} from "../contexts/ProfileContext";
import { ControllerContext } from "../contexts/ControllerContext";
import Admin from "./Admin";
import AtCliente from "./AtCliente";
import "../css/Main.css"

export default function Main() {
  const {perfil} = useContext(ProfileContext);
  
  const [current,setCurrent]=useState(undefined);

  const render = (perfil)=>{
    if(perfil.acceso===1)return <Admin/>
    if(perfil.acceso===2)return <AtCliente/>
  }


  return (    
    <div className='Main'>
      <ControllerContext.Provider value={{current,setCurrent}}>

        {render(perfil)} 

      </ControllerContext.Provider>
    </div>
  )
}
