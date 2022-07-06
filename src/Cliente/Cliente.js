
import React, { useState,useEffect } from 'react';
import swal from "sweetalert";
import SearchBar from '../Component/SearchBar';
import Datos from '../Host/Datos';
import {Quetzal, Dolar} from '../Funciones/Moneda';

function Cliente(props)  {
    const [idcliente, setIdCliente] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState(""); 
    const [direccion, setDreccion] = useState("");
    const [dpi, setDpi] = useState("");
    const [f_perfil, setF_perfil] = useState("-"); 
    const [f_casa, setF_casa] = useState("-");
    const [f_dpi, setF_dpi] = useState("-");
    const [ubicacion, setUbicacion] = useState(""); 
    const [estado, setEstado] = useState("Activo");
    const [latitudes, setLatitudes] =useState("");
    const [longitudes, setLongitudes] =useState("");
    const [linkMap, setLinkMap]=useState("");
    

    const [datos, setdatos] = useState([]);  
    const [encontrado, setencontrado] = useState([]);
    const [buscar, setbuscar] = useState("");
    const [accion, setAccion] = useState("new");
    
    //const moneda=2;
    //const Moneda= moneda===1 ? Dolar: Quetzal;

    useEffect(()=>{
      ConsultarCliente();
      getUbicacion();

    },[])
    
const getUbicacion=()=>{
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition((position)=>{
        setUbicacion(position.coords.latitude+"/"+position.coords.longitude);
    })
}else{
    swal("Aviso","Por favor active la ubicación de su dispositivo","Error");
}
}


    const ConsultarCliente=async()=>{
      const datos=await Datos.Consulta("cliente");
      if(datos!==null){
        console.log(datos.res);
        setdatos(datos.res);
        setencontrado(datos.res)
      }
    }

    const limpiar=()=>{
      setIdCliente(0);
      setNombre("");
      setTelefono("");
      setApellido("");
      setEstado("Activo");
    }
    const Ingresar=async()=>{
      let datos={
        idcliente:0,
        nombre:nombre,
        apellido:apellido,
        telefono:telefono,
        direccion:direccion,
        dpi:dpi,
        f_perfil:f_perfil,
        f_casa:f_casa,
        f_dpi:f_dpi,
        ubicacion:ubicacion,
        estado:estado
      }
   
      let cliente=await Datos.NuevoReg("cliente",datos);
      if(cliente !== null){
        if(cliente.message==="Success"){
          swal("Cliente","Ingresdo exitosamente","success");
          limpiar();
          ConsultarCliente();
        }else{
          swal("Cliente","No se pudo Ingresar, verifique los datos","warning");
        }
      }
    }
    const Actualizar=async()=>{
      let datos={
        idcliente:idcliente,
        nombre:nombre,
        apellido:apellido,
        telefono:telefono,
        direccion:direccion,
        dpi:dpi,
        f_perfil:f_perfil,
        f_casa:f_casa,
        f_dpi:f_dpi,
        ubicacion:ubicacion,
        estado:estado
      }
      console.log(datos);
      let cliente=await Datos.ActualizarReg("cliente",datos);
      if(cliente !== null){
        if(cliente.message==="Success"){
          swal("Cliente","Ingresdo exitosamente","success");
          limpiar();
          ConsultarCliente();
        }else{
          swal("Cliente","No se pudo Ingresar, verifique los datos","warning");
        }
      }
    }
    const Eliminar=async(id)=>{
      let cliente=await Datos.BorrarReg("cliente",id);
      if(cliente!==null){
        if(cliente.message === "Success"){
          swal("Cliente", "Eliminado con exíto","success")
          ConsultarCliente();
        }else{
          swal("Cliente","No se pudo eliminar","warning");
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
setIdCliente(datos.idcliente);
setNombre(datos.nombre);
setApellido(datos.apellido);
setTelefono(datos.telefono);
setEstado(datos.estado)
setAccion("update");

var myInput = document.getElementById("exampleModal");
    e.addEventListener("shown.bs.modal", function () {
      myInput.focus();
    });
    }

    const AbrirDetalle=(datos,e)=>{
       let ubica=datos.ubicacion.split("/");
       let log=ubica[1];
       let lat=ubica[0];
     
     console.log(log, lat);
       setF_perfil(datos.f_perfil);
       setF_casa(datos.f_casa);
       setF_dpi(datos.f_dpi);
       setLinkMap(`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2292.027386295935!2d${log}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sgt!4v1656994522621!5m2!1ses-419!2sgt`);
        
        var myInput = document.getElementById("exampleDetalle");

            e.addEventListener("shown.bs.modal", function () {
              myInput.focus();
            });
            }


    const Busqueda =(e)=>{
      let buscarTexto=e.target.value;
      setbuscar(buscarTexto);
      let text=buscarTexto.replace(/^\w/,(c) =>c.toLowerCase());
      setbuscar(buscarTexto);
      
      setdatos(encontrado.filter((item)=>{
          return   item.nombre.toLowerCase().includes(text) ;   
        }).map(({idcliente, nombre, apellido, telefono, estado})=>{
          return{idcliente, nombre, apellido, telefono, estado}
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
            <h5 className="modal-title">Cliente</h5></div>
            <SearchBar
            onChange={Busqueda} 
            value={buscar} 
            placeholder="Buscar Cliente..."  

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
        <h5 className="modal-title">Ingreso de Cliente</h5>

        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <div className="form-outline mb-4">
         <label className="form-label" htmlFor="form1Example1" hidden= {true} >Codigo </label>   
    <input type="text" id="form1Example1" className="form-control" hidden= {true} value={idcliente} onChange={(e) => setIdCliente(e.target.value)} />

  </div>
  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Nombre</label>
   
          <input type="text" id="form1Example1" className="form-control" value={nombre}  onChange={(e) => setNombre(e.target.value)} />
         
  </div>
  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Apellido</label>
  
        <input type="text" id="form1Example1" className="form-control" value={apellido}  onChange={(e) => setApellido(e.target.value)} />
      

  </div>
  <div className="form-outline mb-4">

       <label className="form-label" htmlFor="form1Example1" >Telefono</label>
        <input type="text" id="form1Example1" className="form-control" value={telefono}  onChange={(e) => setTelefono(e.target.value)} />

  </div>
  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Dirección</label>
   
          <input type="text" id="form1Example1" className="form-control" value={direccion}  onChange={(e) => setDreccion(e.target.value)} />
         
  </div>
  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Numero de DPI</label>
  
        <input type="text" id="form1Example1" className="form-control" value={dpi}  onChange={(e) => setDpi(e.target.value)} />
      

  </div>
  <div className="form-outline mb-4">
    
       <label className="form-label" htmlFor="form1Example1" >Foto del Cliente</label>
       <div class="custom-file">
    <input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"/>
    
  </div>
      {/**   <input type="text" id="form1Example1" className="form-control" value={f_perfil}  onChange={(e) => setF_perfil(e.target.value)} />
*/} 
 </div>

  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Foto  de la casa</label>
      <div class="custom-file">
    <input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"/>
    
  </div>
           {/**  <input type="text" id="form1Example1" className="form-control" value={f_casa}  onChange={(e) => setF_casa(e.target.value)} />
     */}     
  </div>
  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Foto del DPI</label>
      <div class="custom-file">
    <input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"/>
    
  </div>
      {/**    <input type="text" id="form1Example1" className="form-control" value={f_dpi}  onChange={(e) => setF_dpi(e.target.value)} />
      */}  

  </div>
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Ubicación</label>
        <input type="text" id="form1Example1" className="form-control" value={ubicacion}  onChange={(e) => setUbicacion(e.target.value)} />


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
{/** fin del modal de ingreso cliente */}

{/**inicio del modal de detalles del cliente */}

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
        <h5 className="modal-title">Detalles del cliente</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <div className="form-outline mb-4">
         <label className="form-label" htmlFor="form1Example1" hidden= {true} >Codigo </label>   
    <input type="text" id="form1Example1" className="form-control" hidden= {true} value={idcliente} onChange={(e) => setIdCliente(e.target.value)} />

  </div>
  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Cliente</label>
      <img src="..." class="rounded float-left" alt="..."/>
  </div>
  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Residencia</label>
      <img src="..." class="rounded float-left" alt="..."/>
  </div>
  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >DPi</label>
      <img src="..." class="rounded float-left" alt="..."/>
  </div>
 
  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Ubicación</label>
      <div id="map-container-google-3" className="z-depth-1-half map-container-3">
  <iframe src={linkMap} className="map" width="600" height="450"  allowfullscreen="true" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    {/**  
     * 
     *     <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d30838.02327407945!2d-91.45531645!3d14.95085335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sgt!4v1656994385292!5m2!1ses-419!2sgt" width="800" height="600" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  <iframe src="https://maps.google.com/maps?q=warsaw&t=k&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0"
    style="border:0" allowfullscreen></iframe>
    */} 
</div>
  </div>
 
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Salir</button>
       
      </div>
    </div>
  </div>
</div>
{/**fin del modal de  detalles del cliente */}

<div className="div-table">
<div className="table-wrap">
  
<table className="table-item ">
  <thead >
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Apellido</th>

            <th>Telefono</th>
            <th>Dirección</th>
            <th>dpi</th>
          
            <th>Estado</th>

            <th>Opciones</th>
          </tr>
        </thead>
       <tbody>
      { datos ?
           datos.map((item,index) =>(
            <tr key={index}>
               
               <td>{item.idcliente}</td>
               <td>{item.nombre}</td>
               <td>{item.apellido}</td>
               <td>{item.telefono}</td>
               <td>{item.direccion}</td>
               <td>{item.dpi}</td>
           

               {item.estado === "Activo" ? <td ><p className="activo">{item.estado}</p></td>:
               <td ><p className="noactivo">{item.estado}</p></td>
                }
               
               <td>
               <div className="d-flex dropdown justify-content-center alig-items-center">
  <i className="bi bi-three-dots " type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
   
  </i>
  <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton2">

  <li className=" dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleDetalle" onClick={(e)=>AbrirDetalle(item,e.target)} >Detalles</li>
  <li className=" dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e)=>AbrirActualizar(item,e.target)} >Editar</li>
    <li  className="dropdown-item" onClick={()=>Eliminar(item.idcliente)}>Eliminar</li>

      
   
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
    export default Cliente;
    

