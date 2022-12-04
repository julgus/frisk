import React from 'react' 
import '../../App.css'
import { SidebarLinks } from './SidebarLinks'
import logo from '../../img/hospital.png'; 
import UserCard from './UserCard';

function Toolbar(props) {
    return (
        <div className='Toolbar'>
            <div className="friskLogo">
                <img src={logo} alt="Logo" className='logo'/>
                <h1>Frisk</h1>
            </div>
            <div className='title'>
                <h1>{props.title}</h1>
                <UserCard name={props.name} id={props.id} gender={props.gender}/>
            </div>
        </div>
    ); 
}

export default Toolbar;