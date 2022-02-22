import { useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box } from "@mui/material";
import { Content } from "../../components";
import {
  Route,
  Routes,
  Link,
} from "react-router-dom";
import { Firestore } from "../../pages";

function TabPanel({ children, value, index, ...other }) {
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
          {children}
        </Box>
      )}
    </div>
  );
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={(event, value) => setValue(value)}
          aria-label="basic tabs example"
        >
          <Tab style={{ color: "#eaeff1" }} label="Main Page" component={Link} to="sheets" />
        </Tabs>
      </Box>
      <TabPanel style={{ backgroundColor: "#eaeff1" }} value={value} index={0}>
        <Box
          component="main"
          sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}
        >
          <Routes>
            <Route path="*" element={<Content />} />
            <Route path=":sheetId" element={<Firestore />} />
          </Routes>
        </Box>
      </TabPanel>
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
