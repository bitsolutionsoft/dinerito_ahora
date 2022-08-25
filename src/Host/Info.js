import { Quetzal } from "../Funciones/Moneda";
import Datos from "./Datos";


const ConsultarInfo =async () => { 

    let datos=await Datos.Consulta("ajuste");
    if(datos!==null){
        if(datos.message==="Success"){
            return datos.res;
        }
    }
    }
const info=ConsultarInfo();

const Nombre=info.nombre;
const Descripcion=info.Descripcion;
const Direccion=info.Direccion;
const Desarrollador="BitSolutionSoft";
const Mora=Quetzal(info.mora);
const DiasPasado=info.diasmora;

export {Nombre, Descripcion,Desarrollador, Mora, DiasPasado,Direccion}