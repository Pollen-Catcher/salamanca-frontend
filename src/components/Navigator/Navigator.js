import {
  Divider,
  Drawer,
  List,
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  DnsRounded as DnsRoundedIcon,
  Public as PublicIcon,
  SettingsEthernet as SettingsEthernetIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const categories = [
  {
    id: "Build",
    children: [
      {
        id: "Authentication",
        icon: <PeopleIcon />,
        active: true,
      },
      { id: "Firestore", icon: <DnsRoundedIcon /> },
      { id: "Hosting", icon: <PublicIcon /> },
      { id: "Functions", icon: <SettingsEthernetIcon /> },
    ],
  },
  {
    id: "Content",
    children: [{ id: "Configuration", icon: <SettingsIcon /> }],
  },
];

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

export default function Navigator(props) {
  const { ...other } = props;

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 22, color: "#fff" }}
        >
          Pollen Catcher
        </ListItem>
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <ListItem sx={{ ...item, ...itemCategory }}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItem>
        </Link>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, active }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton selected={active} sx={item}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}

            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
