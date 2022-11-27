import React from 'react';
import {
  CircularProgress,
} from '@material-ui/core';

import LoginPage from './LoginPage';
import UserCard from '../components/toolbar/UserCard';
import Sidebar from '../components/nav/Sidebar';
import Toolbar from '../components/nav/Toolbar';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { FhirClientContext } from 'src/FhirClientContext';
import VaccinationPage from 'src/components/vaccination/VaccinationPage';
import MedsPage from 'src/components/medication/MedsPage';
import LabPage from 'src/components/lab/LabPage';
import { getPageName } from 'src/components/nav/SidebarLinks';
import ConditionPage from 'src/components/condition/ConditionPage';

export default class Portal extends React.Component {
    static contextType = FhirClientContext;

    constructor(props) {
      super(props);
      this.state = {
        page: props.page,
        loading: true,
        error: null,
        data: null, 
        id: '950103-5704',
        userName: 'Julia Gustafsson', 
        email: "adssad",
        loginError: "", 
        warning: ""
      };
    }

    componentDidMount() {
      //this.getVitals();
    }

    render() {
      const defaultPatient = {
        email: "jgustafsson6@gatech.edu", 
        password: "password" 
      }
  
      const Login = details => {
        console.log("login");
        if (details.email === defaultPatient.email && details.password === defaultPatient.password) {
            this.setState({ userName: details.name, email: details.email });
        } else {
            this.setState({ loginError: "Invalid credentials, please try again.", loading: false });
        }
      }

      const Logout = details => {
            this.setState({userName: "", email: ""}); 
      }

      const {
        error, loading
      } = this.state;

      if (error) {
        console.log(error.message);
        return error.message;
      }

      return (
        <div className="App">
          {(this.state.email !== "") ? (
            <div>
              <Toolbar name={this.state.userName} id={this.state.id} title={getPageName(this.state.page)}/>
              <Sidebar/>
              <div className="Content">
                 {(this.state.page == "home") ? 
                    (<div className="Toolbar">
                      <div>
                        <h1>Welcome back, {this.state.userName}!</h1>
                      </div>
                      <UserCard name={this.state.userName} id="950103-5704"></UserCard>
                    </div>) : ("") 
                 } 
                  <div className="Page">
                  {(this.state.page == "vaccination") ? 
                      (<VaccinationPage/>) : ("") 
                  } 
                  {(this.state.page == "medication") ? 
                      (<MedsPage/>) : ("") 
                  } 
                  {(this.state.page == "labresults") ? 
                      (<LabPage/>) : ("") 
                  } 
                  {(this.state.page == "conditions") ? 
                      (<ConditionPage/>) : ("") 
                  } 
                  </div>
                </div>
            </div> ) : (
               <LoginPage login={Login} error={this.state.loginError}/>
            )}
        </div> 
      );
    }
}
