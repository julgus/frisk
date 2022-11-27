import React from 'react';
import {
  AppBar,
  Toolbar
} from '@material-ui/core';
import { FhirClientContext } from '../../FhirClientContext';

const DashboardNavbars = (props) => {
  const [notifications] = [1, 1];
  const name = props.name.find(nameRecord => nameRecord.use === 'official') || [0];
  return (
    <AppBar
      elevation={0}
    >
      <Toolbar>
        <span style={{paddingLeft: 2, fontSize: 25 }}>
          {name.given.join(' ') + ' ' + name.family + notifications}
        </span>
        <span style={{paddingLeft: 20, fontSize: 25 }}>
           Gender:
           {props.gender}
        </span>
        <span style={{paddingLeft: 20, fontSize: 25 }}>
           DOB:
           {props.birthDate}
        </span>
      </Toolbar>
    </AppBar>
  );
};

export default class DashboardNavbar extends React.Component {
    static contextType = FhirClientContext;

    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        patient: null,
        error: null
      };
    }
    // this loader is used for

    componentDidMount() {
      const client = this.context.client;
      console.log(client);
      this._loader = client.patient
        .read()
        .then(patient => {
          this.setState({ patient, loading: false, error: null });
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });
    }

    render() {
      const { error, loading, patient } = this.state;

      if (loading) {
        return null;
      }
      if (error) {
        console.log(error.message);
        return error.message;
      }
      return <DashboardNavbars {...patient} />;
    }
}
