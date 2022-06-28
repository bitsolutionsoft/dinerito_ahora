
import React, { useState,useEffect } from 'react';
import md5 from "md5";
import swal from "sweetalert";
import SearchBar from '../Component/SearchBar';

function Empleado(props)  {
    const [idempleado, setidempleado] = useState("");
    const [nombre, setnombre] = useState("");
    const [apellido, setapellido] = useState("");
    const [dpi, setdpi] = useState(""); 
    const [telefono, settelefono] = useState("");
    const [correo, setcorreo] = useState("");
    const [estado, setestado] = useState("");
    const [datos, setdatos] = useState([]);  
    const [encontrado, setencontrado] = useState([]);
    const [buscar, setbuscar] = useState("");
    const [accion, setaccion] = useState("new");
    const [modulo, setmodulo] = useState([]);
    
  

    return(
        <div className="">
            </div>   

    );
        }
    export default Empleado;
    