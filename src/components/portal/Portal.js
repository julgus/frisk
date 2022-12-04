import React from 'react';
import {
  CircularProgress,
} from '@material-ui/core';

import LoginPage from '../login/LoginPage';
import Sidebar from '../nav/Sidebar';
import Toolbar from '../nav/Toolbar';
import { FhirClientContext } from 'src/FhirClientContext';
import VaccinationPage from 'src/components/vaccination/VaccinationPage';
import MedsPage from 'src/components/medication/MedsPage';
import LabPage from 'src/components/lab/LabPage';
import { getPageName } from 'src/components/nav/SidebarLinks';
import ConditionPage from 'src/components/condition/ConditionPage';
import VitalsPage from 'src/components/vitals/VitalsPage';

export default class Portal extends React.Component {
    static contextType = FhirClientContext;

    constructor(props) {
      super(props);
      this.state = {
        page: props.page,
        loading: true,
        error: null,
        patient: null,
        data: null, 
        id: '950103-5704',
        userName: 'Julia Gustafsson', 
        email: "adssad",
        loginError: "", 
        warning: ""
      };
    }

    componentDidMount() {
        const client = this.context.client;
        this.setState({loading: true});
        const getPath = client.getPath;

        var patient = 'Patient/' + this.context.client.patient.id; 
        console.log(patient); 
  
        this._loader = client.request(patient)
          .then(data => {            
            const patient = client.getPath(data, "");
            console.log(patient); 
            this.setState({
              loading: false,
              patient: patient,
              error: null 
            });
        })
        .catch(error => {
          this.setState({error, loading: false})
        });
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

      if (loading) {
        return (
          <CircularProgress />
        );
      }
    
      return (
        <div className="App">
          {(this.state.email !== "") ? (
            <div>
              <Toolbar name={this.state.patient.name[0].given[0] + " " + this.state.patient.name[0].family} id={this.state.patient.birthDate} gender={this.state.patient.gender} title={getPageName(this.state.page, this.state.patient.name[0].given[0])}/>
              <Sidebar/>
              <div className="Content">
                 {(this.state.page == "home") ? 
                    (<h1>Dashboard</h1>) : ("")}
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
                  {(this.state.page == "vitalsigns") ? 
                      (<VitalsPage/>) : ("") 
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
