
import React, { useState,useEffect } from 'react';
import md5 from "md5";
import swal from "sweetalert";
import SearchBar from '../Component/SearchBar';
import Datos from '../Host/Datos';

function Empleado(props)  {
    const [idempleado, setIdempleado] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [dpi, setDpi] = useState(""); 
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [estado, setEstado] = useState("");

    const [datos, setdatos] = useState([]);  
    const [encontrado, setencontrado] = useState([]);
    const [buscar, setbuscar] = useState("");
    const [accion, setAccion] = useState("new");
    const [modulo, setmodulo] = useState([]);
    
    useEffect(()=>{
        ConsultarEmpleado();
      },[])

      const ConsultarEmpleado=async()=>{
     
        const datos=await Datos.Consulta("empleado");
      //datos  && datos.res && setdatos(datos.res); setencontrado(datos.res);
       if(datos!==null){
          console.log(datos.res);
          setdatos(datos.res);
          setencontrado(datos.res)
        }
      }

      const limpiar=()=>{
        setIdempleado(0);
        setNombre("");
        setApellido("");
        setDpi("");
        setTelefono("");
 
        setEstado("Activo");
      }

      const Ingresar=async()=>{
        let datos={
          idempleado:0,
          nombre:nombre,
          apellido:apellido,
          dpi:dpi,
          telefono:telefono,
      
          estado:estado
        }
        let empleado=await Datos.NuevoReg("empleado",datos);
        if(empleado !== null){
          if(empleado.message==="Success"){
            swal("Empleado","Ingreso exitosamente","success");
            limpiar();
            ConsultarEmpleado();
          }else{
            swal("Empleado","No se pudo Ingresar, verifique los datos","warning");
          }
        }
      }

      const Actualizar=async()=>{
        let datos={
            idempleado:idempleado,
          nombre:nombre,
          apellido:apellido,
          dpi:dpi,
          telefono:telefono,
     
          estado:estado
        }
        let empleado=await Datos.ActualizarReg("empleado",datos);
        if(empleado !== null){
          if(empleado.message==="Success"){
            swal("Empleado","Ingresdo exitosamente","success");
            limpiar();
            ConsultarEmpleado();
          }else{
            swal("Empleado","No se pudo Ingresar, verifique los datos","warning");
          }
        }
      }

      const Eliminar=async(id)=>{
        let empleado=await Datos.BorrarReg("empleado",id);
        if(empleado!==null){
          if(empleado.message === "Success"){
            swal("Plan", "Eliminado con exíto","success")
            ConsultarEmpleado();
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
        setIdempleado(datos.idempleado);
        setNombre(datos.nombre);
        setApellido(datos.apellido);
        setDpi(datos.dpi);
        setTelefono(datos.telefono);
  
        setEstado(datos.estado)
        setAccion("update");
        
        var myInput = document.getElementById("exampleModal");
            e.addEventListener("shown.bs.modal", function () {
              myInput.focus();
            });
            }

            const Busqueda =(e)=>{
              console.log(e.target.value);
                let buscarTexto=e.target.value;
                setbuscar(buscarTexto);
                let text=buscarTexto.replace(/^\w/,(c) =>c.toLowerCase());
                setbuscar(buscarTexto);
                
                setdatos(encontrado.filter(function(item){
                    return item.nombre.toLowerCase().includes(text) || item.apellido.toLowerCase().includes(text) ||  item.estado.toLowerCase().includes(text) ;   
                  }).map(function({idempleado, nombre, apellido, dpi, telefono, correo, estado}){
                    return{idempleado, nombre, apellido, dpi, telefono, correo, estado}
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
            <h5 className="modal-title">Empleado</h5></div>
            <SearchBar
            onChange={Busqueda} 
            value={buscar} 
            placeholder="Buscar Empleado..."  
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
        <h5 className="modal-title">Ingreso de Empleado</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <div className="form-outline mb-4">
         <label className="form-label" htmlFor="form1Example1" hidden= {true} >Codigo de empleado</label>   
    <input type="text" id="form1Example1" className="form-control" hidden= {true} value={idempleado} onChange={(e) => setIdempleado(e.target.value)} />

  </div>
  <div className="form-outline mb-4">
     <label className="form-label" htmlFor="form1Example1" >Nombre</label>
     <input type="text" id="form1Example1" className="form-control" value={nombre}  onChange={(e) => setNombre(e.target.value)} />
   
  </div>
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Interes</label>
        <input type="text" id="form1Example1" className="form-control" value={apellido}  onChange={(e) => setApellido(e.target.value)} />

  </div>
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >DPI</label>
        <input type="text" id="form1Example1" className="form-control" value={dpi}  onChange={(e) => setDpi(e.target.value)} />

  </div>

  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Telefono</label>
        <input type="text" id="form1Example1" className="form-control" value={telefono}  onChange={(e) => setTelefono(e.target.value)} />

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
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DPI</th>
            <th>Telefono</th>
            <th>Estado</th>
            
            <th>Opciones</th>
          </tr>
        </thead>
       <tbody>
      { datos ?
           datos.map((item,index) =>(
            <tr key={index}>
               
               <td>{item.idempleado}</td>
               <td>{item.nombre}</td>
               <td>{item.apellido}</td>
               <td>{item.dpi}</td>
               <td>{item.telefono}</td>
            

               {item.estado === "Activo" ? <td ><p className="activo">{item.estado}</p></td>:
               <td ><p className="noactivo">{item.estado}</p></td>
                }
               
               <td>
               <div className="d-flex dropdown justify-content-center alig-items-center">
  <i className="bi bi-three-dots " type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
   
  </i>
  <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton2">
  <li className=" dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e)=>AbrirActualizar(item,e.target)} >Editar</li>
    <li  className="dropdown-item" onClick={()=>Eliminar(item.idplan)}>Eliminar</li>
      
   
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
    export default Empleado;
    