
import React, { useState,useEffect, useContext } from 'react';
import swal from "sweetalert";
import SearchBar from '../Component/SearchBar';
import Datos from '../Host/Datos';
import {Quetzal} from '../Funciones/Moneda';
import moment from 'moment';
import DropDown from '../Component/DropDown';
import {ConvetirClAData,ConvetirPlanAData, Obtenercliente,ObtenerPlan} from '../Funciones/Funciones';
import {ContextUser} from '../Context/Context';


function Cuenta(props)  {
    const [idcuenta, setIdCuenta] = useState("");
    const [idcliente, setIdCliente] = useState("");
    const [idplan, setIdPlan] = useState("");
    const [prox_pago, setProx_Pago]=useState("");
    const [estado, setEstado] = useState("Activo");
    
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

  //use context
  //  const {currentUser,setCurrentUser} = useContext(ContextUser);
  

    useEffect(()=>{
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
        prox_pago:moment(prox_pago).format("YYYY-MM-DD"),
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
        prox_pago:moment(prox_pago).format("YYYY-MM-DD"),
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
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Proximo dia de Pago</label>
        <input type="date" id="form1Example1" className="form-control" value={prox_pago}  onChange={(e) => setProx_Pago(e.target.value)} />

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

<div className="div-table">
<div className="table-wrap">
  
<table className="table-item ">
  <thead >
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Plan</th>
            <th>Apertura</th> 
            <th>Monto</th>
            <th>Abonado</th>
            <th>Mora</th>  
            <th>Proximo dia de pago</th>
            <th>Estado</th>
            
            <th>Opciones</th>
          </tr>
        </thead>
       <tbody>
      { datos ?
           datos.map((item,index) =>(
            <tr key={index} >
               
               <td>{item.idcuenta}</td>
               <td>{item.idcliente}</td>
               <td>{item.idplan}</td>  
               <td>{moment(item.fecha).format("DD/MM/YYYY")}</td>
               <td>{item.idplan}</td>
               <td>{Quetzal(item.totalabono)}</td>  
               <td>{Quetzal(item.totalmora)}</td>
               <td>{moment(item.prox_pago).format("DD/MM/YYYY")}</td>
             
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
    