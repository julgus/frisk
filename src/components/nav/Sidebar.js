import React from 'react' 
import '../../App.css'
import { SidebarLinks } from './SidebarLinks'
import logo from '../../img/hospital.png'; 
import LogoutIcon from '@mui/icons-material/Logout';

function Sidebar(props) {
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
            <div className="logout">
                <button className="logout-btn" onClick={props.logout}><LogoutIcon sx={{marginRight: 1}} />Log out</button>
            </div>
        </div>
    ); 
}

export default Sidebar;