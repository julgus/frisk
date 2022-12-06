import React, {useState} from 'react'; 
import logo from '../../img/hospital.png'; 

import { FhirClientContext } from 'src/FhirClientContext';

export default class LoginPage extends React.Component {

    static contextType = FhirClientContext;

    constructor(props) {
      super(props);
      this.state = {
        login: props.login, 
        loading: true,
        error: props.error,
        userName: '', 
        password: "",
        warning: ""
      };
    }

    submitHandler = e => {
      e.preventDefault(); 
      this.state.login({username: this.state.userName, password: this.state.password}); 
    }

    render() {
        
        return (
          <div className='LoginPage'>
              <div className="LoginPanel">
                  <div className="friskLogo">
                      <img src={logo} alt="Logo" className='logo'/>
                      <h1>Frisk</h1>
                  </div>
                  <form onSubmit={this.submitHandler}>
                    <div className="LoginForm"> 
                          <div className="form-group email">
                              <label htmlFor="email">E-mail address or username</label>
                              <input type="text" name="email" id="email" autoComplete="username" placeholder="E-mail address or username" onChange={e => this.state.userName = e.target.value}/>
                          </div>
                          <div className="form-group password">
                              <label htmlFor="password">Password</label>
                              <input type="password" name="password" id="Password" autoComplete="current-password" placeholder="Password" onChange={e => this.state.password = e.target.value}/>
                          </div>
                          <h4 className="errorMsg">{this.state.error}</h4>
                          <input className="submitBtn" type="submit" value="Login"></input>
                      </div>
                  </form>
              </div>
          </div>
        );

      }
}
