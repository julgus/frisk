import React, {useState} from 'react'; 
import moment from 'moment';
import { FhirClientContext } from 'src/FhirClientContext';
import { Box, Container } from '@material-ui/core';
import Meds from './Meds';
import { ArrowForward } from '@material-ui/icons';
import PageSkeleton from '../loading/PageSkeleton';

const capitalize = sentence => {
  const words = sentence.toLowerCase().split(" ");

  for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  
  return words.join(' ');    
}

const Medications = (props) => (
  <>
    {Array.from(props.types).map((type, index) => (
      <Box className='MedicationCard' key={type} style={{marginTop: 0}}
          sx={{
            minHeight: '100%',
            background: '#FFFFFF',
            borderRadius: '5px', 
            p: 0,
            my: 2, 
          }}
      >
      <div>
        <div id={`m${type}`} className="MedicationHeader" onClick={toggle}>
          <div className='flex-group'>
              <div className="plus-icon">
              </div>
            <div className="medication-name">
              {(() => {
                      const med = props.medications
                        .sort((a, b) => moment(b.authoredOn) - moment(a.authoredOn))
                        .filter(med => med.medicationCodeableConcept.coding[0].code == type)[0]
                      return <div className="">
                                <p>Name and type</p>
                                <div className="flex-group">
                                  <h2>{med.medicationCodeableConcept.text}</h2>
                                  <div style={{marginLeft: '10px'}} className={med.status}>{med.status}</div>  
                                </div>
                                <p style={{marginTop: '10px'}}>Treatment for</p>
                                <h3><a className="link" href={`/portal/conditions#c${med.reasonReference[0].code.coding[0].code}`}>{med.reasonReference[0].code.coding[0].display ? med.reasonReference[0].code.coding[0].display : "Not known"}<ArrowForward /></a></h3>
                                <p style={{marginTop: '10px'}}>Prescribed by</p>
                                <h3>{med.encounter.participant[0].individual.name[0].prefix[0] + " " + med.encounter.participant[0].individual.name[0].given[0] + " " + med.encounter.participant[0].individual.name[0].family}</h3>
                                <p style={{marginTop: '10px'}}>Health Clinic</p>
                                <h3>{capitalize(med.encounter.serviceProvider.name)}</h3>
                            </div>;
                      })()
              }
            </div>
          </div>
        </div>
        <Container className="vaccine-details" style={{display: 'none', margin: '0px', padding: '0px'}} maxWidth={false}>
            <Box sx={{m: 0, p: 0}}>
              <Meds medications={props.medications.filter((med) => med.medicationCodeableConcept.coding[0].code == type)} />
            </Box>
        </Container>
      </div>
      </Box>
    ))}
  </>
);

const toggle = (e) => {
  var target = e.target; 

  if (target.classList.contains("link")) {
    return; 
  }
  
  while (target.id == "") {
    target = target.parentNode; 
  }  

  var div = document.getElementById(target.id); 
  if (div.parentNode.lastElementChild.style.display == 'none') {
    div.parentNode.lastElementChild.style.display = "block";
    var icon = div.getElementsByClassName("plus-icon")[0];
    icon.className = "minus-icon";
  } else {
    div.parentNode.lastElementChild.style.display = "none";
    var icon = div.getElementsByClassName("minus-icon")[0];
    icon.className = "plus-icon";
  }
}


export default class MedsPage extends React.Component {
    static contextType = FhirClientContext;

    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          error: null,
          medications: null,
          medicationTypes: null
        };
      }

      componentDidMount() {
        const client = this.context.client;
        const queryMed = new URLSearchParams();
        queryMed.set('patient', client.patient.id);
        this.setState({loading: true});
        const getPath = client.getPath;
  
        queryMed.set('_count', 100);
        queryMed.set('_sort', '-date');
        this._loader = client.request('/MedicationRequest?' + queryMed, {
          resolveReferences: ["medicationReference", "encounter", "encounter.serviceProvider", "reasonReference.0", "encounter.participant.0.individual"],
          pageLimit: 0, // get all pages
          flat: true // return flat array of Observation resources
        }).then(data => {            
            const meds = client.getPath(data, "");
            console.log(meds); 
            this.setState({
              loading: false,
              medications: meds,
              medicationTypes: new Set(meds.sort((a, b) => a.status.localeCompare(b.status)).map(med => med.medicationCodeableConcept.coding[0].code)), 
              error: null 
            });
            this.scrollToElement();
        })
        .catch(error => {
          this.setState({error, loading: false})
        });
      }

      scrollToElement = () => {
        const element = document.getElementById(this.getRef());
        if (element) {
          element.scrollIntoView(); 
          element.classList.add("selected-card");
          window.history.pushState({}, document.title, "/" + "portal/medication");
        }
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
          <div className="MedicationsPage">
              <Medications medications={this.state.medications} types={(this.state.medicationTypes)}/>
          </div>
       );      
    }
}
