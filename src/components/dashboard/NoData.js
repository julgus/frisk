import {
  Button,
  Card,
  CardHeader,
  Divider,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const NoData = () => {
  console.log('test');
  return (
    <Card>
      <CardHeader
        action={(
          <Button
            endIcon={<ArrowDropDownIcon />}
            size="small"
            variant="text"
          >
            No Data
          </Button>
        )}
        title="No data"
      />
      <Divider />
    </Card>
  );
};

export default NoData;
