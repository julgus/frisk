import React from 'react';
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
    FHIR.oauth2.authorize({
      clientId: 'my-client-id',
      scope: 'launch launch/patient patient/read offline_access',
    });

    FHIR.oauth2.ready()
    .then(client => client.request("Patient"))
    .then(console.log('test'))
    .catch(console.error);
  }
  /**
   * Could also return `null` for empty page
   */

  render() {
    return 'Launching...';
  }
}
