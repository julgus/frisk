import React, {useState} from 'react'; 
import { Helmet } from 'react-helmet';
import moment from 'moment';

import { FhirClientContext } from 'src/FhirClientContext';
import { Box, Container, CircularProgress, autocompleteClasses, Skeleton } from '@material-ui/core';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';

import { ConstructionOutlined } from '@material-ui/icons';
import PageSkeleton from '../loading/PageSkeleton';


const Conditions = (props) => (
  <>
    {Array.from(props.conditions).map((condition, index) => (
      <Box className='VaccinationCard' key={index} style={{marginTop: 0}}
          sx={{
            minHeight: '100%',
            background: '#FFFFFF',
            borderRadius: '5px', 
            p: 0,
            my: 2, 
          }}
      >
      <div>
        <div id={"header" + index} className="VaccineHeader" onClick={toggle}>
          <div className='flex-group'>
            <div className="condition-name">
              <p>Name and type</p>
              <h3>{condition.code.text}</h3>
              <div className={condition.verificationStatus.coding[0].code}>{condition.verificationStatus.coding[0].code}</div>
              <p>Health clinic</p>
              <h3>{condition.code.text}</h3>
            </div>
          </div>
          <div className='flex-group'>
            <div>
              <AccessTimeIcon style={{width: '25px', height: '25px', marginRight: '10px'}}/>
            </div>
            <div className="date">
              <p>Date</p>
              <p>{moment(condition.recordedDate).format('LL')}</p>
            </div>
          </div>
        </div>
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
        })
        .catch(error => {
          this.setState({error, loading: false})
        });
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
}
