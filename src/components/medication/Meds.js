import { useState } from 'react';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import VaccinesIcon from '@mui/icons-material/Vaccines';

import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableSortLabel,
  TableRow,
  Typography,
} from '@material-ui/core';
import { capitalize } from 'lodash';

const Meds = (medications) => {
  console.log(medications); 
  const [selectedCustomerIds] = useState([]);
  const meds = Object.values(medications);
  console.log("meds:"); 
  console.log(meds);

  const capitalize = sentence => {
    const words = sentence.toLowerCase().split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    
    return words.join(' ');    
  }

  return (
    <Card style={{border: 'none'}} sx={{p: 0, m: 0, borderRadius: '0px'}}>
      <PerfectScrollbar>
        <Box>
          <Table>
            <TableHead style={{backgroundColor: "#009C8C30"}} sx={{m: 0, p: 0}}>
              <TableRow>
                <TableCell sx={{m: 0, py: 0}}>
                  Status
                </TableCell>
                <TableCell sx={{m: 0, py: 0}}>
                  Issued By
                </TableCell>
                <TableCell sx={{m: 0, py: 0}}>
                  Provider
                </TableCell>
                <TableCell sx={{m: 0, py: 0}}>
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meds.map((med) => (
                <TableRow
                  hover
                  key={med.id}
                  selected={selectedCustomerIds.indexOf(med.id) !== -1}
                >
                  <TableCell style={{width: '15px'}}>
                    {med.status}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {med.encounter.participant[0].individual.name[0].prefix[0] + " " + med.encounter.participant[0].individual.name[0].given[0] + " " + med.encounter.participant[0].individual.name[0].family}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {capitalize(med.encounter.serviceProvider.name)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {moment(med.authoredOn).format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>

    </Card>
  );
};

export default Meds;
