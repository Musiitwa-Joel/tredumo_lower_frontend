import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import UserMenu from "app/theme-layouts/shared-components/UserMenu";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const AppNav = ({ activeApp, tabs, activeTab, handleTabChange }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar
          variant="dense"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {activeApp?.logo && (
              <div style={{ marginRight: 10 }}>
                <img src={activeApp?.logo} alt="logo" width={30} height={30} />
              </div>
            )}

            <Typography variant="h6" color="inherit" component="div">
              {activeApp?.title}
            </Typography>

            <div className="hidden lg:flex h-32 mx-20" />

            {tabs && (
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="scrollable"
                scrollButtons={false}
                className="-mx-4 min-h-40"
                classes={{
                  indicator: "flex justify-center bg-transparent w-full h-full",
                }}
                TabIndicatorProps={{
                  children: (
                    <Box
                      sx={{ bgcolor: "text.disabled" }}
                      className="w-full h-full rounded-full opacity-20"
                    />
                  ),
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    className="text-16 font-semibold min-h-40 min-w-64 mx-4 px-12"
                    disableRipple
                    label={tab}
                  />
                ))}
              </Tabs>
            )}
          </div>

          <Box sx={{ flexGrow: 0 }}>
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppNav;
