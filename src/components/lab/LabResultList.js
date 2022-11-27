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
import { ConstructionOutlined } from '@material-ui/icons';

const LabResultList = (props) => {
  const [selectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const tests = Object.values(props.labtests);

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
                  
                </TableCell>
                <TableCell sx={{m: 0, py: 0}}>
                  Test
                </TableCell>
                <TableCell sx={{m: 0, py: 0}}>
                  Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tests.map((test) => (
                <TableRow 
                  onClick={props.callback}
                  id={test.code.coding[0].code}
                  hover
                  key={test.id}
                  selected={selectedCustomerIds.indexOf(test.id) !== -1}
                >
                  <TableCell style={{width: '15px'}}>
                    <Addchart/>
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
                        {test.code.text}
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


export default LabResultList;
