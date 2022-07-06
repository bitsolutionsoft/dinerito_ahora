import React, {useState } from 'react'
import '../css/styleDrop.css'

function DropDown( props) {
    const[open,setOpen] =useState(false);


//      <div className={open ? 'open' : 'arrow'}>
  return (
    <div className='dropdown_s'
    onClick={()=>setOpen(!open)}
    >
        <div className='input-group mb-2 '>

                <input type='text' 
                className='form-control'
                placeholder={open ? 'Buscar...' : 'Seleccionar...'}
                value={props.value}
                onChange={props.onChange}
                />
            {
                open ? <i className="bi bi-caret-up-fill input-group-text"></i> : <i className="bi bi-caret-down-fill input-group-text"></i>
                }
           

        </div>
        <div className={open ? 'open' : 'options'}>
            {props.dato ? props.dato.map((item,index)=>(
                    <div key={index} className='option' onClick={()=>{
                        props.setValue(item.name) 
                        props.setSelected(item.id)}}>{item.name}</div>
                ))
                :
                null
            }
        </div>
    </div>
  )
}

export default DropDown