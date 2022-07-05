
import React, { useState,useEffect } from 'react';
import md5 from "md5";
import swal from "sweetalert";
import SearchBar from '../Component/SearchBar';
import Datos from '../Host/Datos';
import {Quetzal, Dolar} from '../Funciones/Moneda';
function Cuenta(props)  {
    const [idcuenta, setIdCuenta] = useState("");
    const [idcliente, setIdCliente] = useState("");
    const [idplan, setIdPlan] = useState("");
    const [prox_pago, setProx_Pago]=useState("");
    const [estado, setEstado] = useState("Activo");
    
    const [datos, setdatos] = useState([]);  
    const [encontrado, setencontrado] = useState([]);
    const [buscar, setbuscar] = useState("");
    const [accion, setAccion] = useState("new");
    
    //const moneda=2;
    //const Moneda= moneda===1 ? Dolar: Quetzal;

    useEffect(()=>{
      ConsultarCuenta();
      console.log(idcliente)
    },[])
    
    const ConsultarCuenta=async()=>{
      const datos=await Datos.Consulta("Cuenta");
      if(datos!==null){
        console.log(datos.res);
        setdatos(datos.res);
        setencontrado(datos.res)
      }
    }

    const limpiar=()=>{
      setIdCuenta(0);
      setIdCliente("");
      setProx_Pago("");
      setIdPlan("");
      setEstado("Activo");
    }
    const Ingresar=async()=>{
      let datos={
        idcuenta:0,
        idcliente:idcliente,
        idplan:idplan,
        prox_pago:prox_pago,
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
        prox_pago:prox_pago,
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
    let myInput = document.getElementById("exampleModal");
    e.target.addEventListener("shown.bs.modal", function () {
      myInput.focus();
    });
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
  <div className="modal-dialog">
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
      <label className="form-label" htmlFor="form1Example1" >Monto</label>
      <div className='input-group'>
          <span className="input-group-text">Q</span>
          <input type="text" id="form1Example1" className="form-control" value={idcliente}  onChange={(e) => setIdCliente(e.target.value)} />
          <span class="input-group-text">.00</span>
      </div>
  </div>
  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Interes</label>
      <div className='input-group'>
        <input type="text" id="form1Example1" className="form-control" value={idplan}  onChange={(e) => setIdPlan(e.target.value)} />
        <span class="input-group-text">%</span>
      </div>
      

  </div>
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Dias del Cuenta</label>
        <input type="text" id="form1Example1" className="form-control" value={prox_pago}  onChange={(e) => setProx_Pago(e.target.value)} />

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
            <th>Monto</th>
            <th>Interes</th>
            <th>Dias del Cuenta</th>
            <th>Estado</th>
            
            <th>Opciones</th>
          </tr>
        </thead>
       <tbody>
      { datos ?
           datos.map((item,index) =>(
            <tr key={index}>
               
               <td>{item.idcuenta}</td>
               <td>{Quetzal(item.idcliente)}</td>
               <td>{item.idplan+"%"}</td>
               <td>{item.prox_pago}</td>
             
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
    