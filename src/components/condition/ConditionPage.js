import React, {useState, useEffect} from 'react'; 
import { Helmet } from 'react-helmet';
import moment from 'moment';

import { FhirClientContext } from 'src/FhirClientContext';
import { Box, Container, CircularProgress, autocompleteClasses, Skeleton } from '@material-ui/core';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';

import { ConstructionOutlined } from '@material-ui/icons';
import PageSkeleton from '../loading/PageSkeleton';

const capitalize = sentence => {
  const words = sentence.toLowerCase().split(" ");

  for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  
  return words.join(' ');    
}

const Conditions = (props) => (
  <>
    {Array.from(props.conditions)
       .sort((a, b) => moment(b.recordedDate) - moment(a.recordedDate))
      .map((condition, index) => (
      <Box className='ConditionCard' key={index}
          sx={{
            minHeight: '100%',
            background: '#FFFFFF',
            borderRadius: '5px', 
            p: 0,
            my: 2, 
          }}
      >
      <div>
        <div id={`c${condition.code.coding[0].code}`} className="ConditionHeader">
          <div className='flex-group'>
            <div className="condition-name">
              <div className="">
                <p>Name and type</p>
                <div className="flex-group">
                  <h2>{condition.code.text}</h2>
                  <div style={{marginLeft: '10px'}} className={condition.verificationStatus.coding[0].code}>{condition.verificationStatus.coding[0].code}</div>
                  <div style={{marginLeft: '10px'}} className={condition.clinicalStatus.coding[0].code}>{condition.clinicalStatus.coding[0].code}</div>
                </div>
                <p style={{marginTop: '10px'}}>Health clinic</p>
                <h3>{capitalize(condition.encounter.serviceProvider.name)}</h3>
                <p style={{marginTop: '10px'}}>Diagnosed by</p>
                <h3>{condition.encounter.participant[0].individual.name[0].prefix[0] + " " + condition.encounter.participant[0].individual.name[0].given[0] + " " + condition.encounter.participant[0].individual.name[0].family}</h3>
              </div>
            </div>
          </div>
          <div className='flex-group'>
            <div>
              <AccessTimeIcon style={{width: '25px', height: '25px', marginRight: '10px'}}/>
            </div>
            <div className="date">
              <p>Diagnosed</p>
              <h3>{moment(condition.recordedDate).format('LL')}</h3>
              {(() => {
                if (condition.clinicalStatus.coding[0].code == "resolved") {
                  return (
                    <div style={{marginTop: '10px'}} className="date">
                      <p>Resolved</p>
                      <h3>{moment(condition.abatementDateTime).format('LL')}</h3>
                    </div>
                  );
                }})()
              }
            </div>
          </div>
        </div>
      </div>
      </Box>
    ))}
  </>
);

export default class ConditionPage extends React.Component {
    static contextType = FhirClientContext;

    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          error: null,
          conditions: null,
          userName: 'Julia', 
          email: ""
        };
      }

      componentDidMount() {
        const client = this.context.client;
        const queryMed = new URLSearchParams();
        queryMed.set('patient', client.patient.id);
        this.setState({loading: true});
        const getPath = client.getPath;
  
        queryMed.set('_count', 100);
        this._loader = client.request('/Condition?' + queryMed, {
          resolveReferences: ["encounter",  "encounter.serviceProvider", "encounter.participant", "encounter.participant.0.individual"],
          pageLimit: 0, // get all pages
          flat: true // return flat array of Observation resources
        }).then(data => {            
            const conditions = client.getPath(data, "");
            console.log(conditions);
            this.setState({
              loading: false,
              conditions: conditions, 
              error: null 
            });
            this.scrollToElement();
        })
        .catch(error => {
          this.setState({error, loading: false})
        }); 
      }

      getRef() {
        return window.location.hash.slice(1) != "" ? window.location.hash.slice(1) : ""; 
      }

      render() {
        const { error, loading, meds } = this.state;
        if (loading) {
          return (
            <PageSkeleton display="row"/>
          );
        }
        if (error) {
          console.log(error.message);
          return error.message;
        }
        return (
          <div className="ConditionPage">
            <Conditions conditions={this.state.conditions} />
          </div>
       );      
    }

    scrollToElement = () => {
      const element = document.getElementById(this.getRef());
      if (element) {
        element.scrollIntoView(); 
        element.classList.add("selected-card");
        window.history.pushState({}, document.title, "/" + "portal/conditions");
      }
    }

}
