import React from 'react';
import { oauth2 as SMART } from 'fhirclient';
import FHIR from 'fhirclient';


/**
 * Typically the launch page is an empty page with a `SMART.authorize`
 * call in it.
 *
 * This example demonstrates that the call to authorize can be postponed
 * and called manually. In this case we use ReactRouter which will match
 * the `/launch` path and render our component. Then, after our page is
 * rendered we start the auth flow.
 */
export default class Launcher extends React.Component {
  /**
   * This is configured to make a Standalone Launch, just in case it
   * is loaded directly. An EHR can still launch it by passing `iss`
   * and `launch` url parameters
   */
  componentDidMount() {
    SMART.authorize({
    clientId: '2c3b2d78-dba6-4cae-accf-0aa8a6325317',
    scope: 'launch launch/patient patient/read offline_access patient/Patient.read patient/Observation.read patient/Observation.write patient/MedicationRequest.read patient/Condition.read patient/Vaccination.read',
      redirectUri: './portal',
      iss: 'https://r4.smarthealthit.org',
      completeInTarget: false
    });

    FHIR.oauth2.ready()
    .then(client => client.request("Patient"))
    .then(console.log('test'))
    .catch(console.error);
  }
  
/**
 * Could also return `null` for empty page
 */

// componentDidMount() {
//   SMART.authorize({
//     clientId: 'my-client-id',
//     scope: 'launch launch/patient patient/read offline_access',
//     redirectUri: './portal',
//     iss: 'https://launch.smarthealthit.org/v/r4/sim/eyJoIjoiMSIsImIiOiJkNjRiMzdmNS1kM2I1LTRjMjUtYWJlOC0yM2ViZThmNWEwNGUiLCJqIjoiMSJ9/fhir',

//     completeInTarget: false
//   });

//   FHIR.oauth2.ready()
//   .then(client => client.request("Patient"))
//   .then(console.log('test'))
//   .catch(console.error);
// }

render() {
  return 'Launching...';
}

}