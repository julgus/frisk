import { Helmet } from 'react-helmet';
import React from 'react';
import {
  Box,
  Container,
  CircularProgress,
  Grid
} from '@material-ui/core';
import Vitalinfo from 'src/components/vitals/Vitalinfo';
import VitalAdd from 'src/components/vitals/VitalAdd';
import Medication from 'src/components/medication/Medication';

import VitalsTable from 'src/components/vitals/VitalsTable';
import { FhirClientContext } from 'src/FhirClientContext';

export default class Dashboard extends React.Component {
    static contextType = FhirClientContext;

    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        vitals: null,
        error: null,
        name: 'Heart Rate',
        currentHeartrate: null,
        data: null,
        empty: {
          valueQuantity: {
            value: 'no entires',
            unit: ''
          }
        }
      };
      this.changeVital = this.changeVital.bind(this);
      this.getVitals = this.getVitals.bind(this);
    }

    componentDidMount() {
      this.getVitals();
    }


    /* START TO EDIT YOUR CODE HERE: Task 1 update the getVitals function to also retrive the current weight of the patient
    The varible that we set is currentWeight. We have already provided how to retrive the below vitals */ 

    getVitals() {
      this.setState({ loading: true });
      const query = new URLSearchParams();
      const client = this.context.client;
      const currentWeight = [null];
      query.set('patient', client.patient.id);
      query.set('_count', 100);
      query.set('_sort', '-date'); 
      query.set('code', [
        'http://loinc.org|8462-4', // Diastolic blood pressure
        'http://loinc.org|8480-6', // Systolic blood pressure
        'http://loinc.org|55284-4', // Blood pressure systolic and diasoltic
        'http://loinc.org|8331-1', // Oraltemprature
        'http://loinc.org|59408-5', // SPo2
        'http://loinc.org|8867-4', // Heart rate
        'http://loinc.org|9279-1', //  Respiratory Rate
      ].join(','));
      this._loader = client.request('Observation?' + query, {
        pageLimit: 0, // get all pages
        flat: true // return flat array of Observation resources
      })
        .then(vitals => {
          const byCodes = client.byCodes(vitals, 'code');
          const currentSpo = byCodes('59408-5');
          const currentHeartrate = byCodes('8867-4');
          const currentBloodpressure = byCodes('55284-4');
          const currentRR = byCodes('9279-1');
          const data = currentHeartrate;
          
      /* END OF WHERE YOU NEED TO EDIT YOUR CODE */ 
      
          this.setState({
            currentSpo, currentHeartrate, currentRR, currentWeight, currentBloodpressure, data, loading: false, error: null
          });
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });
    }

    changeVital(vitaltype, data) {
      this.setState({ name: vitaltype, data });
    }

    render() {
      const {
        error, loading
      } = this.state;
      if (loading) {
        return <CircularProgress />;
      }
      if (error) {
        console.log(error.message);
        return error.message;
      }
      return (
        <>
          <Helmet>
            <title>Dashboard | Material Kit</title>
          </Helmet>
          <Box
            sx={{
              backgroundColor: 'background.default',
              minHeight: '100%',
              py: 3
            }}
          >
            <Container maxWidth={false}>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  lg={3}
                  sm={6}
                  xl={3}
                  xs={12}
                >
                   <button type="button" value="Respiratory Rate" onClick={() => this.changeVital('RR', this.state.currentRR)}>
                   {this.state.currentRR[0] ? <Vitalinfo name="Respiratory Rate" vital={this.state.currentRR[0]} /> : <Vitalinfo name="Respiratory Rate" vital={this.state.empty} /> }
                   </button>
                </Grid>
                <Grid
                  item
                  lg={3}
                  sm={6}
                  xl={3}
                  xs={12}
                >
                  <button type="button" value="HR" onClick={() => this.changeVital('Heart Rate', this.state.currentHeartrate)}>
                  {this.state.currentHeartrate[0] ? <Vitalinfo name="HR" vital={this.state.currentHeartrate[0]} /> : <Vitalinfo name="HR" vital={this.state.empty} /> }
                  </button>
                </Grid>
                <Grid
                  item
                  lg={3}
                  sm={6}
                  xl={3}
                  xs={12}
                >
                  <button type="button" value="Weight" onClick={() => this.changeVital('Temp', this.state.currentWeight)}>
                  {this.state.currentWeight[0] ? <Vitalinfo name="Weight" vital={this.state.currentWeight[0]} /> : <Vitalinfo name="Weight" vital={this.state.empty} /> }
                  </button>
                </Grid>
                <Grid
                  item
                  lg={3}
                  sm={6}
                  xl={3}
                  xs={12}
                >
                  <button type="button" value="SPO2" onClick={() => this.changeVital('SPO2', this.state.currentSpo)}>
                  {this.state.currentSpo[0] ? <Vitalinfo name="SPO2" vital={this.state.currentSpo[0]} /> : <Vitalinfo name="SPO2" vital={this.state.empty} /> }
                  </button>
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={8}
                  xl={6}
                  xs={8}
                >
                  <VitalAdd getVitals={this.getVitals} />
                </Grid>
                
                <Grid
                  item
                  lg={12}
                  md={16}
                  xl={12}
                  xs={16}
                >
                  {this.state.data[0] ? <VitalsTable name={this.state.name} data={this.state.data} /> : <div> </div>}
                </Grid>
                <Grid
                  item
                  lg={12}
                  md={16}
                  xl={12}
                  xs={16}
                >
                  <Medication />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>
      );
    }
}
