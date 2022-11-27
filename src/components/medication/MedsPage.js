import React, {useState} from 'react'; 
import { Helmet } from 'react-helmet';
import moment from 'moment';

import { FhirClientContext } from 'src/FhirClientContext';
import { Box, Container, CircularProgress, autocompleteClasses } from '@material-ui/core';
import Meds from './Meds';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { ConstructionOutlined } from '@material-ui/icons';
import PageSkeleton from '../loading/PageSkeleton';

const Medications = (props) => (
  <>
    {Array.from(props.medications).map((med, index) => (
      <Box className='MedicationCard' key={med.id}
          sx={{
            minHeight: '100%',
            background: '#FFFFFF',
            borderRadius: '5px', 
            p: 0,
            my: 2, 
          }}
      >
      <div>
        <div className="MedicationHeader" onClick={toggle}>
          <div className='flex-group'>
            <div className="plus-icon">
            </div>
            <div className="medication-name">
              <p>Name and type</p>
              <h3>{med.medicationCodeableConcept.coding[0].display}</h3>
              <div className={med.status}>{med.status}</div>
            </div>
          </div>
        </div>
        <Container className="medication-details" style={{display: 'block', margin: '0px', padding: '0px'}} maxWidth={false}>
            <Box sx={{m: 0, p: 0}}>
              <Meds medications={med}/>
            </Box>
        </Container>
      </div>
      </Box>
    ))}
  </>
);

const toggle = (e) => {
  var id = e.target.id; 
  var div = document.getElementById(id); 

  if (document.getElementById(id).parentNode.lastElementChild.style.display == 'none') {
    document.getElementById(id).parentNode.lastElementChild.style.display = "block";
    var icon = div.getElementsByClassName("plus-icon")[0];
    icon.className = "minus-icon";
  } else {
    document.getElementById(id).parentNode.lastElementChild.style.display = "none";
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
          resolveReferences: ["medicationReference", "encounter", "encounter.serviceProvider", "encounter.participant.0.individual"],
          pageLimit: 0, // get all pages
          flat: true // return flat array of Observation resources
        }).then(data => {            
            const meds = client.getPath(data, "");
            console.log(meds); 
            this.setState({
              loading: false,
              medications: meds,
              medicationTypes: new Set(meds.map(med => med.medicationCodeableConcept.coding[0].display)), 
              error: null 
            });
        })
        .catch(error => {
          this.setState({error, loading: false})
        });
      }

      //  <CircularProgress style={{height: '50px', width: '50px', marginTop: '20px'}}/>

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
              <Medications medications={(this.state.medications)}/>
          </div>
       );      
    }
}
