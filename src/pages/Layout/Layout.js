import { useState } from "react";
import { useMediaQuery, useTheme, Box, Typography, Link } from "@mui/material";
import { Navigator, Header } from "../../components";

const Copyright = () => {
  return (
    <Box sx = {{
        position: "relative",
        display: "flex",
        bottom: 0,
        width: "100%",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        p: 2,
    }}>
      <Typography variant="body2" color="#b6b5b5" align="center">
        {"Copyright © "}
        <Link color="inherit" href="LINK AQUI">
          Pollen Catcher
        </Link>{" "}
        {new Date().getFullYear()}.
      </Typography>
    </Box>
  );
};

export default function Layout() {
  const drawerWidth = 256;

  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Box
        sx={{ display: "flex", minHeight: "100vh", position: "relative", backgroundColor: "#f0f0f0"}}
      >
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          )}
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: "block", xs: "none" } }}
          />
        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header onDrawerToggle={handleDrawerToggle} />
        </Box>
      </Box>
      <Copyright/>
    </>
  );
}
