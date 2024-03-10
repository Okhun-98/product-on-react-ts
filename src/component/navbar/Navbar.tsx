import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { navLinks } from "./navbar.data";
import { INavbarProps } from "../../types/navbar";
import { useTokenStore } from "../../stores/token";

const drawerWidth = 240;

export const Navbar: React.FC<INavbarProps> = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { token, setToken, logOut } = useTokenStore();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("TOKEN");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    }
  }, []);

  const filteredNavLinks = React.useMemo(() => {
    return navLinks.filter((link) => {
      if (!token && !link.isLoggedIn) {
        return true;
      } else if (token && link.path !== "/login") {
        return true;
      } else {
        return false;
      }
    });
  }, [token]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box sx={{ width: drawerWidth }} onClick={handleDrawerToggle}>
      <Toolbar />
      <Typography variant="h6" sx={{ my: 2, textAlign: "center" }}>
        ShopIn
      </Typography>
      <Divider />
      <List>
        {filteredNavLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton component={Link} to={link.path}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            color="inherit"
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={logOut}
          >
            Shop In
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {filteredNavLinks.map((link) => (
              <Button
                key={link.path}
                sx={{ color: "#fff" }}
                component={Link}
                to={link.path}
              >
                {link.label}
              </Button>
            ))}
          </Box>
          {token && (
            <Button color="inherit" onClick={logOut}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
};
