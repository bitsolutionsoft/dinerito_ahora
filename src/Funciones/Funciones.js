const ConvetirPlanAData=(data)=>{
return data.map((item,index)=>{
    return {id:item.idplan, name:'Cantidad: '+item.monto+" Interes: "+item.interes+'%'}
})
}
const ConvetirClAData=(data)=>{
    return data.map((item)=>{
        return{id:item.idcliente, name:item.nombre+' '+ item.apellido}
    })
    }
    const ConvetirEmpanAData=(data)=>{
        return data.map((item)=>{
            return{id:item.idempleado, name:item.nombre+' '+ item.apellido}
        })
        }
        const Obtenercliente=(data,id)=>{
          for (let i in data){
            if(data[i].idcliente === id){
                return data[i];
            }
          }
           
        }
        const ObtenerEmpleado=(data,id)=>{
            for (let i in data){
              if(data[i].idempleado === id){
                  return data[i];
              }
            }
             
          }
          const ObtenerPlan=(data,id)=>{
            for (let i in data){
              if(data[i].idplan === id){
                  return data[i];
              }
            }
             
          }

export {ConvetirPlanAData, ConvetirClAData,ConvetirEmpanAData, Obtenercliente,ObtenerPlan,ObtenerEmpleado};