import React,{useState,useEffect} from 'react';
import "../css/general.css";
import "../css/Productos.css";
import Axios from "axios";
function showModal(id,class1,class2) {
  const classList = document.getElementById(id).classList;
    
  if(classList.contains(class1)){
    document.getElementById(id).classList.replace(class1,class2);
  } else{
    document.getElementById(id).classList.replace(class2,class1);
  }
}

export default function Productos() {
  const [codigo, setCodigo] = useState("");
  const [identificador, setIdentificador] = useState("");
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [presentacion, setPresentacion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [productos,setProductos] = useState(undefined);
  const [refresh,setRefresh] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(undefined);


  const limpiarCampos=()=>{
    setCodigo("");
    setIdentificador("");
    setNombre("");
    setMarca("");
    setPresentacion("");
    setPrecio("");
    const radio =document.getElementById("p"+currentSelection);
    if(radio!==null){
      document.getElementById("p"+currentSelection).checked=false;
    }
    setCurrentSelection(undefined);
  };

  const displayTable = (data)=>{
    return (
      <div className="div-tabla">
        <table className='tabla'>
          <caption><span id='caption'>Productos</span></caption>
          <thead>
            <tr>
              <th>Código</th>
              <th>Identificador</th>
              <th>Nombre</th>
              <th>Marca/Proveedor</th>
              <th>Presentación</th>
              <th>Precio Unitario</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((element,index)=>{
                return(
                  <tr key={"p"+index}>
                    <td>{element.codProducto}</td>
                    <td>{element.identificador}</td>
                    <td>{element.nombre}</td>
                    <td>{element.marca}</td>
                    <td>{element.presentacion}</td>
                    <td>{element.precio}</td>
                    <td>{element.update? <input type="radio" name="producto" id={"p"+index} onChange={()=>{selectProducto(index)}}/> : <></>}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      
    );
  }
  
  const selectProducto = (id)=>{
    setCurrentSelection(id);
    setCodigo(productos[id].codProducto);
    setIdentificador(productos[id].identificador);
    setNombre(productos[id].nombre);
    setMarca(productos[id].marca);
    setPresentacion(productos[id].presentacion);
    setPrecio(productos[id].precio);
  }

  const postInfo=(info)=>{    
    let enviarDatos=true;
    
    if(info.includes("")){
      alert("Todos los campos son requeridos");
      enviarDatos=false;
    } else{     
      for (let index = 0; index < productos.length; index++) {
        const e = productos[index];
        if (info[0]===e.codProducto) {
          alert("No pueden existir productos con Códigos iguales");
          enviarDatos=false;
          break;
        }        
      }
      if (enviarDatos===true) {
        Axios.post("https://salescontrolserver.onrender.com/insertProducto",{
          codProducto: info[0],
          identificador: info[1],
          nombre: info[2],
          marca: info[3],
          presentacion: info[4],
          precio: info[5]
        })
        .then((response)=>{
          if (response.status===200) {
          alert("Datos ingresados correctamente");
          limpiarCampos();
          showModal("modal","mostrar","noMostrar");
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
      Axios.put("https://salescontrolserver.onrender.com/updateProducto",{
        _id:id,
        codProducto: info[0],
        identificador: info[1],
        nombre: info[2],
        marca: info[3],
        presentacion: info[4],
        precio: info[5]
      })
      .then((response)=>{
        if (response.status===200) {
        alert("Datos modificados correctamente");
        limpiarCampos();
        showModal("modal","mostrar","noMostrar");
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
      let confirm = window.confirm("¿Está seguro de eliminar el producto "+ productos[currentSelection].identificador+"?");
      if(confirm===true){
        Axios.delete("https://salescontrolserver.onrender.com/deleteProducto",{data:{_id:productos[currentSelection]._id}})
      .then((response)=>{
        if (response.status===200) {
        alert("Producto eliminado");
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
      alert("Debe seleccionar un producto");
    } else{
      document.getElementById("btn-modificar").classList.replace("btnNoMostrar","btnMostrar");
      showModal("modal","mostrar","noMostrar");
    }
  }
  useEffect(() => {
    Axios.get("https://salescontrolserver.onrender.com/readProductos")
    .then((response)=>{setProductos(response.data)})
    .catch((error)=>{console.log(error)})
  }, [refresh]);
  

  return(
    <div className='productos-window' >
      <div className="comandos">
        <button onClick={()=>{setRefresh(!refresh)}}>Actualizar Tabla</button>
        <button onClick={()=>{
          limpiarCampos();
          document.getElementById("btn-agregar").classList.replace("btnNoMostrar","btnMostrar");
          showModal("modal","mostrar","noMostrar");
          document.getElementById("codProducto").focus()}}>Agregar Producto</button>
        <button onClick={()=>{showModificar();
        document.getElementById("codProducto").focus()}}>Modificar Producto</button>
        <button onClick={()=>{deleteInfo()}}>Eliminar Producto</button>
      </div>
      <div className="modal noMostrar" id='modal' onKeyDown={(e)=>{
      if(e.key==="Escape"){
        limpiarCampos();
        showModal("modal","mostrar","noMostrar");
        document.getElementById("btn-agregar").classList.replace("btnMostrar","btnNoMostrar");
        document.getElementById("btn-modificar").classList.replace("btnMostrar","btnNoMostrar");
      };
      if(e.key==="Enter"){
        if(document.getElementById("btn-agregar").classList.contains("btnMostrar")){
          postInfo([codigo,identificador,nombre,marca,presentacion,precio]);
        };
        if(document.getElementById("btn-modificar").classList.contains("btnMostrar")){
          updateInfo(productos[currentSelection]._id,[codigo,identificador,nombre,marca,presentacion,precio])
        };
      }
    }} >
        <div className='form'>
        <div className="line">
          <label htmlFor="codProducto">Código</label>
          <input type="text" name="codProducto" id="codProducto" value={codigo} onChange={(e)=>{setCodigo(e.target.value)}} />
        </div>
        <div className="line">
          <label htmlFor="identificador">Identificador</label>
          <input type="text" name="identificador" id="identificador" value={identificador} readOnly />
        </div>
        <div className="line">
          <label htmlFor="nombre">Nombre</label>
          <input type="text" name="nombre" id="nombre" value={nombre} onChange={(e)=>{
            setNombre(e.target.value);
            setIdentificador(e.target.value+"-"+marca+"-"+presentacion)}} />
        </div>
        <div className="line">
          <label htmlFor="marca">Marca/Proveedor</label>
          <input type="text" name="marca" id="marca" value={marca} onChange={(e)=>{
            setMarca(e.target.value);
            setIdentificador(nombre+"-"+e.target.value+"-"+presentacion)}}/>
        </div>
        <div className="line">
          <label htmlFor="presentacion">Presentación</label>
          <input type="text" name="presentacion" id="presentacion" value={presentacion} onChange={(e)=>{
            setPresentacion(e.target.value);
            setIdentificador(nombre+"-"+marca+"-"+e.target.value)}}/>
        </div>
        <div className="line">
          <label htmlFor="precio">Precio</label>
          <input type="text" name="precio" id="precio" value={precio} onChange={(e)=>{setPrecio(e.target.value)}} />
        </div>
        <div className="line">
          <button id='btn-agregar' className='btnNoMostrar' onClick={()=>{postInfo([codigo,identificador,nombre,marca,presentacion,precio])}}>Agregar</button>
          <button id='btn-modificar' className='btnNoMostrar' onClick={()=>{updateInfo(productos[currentSelection]._id,[codigo,identificador,nombre,marca,presentacion,precio])}} >Modificar</button>
          <button onClick={()=>{
            limpiarCampos();
            showModal("modal","mostrar","noMostrar");
          }}>Cancelar</button>
        </div>
        </div>
      </div>
      <div className="contenedorTabla">
          {productos===undefined? <p>No Data</p>:displayTable(productos)}
      </div>
    </div>
  )
}
