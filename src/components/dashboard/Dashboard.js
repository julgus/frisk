import React from 'react'; 
import moment from 'moment';

import { FhirClientContext } from 'src/FhirClientContext';
import { Box } from '@material-ui/core';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MedicationIcon from '@mui/icons-material/Medication';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ArrowForward } from '@material-ui/icons';
import PageSkeleton from '../loading/PageSkeleton';

const Activities = (props) => (
  <>
    {Array.from(props.activities).sort((a, b) => b.date - a.date).map((activity, index) => (
      <Box className='DashboardCard' key={index} style={{marginTop: 0}}
          sx={{
            background: '#FFFFFF',
            borderRadius: '5px', 
            mt: 0, 
            p: 0,
            my: 2, 
          }}
      >
      <div>
        <div id={"header" + index} className={activity.type} onClick={toggle}>
          <div className="DashboardHeader">
            <div className='flex-group'>
              <div className="icon">
              {(() => {
                        switch(activity.type) {
                          case 'Lab Result': 
                            return <MonitorHeartIcon style={{width: '35px', height: '35px'}}/>; 
                          case 'Vaccine': 
                            return <VaccinesIcon style={{width: '35px', height: '35px'}}/>; 
                          case 'Medication': 
                            return <MedicationIcon style={{width: '35px', height: '35px'}}/>; 
                          case 'Condition': 
                            return <FavoriteBorderIcon style={{width: '35px', height: '35px'}}/>; 
                          default:
                            return ""; 
                        }
              })()}
              </div>
              <div className="vaccine-name">
                <h2>New {activity.type}</h2>
                <p>Name and Type</p>
                <h3><a className='link' href={activity.link}>{activity.name}<ArrowForward /></a></h3>
                <p>Health clinic</p>
                <h3>{capitalize(activity.provider)}</h3>
              </div>
            </div>
            <div className='flex-group'>
              <div>
                <AccessTimeIcon style={{width: '25px', height: '25px', marginRight: '10px'}}/>
              </div>
              <div className="date">
                <p>Date</p>
                <h3>{moment(activity.date, 'YYMMDD').format('LL')}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Box>
    ))}
  </>
);

const capitalize = sentence => {
  const words = sentence.toLowerCase().split(" ");

  for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  
  return words.join(' ');    
}

const toggle = (e) => {
  var target = e.target; 
  while (target.id == "") {
    target = target.parentNode; 
  }  

  if (target.className == 'Lab Result') {
    window.location.replace("/portal/labresults");
  }
  else if (target.className == 'Medication') {
    window.location.replace("/portal/medication");
  }
  else if (target.className == 'Condition') {
    window.location.replace("/portal/conditions");
  }
  else if (target.className == 'Vaccine') {
    window.location.replace("/portal/vaccination");
  }

}

export default class Dashboard extends React.Component {
    static contextType = FhirClientContext;

    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          error: null,
          activities: [], 
        };
      }

      componentDidMount() {
        this.setState({loading: true});

        const client = this.context.client;
        const queryMed = new URLSearchParams();
        const getPath = client.getPath;
        queryMed.set('patient', client.patient.id);
        queryMed.set('_count', 100);

        this._loader = client.request('/Condition?' + queryMed, {
          resolveReferences: ["encounter",  "encounter.serviceProvider"],
          pageLimit: 0, // get all pages
          flat: true // return flat array of Observation resources
        }).then(data => {            
            const conditions = client.getPath(data, "");
            Array.from(conditions).filter(c => parseInt(moment(c.recordedDate).fromNow()) < 5).forEach(c => {
              this.setState({
                activities: [...this.state.activities, {"type": "Condition", "name": c.code.text, "date": moment(c.recordedDate).format('YYMMDD'), "provider": c.encounter.serviceProvider.name,  "link": "/portal/conditions/#c" + c.code.coding[0].code}],
                error: null,
                loading: true
              }); 
            });
        })
        .catch(error => {
          this.setState({error})
        }); 

        queryMed.set('_sort', '-date');
        this._loader = client.request('/Immunization?' + queryMed, {
          resolveReferences: ["encounter",  "encounter.serviceProvider"],
          pageLimit: 0, // get all pages
          flat: true // return flat array of Observation resources
        }).then(data => {            
            const vaccines = client.getPath(data, "");
            Array.from(vaccines).filter(v => parseInt(moment(v.occurrenceDateTime).fromNow()) < 5).forEach(v => {
              this.setState({
                activities: [...this.state.activities, {"type": "Vaccine", "name": v.vaccineCode.text, "date": moment(v.occurrenceDateTime).format('YYMMDD'), "provider": v.encounter.serviceProvider.name,  "link": "/portal/vaccination/#v" + v.vaccineCode.coding[0].code}],
                error: null,
                loading: true
              }); 
            });
        })
        .catch(error => {
          this.setState({error})
        });

        this._loader = client.request('/MedicationRequest?' + queryMed, {
          resolveReferences: ["encounter",  "encounter.serviceProvider"],
          pageLimit: 0, // get all pages
          flat: true // return flat array of Observation resources
        }).then(data => {            
            const meds = client.getPath(data, "");
            Array.from(meds).filter(m => parseInt(moment(m.authoredOn).fromNow()) < 5).forEach(m => {
              this.setState({
                activities: [...this.state.activities, {"type": "Medication", "name": m.medicationCodeableConcept[0].text, "date": moment(m.authoredOn).format('YYMMDD'), "provider": m.encounter.serviceProvider.name, "link": "/portal/medication/#m" + m.medicationCodeableConcept.coding[0].code}],
                error: null,
                loading: true
              }); 
            });
        })
        .catch(error => {
          this.setState({error})
        });

        this._loader = client.request('/Observation?' + queryMed, {
          resolveReferences: ["encounter",  "encounter.serviceProvider"],
          pageLimit: 0, // get all pages
          flat: true // return flat array of Observation resources
        }).then(data => {            
            const observations = client.getPath(data, "");
            const labresults = observations.filter(obs => obs.category[0].coding[0].code == 'laboratory').filter(o => parseInt(moment(o.effectiveDateTime).fromNow()) < 5); 
            console.log(labresults);
            const encounters = new Set(labresults.map(obs => obs.encounter)); 
            console.log(encounters); 
            encounters.forEach(e => {
              this.setState({
                activities: [...this.state.activities, {"type": "Lab Result", "name": "Lab Encounter", "date": moment(e.period.start).format('YYMMDD'), "provider": e.serviceProvider.name, "link": "/portal/labresults/#e" + e.id}],
                error: null, 
                loading: false
              }); 
            });
        })
        .catch(error => {
          this.setState({error})
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
          <div className="Dashboard">
              <div className="activity">
                <h2>Recent Activity</h2>
                <Activities activities={this.state.activities} />
              </div>
          </div>
       );      
    }
}
