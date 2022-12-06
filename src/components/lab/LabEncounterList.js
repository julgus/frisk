import { useState } from 'react';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Addchart from '@mui/icons-material/Addchart';

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

const LabEncounterList = (labtests) => {
  const [selectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const tests = Object.values(labtests.labtests);

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
            <TableHead style={{backgroundColor: "#c5e1f3"}} sx={{m: 0, p: 0}}>
              <TableRow>
                <TableCell sx={{m: 0, py: 0}}>
                  Date
                </TableCell>
                <TableCell sx={{m: 0, py: 0}}>
                  Ordered by
                </TableCell>
                <TableCell sx={{m: 0, py: 0}}>
                  Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.map((test) => (
                <TableRow
                  hover
                  key={test.id}
                >
                  <TableCell>
                     {moment(test.effectiveDateTime).format('MM-DD-YYYY')}
                  </TableCell>
                  <TableCell>
                    <Box className='date'

                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                        className="clinic"
                      >
                            {test.encounter.participant[0].individual.name[0].prefix[0] + " " + test.encounter.participant[0].individual.name[0].given[0] + " " + test.encounter.participant[0].individual.name[0].family}
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
                        {test.valueQuantity.value.toFixed(2) + " " + test.valueQuantity.unit} 
                      </Typography>
                    </Box>
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

// CustomerListResults.propTypes = {
//   customers: PropTypes.array.isRequired
// };

export default LabEncounterList;
