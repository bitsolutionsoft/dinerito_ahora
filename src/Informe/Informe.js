
import { Chart, LineController, LineElement, PointElement, LinearScale, Title,CategoryScale } from 'chart.js'

import Datos from "../Host/Datos";
import React, { useState,useEffect } from 'react';
import moment from "moment";
import swal from "sweetalert";
import '../css/estilo.css'


function Informe(props)  {

  Chart.register(LineController, LineElement, PointElement, LinearScale, Title,CategoryScale);

  const [fechainicio, setfechainicio] = useState("");
  const [fechaFinal, setfechaFinal] = useState("");

  //const [datosVentas, setdatosVentas] = useState([]);
  const [datosGanacias, setdatosGanacias] = useState([]);
  const[datosCredito, setDatosCredito] =useState([]);
  

const [myChart, setmyChart] = useState("")

const [detalle, setDetalle] = useState([]);


  useEffect(() => {
//datosGrafica();
}, [])

const traducir = (params) => {

  switch (params.toString().toLowerCase()) {
    case "monday":
      return "lunes";
    case "tuesday":
      return "martes";
    case "wednesday":
      return "miercoles";
    case "thursday":
      return "jueves";
    case "friday":
      return "viernes";
    case "saturday":
      return "sabado";
    case "sunday":
      return "domingo";
    case "january":
      return "enero";
    case "february":
      return "febrero";
    case "march":
      return "marzo";
    case "april":
      return "abril";
    case "may":
      return "mayo";
    case "june":
      return "junio";
    case "july":
      return "julio";
    case "august":
      return "agosto";
    case "september":
      return "septiembre";
    case "october":
      return "octubre";
    case "november":
      return "noviembre";
    case "december":
      return "diciembre";
    default:
      return params;
      
  }
  
}

const verInforme = (params) => {
  switch(params){
    case "Dia":
      informeCuenta(0,moment(new Date()).format("YYYY-MM-DD"),moment(new Date()).format("YYYY-MM-DD"),"dia")
      balance(0,moment(new Date()).format("YYYY-MM-DD"),moment(new Date()).format("YYYY-MM-DD"),"dia")
     // infoVentas(0,moment(new Date()).format("YYYY-MM-DD"),moment(new Date()).format("YYYY-MM-DD"),"ventaxsem")
      break;
      case "Semana":
        informeCuenta(0,moment(new Date()).format("YYYY-MM-DD"),moment(new Date()).format("YYYY-MM-DD"),"semana")
        balance(0,moment(new Date()).format("YYYY-MM-DD"),moment(new Date()).format("YYYY-MM-DD"),"semana")
       // infoVentas(0,moment(new Date()).format("YYYY-MM-DD"),moment(new Date()).format("YYYY-MM-DD"),"ventaxmes")
        break;
        case "Mes":
          informeCuenta(0,moment(new Date()).format("YYYY-MM-DD"),moment(new Date()).format("YYYY-MM-DD"),"mes")
          balance(0,moment(new Date()).format("YYYY-MM-DD"),moment(new Date()).format("YYYY-MM-DD"),"mes")
         // infoVentas(0,moment(new Date()).format("YYYY-MM-DD"),moment(new Date()).format("YYYY-MM-DD"),"ventaxanio")
          break;
          case "Rango":
            if(fechaFinal !=="" && fechainicio !==""){
            informeCuenta(0,moment(fechainicio).format("YYYY-MM-DD"),moment(fechaFinal).format("YYYY-MM-DD"),"rango")
            balance(0,moment(fechainicio).format("YYYY-MM-DD"),moment(fechaFinal).format("YYYY-MM-DD"),"rango")
           // infoVentas(0,moment(fechainicio).format("YYYY-MM-DD"),moment(fechaFinal).format("YYYY-MM-DD"),"ventaxran")
            }else{
              swal("Aviso","Por favor de seleccionar la fecha inical y fecha final", "success");
            }
            break; 
            default:
            break;
  }
  
}

/*
async function verDetalle (item,e)  {
 
  let detalle=await DataDetalle.consultarDetalle(item.idfactura);
  if(detalle !== null){
    console.log(detalle)
      if(detalle.message ==="Success"){
          setDetalle(detalle.res)
      }
  }
  
  var myInput = document.getElementById("exampleModal");
  e.addEventListener("shown.bs.modal", function () {
    myInput.focus();
  });
}
*/
const informeCuenta = async(idfac,fecha1,fecha2,accion)=>{
  let informe={
    "id": idfac,
    "finicial":fecha1,
    "ffinal":fecha2,
    "accion":accion,
  }
  let datainforme=await Datos.consultarInforme("informe",informe);
  console.log(datainforme)
  if(datainforme!== null){
    if(datainforme.message==="Success"){
      setDatosCredito(datainforme.res)
    }
  }

}

const balance=async(idfac,fecha1,fecha2,accion)=>{
  let informe={
    "id": idfac,
    "finicial":fecha1,
    "ffinal":fecha2,
    "accion":accion,
  }
  let databalance=await Datos.consultarInforme('balance',informe);
  console.log(databalance)
  if(databalance!== null){
    if(databalance.message==="Success"){
      setdatosGanacias(databalance.res)
    }
  }

}

async function infoVentas(idfac,fecha1,fecha2,accion){
  let informe={
    "id_fac": idfac,
    "fech1":fecha1,
    "fech2":fecha2,
    "accion":accion,
  }
  let dventas=await Datos.consultarInforme(informe);
  console.log(dventas)
  if(dventas!== null){
    if(dventas.message==="Success"){
    
      //setdatosinfoVentas(dventas.res)
      //setdataDatos(returnData(dventas.res));
      //setlabelsDatos(returnLabel(dventas.res));
graficarDatos(dventas.res);
     
    }
  }

}
  const returnLabel = (datos) => {
    let labels=[];
    datos.map(item=>{
      labels.push(traducir(item.nombre));
      return true;
    })
    return labels;
  }
  
const returnData = (datos) => {
  let data=[];
  datos.map(item=>{
    console.log(item.total)
    data.push(item.total);
    return true;
  })
  return data;
}



  const graficarDatos = (datos) => {
/**configuracion de  la grafica */ 
//etiquetas
const labels = returnLabel(datos);
console.log(labels)
//datos
const data = {
  labels: labels,
  datasets: [
    {
      label: 'Ventas',
      data:returnData(datos),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor:'rgb(54, 162, 235)',
      yAxisID: 'y',
    },
  
  ]
};
//configuracion de la grafica
    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: "Ventas"       
           }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
    
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        }
      },
    };

    //obtner el id del canva de la grafica
    const ctx = document.getElementById('myChart').getContext('2d');
    //crear grafica y mardar los parametros
  

let chart = Chart.getChart('myChart');
if (typeof chart !== 'undefined') {
  chart.destroy() // Does not show anything because of this line, comment it out to show again
}
setmyChart( new Chart(ctx,config));

 
   
  }
  const abriFecha = (e) => { 
  let myInput = document.getElementById("exampleFecha");
  e.target.addEventListener("shown.bs.modal", function () {
    myInput.focus();
  });
}

return(
<div className="container-fluid m-0 p-0 vh-100">
  <div className="mb-1">   
    <h5>Informe</h5>
  </div>
  <div className='row'>
      <div className='mb-1 ' >
          <h6>Informe Por:</h6>
              <div className="row d-flex"> 
               <div className="form-check form-check-inline">
               <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="Por Dia"  onClick={(e)=>verInforme("Dia")}/>
                  <label className="form-check-label" htmlFor="exampleRadios1">Hoy</label>
               </div>
               <div className="form-check form-check-inline">
                 <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="Por semana"  onClick={(e)=>verInforme("Semana")} />
                 <label className="form-check-label" htmlFor="exampleRadios2">Semana</label>
               </div>
               <div className="form-check form-check-inline">
                 <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios3" value="Por mes"  onClick={(e)=>verInforme("Mes")}/>
                 <label className="form-check-label" htmlFor="exampleRadios3">Mes</label> <br/>
               </div> 
               <div className="form-check form-check-inline">
                 <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios3" data-bs-toggle="modal" data-bs-target="#exampleFecha" onClick={(e)=>abriFecha(e)}/>
                 <label className="form-check-label" htmlFor="exampleRadios3">Rango de fecha</label> <br/>
               </div> 
               </div>         
            </div>

      </div>
 
  </div>

  {/**modal tango de fecha */}
  <div
          className="modal fade"
          id="exampleFecha"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden={true}
        >
  <div className="modal-dialog modal-dialog-scrollable">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Rango de fecha</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <div className="input-group input-group-sm  mb-1 " >
                <span className="input-group-text">Inicio</span>
                <input type="date" className="form-control form-control-sm" placeholder='01/02/2022' value={fechainicio} onChange={(e)=>setfechainicio(moment(e.target.value).format("YYYY-MM-DD"))}/>
            </div>
            <div className="input-group input-group-sm  mb-1 ">
                <span className="input-group-text">Final</span>
                <input type="date"  className="form-control form-control-sm"  placeholder='01/02/2022' value={fechaFinal} onChange={(e)=>setfechaFinal(moment(e.target.value).format("YYYY-MM-DD"))}/>
            </div>

   
      </div>
      <div className="modal-footer">
      <button type="button" className="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancelar</button>
      <button type="button" className=" btn btn-sm btn-warning" data-bs-dismiss="modal" onClick={()=>verInforme("Rango")} >Aceptar</button>
      </div>
    </div>
  </div>
</div>
  {/**final del modal rango de fecha */}
<div>
  <h6>Informe de credito</h6>
<div >
{datosCredito.length > 0   ?  datosCredito.map((item,key) =>(
    <div className='contain-status' key={key}>
 <div className='div-ventas'>
<label className='title-card-info'>Credito Nuevo</label>
<label className='desc-card-info'>{item.nuevo }</label>
<div class="progress">
  <div class="progress-bar progress-bar-striped progress-bar-animated " role="progressbar" style={{width: item.nuevo}} aria-valuenow={item.nuevo} aria-valuemin="0" aria-valuemax={item.activo}>{item.nuevo +"%"}</div>
</div>
 </div>
 <div className='div-ventas'>
 <label className='title-card-info'>Credito Activo</label>
<label className='desc-card-info'>{item.activo }</label>
<div class="progress">
  <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: item.activo}} aria-valuenow={item.activo} aria-valuemin="0" aria-valuemax={item.activo}>{item.activo +"%"}</div>
</div>
 </div>
 <div className='div-ventas'>
 <label className='title-card-info'>Credito Moroso</label>
<label className='desc-card-info'>{item.moroso}</label>
<div class="progress">
  <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: item.moroso}} aria-valuenow={item.moroso} aria-valuemin="0" aria-valuemax={item.activo}>{item.moroso +"%"}</div>
</div>
 </div></div>
 )) 

 : 

 <div className='contain-status' >
 <div className='div-ventas'>
<label className='title-card-info'>Credito Nuevo</label>
<label className='desc-card-info'>0</label>
 </div>
 <div className='div-ventas'>

 <label className='title-card-info'>Credito Activo</label>
<label className='desc-card-info'>0</label>
 </div>
 <div className='div-ventas'>

 <label className='title-card-info'>Credito Moroso</label>
<label className='desc-card-info'>0</label>
 </div>
 </div>
 }
  
</div>
</div>

<div>
  <h6>Estado de credito</h6>
<div >
{datosGanacias.length > 0   ?  datosGanacias.map((item,key) =>(
    <div className='contain-status' key={key}>
 <div className='div-inversion'>
<label className='title-card-info'>Cantida de credito</label>
<label className='desc-card-info'>{item.credito > 0 ? item.cedito.toFixed(2) : 0}</label>
 </div>
 <div className='div-inversion'>
 <label className='title-card-info'>Cantidad cobrada</label>
<label className='desc-card-info'>{item.cobrado > 0 ? item.cobrado.toFixed(2) : 0}</label>
 </div>
 <div className='div-inversion'>
 <label className='title-card-info'>Cantidad pediente</label>
<label className='desc-card-info'>{item.pendiente > 0 ? item.pendiente.toFixed(2) : 0}</label>
 </div>
 <div className='div-inversion'>
 <label className='title-card-info'>Ganancia </label>
<label className='desc-card-info'>{item.ganancia > 0 ? item.ganancia.toFixed(2) : 0}</label>
 </div>
 </div>
 )) 

 : 

 <div className='contain-status' >
 <div className='div-inversion'>
<label className='title-card-info'>Cantidad de Credito</label>
<label className='desc-card-info'>0</label>
 </div>
 <div className='div-inversion'>

 <label className='title-card-info'>Cantidada cobrada</label>
<label className='desc-card-info'>0</label>
 </div>
 <div className='div-inversion'>

 <label className='title-card-info'>Cantidad  pediente</label>
<label className='desc-card-info'>0</label>
 </div>
 
 <div className='div-inversion'>
 <label className='title-card-info'>Ganancia </label>
<label className='desc-card-info'>0</label>
 </div>
 </div>
 }
  
</div>
</div>
<div className="row vh-70">


<div className=" h-100 ">
  <h5>Historial de ventas</h5>
  <div className="div-table">
<div className="table-wrap">
<table className="table-item">
  <thead >
          <tr>
          <th>#</th>
            <th>Fecha</th>
            <th>Cliente</th>
             <th>Total vendido</th>
             <th>Detalle</th>
           
          </tr>
        </thead>
       <tbody>
  {datosCredito ?
datosCredito.map((item,index)=>(
  <tr  key={index} > 
  <td>{item.idfactura}</td>           
  <td>{moment.utc(item.fecha).format("DD/MM/YYYY")}</td>
  <td>{item.cliente}</td> 
  <td>{item.total}</td>
 {/** <td ><button  type="button" className="btn btn-sm-outline-info" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e)=>verDetalle(item,e.target)}><i style={{color: "#FABC2A"}} className="fa fa-info-circle gb-primary" aria-hidden="true"></i></button></td>
*/} </tr>
))

: null
}
</tbody>
      </table>
</div>
</div>
</div>

</div>
 
{/**modal de detalle producto */}
<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Detalle de la venta</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <div className="table-wrap">
      <table className="table-item">
        <thead >
            <tr>
              <th>#</th>
              <th>Descripcion</th>
              <th>Rollo</th>
              <th>Yarda</th>
              <th>Precio </th>
              <th>Subtotal </th>
            </tr>
          </thead>
         <tbody>
        { detalle ?
             detalle.map((item, index) =>(
              <tr key={index} >
                 <td>{item.idfactura}</td>
                 <td>{item.descripcion}</td>
                  <td>{item.rollo}</td>
                 <td>{item.yarda}</td>  
                 <td>{item.precio}</td>
                 <td>{item.total}</td>
               </tr>
             )) 
             : null
             
        
             }
        
         </tbody>
        </table>

      </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Salir</button>
      
      </div>
    </div>
  </div>
</div>
{/**finañ del modal */}

 </div>

    );
}

export default Informe;