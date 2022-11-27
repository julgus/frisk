import React, {useState, PureComponent} from 'react'; 
import { Helmet } from 'react-helmet';
import moment from 'moment';

import { FhirClientContext } from 'src/FhirClientContext';
import { Box, Container, CircularProgress, autocompleteClasses } from '@material-ui/core';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HighLightOff from '@mui/icons-material/HighlightOff'
import ViewList from '@mui/icons-material/ViewList';
import Dashboard from '@mui/icons-material/Dashboard';

import LabAppointmentList from './LabAppointmentList';
import LabResultList from './LabResultList';

import { ConstructionOutlined, SignalCellularNullOutlined } from '@material-ui/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PageSkeleton from '../loading/PageSkeleton';

const capitalize = sentence => {
  const words = sentence.toLowerCase().split(" ");

  for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }
  
  return words.join(' ');    
}

const ByEncounter = (props) => (
  <>
      {Array.from(props.encounters).map((encounter, index) => (
      <Box className='ObservationCard' key={index}
          sx={{
            minHeight: '100%',
            background: '#FFFFFF',
            borderRadius: '5px', 
            p: 0,
            my: 2, 
          }}
      >
      <div>
        <div id={"header" + index} className="LabResultHeader" onClick={toggle}>
          <div className='flex-group'>
            <div className="plus-icon">
            </div>
            <div className="lab-test">
              <p>Health center</p>
              <h3>{capitalize(encounter.serviceProvider.name)}</h3>

              <p>Ordered by</p>
              <h3>{encounter.participant[0].individual.name[0].prefix[0] + " " + encounter.participant[0].individual.name[0].given[0] + " " + encounter.participant[0].individual.name[0].family}</h3>
            </div>
          </div>
          <div className='flex-group'>
            <div>
              <AccessTimeIcon id={"header" + index + "-9"} style={{width: '25px', height: '25px', marginRight: '10px'}}/>
            </div>
            <div className="test-date">
              <p>Date of tests</p>
              <h3>{moment(props.labtests.filter((test) => test.encounter.id == encounter.id)[0].effectiveDateTime).format('LL')}</h3>
            </div>
          </div>
        </div>
        <Container className="vaccine-details" style={{display: 'none', margin: '0px', padding: '0px'}} maxWidth={false}>
            <Box sx={{m: 0, p: 0}}>
              <LabResultList labtests={props.labtests.filter((test) => test.encounter.id == encounter.id)} callback={props.callback}/>
            </Box>
        </Container>
      </div>
      </Box>
    ))}
  </>
);

const ByType = (props) => (
  <>
      {Array.from(props.types).sort().map((testType, index) => (
      <Box className='ObservationCardByType' key={index}
          sx={{
            background: '#FFFFFF',
            borderRadius: '5px', 
            p: 0,
            my: 2, 
          }}
      >
      <div>
        <div id={testType.coding[0].code} className="LabTest" onClick={props.callback}>
            <div className="vaccine-name">
              {formatTestName(testType.text)}
              <h2>{(() => {
                      const test = props.labtests
                        .filter(test => test.code.text == testType.text)
                        .sort((a, b) => moment(b.effectiveDateTime) - moment(a.effectiveDateTime))[0];
                        return test.valueQuantity.value.toFixed(2) + " " + test.valueQuantity.unit; 
                      })()
                  }</h2>
              <p>as of {moment(props.labtests
                        .filter(test => test.code.text == testType.text)
                        .sort((a, b) => moment(b.effectiveDateTime) - moment(a.effectiveDateTime))
                        [0].effectiveDateTime).format('LL')}</p>
            </div>
        </div>
      </div>
      </Box>
    ))}
  </>
);

const formatTestName = (testName) => {
  if (testName.includes('[')) {
    const split = testName.split('['); 
    return <><h3>{capitalize(split[0].trim())}</h3></>; 
    //<p>[{split[1]}</p>
  } else {
    return <><h3>{capitalize(testName)}</h3></>;
  }
}

const Chart = (props) => (
  <>
  <ResponsiveContainer className="chart" width="100%" minHeight={200} maxHeight={300}>
      <LineChart
                    width={500}
                    height={300}
                    data={props.data}
                    margin={{
                      top: 5,
                      right: 5,
                      left: 5,
                      bottom: 5,
                    }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{value: props.data[0].unit, angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#49B1F7" animationDuration={200} strokeWidth={3}/>
      </LineChart>
    </ResponsiveContainer>
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

export default class LabPage extends React.Component {
    static contextType = FhirClientContext;

    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          error: null,
          labtests: null,
          labTestTypes: null, 
          encounters: null, 
          detailedTest: null, 
          displayMode: 'type'
        };
        this.updateDisplayState = this.updateDisplayState.bind(this)
      }

      updateDisplayState = (e) => {
        var target = e.target; 
        while (target.id == "") {
          target = target.parentNode; 
        }  

        for(var child=target.parentNode.firstChild; child!==null; child=child.nextSibling) {
          child.className = "toggleButton";
        }

        target.className = "toggleButtonActive";

        if (this.state.displayMode == 'encounter') {
          this.setState({displayMode: "type"});
        } else {
          this.setState({displayMode: "encounter"});
        }
      }

      formatTestName = (testName) => {
        if (testName.includes('[')) {
          const split = testName.split('['); 
          return capitalize(split[0].trim());
        } else {
          return capitalize(testName); 
        }
      }

      updateChartEncounter = (e) => { 
        var target = e.target; 
        while (target.id == "") {
          target = target.parentNode; 
        }  
        this.setState({detailedTest: target.id}); 
      }

      updateChart = (e) => { 
        if (e.target.id.length > 0) {
          this.setState({detailedTest: e.target.id}); 
        } else {
          this.setState({detailedTest: e.target.parentNode.parentNode.id});
        }
      }

      formatChartData = (testCode) => { 
        var data = []; 
        this.state.labtests.filter(test => test.code.coding[0].code == testCode)
            .sort((a, b) => moment(a.effectiveDateTime) - moment(b.effectiveDateTime))
            .forEach(test => {
              data.push({date: moment(test.effectiveDateTime).format('DD/MM/YYYY'), value: Number(test.valueQuantity.value.toFixed(2)), unit: test.valueQuantity.unit})
            });
        return data; 
      }

      getTestName = (testCode) => { 
        return this.state.labtests.filter(test => test.code.coding[0].code == testCode)[0].code.text; 
      }

      componentDidMount() {
        const client = this.context.client;
        const queryMed = new URLSearchParams();
        queryMed.set('patient', client.patient.id);
        this.setState({loading: true});
        const getPath = client.getPath;
  
        queryMed.set('_count', 100);
        queryMed.set('_sort', '-date');
        this._loader = client.request('/Observation?' + queryMed, {
          resolveReferences: ["encounter",  "encounter.serviceProvider", "encounter.participant", "encounter.participant.0.individual"],
          pageLimit: 0, // get all pages
          flat: true // return flat array of Observation resources
        }).then(data => {            
            const observations = client.getPath(data, "");
            const labresults = observations.filter(obs => obs.category[0].coding[0].code == 'laboratory'); 
            this.setState({
              loading: false,
              labtests: labresults,
              vitals: observations.filter(obs => obs.category[0].coding[0].code == 'vital-signs'), 
              labTestTypes: new Set(labresults.map(obs => obs.code)), 
              encounters: new Set(labresults.map(obs => obs.encounter)),
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
            <PageSkeleton display="grid"/>
          );
        }
        if (error) {
          console.log(error.message);
          return error.message;
        }
        return (
          <div className="ObservationPage">
            <div className="Observations">
              <div className="ObservationHeader">
                <div id="toggleButtons" className="alignEnd">
                  <button id="byType" className="toggleButtonActive" onClick={this.updateDisplayState}>By Type <Dashboard style={{width: "18px", translate: "0 7px"}}/> </button>
                  <button id="ByEncounter" className="toggleButton" onClick={this.updateDisplayState}>By Encounter <ViewList style={{width: "20px", translate: "0 6px"}}/> </button>
                </div>
              </div>
              {this.state.displayMode == 'encounter' ? 
                <div id="ObservationList" className="ObservationList">
                  <ByEncounter labtests={this.state.labtests} types={this.state.labTestTypes} encounters={this.state.encounters} callback={this.updateChartEncounter}/> 
                </div>:
                <div className="ObservationListFlex">
                  <ByType labtests={this.state.labtests} types={this.state.labTestTypes} callback={this.updateChart}/>
                </div>}
            </div>
            {this.state.detailedTest ? 
            <div id="ObservationDetails" className="ObservationDetails">
              <div className="title">
                <div style={{'display': 'flex', 'flexDirection': 'row'}}>
                  <h3>History: {this.formatTestName(this.getTestName(this.state.detailedTest))}</h3> 
                </div>
                <div className="close" onClick={() => this.setState({detailedTest: null})}>
                  <HighLightOff/>
                </div>
              </div>
              <Chart data={this.formatChartData(this.state.detailedTest)}/>
              <Container className="vaccine-details" style={{margin: '0px', padding: '0px'}} maxWidth={false}>
                <Box 
                  style={{
                    overflowY: "auto",
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column"
                  }}
                  sx={{m: 0, p: 0}}>
                    <LabAppointmentList labtests={this.state.labtests.filter((test) => test.code.coding[0].code == this.state.detailedTest)} />
                </Box>
              </Container>
            </div> : ""}
          </div>
       );      
    }
}
