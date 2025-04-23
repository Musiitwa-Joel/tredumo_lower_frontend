import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { selectUser, userLoggedOut } from "app/store/userSlice";
import { addAppToTaskBar, updateApps } from "app/store/appSlice";
import { setToken } from "app/store/tokenSlice";
// import { useApolloClient } from "@apollo/client";

function UserMenu(props) {
  const userObj = useSelector((state) => state.user.user);
  const currentRoute = useLocation();
  // const client = useApolloClient();
  const [userMenu, setUserMenu] = useState(null);
  const dispatch = useDispatch();

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  return (
    <>
      <Button
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
        color="inherit"
      >
        {currentRoute.pathname == "/example" && (
          <div className="hidden md:flex flex-col mx-4 items-end">
            <Typography component="span" className="font-semibold flex">
              {`${userObj?.user?.first_name} ${userObj?.user?.other_names}`}
            </Typography>
            <Typography
              className="text-11 font-medium capitalize"
              color="text.secondary"
            >
              {/* {user?.role.role_name} */}
            </Typography>
          </div>
        )}

        {userObj?.user ? (
          <Avatar
            className="md:mx-4"
            alt="user photo"
            src={userObj?.user?.photo}
          />
        ) : (
          <Avatar className="md:mx-4">{userObj?.user?.photo}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: "py-8",
        }}
      >
        <>
          <MenuItem
            component={Link}
            to="/apps/profile"
            onClick={userMenuClose}
            role="button"
          >
            <ListItemIcon className="min-w-40">
              <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="My Profile" />
          </MenuItem>
          <MenuItem
            component={Link}
            to="/apps/mailbox"
            onClick={userMenuClose}
            role="button"
          >
            <ListItemIcon className="min-w-40">
              <FuseSvgIcon>heroicons-outline:mail-open</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </MenuItem>
          <MenuItem
            component={NavLink}
            // to="/"
            onClick={() => {
              dispatch(setToken(null)); // remove token
              dispatch(addAppToTaskBar([])); // close all apps
              dispatch(userLoggedOut()); // remove the user profile
            }}
          >
            <ListItemIcon className="min-w-40">
              <FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </MenuItem>
        </>
      </Popover>
    </>
  );
}

export default UserMenu;
