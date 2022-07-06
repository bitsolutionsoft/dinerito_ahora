import '../css/login.css';
import md5 from 'md5';
import React, { useContext, useState } from 'react';
import Datos from '../Host/Datos';
import ls from "local-storage";
import swal from "sweetalert"

function Login(props)  {
    const [user, setuser] = useState("");
    const [password, setpassword] = useState("");
    

    async function loguear() {
      let data = {
        idusuario: 0,
        idempleado: 0,
        usuario: user.trim(),
        pass: md5(password.trim()),
      };

      let usuario = await Datos.ConsultaUser(data);

      if (usuario !== undefined) {
        if (usuario.message === "Success") {
          let d = usuario.res[0];
          console.log(d);
          ls.set("usuario", usuario.res[0]);
          
          consultarPermiso(d.idempleado);
          swal("Dinerito_Ahora", "Bienvenido", "success");
          props.history.push("/Menu");
        } else {
          swal("Dinerito_Ahora", "Usuario o Cantraseña Incorrecta", "warning");
        }
      }
    }
    async function consultarPermiso(idemp) {
      let dat = await Datos.ConsultaPermiso(idemp);
      if (dat !== null) {
        if (dat.message === "Success") {
          console.log(dat.res);
          ls.set("permiso", dat.res);
        }
      }
    }
   
    const pressEnter=(event)=>{
        if(event.key==='Enter'){
            loguear();
        }
    }


return (
    
    <div className="container-fluid login">
     
    <div className="container w-75 mt-5 mb-15">
        <div className="row bg  bg-opacity-50 align-items-stretch  rounded">
            <div className="col  d-none d-lg-block col-md-5 col-lg-5 col-xl-6  imgleft">
            </div>
            <div className="col  p-2 rounded-end">
                <h2 className="fw-bold text-center pt-6 py-5  text-white"  >Bienvenido</h2>
                
                <div className="d-flex justify-content-center h-100 ">
                    <div> 
                        <div className="bg p-2 t bg-opacity-10">
                            <div className="input-group form-group">
                                <div> 
                                    <label htmlFor="username" className="form-label text-white fw-bold" > Usuario: </label>
                                    <div className="input-group-prepend"> 
                                    <i className="bi bi-person form-control-icon "  ></i>
                                    <input type="text" className="form-control " placeholder="Username" name="user"  onChange={(e) => setuser(e.target.value)}/>
                                    </div>
                                    
                                </div>
                            </div>
                              <div className="input-group form-group">
                                <div className="mb-3">
                                    
                                        <label htmlFor="password" className="form-label text-white fw-bold">Contraseña:</label>
                                        <div className="form-group py-1 pb-2">
                                        <i className="bi bi-lock form-control-icon " ></i>  
                                        <input type="password" className="form-control" placeholder="Password" name="password" onKeyDown={(e)=>pressEnter(e)}   onChange={(e)=>setpassword(e.target.value)}/>
                                        </div>
                                </div>
                                
                            </div>                           
                            <div className="d-grid mb-10">
                                <div>
                                    <input type="submit" value="Iniciar Sesión" className="btn btn-secondary w-100 my-100" onClick={()=> loguear()}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
            
</div>


         
        );
    
}
export default Login;