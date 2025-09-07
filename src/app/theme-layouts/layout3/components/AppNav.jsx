import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Tabs, Tab } from "@mui/material";
import UserMenu from "app/theme-layouts/shared-components/UserMenu";
import { useSelector } from "react-redux";
import { selectAppTheme } from "app/store/appSlice";

const AppNav = ({ activeApp, tabs, activeTab, handleTabChange }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // Get theme colors from Redux
  const appTheme = useSelector(selectAppTheme);

  // Log the primary color when the component renders or theme changes
  useEffect(() => {
    console.log("🎨 Primary Color from appTheme:", appTheme?.primary_color);
  }, [appTheme]);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: appTheme?.primary_color || "#1976d2", // Use theme color or fallback
          color: "#fff",
          boxShadow: "none",
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Left Section: Logo + Title + Tabs */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {activeApp?.logo && (
              <Box sx={{ marginRight: 1 }}>
                <img src={activeApp.logo} alt="logo" width={30} height={30} />
              </Box>
            )}

            <Typography variant="h6" color="inherit" component="div">
              {activeApp?.title}
            </Typography>

            <Box className="hidden lg:flex h-32 mx-20" />

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
          </Box>

          {/* Right Section: User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppNav;
