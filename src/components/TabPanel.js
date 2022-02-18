import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Content from './Content';
import Index from '../pages/Firestore/index';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab style={{ color: '#0a1c31' }} label="Main Page" {...a11yProps(0)} />
          <Tab style={{ color: '#0a1c31' }} label="Firestore CRUD" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel style={{ backgroundColor: '#0a1c31' }} value={value} index={0}>
        <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#0a1c31' }}>
          <Content />
        </Box>
      </TabPanel>
      <TabPanel style={{ backgroundColor: '#0a1c31' }} value={value} index={1}>
        <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#0a1c31' }}>
          <Index />
        </Box>
      </TabPanel>
    </Box>
  );
}
