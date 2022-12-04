import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar } from '@material-ui/core';

/* Code adopted from Lab 4 */ 

const MainNavbar = (props) => (
  <AppBar
    elevation={0}
    {...props}
  >
    <Toolbar sx={{ height: 64 }}>
      <RouterLink to="/">
      </RouterLink>
    </Toolbar>
  </AppBar>
);

export default MainNavbar;
