import { set } from 'local-storage';
import React,{useEffect, useState} from 'react'
import swal from 'sweetalert';
import Datos from '../Host/Datos';

function Ajuste() {
const [Nombre,setNombre]=useState();
const [Descripcion,setDescripcion]=useState("");
const [Direccion,setDireccion]=useState("");
const [Mora,setMora]=useState("");
const [DiasMora,setDiasMora]=useState("");
useEffect(()=>{
    ConsultarInfo();
},[])

const ConsultarInfo =async () => { 
let datos=await Datos.Consulta("ajuste");
if(datos!==null){
    if(datos.message==="Success"){
        setNombre(datos.res[0].nombre);
        setDescripcion(datos.res[0].descripcion);
        setDireccion(datos.res[0].direccion);
        setDiasMora(datos.res[0].diasmora);
        setMora(datos.res[0].mora);
    }
}
}
const GuardarCambios = async() => { 
    let datos={
        nombre:Nombre,
        descripcion:Descripcion,
        direccion:Direccion,
        mora:Mora,
        diasmora:DiasMora

    }
    let info=await Datos.ActualizarReg("ajuste",datos)
    if(info!==null){
        if(info.message==="Success"){
            swal("","Información actualizado","success");
            ConsultarInfo();
            return
        }
        swal("","No se pudo Actuliazar la infomración","error");
    }

 }
  return (
    <div>
        
      <div className="modal-body">
      <div className="form-outline mb-4">
         <label className="form-label" htmlFor="form1Example1"  >Nombre de la Empresa</label>   
    <input type="text" id="form1Example1" className="form-control"  value={Nombre} onChange={(e) => setNombre(e.target.value)} />

  </div>
  <div className="form-outline mb-4">
     <label className="form-label" htmlFor="form1Example1" >Descripcion</label>
     <input type="text" id="form1Example1" className="form-control" value={Descripcion}  onChange={(e) => setDescripcion(e.target.value)} />
   
  </div>
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Direccion de la empresa</label>
        <input type="text" id="form1Example1" className="form-control" value={Direccion}  onChange={(e) => setDireccion(e.target.value)} />

  </div>
 
  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Se aplicará mora a los pagos atrasados despues de haber transcurrido:</label>
 <div className="input-group mb-3">
  <input type="text" id="form1Example1" className="form-control" value={DiasMora}  onChange={(e) => setDiasMora(e.target.value)} />
  <span className="input-group-text">Días</span>
</div>
  </div>

  <div className="form-outline mb-4">
       <label className="form-label" htmlFor="form1Example1" >Monto de la mora</label>
        <input type="text" id="form1Example1" className="form-control" value={Mora}  onChange={(e) => setMora(e.target.value)} />

  </div>
  
  <div className="modal-footer">
      
        <button type="button" className="btn btn-primary" onClick={()=>GuardarCambios()} >Guardar Cambios</button>
      </div>
  

      </div>
    </div>
  )
}

export default Ajuste