import React, {useState} from 'react'; 
import { Helmet } from 'react-helmet';
import moment from 'moment';

import { FhirClientContext } from 'src/FhirClientContext';
import { Box, Container, CircularProgress, autocompleteClasses } from '@material-ui/core';
import VaccinationList from './VaccinationList';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';

import { ConstructionOutlined } from '@material-ui/icons';
import PageSkeleton from '../loading/PageSkeleton';


const Vaccines = (props) => (
  <>
    {Array.from(props.types).map((type, index) => (
      <Box className='VaccinationCard' key={index} style={{marginTop: 0}}
          sx={{
            minHeight: '100%',
            background: '#FFFFFF',
            borderRadius: '5px', 
            mt: 0, 
            p: 0,
            my: 2, 
          }}
      >
      <div>
        <div id={"header" + index} className="VaccineHeader" onClick={toggle}>
          <div className='flex-group'>
            <div className="plus-icon">
            </div>
            <div className="vaccine-name">
              <p>Name and type</p>
              <h3>{type}</h3>
            </div>
          </div>
          <div className='flex-group'>
            <div>
              <AccessTimeIcon style={{width: '25px', height: '25px', marginRight: '10px'}}/>
            </div>
            <div className="last-dose">
              <p>Last dose</p>
              <h3>{moment(props.vaccines.filter((vac) => vac.vaccineCode.text == type)[0].occurrenceDateTime).format('LL')}</h3>
            </div>
          </div>
        </div>
        <Container className="vaccine-details" style={{display: 'none', margin: '0px', padding: '0px'}} maxWidth={false}>
            <Box sx={{m: 0, p: 0}}>
              <VaccinationList vaccines={props.vaccines.filter((vac) => vac.vaccineCode.text == type)} />
            </Box>
        </Container>
      </div>
      </Box>
    ))}
  </>
);


const toggle = (e) => {
  var target = e.target; 
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

export default class VaccinationPage extends React.Component {
    static contextType = FhirClientContext;

    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          error: null,
          vaccines: null,
          vaccineTypes: null, 
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
        queryMed.set('_sort', '-date');
        this._loader = client.request('/Immunization?' + queryMed, {
          resolveReferences: ["encounter",  "encounter.serviceProvider", "encounter.participant", "encounter.participant.0.individual"],
          pageLimit: 0, // get all pages
          flat: true // return flat array of Observation resources
        }).then(data => {            
            const vaccines = client.getPath(data, "");
            console.log(vaccines);
            this.setState({
              loading: false,
              vaccines: vaccines,
              vaccineTypes: new Set(vaccines.map(vac => vac.vaccineCode.text)), 
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
          <div className="VaccinationPage">
              <Vaccines vaccines={this.state.vaccines} types={this.state.vaccineTypes} />
          </div>
       );      
    }
}
