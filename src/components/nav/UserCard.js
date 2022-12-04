import React from 'react'; 
import '../../App.css';
import female from '../../img/user-1.jpg'; 
import male from '../../img/user-2.jpg'; 

function UserCard(props) {
    return (<div className='UserCard'>
        <img src={props.gender == 'male' ? male : female} alt="Logo" className='patientImg'/>
        <div className='patient-data'>
            <h3>{props.name}</h3>
            <h4>{props.id}</h4>
        </div>
    </div>); 
}

export default UserCard;