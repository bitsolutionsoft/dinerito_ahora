
import React, { useState,useEffect, useContext } from 'react';
import swal from "sweetalert";
import SearchBar from '../Component/SearchBar';
import Datos from '../Host/Datos';
import {Quetzal} from '../Funciones/Moneda';

import moment from 'moment';

import DropDown from '../Component/DropDown';
import ls, { set }  from "local-storage";
import {AplicarMora, ConvetirClAData,ConvetirPagoAData, Obtenercliente,ObtenerPlan, ObtenerTipoPago} from '../Funciones/Funciones';
import { DataContext } from '../Context/Context';
import { DiasPasado, Mora } from '../Host/Info';



function Abono(props)  {
    const [idabono, setIdAbono] = useState("");
    const [idcuenta, setIdCuenta] = useState("");
    const [idempleado, setIdEmpleado] = useState("");
    const [concepto, setConcepto] = useState("");
    const [monto, setMonto]=useState("");
    const [tipo_pago, setTipo_pago]=useState("");
    const [comprobante, setComprobante]=useState("");
    const [mora, setMora]=useState("");
    const [fechaPago, setFechaPago]= useState("");
    const [estado, setEstado] = useState("Cancelado");
    const [prox_pago, setProx_Pago] =useState("");
    const [prox_monto, setProx_monto] =useState("")
    const [datos, setdatos] = useState([]);  
    const [encontrado, setencontrado] = useState([]);
    const [datosAbono, setDatosAbono] = useState([]);
    const [filterAbono, setFilterAbono] = useState([]);
    const [tipoPago, setTipoPago] = useState([]);
    const [filterTipoPago, setFilterPago] = useState([]);
    const [buscar, setbuscar] = useState("");
    const [abonSeleccionado, setAbonoSeleccionado]=useState([]);
    const [buscarTipoPago, setBuscarTipoPago] =useState("");
    const [accion, setAccion] = useState("new");
    const [isDisabled, setIsDisabled]=useState(false);
//datos de para la desplegar la table
const [open, setOpen]=useState(false)
const [buscarCuenta,setBuscarCuenta]=useState("");
const [CuentaSeleccionada,setCuentaSeleccionada] =useState([]);


  

    useEffect(()=>{
      
        setIdEmpleado(ls.get("usuario").idempleado)
       ConsultaAbono(false,0);
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
const ConsultaAbono = async (reverse, id) => {
  const datos_Abono= id <= 0 ? await Datos.Consulta("abono") : await Datos.ConsultaAbonoXP(id);
  if(datos_Abono!==null){
    if(datos_Abono.message==="Success"){
    console.log(datos_Abono.res)
    let abonoAsc= reverse ? datos_Abono.res.reverse() : datos_Abono.res;
    setDatosAbono(abonoAsc);
    setFilterAbono(abonoAsc);
    }else{
      setDatosAbono([])
      setFilterAbono([])
      swal("Aviso","Esta cuenta no tiene pagos efectuados, seleccione otra!","warning");
    }
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
     
      setIdAbono(0) ;
      setIdCuenta(0);
    //  setIdEmpleado("");
      setMonto("");
      setConcepto("");
    setTipo_pago("")
    setComprobante("")
      setBuscarTipoPago("")
      setMora("")
      setEstado("Cancelado");
      setAccion("new")
    }
    const Ingresar=async()=>{
      let datos={
        idabono:0,
        idcuenta: CuentaSeleccionada.idcuenta,
        idempleado:idempleado,
        concepto:concepto,
        monto:monto,
        tipo_pago:tipo_pago,
        comprobante:comprobante,
        //fecha:moment(fecha).format("YYYY-MM-DD"),
        mora:mora,
        prox_pago:prox_pago !=="" ? moment(prox_pago).format("YYYY-MM-DD h:mm:ss") : moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
        estado:estado
      }
   
      let Abono=await Datos.NuevoReg("abono",datos);
      if(Abono !== null){
        if(Abono.message==="Success"){
          swal("Abono","Ingresdo exitosamente","success");
            siguientePago(datos)
          limpiar();
          ConsultaAbono(true,CuentaSeleccionada.idcuenta)
          ConsultarCuenta();
        
        }else{
          swal("Abono","No se pudo Ingresar, verifique los datos","warning");
        }
      }
    }


    const siguientePago = async(datos) => {
    if(isDisabled){
      let dats={
        idabono:0,
        idcuenta: CuentaSeleccionada.idcuenta,
        idempleado:idempleado,
        concepto:moment(datos.prox_pago).format("MMMM"),
        monto:prox_monto !=="" ? prox_monto : datos.monto,
        tipo_pago:1,
        comprobante:"-",
        //fecha:moment(fecha).format("YYYY-MM-DD"),
        mora:"0",
        prox_pago:datos.prox_pago,
        estado:datos.estado
      }
      let siguiente= await Datos.NuevoReg("abono/prox",dats);
      if(siguiente !== null){
        if(siguiente.message==="Success"){
          setIsDisabled(false)
          setProx_Pago("")
          ConsultaAbono(true,CuentaSeleccionada.idcuenta)
        }else{
                swal("Abono","No se pudo Ingresar fecha del siguiente pago, verifique los datos","warning");
        }
      }
    }
     }
    const Actualizar=async()=>{
      let datos={
        idabono:idabono,
        idcuenta: CuentaSeleccionada.idcuenta,
        idempleado:idempleado,
        concepto:concepto,
        monto:monto,
        tipo_pago:tipo_pago,
        comprobante:comprobante,
        mora:mora,
        prox_pago:prox_pago !=="" ? moment(prox_pago).format("YYYY-MM-DD h:mm:ss") : moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
        estado:estado
      }
      console.log(datos);
      let Abono=await Datos.ActualizarReg("abono",datos);
      if(Abono !== null){
        if(Abono.message==="Success"){
          swal("Abono","Ingresdo exitosamente","success");
          siguientePago(datos)
          limpiar();
          ConsultarCuenta();
          ConsultaAbono(true,CuentaSeleccionada.idcuenta);
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
          ConsultaAbono(false,CuentaSeleccionada.idcuenta)
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
setCuentaSeleccionada(datos)
setIdAbono(datos.idabono)
setIdCuenta(datos.idcuenta);
setIdEmpleado(datos.idempleado);
setConcepto(datos.concepto);
setMonto(datos.monto);
setFechaPago(datos.fecha)
setTipo_pago(datos.tipo_pago);
setComprobante(datos.comprobante);


if(AplicarMora(new Date(), datos.fecha)){
setMora(Mora)
}else{
setMora(datos.mora !==null ? datos.mora : 0 )
}

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
      
      setDatosAbono(filterAbono.filter(function(item){
          return   item.concepto.toLowerCase().includes(text)|| item.comprobante.toLowerCase().includes(text) ;   
        }).map(function({idcuenta, idempleado, concepto, monto,tipo_pago,comprobante,mora, estado}){
          return{idcuenta, idempleado, concepto, monto,tipo_pago,comprobante,mora, estado}
        })
       );
      
        }
    
  const AbrirIngreso=(e)=>{
    limpiar();
    if(CuentaSeleccionada.length <=0){
      swal("Aviso","Para poder agregar un abono, primero seleccione a la cuenta a la que desee abonar!","warning")
    
  }
    if(CuentaSeleccionada.length >= 1){
      let myInput = document.getElementById("exampleModal");
    e.target.addEventListener("shown.bs.modal", function () {
      myInput.focus();
    });
    }
   
  }


 const AbrirDetalle = (item,e) => { 
setAbonoSeleccionado(item);
let myInput = document.getElementById("exampleDetalle");
e.addEventListener("shown.bs.modal", function () {
  myInput.focus();
});
  } 

  const BusquedaPago=(e)=>{
    let buscarTexto=e.target.value;
    setBuscarTipoPago(buscarTexto);
    let text=buscarTexto.replace(/^\w/,(c) =>c.toLowerCase());
    setBuscarTipoPago(buscarTexto);
    
    setTipoPago(filterTipoPago.filter((item)=>{ 
        return   item.nombre.toLowerCase().includes(text) ;   
      }).map(({idtipopago, nombre})=>{
        return{idtipopago, nombre}
      })
     );
    
      }
      const BusquedaCuenta =(buscarTexto)=>{
        setBuscarCuenta(buscarTexto);
        let text=buscarTexto.replace(/^\w/,(c) =>c.toLowerCase());
        setBuscarCuenta(buscarTexto);
        
        setdatos(encontrado.filter(function(item){
            return   item.estado.toLowerCase().includes(text) ;   
          }).map(function({idcuenta, idcliente, idplan, prox_pago, estado}){
            return{idcuenta, idcliente, idplan, prox_pago, estado}
          })
         );
        
          }
     const ItemSeleccionado = (item) => {
    
      setIdCuenta(item.idcuenta)
      setCuentaSeleccionada(item)
     ConsultaAbono(true,item.idcuenta);
      console.log("numero de la cuenta "+ CuentaSeleccionada.idcuenta);
      }

    return(
        <div className='container-fluid m-0 p-0 vh-100'>
            <div className='mt-0'>   
            <h5 className="modal-title">Abono</h5>
            </div>
            <div className="form-outline mb-2 ">
            <h6>{CuentaSeleccionada.idcuenta !== undefined  ? "Pagos de la cuenta de: "+CuentaSeleccionada.cliente+ ",  Cantidad de: Q"+ CuentaSeleccionada.monto  : 'Seleccione una cuenta...' }</h6>
                <div className='dropdown_table' onClick={()=>setOpen(!open)}>
                <div className='input-group mb-2 '>
                <input type='text' 
                className='form-control'
                placeholder='Buscar Cuenta...' 
                value={buscarCuenta}
                onChange={(e)=>{BusquedaCuenta(e.target.value)}}
                />
                {
                open ? <i className="bi bi-caret-up-fill input-group-text"></i> : <i className="bi bi-caret-down-fill input-group-text"></i>
                }
                </div>
                <div className={open ? 'open_table' : 'options_table'}>
                  
<div className="div-table">
<div className="table-wrap">
  
<table className="table-item ">
  <thead >
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Plan</th>
            <th>Apertura</th> 
        
            <th>Abonado</th>
            <th>Mora</th>  
            <th>Estado</th>
          </tr>
        </thead>
       <tbody>
      { datos ?
           datos.map((item,index) =>(
            <tr key={index}  onClick={()=>{ItemSeleccionado(item)}}>
               
               <td>{item.idcuenta}</td>
               <td>{item.cliente}</td>
               <td>{Quetzal(item.monto)}</td>  
               <td>{moment(item.fecha).format("DD/MM/YYYY")}</td>
               <td>{Quetzal(item.totalabono)}</td>  
               <td>{Quetzal(item.totalmora)}</td>
             
               {item.estado === "Activo" ? <td ><p className="activo">{item.estado}</p></td>:
               <td ><p className="noactivo">{item.estado}</p></td>
                }


             </tr>
           )) 
           : null
           
      
           }
      
       </tbody>
      </table>
      </div>

  
        </div>
                
              </div>
    </div>
    
      </div>
            <SearchBar
            onChange={Busqueda} 
            value={buscar} 
            placeholder="Buscar Abono..."  
            data_bs_toggle="modal"
            data_bs_target="#exampleModal"
            onClick={AbrirIngreso}
            />
         
{/**modal para ingreso de abono */}

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
      <div className='input-group'>
          <span className="input-group-text">Q</span>
          <input type="number" id="form1Example1" className="form-control" value={monto}  onChange={(e) => setMonto(e.target.value)} />
          <span className="input-group-text">.00</span>
      </div>
       
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
  <label className="form-label" htmlFor="form1Example1" >Mora</label>
      <div className='input-group'>
          <span className="input-group-text">Q</span>
          <input type="number" id="form1Example1" className="form-control" value={mora}  onChange={(e) => setMora(e.target.value)} />
          <span className="input-group-text">.00</span>
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
  
<div className="form-check form-check-inline">
  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value={estado} checked={estado === "Pendiente" ? true : false} onChange={() => setEstado("Pendiente")}/>
  <label className="form-check-label" htmlFor="inlineRadio2">Pendiente</label>
  </div>
</div>

  </div>
  <div className="form-outline mb-4 center">
       <div className="form-check mb-3">
       <input className="form-check-input mt-0" type="checkbox" value={isDisabled} checked={isDisabled} onClick={()=>{setIsDisabled(!isDisabled)}}  data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"/>
       <label   className="form-check-label"  > Agregar siguiente pago </label>
       </div>
       <div className="collapse" id="collapseExample">
 <div className="form-outline mb-3">
<label className="form-label" htmlFor="form1Example1">Fecha del proximo pago</label>
  <input disabled={!isDisabled} type="date" aria-label="Text input with checkbox" className="form-control form-control-sm"  placeholder='01/02/2022' value={prox_pago} onChange={(e)=>setProx_Pago(moment(e.target.value).format("YYYY-MM-DD"))}/>
 
</div>
  
      
<div className='form-outline mb-3'>
<lable className="form-label" htmlFor="form1Examples1">Monto del proximo pago</lable>
 <input disabled={!isDisabled} type="number" className="form-control form-control-sm"  placeholder='ej.: 10.00' value={prox_monto} onChange={(e)=>setProx_monto(e.target.value)}/>
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


<div
         className="modal fade"
          id="exampleDetalle"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden={true}
        >
  <div className="modal-dialog modal-dialog-scrollable">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Detalle del  Pago</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      
  <div className="form-outline mb-4">
       <h6 className="form-label" htmlFor="form1Example1" >Cobrador:</h6>
  </div>
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >{abonSeleccionado.empleado}</label>
  </div>
  
 
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Salir</button>
       
      </div>
    </div>
  </div>
</div>

<div className='row vh-70  '>
<div className="div-table overflow-auto">
<div className="table-wrap">
  
<table className="table-item ">
  <thead >
          <tr>
            <th>#</th>
            <th>Concepto</th>
            <th>Monto</th> 
            <th>Tipo de  Pago</th>
            <th>Comprobante</th>
            <th>Fecha Pago</th>  
            <th>Dia cobrado</th>           
            <th>Mora</th>
            <th>Estado</th>
            
            <th>Opciones</th>
          </tr>
        </thead>
       <tbody>
      { datosAbono.length > 0 ?
           datosAbono.map((item,index) =>(
            <tr key={index} >
               
               <td>{item.idabono}</td>           
               <td>{item.concepto}</td>  
               <td>{Quetzal(item.monto)}</td>  
               <td>{item.nombre}</td>  
               <td>{item.comprobante}</td>  
               <td>{moment(item.fecha).format("DD/MM/YYYY")}</td>
               <td>{moment(item.diacobro).format("DD/MM/YYYY")}</td>
               <td>{Quetzal(item.mora)}</td>  
             
               {item.estado === "Cancelado" ? <td ><p className="activo">{item.estado}</p></td>:
               <td ><p className="noactivo">{item.estado}</p></td>
                }
               
               <td>
               <div className="d-flex dropdown justify-content-center alig-items-center">
  <i className="bi bi-three-dots " type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
   
  </i>
  <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton2">
  <li  className="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleDetalle" onClick={(e)=>AbrirDetalle(item,e.target)}>Ver detalle</li>
  <li className=" dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e)=>AbrirActualizar(item,e.target)} >Editar</li>
    <li  className="dropdown-item" onClick={()=>Eliminar(item.idabono)}>Eliminar</li>
      
   
  </ul>
</div>


                 </td>

             </tr>
           )) 
           : 
 null
           }
      
       </tbody>
      </table>
      </div>

  
        </div>
</div>
     </div>   

    );
        }
    export default Abono;
    