import "./css/App.css"
import { useState } from "react";
import LogIn from "./pages/LogIn";
import Main from "./pages/Main";
import { ProfileContext } from "./contexts/ProfileContext";

function App() {
  const [perfil, setPerfil] = useState(undefined);
  
  return (
    <div className="App">
      <ProfileContext.Provider value={{perfil,setPerfil}}>
        
        {perfil===undefined? <LogIn/>:<Main/>}
        
      </ProfileContext.Provider>
          </div>
  );
}

export default App;
