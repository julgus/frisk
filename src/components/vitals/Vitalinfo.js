import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography
} from '@material-ui/core';
import MoneyIcon from '@material-ui/icons/Money';
import { red } from '@material-ui/core/colors';

const Vitalinfo = (props) => (
  <Card
    sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="h3"
          >
            {props.name}
          </Typography>
          <Typography
            sx={{
              mr: 1
            }}
            variant="h2"
          >
            <span>{props.vital.valueQuantity.value}</span>
            <span> </span>
            <span>{props.vital.valueQuantity.unit}</span>
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: red[600],
              height: 56,
              width: 56
            }}
          >
            <MoneyIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography
          sx={{
            mr: 1
          }}
          variant="body2"
        >
          Date Recorded:
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          {props.vital.effectiveDateTime}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default Vitalinfo;
