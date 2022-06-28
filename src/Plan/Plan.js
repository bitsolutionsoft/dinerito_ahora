
import React, { useState,useEffect } from 'react';
import md5 from "md5";
import swal from "sweetalert";
import SearchBar from '../Component/SearchBar';
import Datos from '../Host/Datos';

function Plan(props)  {
    const [idplan, setIdplan] = useState("");
    const [monto, setMonto] = useState("");
    const [interes, setInteres] = useState("");
    const [plan_dia, setPlan_dia] = useState(""); 
    const [estado, setEstado] = useState("Activo");
    
    const [datos, setdatos] = useState([]);  
    const [encontrado, setencontrado] = useState([]);
    const [buscar, setbuscar] = useState("");
    const [accion, setAccion] = useState("new");
    const [modulo, setmodulo] = useState([]);

    useEffect(()=>{
      ConsultarPlan();
    },[])
    
    const ConsultarPlan=async()=>{
      const datos=await Datos.Consulta("plan");
      if(datos!==null){
        console.log(datos.res);
        setdatos(datos.res);
        setencontrado(datos.res)
      }
    }

    const limpiar=()=>{
      setIdplan(0);
      setMonto("");
      setPlan_dia("");
      setInteres("");
      setEstado("Activo");
    }
    const Ingresar=async()=>{
      let datos={
        idplan:0,
        monto:monto,
        interes:interes,
        plan_dia:plan_dia,
        estado:estado
      }
      let plan=await Datos.NuevoReg("plan",datos);
      if(plan !== null){
        if(plan.message==="Success"){
          swal("Plan","Ingresdo exitosamente","success");
          limpiar();
          ConsultarPlan();
        }else{
          swal("Plan","No se pudo Ingresar, verifique los datos","warning");
        }
      }
    }
    const Actualizar=async()=>{
      let datos={
        idplan:idplan,
        monto:monto,
        interes:interes,
        plan_dia:plan_dia,
        estado:estado
      }
      let plan=await Datos.ActualizarReg("plan",datos);
      if(plan !== null){
        if(plan.message==="Success"){
          swal("Plan","Ingresdo exitosamente","success");
          limpiar();
          ConsultarPlan();
        }else{
          swal("Plan","No se pudo Ingresar, verifique los datos","warning");
        }
      }
    }
    const Eliminar=async(id)=>{
      let plan=await Datos.BorrarReg("plan",id);
      if(plan!==null){
        if(plan.message==="Success"){
          swal("Plan", "Eliminado con exíto","success")
          ConsultarPlan();
        }else{
          swal("Plan","No se pudo eliminar","warning");
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
setIdplan(datos.idplan);
setMonto(datos.monto);
setInteres(datos.interes);
setPlan_dia(datos.plan_dia);
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
        }).map(function({idplan, monto, interes, plan_dia, estado}){
          return{idplan, monto, interes, plan_dia, estado}
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
            <h5 className="modal-title">Plan</h5></div>
            <SearchBar
            onChange={Busqueda} 
            value={buscar} 
            placeholder="Buscar Plan..."  
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
        <h5 className="modal-title">Ingreso de Plan</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <div className="form-outline mb-4">
         <label className="form-label" htmlFor="form1Example1" hidden= {true} >Codigo de empleado</label>   
    <input type="text" id="form1Example1" className="form-control" hidden= {true} value={idplan} onChange={(e) => setIdplan(e.target.value)} />

  </div>
  <div className="form-outline mb-4">
     <label className="form-label" htmlFor="form1Example1" >Monto</label>
     <input type="text" id="form1Example1" className="form-control" value={monto}  onChange={(e) => setMonto(e.target.value)} />
   
  </div>
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Interes</label>
        <input type="text" id="form1Example1" className="form-control" value={interes}  onChange={(e) => setInteres(e.target.value)} />

  </div>
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Dias del Plan</label>
        <input type="text" id="form1Example1" className="form-control" value={plan_dia}  onChange={(e) => setPlan_dia(e.target.value)} />

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
            <th>Dias del Plan</th>
            <th>Estado</th>
            
            <th>Opciones</th>
          </tr>
        </thead>
       <tbody>
      { datos ?
           datos.map((item,index) =>(
            <tr key={index}>
               
               <td>{item.idplan}</td>
               <td>{item.monto}</td>
               <td>{item.interes}</td>
               <td>{item.plan_dia}</td>
             
               {item.estado === "Activo" ? <td ><p className="activo">{item.estado}</p></td>:
               <td ><p className="noactivo">{item.estado}</p></td>
                }
               
               <td>
               <div className="d-flex dropdown justify-content-center alig-items-center">
  <i className="bi bi-three-dots " type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
   
  </i>
  <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton2">
  <li className=" dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e)=>AbrirActualizar(item,e.target)} >Editar</li>
    <li  className="dropdown-item" onClick={()=>Eliminar(item.idempleado)}>Eliminar</li>
      
   
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
    export default Plan;
    