
import React, { useState,useEffect, useContext } from 'react';
import swal from "sweetalert";
import SearchBar from '../Component/SearchBar';
import Datos from '../Host/Datos';
import {Quetzal} from '../Funciones/Moneda';
import moment from 'moment';
import DropDown from '../Component/DropDown';
import ls from "local-storage";
import {ConvetirClAData,ConvetirPagoAData, Obtenercliente,ObtenerPlan, ObtenerTipoPago} from '../Funciones/Funciones';
import {ContextUser} from '../Context/Context';


function Abono(props)  {
    const [idabono, setIdAbono] = useState("");
    const [idcuenta, setIdCuenta] = useState("");
    const [idempleado, setIdEmpleado] = useState("");
    const [concepto, setConcepto] = useState("");
    const [monto, setMonto]=useState("");
    const [tipo_pago, setTipo_pago]=useState("");
    const [comprobante, setComprobante]=useState("");
    const [mora, setMora]=useState("");
    const [estado, setEstado] = useState("Cancelado");
    
    const [datos, setdatos] = useState([]);  
    const [encontrado, setencontrado] = useState([]);
    const [abono, setAbono] = useState([]);
    const [filterAbono, setFilterAbono] = useState([]);
    const [tipoPago, setTipoPago] = useState([]);
    const [filterTipoPago, setFilterPago] = useState([]);
    const [buscar, setbuscar] = useState("");
   
    const [buscarTipoPago, setBuscarTipoPago] =useState("");
    const [accion, setAccion] = useState("new");

  //use context
  //  const {currentUser,setCurrentUser} = useContext(ContextUser);
  

    useEffect(()=>{
        setIdEmpleado(ls.get("usuario").idempleado)
       ConsultaAbono(false);
      CunsultaTipoPago();
      ConsultarCuenta();
     
    },[])
    
    const ConsultarCuenta=async()=>{
      const datos=await Datos.Consulta("cuenta");
      if(datos!==null){
        console.log(datos.res);
        setdatos(datos.res);
        setencontrado(datos.res)
      }
    }
const ConsultaAbono = async (reverse) => {
  const datosAbono=await Datos.Consulta("abono");
  if(datosAbono!==null){
    console.log(datosAbono.res)
    let abonoAsc= reverse ? datosAbono.res.reverse() : datosAbono.res;
    setAbono(abonoAsc);
    setFilterAbono(abonoAsc);
  }
}
const CunsultaTipoPago = async() => {
  const datosPago=await Datos.Consulta("tipoPago");
  if(datosPago !==null){
setTipoPago(datosPago.res);
setFilterPago(datosPago.res)
  }
}
    const limpiar=()=>{
      setIdCuenta(0);
      setIdEmpleado("");
      setMonto("");
      setConcepto("");
    setTipo_pago("")
    setComprobante("")
      setBuscarTipoPago("")
      setEstado("Cancelado");
      setAccion("new")
    }
    const Ingresar=async()=>{
      let datos={
        idabono:0,
        idcuenta:idcuenta,
        idempleado:idempleado,
        concepto:concepto,
        monto:monto,
        tipo_ago:tipo_pago,
        comprobante:comprobante,
        //fecha:moment(fecha).format("YYYY-MM-DD"),
        mora:mora,
        estado:estado
      }
   
      let Abono=await Datos.NuevoReg("abono",datos);
      if(Abono !== null){
        if(Abono.message==="Success"){
          swal("Abono","Ingresdo exitosamente","success");
          limpiar();
          ConsultaAbono()
          ConsultarCuenta();
        }else{
          swal("Abono","No se pudo Ingresar, verifique los datos","warning");
        }
      }
    }
    const Actualizar=async()=>{
      let datos={
        idabono:idabono,
        idcuenta:idcuenta,
        idempleado:idempleado,
        concepto:concepto,
        monto:monto,
        tipo_ago:tipo_pago,
        comprobante:comprobante,
        //fecha:moment(fecha).format("YYYY-MM-DD"),
        mora:mora,
        estado:estado
      }
      console.log(datos);
      let Abono=await Datos.ActualizarReg("abono",datos);
      if(Abono !== null){
        if(Abono.message==="Success"){
          swal("Abono","Ingresdo exitosamente","success");
          limpiar();
          ConsultarCuenta();
          ConsultaAbono();
        }else{
          swal("Abono","No se pudo Ingresar, verifique los datos","warning");
        }
      }
    }
    const Eliminar=async(id)=>{
      let Abono=await Datos.BorrarReg("abono",id);
      if(Abono!==null){
        if(Abono.message === "Success"){
          swal("Abono", "Eliminado con exíto","success")
          ConsultarCuenta();
          ConsultaAbono()
        }else{
          swal("Abono","No se pudo eliminar","warning");
        }
      }
    }
    const GuardarCambios=()=>{
      if(accion==="new"){
        Ingresar();
      }else{
        Actualizar();
      }
    }
    const AbrirActualizar=(datos,e)=>{
     let TipoActual=ObtenerTipoPago(tipoPago,datos.tipo_pago)
     setBuscarTipoPago(TipoActual.nombre);

setAbono(datos.idabono)
setIdCuenta(datos.idcuenta);
setIdEmpleado(datos.idempleado);
setConcepto(datos.concepto);
setMonto(datos.monto);
setTipo_pago(datos.tipo_pago);
setComprobante(datos.comprobante);
setMora(datos.mora)
setEstado(datos.estado)
setAccion("update");

var myInput = document.getElementById("exampleModal");
    e.addEventListener("shown.bs.modal", function () {
      myInput.focus();
    });
    }
    const Busqueda =(e)=>{
      let buscarTexto=e.target.value;
      setbuscar(buscarTexto);
      let text=buscarTexto.replace(/^\w/,(c) =>c.toLowerCase());
      setbuscar(buscarTexto);
      
      setdatos(encontrado.filter(function(item){
          return   item.concepto.toLowerCase().includes(text)|| item.comprobante.toLowerCase().includes(text) ;   
        }).map(function({idcuenta, idempleado, concepto, monto,tipo_pago,comprobante,mora, estado}){
          return{idcuenta, idempleado, concepto, monto,tipo_pago,comprobante,mora, estado}
        })
       );
      
        }
    
  const AbrirIngreso=(e)=>{
    limpiar();
    let myInput = document.getElementById("exampleModal");
    e.target.addEventListener("shown.bs.modal", function () {
      myInput.focus();
    });
  }

  const BusquedaPago=(e)=>{
    let buscarTexto=e.target.value;
    setBuscarTipoPago(buscarTexto);
    let text=buscarTexto.replace(/^\w/,(c) =>c.toLowerCase());
    setBuscarTipoPago(buscarTexto);
    
    setTipoPago(filterTipoPago.filter((item)=>{
        return   item.nombre.toLowerCase().includes(text) || item.apellido.toLowerCase().includes(text) ;   
      }).map(({idempleado, nombre, apellido, telefono, estado})=>{
        return{idempleado, nombre, apellido, telefono, estado}
      })
     );
    
      }

     
    return(
        <div>
            <div className="mb-2">   
            <h5 className="modal-title">Cuenta</h5></div>
            <SearchBar
            onChange={Busqueda} 
            value={buscar} 
            placeholder="Buscar Cuenta..."  
            data_bs_toggle="modal"
            data_bs_target="#exampleModal"
            onClick={AbrirIngreso}
            />
         
{/**modal para ingreso de empleado */}

  <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden={true}
        >
  <div className="modal-dialog modal-dialog-scrollable">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Ingreso de Abono</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <div className="form-outline mb-4">
         <label className="form-label" htmlFor="form1Example1" hidden= {true} >Codigo de abono</label>   
    <input type="text" id="form1Example1" className="form-control" hidden= {true} value={idabono} onChange={(e) => setIdAbono(e.target.value)} />

  </div>
 
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Concepto</label>
        <input type="text" id="form1Example1" className="form-control" value={concepto}  onChange={(e) => setConcepto(e.target.value)} />

  </div>
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Monto</label>
        <input type="text" id="form1Example1" className="form-control" value={monto}  onChange={(e) => setMonto(e.target.value)} />

  </div>

  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Tipo de Pago</label>
      <DropDown 
        dato = {ConvetirPagoAData(tipoPago)} 
        selected={tipo_pago} 
        setSelected={setTipo_pago}  
        value={buscarTipoPago}  
        setValue={setBuscarTipoPago} 
        onChange={BusquedaPago}
      />
  
   
      

  </div>
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Comprobante</label>
        <input type="text" id="form1Example1" className="form-control" value={comprobante}  onChange={(e) => setComprobante(e.target.value)} />

  </div>
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Mora</label>
        <input type="text" id="form1Example1" className="form-control" value={mora}  onChange={(e) => setMora(e.target.value)} />

  </div>

  
  <div className="form-outline mb-4 center">
       <label className="form-label" htmlFor="form1Example1">Estado</label>
       <div className="form-outline mb-4">
        <div className="form-check form-check-inline">
  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value={estado} checked={estado === "Cancelado" ? true : false} onChange={() => setEstado("Cancelado")} selected/>
  <label className="form-check-label" htmlFor="inlineRadio1">Cancelar</label>
</div>
<div className="form-check form-check-inline">
  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value={estado} checked={estado === "Atrasado" ? true : false} onChange={() => setEstado("Atrasado")}/>
  <label className="form-check-label" htmlFor="inlineRadio2">Atrasado</label>
  </div>
</div>

  </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" className="btn btn-primary" onClick={()=>GuardarCambios()} >Guardar</button>
      </div>
    </div>
  </div>
</div>

<div className="div-table">
<div className="table-wrap">
  
<table className="table-item ">
  <thead >
          <tr>
            <th>#</th>
            <th>Empleado</th>
            <th>Concepto</th>
            <th>Monto</th> 
            <th>Tipo de  Pago</th>
            <th>comprobante</th>
            <th>Fecha</th>  
            <th>Mora</th>
            <th>Estado</th>
            
            <th>Opciones</th>
          </tr>
        </thead>
       <tbody>
      { abono ?
           abono.map((item,index) =>(
            <tr key={index} >
               
               <td>{item.idabono}</td>
               <td>{item.idempleado}</td>
               <td>{item.concepto}</td>  
               <td>{Quetzal(item.monto)}</td>  
               <td>{item.tipo_pago}</td>  
               <td>{item.comprobante}</td>  
               <td>{moment(item.fecha).format("DD/MM/YYYY")}</td>
               <td>{Quetzal(item.mora)}</td>  
             
               {item.estado === "Activo" ? <td ><p className="activo">{item.estado}</p></td>:
               <td ><p className="noactivo">{item.estado}</p></td>
                }
               
               <td>
               <div className="d-flex dropdown justify-content-center alig-items-center">
  <i className="bi bi-three-dots " type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
   
  </i>
  <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton2">
  <li className=" dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e)=>AbrirActualizar(item,e.target)} >Editar</li>
    <li  className="dropdown-item" onClick={()=>Eliminar(item.idabono)}>Eliminar</li>
      
   
  </ul>
</div>


                 </td>

             </tr>
           )) 
           : null
           
      
           }
      
       </tbody>
      </table>
      </div>

  
        </div>
     </div>   

    );
        }
    export default Abono;
    