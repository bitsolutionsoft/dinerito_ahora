import React, { useEffect, useState } from 'react';
import '../css/estilo.css'
import ls from "local-storage";
import {Nombre} from '../Host/Info';

import Plan from '../Plan/Plan';
import Empleado from '../Empleado/Empleado';
import AlertModel from '../Menu/AlertModel';
import Cliente  from '../Cliente/Cliente';
import Cuenta from '../Cuenta/Cuenta';

function Menu(props)  {
    const [screen, setScreen] = useState("");
    const [usuario, setUsuario] =useState("");
    const nav_item="nav-item";
    const nav_active="nav-item nav-active";

   
    useEffect(() => {
       iniciar();
    }, [])

    const iniciar=()=>{
  if(ls.get('usuario')===null){
    props.history.push('./')
  }else{

      setUsuario(ls.get("usuario").usuario)
  }
}

const acceso = (modulo) => {
    let permiso=ls.get("permiso");
    console.log(permiso);
 let acceso=false;
    permiso.map((item) =>{
        if(item.nombre === modulo){
            if(item.permiso ===1){
                acceso= true;
            }
        }
        return true;
    })
    return acceso
}




    function ColocarContent(){
      
         switch (screen) {
             case 'Plan':
if(acceso("Plan")){
                    return <Plan />
  
                }else{
                        return <AlertModel tipo="warning" titulo="Aviso" msg="No tienes acceso a Plan" />
                      }
               
             case 'Empleado':
if(acceso("Empleado")){
                    return <Empleado />
                  }else{
                        return <AlertModel tipo="warning" titulo="Aviso" msg="No tienes acceso a Empleado" />;
                      }
               
                      case 'Cliente':
if(acceso("Cliente")){
                    return <Cliente />
                  }else{
                        return <AlertModel tipo="warning" titulo="Aviso" msg="No tienes acceso a Cliente" />;
                      }
                      case 'Cuentas':
                        if(acceso("Cuentas")){
                                            return <Cuenta />
                                          }else{
                                                return <AlertModel tipo="warning" titulo="Aviso" msg="No tienes acceso a Cuentas" />;
                                              }
               
             default:  

             return <AlertModel tipo="success" titulo={usuario} msg="Bienvenido a Dinerito Ahora" />;
            }
           
     }
    
     const cerrarSesion=()=>{
         ls.clear();
         props.history.push('./');
     }

    return (
        
<div className="container-fluid vh-100">
    
        <div className="row flex-nowrap ">
            <div className="col-auto col-sm-auto  col-md-1 col-xl-2 px-sm-2 px-0 nav-lateral max-vh-100 ">
                <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2  min-vh-100">
                    <p    className="d-flex align-items-center pb-3 mb-md-0 me-md-auto  text-decoration-none">
                        <span className="fs-5 d-none d-none d-md-none d-xl-inline  text-center">{Nombre}</span>

                
                    </p>
                    <div className="dropdown pb-4">
                        <p     className="d-flex align-items-center  text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="https://raw.githubusercontent.com/bitsolutionsoft/img/main/img.png" alt="perfil" width="30" height="30" className="rounded-circle"/>
                            <span className="d-none d-md-none d-xl-inline mx-1">{usuario}</span>
                        </p>
                        <ul className="dropdown-menu dropdown-menu text-small shadow">
                       
                       <li onClick={()=>setScreen("Usuario")}><button    className="dropdown-item" >Ajustes</button></li>
                     
                       <li>
                           <hr className="dropdown-divider"/>
                       </li>
                       <li onClick={cerrarSesion}><button    className="dropdown-item" >Cerra Sesion</button></li>
                   </ul>
                    </div>
                    
                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    
                        <li onClick={()=>setScreen("Plan")}  className={screen === "Plan" ? nav_active : nav_item}>
                            <div    className=" align-middle px-0">
                                <i className="bi bi-card-list"></i> <span className="ms-1 d-none d-md-none d-xl-inline">Plan</span>
                            </div>
                        </li>
                        <li onClick={()=>setScreen("Empleado")}  className={screen === "Empleado" ? nav_active : nav_item}>
                            <div    className=" align-middle px-0">
                                <i className="bi bi-file-earmark-person"></i> <span className="ms-1 d-none d-md-none d-xl-inline">Empleado</span>
                            </div>
                        </li>
                        <li onClick={()=>setScreen("Cliente")} className={screen === "Cliente" ? nav_active : nav_item}>
                            <div    className=" align-middle px-0">
                            <i className="bi bi-person-lines-fill" aria-hidden="true"></i> <span className="ms-1 d-none d-md-none d-xl-inline">Cliente</span>
                            </div>
                        </li>
                        <li onClick={()=>setScreen("Cuenta")} className={screen === "Cuenta" ? nav_active : nav_item}>
                            <div    className="align-middle px-0">
                            <i className="bi bi-postcard" aria-hidden="true"></i> <span className="ms-1 d-none d-md-none d-xl-inline">Cuentas</span>
                            </div>
                        </li>

                        <li onClick={()=>setScreen("Abono")} className={screen === "Abono" ? nav_active : nav_item}>
                            <div className=" px-0 align-middle">
                                <i className="bi bi-credit-card-2-front"></i> <span className="ms-1 d-none d-md-none d-xl-inline">Abonos</span> 
                                </div>
                           
                        </li>
                        <li onClick={()=>setScreen("Informe")} className={screen === "Informe" ? nav_active : nav_item}>
                        <div    className=" px-0 align-middle">
                                <i className="bi bi-graph-up-arrow" ></i> <span className="ms-1 d-none d-md-none d-xl-inline">Informe</span>
                                </div>
                        </li>
                      
                        <li onClick={()=>setScreen("Bodega")} className={screen === "Bodega" ? nav_active : nav_item}>
                            <div className=" px-0 align-middle">
                                <i className="bi bi-archive"></i> <span className="ms-1 d-none d-md-none d-xl-inline">Bodega</span> </div>
                                
                        </li>

                        <li onClick={()=>setScreen("Caja")} className={screen === "Caja" ? nav_active : nav_item}>
                            <div className=" px-0 align-middle">
                                <i className="bi bi-archive"></i> <span className="ms-1 d-none d-md-none d-xl-inline">Caja</span> 
                                </div>
                               
                        </li>

                        <li onClick={()=>setScreen("Proveedor")} className={screen === "Proveedor" ? nav_active : nav_item}>
                            <div    className=" px-0 align-middle">
                                <i className="bi bi-archive"></i> <span className="ms-1 d-none d-md-none d-xl-inline">Proveedores</span> 
                                </div>
                        </li>
                        <li onClick={cerrarSesion} className={screen === "Salir" ? nav_active : nav_item}>
                            <div    className="px-0 align-middle">
                                <i className="bi bi-box-arrow-in-right"></i> <span className="ms-1 d-none d-md-none d-xl-inline">Salir</span> 
                                </div>
                        </li>
                    </ul>
                    <hr/>
                   
                </div>
            </div>
            
            <div className="col py-3 max-vh-100 overflow-auto">
            <ColocarContent  /> 
            </div>
        </div>
    </div>
    
    );



}

export default Menu;