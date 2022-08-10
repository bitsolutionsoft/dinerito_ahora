
import React, { useState,useEffect } from 'react';
import swal from "sweetalert";
import SearchBar from '../Component/SearchBar';
import Datos from '../Host/Datos';
import {Quetzal, Dolar} from '../Funciones/Moneda';

//import { MapContainer, TileLayer, useMap,Marker,Popup } from 'react-leaflet'

function Cliente(props)  {
    const [idcliente, setIdCliente] = useState("");
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [telefono, setTelefono] = useState(""); 
    const [direccion, setDreccion] = useState("");
    const [dpi, setDpi] = useState("");
    const [f_perfil, setF_perfil] = useState(); 
    const [f_casa, setF_casa] = useState();
    const [f_dpi, setF_dpi] = useState();
    const [ubicacion, setUbicacion] = useState(""); 
    const [estado, setEstado] = useState("Activo");
    const [latitudes, setLatitudes] =useState("");
    const [longitudes, setLongitudes] =useState("");
    const [linkMap, setLinkMap]=useState("");
    

    const [datos, setdatos] = useState([]);  
    const [encontrado, setencontrado] = useState([]);
    const [buscar, setbuscar] = useState("");
    const [accion, setAccion] = useState("new");

    const [getIDPI, setGetIDPI] = useState("");
    const [getICASA, setGetICASA] = useState("");
    const [getIPERFIL, setGetIPERIL] = useState("");
    const[prev_perfil, setPrev_perfil]=useState();
const [prev_casa, setPrev_casa ]   =useState();
const [prev_dpi, setPrev_dpi ]   =useState();
const[classTag, setClassTag]=useState("tag_copy")

    //const moneda=2;
    //const Moneda= moneda===1 ? Dolar: Quetzal;

    useEffect(()=>{
      ConsultarCliente();
      //getUbicacion();

    },[])
    
const getUbicacion=()=>{

navigator.permissions.query({name:'geolocation'}).then(function(result) {
  
  if (result.state == 'granted') {
    navigator.geolocation.getCurrentPosition(MostrarPosicion,MostraError);

    report(result.state);
//    geoBtn.style.display = 'none';
  } else if (result.state == 'prompt') {
    report(result.state);
  //  geoBtn.style.display = 'none';
    navigator.geolocation.getCurrentPosition(MostrarPosicion,MostraError);
  } else if (result.state == 'denied') {
    report(result.state);
    
    navigator.geolocation.getCurrentPosition(MostrarPosicion,MostraError);
    //geoBtn.style.display = 'inline';
  }
  result.addEventListener('change', function() {
    report(result.state);
  });
});
} 



function report(state) {
  console.log('Permission ' + state);
}
  const MostrarPosicion = (position) => { 
    setUbicacion(position.coords.latitude+","+position.coords.longitude);
   }
const MostraError = (error) => { 
switch(error.code){
case  error.PERMISSION_DENIED: 
swal("Aviso","No se puede obtener la ubicación, por favor habilite los permisos","warning");
break;
case error.POSITON_UNAVAILABLE:
swal("Aviso","La ubicacion no esta disponible","warnind");
break;
case error.TIMEOUT:
swal("Aviso","Se agoto el tiepo para obtener la ubicación","warning");
break;
case error.UNKNOWN_ERROR:
swal("Aviso","Hubo un error al intentar obtener la ubicacion","warning");
break;
default:
break;
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
const SubirImagen =async (file) => { 
 const datosImg=await Datos.UploadImg(file);
 if(datosImg !== null) {
  if(datosImg.message !== "Success"){
    swal("Aviso","No se pudo cargar la imagen","error");
  }
 }
}
const Preview = (file,setPreview) => { 
setPreview(file.url)
}

const GetPreview = (file,setPreview) => { 
  let reader=new FileReader();
  reader.onloadend=function(e){
    setPreview(reader.result)
  }
  reader.readAsDataURL(file)
}
 
  
const VerImagen = async (name,tipo) => { 
const datosImg=await Datos.ViewImg(name);
if(datosImg){
  console.log(datosImg)
 switch(tipo){
  case "Dpi":
    Preview(datosImg,setGetIDPI)
    //setGetIDPI(URL.createObjectURL(datosImg));
    break;
    case "Casa":
      Preview(datosImg,setGetICASA)
      //setGetICASA(URL.createObjectURL (datosImg));
      break;
      case "Perfil":
        Preview(datosImg,setGetIPERIL)
        //setGetIPERIL(URL.createObjectURL (datosImg));
        break;
  default:
    break;
 }
}else{
  swal("Aviso","No se encotro la imgane","warning");
}

 }
const BorarImagen = async (name) => { 
  const datosImg =await Datos.DeleteImg(name);
  if(datosImg){
    if(datosImg.message ==="Archivo eliminado"){
      
    }
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
      const fperfil=f_perfil;
      const fdpi=f_dpi;
      const fcasa=f_casa;
      console.log(fcasa)
      let datos={
        idcliente:0,
        nombre:nombre,
        apellido:apellido,
        telefono:telefono,
        direccion:direccion,
        dpi:dpi,
        f_perfil:f_perfil.name,
        f_casa:f_casa.name,
        f_dpi:f_dpi.name,
        ubicacion:ubicacion,
        estado:estado
      }
   
      let cliente=await Datos.NuevoReg("cliente",datos);
      if(cliente !== null){
        if(cliente.message==="Success"){
          console.log(fperfil)
          SubirImagen(fperfil);
          SubirImagen(fcasa);
          SubirImagen(fdpi);

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
        f_perfil:f_perfil.name,
        f_casa:f_casa.name,
        f_dpi:f_dpi.name,
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
    const Eliminar=async(datos)=>{
      let cliente=await Datos.BorrarReg("cliente",datos.idcliente);
      if(cliente!==null){
        if(cliente.message === "Success"){
          swal("Cliente", "Eliminado con exíto","success")
          BorarImagen(datos.f_casa);
          BorarImagen(datos.f_dpi);
          BorarImagen(datos.f_perfil);
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
       let ubica=datos.ubicacion.split(",");
          let lat=ubica[0];
       let log=ubica[1];
   
     setLatitudes(ubica[0]);
     setLongitudes(ubica[1]);
     console.log(log, lat);
       //setF_perfil(datos.f_perfil);
       //setF_casa(datos.f_casa);
       //setF_dpi(datos.f_dpi);
       VerImagen(datos.f_perfil,"Perfil");
       VerImagen(datos.f_casa, "Casa");
       VerImagen(datos.f_dpi,"Dpi");
      // setLinkMap(`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2292.027386295935!2d${log}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sgt!4v1656994522621!5m2!1ses-419!2sgt`);
     setLinkMap(`https://www.google.es/maps?q=${lat},${log}`);
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
const verEtiqueta = (visible) => { 
  if(visible){
    setClassTag("tag_copy tag_visible")
    setTimeout(()=>{
      setClassTag("tag_copy")
    },1000);

  }else{
setClassTag("tag_copy")
  }
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
          <label for="formFile" className="form-label" htmlFor="form1Example1" >Foto del Cliente</label>
        <div className="custom-file"> 
    <input type="file" className="form-control"  id="formFile"  aria-describedby="inputGroupFileAddon01" name={f_perfil} onChange={(e)=>{setF_perfil(e.target.files[0]); GetPreview(e.target.files[0],setPrev_perfil)}} />
    <img src={prev_perfil} alt="..." height={50} width={50}></img>
  </div>

      {/**   <input type="text" id="form1Example1" className="form-control" value={f_perfil}  onChange={(e) => setF_perfil(e.target.value)} />
*/} 
 </div>

  <div className="form-outline mb-4">
      <label for="formFile" className="form-label" htmlFor="form1Example1" >Foto  de la casa</label>
      <div className="custom-file">
    <input type="file" className="form-control"  id="formFile" aria-describedby="inputGroupFileAddon01" name={f_casa} onChange={(e)=>{setF_casa(e.target.files[0]); GetPreview(e.target.files[0],setPrev_casa)}}/>
    <img src={prev_casa} alt="..." height={50} width={50}></img>
  </div>
           {/**  <input type="text" id="form1Example1" className="form-control" value={f_casa}  onChange={(e) => setF_casa(e.target.value)} />
     */}     
  </div>

  <div className="form-outline mb-4">
      <label className="form-label" htmlFor="form1Example1" >Foto del DPI</label>
      <div className="custom-file">
        
    <input type="file" className="form-control"  id="formFile" aria-describedby="inputGroupFileAddon01" name={f_dpi} onChange={(e)=>{setF_dpi(e.target.files[0]); GetPreview(e.target.files[0],setPrev_dpi)}}/>
    <img src={prev_dpi} alt="..." height={50} width={50}></img>
  </div>
      {/**    <input type="text" id="form1Example1" className="form-control" value={f_dpi}  onChange={(e) => setF_dpi(e.target.value)} />
      */}  

  </div>
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Ubicación</label>
       <div className='input-group'>
       <input type="text" className="form-control" placeholder="ej: 14.02,-90.3" disabled={true} aria-label="Recipient's username" aria-describedby="basic-addon2" value={ubicacion}  onChange={(e) => setUbicacion(e.target.value)}/>
  <span className="input-group-text" id="basic-addon2" onClick={()=>{getUbicacion()}}><i className='bi bi-geo-alt-fill'></i> </span>
</div>

      

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
     
       
  <div className='d-flex row gap-2 justify-content-md-center'>
  <div className="gallery" >
  <img src={getIPERFIL} className="imgs" alt="..."/>
  <div class="div_dec">
    <lable className="card-title">Foto del cliente</lable> 
  </div>
</div>
<div className="gallery" >
  <img src={getICASA} className="imgs" alt="..."/>
  <div class="div_dec">
    <label className="card-title">Foto de la residencia </label> 
  </div>
</div>
<div className="gallery">
  <img src={getIDPI} className="imgs" alt="..."/>
  <div class="div_dec">
    <label className="card-title">Foto del DPI</label> 
  </div>
</div>
 <div  className="gallery">
     <label className="form-label" htmlFor="form1Example1" >Ubicación</label>
     <label className={classTag}>Copiado!</label>
      <div className='d-flex justify-content-center'>
      <i className="bi bi-geo-alt-fill icon_location" onClick={()=>{navigator.clipboard.writeText(linkMap);
      verEtiqueta(true)
      }}></i> 
      
      </div>
      <div className='container'>
      <a href={linkMap} >ir a google maps</a> 
      </div>
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
    

