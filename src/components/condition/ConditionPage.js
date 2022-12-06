import React, {useState, useEffect} from 'react'; 
import moment from 'moment';

import { FhirClientContext } from 'src/FhirClientContext';
import { Box } from '@material-ui/core';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ArrowForward } from '@material-ui/icons';

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
      .sort((a, b) => {return a.clinicalStatus.coding[0].code.localeCompare(b.clinicalStatus.coding[0].code)})
      .map((condition, index) => (
      <Box className='ConditionCard' key={index}
          sx={{
            minHeight: '100%',
            background: '#FFFFFF',
            borderRadius: '5px', 
            p: 0,
            mb: 2, 
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
                  <div style={{marginLeft: '10px'}} className={condition.clinicalStatus.coding[0].code}>{condition.clinicalStatus.coding[0].code}</div>
                </div>
                <p style={{marginTop: '15px'}}>Diagnosed by</p>
                <h3>{condition.encounter.participant[0].individual.name[0].prefix[0] + " " + condition.encounter.participant[0].individual.name[0].given[0] + " " + condition.encounter.participant[0].individual.name[0].family}</h3>
                <p style={{marginTop: '15px'}}>Health clinic</p>
                <h3>{capitalize(condition.encounter.serviceProvider.name)}</h3>
                 {(() => {
                      var meds = Array.from(props.medications)
                        .filter(med => med.reasonReference[0].code.coding[0].code == condition.code.coding[0].code);
                      if (meds.length > 0) {
                        var arr = []; 
                        arr.push(<p className="treatments">Active Treatments</p>); 
                        meds.forEach(med => {
                          console.log(med.medicationCodeableConcept.text);
                          arr.push(<h3><a className='link' href={`/portal/medication#m${med.medicationCodeableConcept.coding[0].code}`}>{med.medicationCodeableConcept.text}<ArrowForward /></a></h3>); 
                        });
                        return arr; 
                     }
                })()}
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
          medications: null, 
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
              loading: true,
              conditions: conditions, 
              error: null 
            });
            this._loader = client.request('/MedicationRequest?' + queryMed, {
              resolveReferences: ["medicationReference", "encounter", "reasonReference.0", "encounter.participant.0.individual"],
              pageLimit: 0, // get all pages
              flat: true // return flat array of Observation resources
            }).then(data => {            
                const meds = client.getPath(data, "");
                console.log(meds.filter(m => m.status == 'active')); 
                this.setState({
                  loading: false,
                  medications: meds.filter(m => m.status == 'active'),
                  error: null 
                });
                this.scrollToElement();
            }).catch(error => {
              this.setState({error, loading: false})
            }); 
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
            <Conditions conditions={this.state.conditions} medications={this.state.medications} />
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
