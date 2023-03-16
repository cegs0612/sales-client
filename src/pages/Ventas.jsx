import React , {useState,useEffect,useContext} from 'react'
import Axios from "axios";
import "../css/general.css";
import "../css/ventas.css";
import { ProfileContext } from "../contexts/ProfileContext";


export default function Ventas() {
  const [sucursales, setSucursales] = useState(undefined);
  const [currentSucursal, setCurrentSucursal] = useState(undefined);
  const [numFactura, setNumFactura] = useState(0);
  const [nombre, setNombre] = useState("");
  const [nit, setNit] = useState(0);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [cantidad, setCantidad] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [subTotal, setsubTotal] = useState(0);
  const [totalVenta, setTotalVenta] = useState(0);
  const [listaItems, setListaItems] = useState(undefined);
  const [listaVentas, setListaVentas] = useState(undefined);
  const {perfil} = useContext(ProfileContext);
  const [refreshItemsTable, setRefreshItemsTable] = useState(true);
  const [currentSelection, setCurrentSelection] = useState(undefined);
  const [refresh, setRefresh] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAgregar, setShowAgregar] = useState(false);
  const [showModificar, setShowModificar] = useState(false);
  const [today, setToday] = useState(undefined);
  const [fecha, setFecha] = useState(undefined);
  
  
  const limpiarCampos=()=>{
    setNumFactura(0);
    setNombre("");
    setNit(0);
    setItems([]);
    setSelectedItem(undefined);
    setCantidad(0);
    setPrecio(0);
    setsubTotal(0);
    setTotalVenta(0);
    const radio =document.getElementById("v"+currentSelection);
    if(radio!==null){
      document.getElementById("v"+currentSelection).checked=false;
    }
    setCurrentSelection(undefined);
  };

  const selectVenta = (index)=>{
    setNumFactura(listaVentas[index].factura);
    setNombre(listaVentas[index].nombre);
    setNit(listaVentas[index].nit);
    setItems(listaVentas[index].productos);
    setTotalVenta(listaVentas[index].total);
  }

  const displayTable = (data)=>{
    return (
      <div className="div-tabla">
        <table className='tabla productos'>
            <caption><span id='caption'>Ventas del día</span></caption>
            <thead>
              <tr>
                <th>#</th>
                <th>Factura</th>
                <th>Nombre</th>
                <th>NIT</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map((element,index)=>{
                  return(
                    <tr key={"v"+index}>
                      <td>{index+1}</td>
                      <td>{element.factura}</td>
                      <td>{element.nombre}</td>
                      <td>{element.nit}</td>
                      <td>
                        <table className='tablaItems'>
                          <thead>
                            <th>Item</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                          </thead>
                          <tbody>
                            {element.productos.map((element,index)=>{
                              return(
                                <tr key={"vi"+index}>
                                  <td className="tdi">{element.item}</td>
                                  <td className="tdi">{element.cantidad}</td>
                                  <td className="tdi">{element.precio}</td>
                                  <td className="tdi">{element.subTotal}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </td>
                      <td>{element.total}</td>
                      <td>{element.update? <input type="radio" name="producto" id={"v"+index} onChange={()=>{setCurrentSelection(index);selectVenta(index)}}/> : <></>}</td>
                    </tr>
                  )
                })
              }
            </tbody>
        </table> 
      </div>
      
    );
  }

  const postInfo = ()=>{
    if (numFactura===0||nombre===""||nit===0||items===[]||totalVenta===0) {
      alert("Llene todos los datos");
    } else{
      const date = new Date();
      const addVenta = {
        usuario: perfil.codigo,
        sucursal: currentSucursal,
        fecha: date,
        factura: numFactura,
        nombre: nombre,
        nit: nit,
        productos: items,
        total: totalVenta, 
      }   
      Axios.post("https://salescontrolserver.onrender.com/insertVenta",addVenta)
      .then((response)=>{
        if (response.status===200) {
          alert("Datos ingresados correctamente")
          limpiarCampos();
          setShowModal(false);
          setShowAgregar(false);
          setShowModificar(false);
        }
      })
      .catch((error)=>{console.log(error)});    
    }
  };

  const updateInfo = () =>{
    if (numFactura===0||nombre===""||nit===0||items===[]||totalVenta===0) {
      alert("Llene todos los datos");
    } else{
      const updateVenta = {
        usuario: perfil.codigo,
        sucursal: currentSucursal,
        factura: numFactura,
        nombre: nombre,
        nit: nit,
        productos: items,
        total: totalVenta, 
      }   
      Axios.put("https://salescontrolserver.onrender.com/updateVenta",{_id: listaVentas[currentSelection]._id ,updateVenta})
      .then((response)=>{
        if (response.status===200) {
          alert("Datos ingresados correctamente")
          limpiarCampos();
          setShowModal(false);
          setShowAgregar(false);
          setShowModificar(false);
        }
      })
      .catch((error)=>{console.log(error)});
    }
  };

  const deleteInfo = ()=>{
    let confirm = window.confirm(`¿Está seguro de eliminar la venta con factura n° ${listaVentas[currentSelection].factura}?`);
    if(confirm){
      Axios.delete("https://salescontrolserver.onrender.com/deleteVenta",{data:{_id:listaVentas[currentSelection]._id}})
      .then((response)=>{
        if(response.status===200){
          alert("Venta eliminada");
          setRefresh(!refresh);
        }
      }).catch((error)=>{console.log(error)})
    } else {
      limpiarCampos();
    }
  }

  useEffect(()=>{
    Axios.get("https://salescontrolserver.onrender.com/readSucursales")
    .then((response)=>{setSucursales(response.data)})
    .catch((error)=>{console.log(error)});
    
    Axios.get("https://salescontrolserver.onrender.com/readProductos")
    .then((response)=>{setListaItems(response.data)})
    .catch((error)=>{console.log(error)});

    const today = new Date();
    setToday(today);
    const fecha = today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear();
    setFecha(fecha);
  },[]);

  useEffect(()=>{
    const array = items;
    setItems(array);
  },[refreshItemsTable,items])

  useEffect(()=>{
    if(currentSucursal!==undefined){
      const date = new Date(today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+" 00:00");
      Axios.get("https://salescontrolserver.onrender.com/readVentas",{params:{"fecha":{$gt:date},sucursal:currentSucursal}})
      .then((response)=>{setListaVentas(response.data)})
      .catch((error)=>{console.log(error)})
    };
  },[refresh,currentSucursal,today])

  return (
    <div className='ventas'>
      <div className="cabecera">
        <div className="line">
          <div className="divSucursal">
            <label htmlFor="sucursal">Sucursal: </label>
            {sucursales===undefined? <p> </p> : <select name="sucursales" placeholder='sucursal' id="sucursales" onChange={(e)=>{setCurrentSucursal(e.target.value);setRefresh(!refresh)}}>
                <option value={undefined}> </option>
                {
                  sucursales.map((element,index)=>{
                    return(
                      <option key={"s"+index} value={element.codSucursal}>{element.denominacion}</option>
                    )
                  })
                }
            </select>}
          </div>
          <label htmlFor="fecha">Fecha: {fecha}</label> 
        </div>
        <div className="comandos">
          <button onClick={()=>{setRefresh(!refresh)}}>Actualizar Tabla</button>
          <button onClick={()=>{
            if(currentSucursal===undefined||currentSucursal==="") {
              alert("Escoja sucursal")
            } else {
              limpiarCampos();
              setShowAgregar(true);
              setShowModificar(false);
              setShowModal(true);
            }}}>Nuevo Registro</button>
          <button onClick={()=>{
            if(currentSucursal===undefined||currentSucursal==="") {
              alert("Escoja sucursal")
            } else { 
              if (currentSelection===undefined){
                alert("Seleccione una venta para modificar");
              } else {
                setShowModal(true);
                setShowAgregar(false);
                setShowModificar(true);
              }
            }}}>Modificar Registro</button>
          <button onClick={()=>{
            if(currentSucursal===undefined||currentSucursal==="") {
              alert("Escoja sucursal")
            } else { 
              if (currentSelection===undefined){
                alert("Seleccione una venta para eliminar");
              } else {
                deleteInfo();
              }
            }}}>Eliminar Registro</button>
        </div>
      </div>
      {showModal && <div className="modal Mostrar" id='modal-venta' onKeyDown={(e)=>{
        if(e.key==="Escape"){
          limpiarCampos();
          setShowModal(false);
        }
      }} >
        <div className="form">
          <div className="line">
            <label htmlFor="usuario">Usuario</label>
            <input type="text" name="usuario" id="usuario" value={perfil.codigo} readOnly/>
          </div>
          <div className="line">
            <label htmlFor="numFactura">N° Factura</label>
            <input type="number" name="numFactura" id="numFactura" autoFocus value={numFactura} onChange={(e)=>{setNumFactura(e.target.value)}} />
          </div>
          <div className="line">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" name="nombre" id="nombre"value={nombre} onChange={(e)=>{setNombre(e.target.value)}} />
          </div>
          <div className="line">
            <label htmlFor="nit">NIT</label>
            <input type="number" name="nit" id="nit" value={nit} onChange={(e)=>{setNit(e.target.value)}} />
          </div>
          <table className="tabla">
            <thead>
              <tr><th>#</th><th>Item</th><th>Cantidad</th><th>Precio</th><th>SubTotal</th><th> </th></tr>
              </thead>
            <tbody>
              { items===[]? <tr></tr>:items.map((element,index)=>{
                  return(
                    <tr key={"item"+index}>
                      <td>{index+1}</td>
                      <td className='tdItem'>{element.item}</td>
                      <td>{element.cantidad}</td>
                      <td>{element.precio}</td>
                      <td>{element.subTotal}</td>
                      <td><button onClick={()=>{
                        const array = items;
                        for (let i = index; i < array.length-1; i++) {
                          array[i]=array[i+1];
                        }
                        array.pop();
                        let suma = 0;
                        array.forEach(element => {
                          suma += element.subTotal;
                        });
                        setItems(array);
                        setRefreshItemsTable(!refreshItemsTable);
                        setTotalVenta(suma);
                      }}>-</button></td>
                    </tr>
                  )
                })
              }
              <tr>
                <td> </td>
                <td>
                  { 
                    listaItems===undefined? "": <><input type='text' id='select-item' list='lista-items'className='tdItem' onChange={(e)=>{
                    listaItems.forEach((element) => {
                      if (element.identificador===e.target.value) {
                        setPrecio(element.precio);
                        setSelectedItem(e.target.value);
                        setsubTotal(cantidad*element.precio);
                      }
                    })}}
                    />
                    <datalist id='lista-items'>
                      
                      {listaItems.map((element,index)=>{
                        return(
                          <option key={"li"+index} value={element.identificador} />
                        )
                      })}
                    </datalist></> 
                  }
                  </td>
                  <td>{<input type="number" name="cantidad" id="cantidad" onChange={(e)=>{setCantidad(e.target.value);
                  setsubTotal(e.target.value*precio)}}></input>}</td>
                  <td>{precio}</td>
                  <td>{subTotal}</td>
                  <td><button onClick={()=>{
                    if(selectedItem===undefined||cantidad<=0||precio===0||cantidad===0){
                      alert("Llene todos los campos para agregar un producto")
                    } else {
                      const add = {
                        item: selectedItem,
                        cantidad:cantidad,
                        precio:precio,
                        subTotal:subTotal,
                      };
                      const arrayItems = items;
                      arrayItems.push(add);
                      setItems(arrayItems);
                      setSelectedItem(undefined);
                      setCantidad(0);
                      setPrecio(0);
                      setsubTotal(0);
                      document.getElementById("select-item").value="";
                      document.getElementById("cantidad").value=0;
                      document.getElementById("select-item").focus();
                      let suma = 0;
                      const array = items;
                      array.forEach(element => {
                        suma += element.subTotal;
                      });
                      setTotalVenta(suma);
                    }
                  }}>+</button></td>
              </tr>
            </tbody>
            <tfoot>
              <tr><th colSpan='4'>Total</th><th>{totalVenta}</th></tr>
            </tfoot>
          </table>
          <div className="comandos">
            {showAgregar&&<button onClick={()=>{
              postInfo();
              setRefresh(!refresh)}}>Agregar</button>}
            {showModificar&&<button onClick={()=>{
              updateInfo();
              setRefresh(!refresh);
            }}>Modificar</button>}
            <button onClick={()=>{
              limpiarCampos();
              setShowModal(false);
            }}>Cancelar</button>
          </div>
        </div>
      </div>}
      <div className="contenedorTabla">
          {listaVentas===undefined||currentSucursal===undefined? <p>No Data</p>:displayTable(listaVentas)}
      </div>
    </div>
  )
}
