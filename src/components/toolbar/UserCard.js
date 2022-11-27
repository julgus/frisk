import React from 'react'; 
import '../../App.css';
import logo from '../../user-1.jpg'; 

function UserCard(props) {
    return (<div className='UserCard'>
        <img src={logo} alt="Logo" className='patientImg'/>
        <div className='patient-data'>
            <h3>{props.name}</h3>
            <h4>{props.id}</h4>
        </div>
    </div>); 
}

export default UserCard;