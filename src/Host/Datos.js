import host from "../Host/Host";
import Header from "../Host/Header";

class Datos{
    Consulta(table){
        return fetch(`${host+table}/view`,Header.headerGets())
        .then(response => response.json())
        .then((respDatos)=>respDatos)
        .catch((error) =>error);
    }

    ConsutaID(table, id){
        return fetch(`${host+table}/view/${id}`,Header.headerGets())
        .then(response=>response.json())
        .then((respDatos) => respDatos)
        .catch((error) =>error);
    }
    NuevoReg(table,datos){
        return fetch(`${host+table}`,Header.headerPostCB(datos))
        .then(response =>response.json())
        .then((respDatos)=> respDatos)
        .then((error)=>error);
    }
    ActualizarReg(table,datos){
        return fetch(`${host+table}/update`,Header.headerPostCB(datos))
        .then(response =>response.json())
        .then((respDatos)=>respDatos)
        .catch((error)=>error);
    }
    BorrarReg(table, id){
        return fetch(`${host+table}/delete/${id}`,Header.headerPostSB())
        .then(response=>response.json())
        .then((respDatos)=>respDatos)
        .catch((error)=>error);
    }
    ConsultaUser(data){
        return fetch(`${host}usuario/login`,Header.headerPostCBL(data))
        .then(respnse =>respnse.json())
        .then(respDatos =>respDatos)
        .catch((error)=>error);
    }
    ConsultaPermiso(id){
        return fetch(`${host}permiso/emp/${id}`,Header.headerGets())
        .then(response=>response.json())
        .then((respDatos)=>respDatos)
        .catch((error)=>error);
    }
}
export default new Datos();