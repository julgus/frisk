import React from 'react' 
import '../../App.css'
import { SidebarLinks } from './SidebarLinks'
import logo from '../../img/hospital.png'; 

function Sidebar() {
    return (
        <div className='Sidebar'>
            <ul className='SidebarList'>
            {SidebarLinks.map((val, key) => {
                return (<li key={key} className='row' 
                onClick={()=>{
                    window.location.pathname = val.link
                    }}
                    >
                        <div className='icon'>{val.icon}</div>
                        <div className='title'>{val.title}</div>
                    </li>)
            })}
            </ul>
        </div>
    ); 
}

export default Sidebar;