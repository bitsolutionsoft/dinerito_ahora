import React, { useState,useEffect, useContext } from 'react';
import swal from "sweetalert";
import SearchBar from '../Component/SearchBar';
import Datos from '../Host/Datos';
import {Quetzal,MonedaSS, Decimal} from '../Funciones/Moneda';
import moment from 'moment';
import DropDown from '../Component/DropDown';
import {ConvetirClAData,ConvetirPlanAData, Obtenercliente,ObtenerPlan} from '../Funciones/Funciones';
import {ContextUser} from '../Context/Context';
import ls from 'local-storage';

function Cuenta(props)  {
    const [idcuenta, setIdCuenta] = useState("");
    const [idcliente, setIdCliente] = useState("");
    const [idplan, setIdPlan] = useState("");
    const [estado, setEstado] = useState("Activo");  

    //siguiente pago
    const [prox_pago, setProx_Pago]=useState("");
    const [prox_monto, setProx_monto] =useState("");
    
//calcular pago
    const[modalidadpago,setModalidadPago]=useState("Mes");
    const[inicio_pago,setInicio_pago]=useState("");
    const[cant_pago,setCant_pago]=useState("");
    const [monto_pago,setMonto_pago]=useState("");

    //datos de cliente y de plan
    const [datos, setdatos] = useState([]);  
    const [encontrado, setencontrado] = useState([]);
    const [cliente, setCliente] = useState([]);
    const [filterCliente, setfilterCliente] = useState([]);
    const [plan, setPlan] = useState([]);
    const [filterPlan, setFilterPlan] = useState([]);
    const [buscar, setbuscar] = useState("");
    const [buscarCl,setBuscarCl] = useState("");
    const [buscarPlan, setBuscarPlan] =useState("");
    const [accion, setAccion] = useState("new");
    const [idempleado, setIdEmpleado] =useState();
    const [cuentaSelecciondo, setCuentaSeleccionado]=useState([]);
    const [cantInteres, setCantInteres]=useState("");

  
  

    useEffect(()=>{
      setIdEmpleado(ls.get("usuario").idempleado)
       ConsultaCliente(false);
      ConsultaPlan();
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
const ConsultaCliente = async (reverse) => {
  const datosCliente=await Datos.Consulta("cliente");
  if(datosCliente!==null){
    let clienteAsc= reverse ? datosCliente.res.reverse() : datosCliente.res;
    setCliente(clienteAsc);
    setfilterCliente(clienteAsc);
  }
}
const ConsultaPlan = async() => {
  const datosPlan=await Datos.Consulta("plan");
  if(datosPlan !==null){
setPlan(datosPlan.res);
setFilterPlan(datosPlan.res)
  }
}
    const limpiar=()=>{
      setIdCuenta(0);
      setIdCliente("");
      setProx_Pago("");
      setIdPlan("");
      setBuscarCl("")
      setBuscarPlan("")
      setEstado("Activo");
      setAccion("new")
    }
    const Ingresar=async()=>{
      let datos={
        idcuenta:0,
        idcliente:idcliente,
        idplan:idplan,
       // prox_pago:moment(prox_pago).format("YYYY-MM-DD"),
        estado:estado
      }
   
      let Cuenta=await Datos.NuevoReg("cuenta",datos);
      if(Cuenta !== null){
        if(Cuenta.message==="Success"){
          swal("Cuenta","Ingresdo exitosamente","success");
          limpiar();
          ConsultarCuenta();
        }else{
          swal("Cuenta","No se pudo Ingresar, verifique los datos","warning");
        }
      }
    }
    const Actualizar=async()=>{
      let datos={
        idcuenta:idcuenta,
        idcliente:idcliente,
        idplan:idplan,
       // prox_pago:moment(prox_pago).format("YYYY-MM-DD"),
        estado:estado
      }
      console.log(datos);
      let Cuenta=await Datos.ActualizarReg("cuenta",datos);
      if(Cuenta !== null){
        if(Cuenta.message==="Success"){
          swal("Cuenta","Ingresdo exitosamente","success");
          limpiar();
          ConsultarCuenta();
        }else{
          swal("Cuenta","No se pudo Ingresar, verifique los datos","warning");
        }
      }
    }
    const Eliminar=async(id)=>{
      let Cuenta=await Datos.BorrarReg("cuenta",id);
      if(Cuenta!==null){
        if(Cuenta.message === "Success"){
          swal("Cuenta", "Eliminado con exíto","success")
          ConsultarCuenta();
        }else{
          swal("Cuenta","No se pudo eliminar","warning");
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
      let clienteActual=Obtenercliente(cliente,datos.idcliente);
      setBuscarCl(clienteActual.nombre+' '+clienteActual.apellido)
      let planActual=ObtenerPlan(plan,datos.idplan);
      setBuscarPlan('Cantidad: '+planActual.monto+'  Interes: '+planActual.interes+'%');

setIdCuenta(datos.idcuenta);
setIdCliente(datos.idcliente);
setIdPlan(datos.idplan);
setProx_Pago(datos.prox_pago);
setEstado(datos.estado)
setAccion("update");

var myInput = document.getElementById("exampleModal");
    e.addEventListener("shown.bs.modal", function () {
      myInput.focus();
    });
    }

    const AgregarSiguiente = (item, e) => { 
      setCuentaSeleccionado(item)
      let myInput=document.getElementById("exampleModalS");
      e.addEventListener("shown.bs.modal",()=>{
        myInput.focus();
      })
     }
    const CalcularPagos = (item,e) => { 
      setCuentaSeleccionado(item)
      let myInput=document.getElementById("exampleModalC");
      e.addEventListener("shown.bs.modal",()=>{
        myInput.focus();
      })
     }
    const Busqueda =(e)=>{
      let buscarTexto=e.target.value;
      setbuscar(buscarTexto);
      let text=buscarTexto.replace(/^\w/,(c) =>c.toLowerCase());
      setbuscar(buscarTexto);
      
      setdatos(encontrado.filter(function(item){
          return   item.estado.toLowerCase().includes(text) ;   
        }).map(function({idcuenta, idcliente, idplan, prox_pago, estado}){
          return{idcuenta, idcliente, idplan, prox_pago, estado}
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

  const BusquedaCliente =(e)=>{
    let buscarTexto=e.target.value;
    setBuscarCl(buscarTexto);
    let text=buscarTexto.replace(/^\w/,(c) =>c.toLowerCase());
    setBuscarCl(buscarTexto);
    
    setCliente(filterCliente.filter((item)=>{
        return   item.nombre.toLowerCase().includes(text) || item.apellido.toLowerCase().includes(text) ;   
      }).map(({idcliente, nombre, apellido, telefono, estado})=>{
        return{idcliente, nombre, apellido, telefono, estado}
      })
     );
    
      }

      const BusquedaPlan =(e)=>{
        let buscarTexto=e.target.value;
        setBuscarPlan(buscarTexto);
        let text=buscarTexto.replace(/^\w/,(c) =>c.toLowerCase());
        setBuscarPlan(buscarTexto);
        
        setPlan(filterPlan.filter(function(item){
            return   item.estado.toLowerCase().includes(text) ;   
          }).map(function({idplan, monto, interes, plan_dia, estado}){
            return{idplan, monto, interes, plan_dia, estado}
          })
         );
        
          }
const GuardarSiguiente = () => { 
  let dats={
    idabono:0,
    idcuenta: cuentaSelecciondo.idcuenta,
    idempleado:idempleado,
    concepto:moment(datos.prox_pago).format("MMMM"),
    monto:Decimal(prox_monto),
    tipo_pago:1,
    comprobante:"-",
    mora:"0",
    prox_pago:prox_pago,
    estado:"Pendiente"
   
  }
   siguientePago(dats)
 }
const GuardarPagos = (second) => { 
 
  for(let i =0; i<cant_pago;i++){
     let dats={
    idabono:0,
    idcuenta: cuentaSelecciondo.idcuenta,
    idempleado:idempleado,
    concepto:"-",
    monto:Decimal(monto_pago),
    tipo_pago:1,
    comprobante:"-",
    mora:"0",
    prox_pago:moment(inicio_pago).add(i,returnModalidad(modalidadpago)).format("YYYY-MM-DD h:mm:ss"),
    estado:"Pendiente"
  }

    siguientePago(dats)
  }
 }
      
const returnModalidad=(modalidad)=>{
  switch(modalidad){
    case "Dia":
      return "days";

    case "Semana":
      return "weeks";

    case "Mes":
      return "months";

      default:
      return "days"
  }

 }
    const siguientePago = async(dats) => {  
        let siguiente= await Datos.NuevoReg("abono/prox",dats);
        if(siguiente !== null){
          if(siguiente.message==="Success"){
            swal("Abono","Los pagos fueron establecidos de  forma correcta","success");
            ConsultarCuenta();

          }else{
                  swal("Abono","No se pudo Ingresar fecha del siguiente pago, verifique los datos","warning");
          }
        
      }
       }
      
const calcularCuota = (cant) => { 
  setCant_pago(cant)
  if(cant > 0)
{
  let monto=cuentaSelecciondo.monto;
  let interes=(monto*(cuentaSelecciondo.interes/100));
  let cuota=(monto/cant)+(interes)
  setMonto_pago(cuota)
}else{
  setMonto_pago("")
}

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
         
{/**modal para ingreso de cuenta ----------------------------------------------------------------- */}

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
        <h5 className="modal-title">Ingreso de Cuenta</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <div className="form-outline mb-4">
         <label className="form-label" htmlFor="form1Example1" hidden= {true} >Codigo de empleado</label>   
    <input type="text" id="form1Example1" className="form-control" hidden= {true} value={idcuenta} onChange={(e) => setIdCuenta(e.target.value)} />

  </div>
  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Cliente</label>
      <DropDown 
        dato = {ConvetirClAData(cliente)} 
        selected={idcliente} 
        setSelected={setIdCliente}  
        value={buscarCl}  
        setValue={setBuscarCl} 
        onChange={BusquedaCliente}
      />
   
  </div>
  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Plan</label>
      <DropDown 
        dato = {ConvetirPlanAData(plan)} 
        selected={idplan} 
        setSelected={setIdPlan}  
        value={buscarPlan}  
        setValue={setBuscarPlan} 
        onChange={BusquedaPlan}
      />
  
   
      

  </div>
  

  
  <div className="form-outline mb-4 center">
       <label className="form-label" htmlFor="form1Example1">Estado</label>
       <div className="form-outline mb-4">
        <div className="form-check form-check-inline">
  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value={estado} checked={estado === "Activo" ? true : false} onChange={() => setEstado("Activo")} selected/>
  <label className="form-check-label" htmlFor="inlineRadio1">Activo</label>
</div>
<div className="form-check form-check-inline">
  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value={estado} checked={estado === "No Activo" ? true : false} onChange={() => setEstado("No Activo")}/>
  <label className="form-check-label" htmlFor="inlineRadio2">No activo</label>
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

{/** modal agregar siguiente ----------------------------------------------------------------------------*/}

<div
          className="modal fade"
          id="exampleModalS"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden={true}
        >
  <div className="modal-dialog modal-dialog-scrollable">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Agregar fecha del proximo pago</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <div className="form-outline mb-4">
    <label className="form-label" htmlFor="form1Example1" >Fecha  del proximo de Pago</label>
        <input type="date" id="form1Example1" className="form-control" value={prox_pago}  onChange={(e) => setProx_Pago(e.target.value)} />
     </div>
     <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Monto de proxima pago</label>
      <div className='input-group'>
          <span className="input-group-text">Q</span>
          <input type="number" id="form1Example1" className="form-control" value={prox_monto}  onChange={(e) => setProx_monto(e.target.value)} />
          <span className="input-group-text">.00</span>
      </div>
  </div>
  
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" className="btn btn-primary" onClick={()=>GuardarSiguiente()} >Guardar</button>
      </div>
    </div>
  </div>
</div>

{/** modal agregar siguiente _______________________________________________________________________*/}
<div
          className="modal fade"
          id="exampleModalC"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden={true}
        >
  <div className="modal-dialog modal-dialog-scrollable">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Configurar Modo de pagos</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">

      <div className="input-group mb-3">
        <label className="form-label " htmlFor="form1Example1" >Monto de la cuenta:</label>
        <label className='form-label ms-3 '>{cuentaSelecciondo.monto !== undefined   ? cuentaSelecciondo.monto : 0}</label>
         </div>
         <div className="input-group mb-3">
        <label className="form-label " htmlFor="form1Example1" >Interes:</label>
        <label className='form-label ms-3'>{cuentaSelecciondo.interes !== undefined   ? cuentaSelecciondo.interes+" %" : 0 }</label>
         </div>

      <div className="form-outline mb-4">
        
        <label className="form-label" htmlFor="form1Example1" >Ingrese la cantidad de pagos</label>
            <input type="text" id="form1Example1" className="form-control" value={cant_pago}  onChange={(e) => {calcularCuota(e.target.value)} } />
         </div>
        
  <div className="form-outline mb-4 center">
       <label className="form-label" htmlFor="form1Example1">Seleccione la modalidad de pago</label>
       <div className="form-outline mb-4">
        <div className="form-check form-check-inline">
  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio5" value={modalidadpago} checked={modalidadpago === "Dia" ? true : false} onChange={() =>{ setModalidadPago("Dia")} }  />
  <label className="form-check-label" htmlFor="inlineRadio5">Día</label>
</div>
<div className="form-check form-check-inline">
  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio6" value={modalidadpago} checked={modalidadpago === "Semana" ? true : false} onChange={() => {setModalidadPago("Semana")}}/>
  <label className="form-check-label" htmlFor="inlineRadio6">Semana</label>
  </div>
  
<div className="form-check form-check-inline">
  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio7" value={modalidadpago} checked={modalidadpago === "Mes" ? true : false} onChange={() => {setModalidadPago("Mes")}}/>
  <label className="form-check-label" htmlFor="inlineRadio7">Mes</label>
  </div>
</div>
</div>
      <div className="form-outline mb-4">

    <label className="form-label" htmlFor="form1Example1" >Fecha del primer Pago</label>
        <input type="date" id="form1Example1" className="form-control" value={inicio_pago}  onChange={(e) => setInicio_pago(e.target.value)} />
     </div>
     <div className="form-outline mb-4">

<label className="form-label" htmlFor="form1Example1" >Monto por pago</label>
    <label  id="form1Example1" className="form-control">{MonedaSS(monto_pago)}</label>
 </div>

      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" className="btn btn-primary" onClick={()=>GuardarPagos()} >Guardar</button>
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
            <th>Cliente</th>
            <th>Plan</th>
            <th>Apertura</th> 
            <th>Total a cobrar</th>
            <th>Cant. Pagos</th>
            <th>Abonado</th>
            <th>Mora</th>  
  
            <th>Estado</th>
            
            <th>Opciones</th>
          </tr>
        </thead>
       <tbody>
      { datos ?
           datos.map((item,index) =>(
            <tr key={index} >
               
               <td>{item.idcuenta}</td>
               <td>{item.cliente}</td>
               <td>{Quetzal(item.monto)}</td>  
               <td>{moment(item.fecha).format("DD/MM/YYYY")}</td>             
               <td>{Quetzal(item.totalpago)}</td>  
               <td>{item.cantpago}</td>
               <td>{Quetzal(item.totalabono)}</td>  
               <td>{Quetzal(item.totalmora)}</td>

             
               {item.estado === "Activo" ? <td ><p className="activo">{item.estado}</p></td>:
               <td ><p className="noactivo">{item.estado}</p></td>
                }
               
               <td>
               <div className="d-flex dropdown justify-content-center alig-items-center">
  <i className="bi bi-three-dots " type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
   
  </i>
  <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton2">
  <li className=" dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e)=>AbrirActualizar(item,e.target)} >Editar</li>
    <li  className="dropdown-item" onClick={()=>Eliminar(item.idcuenta)}>Eliminar</li>
    {/** 
    <li  className=" dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModalS" onClick={(e)=>AgregarSiguiente(item,e.target)}>Agregar siguiente pago</li>
   */} 
   <li  className=" dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModalC" onClick={(e)=>CalcularPagos(item,e.target)}>Configurar pago</li>
      
   
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
    export default Cuenta;
    