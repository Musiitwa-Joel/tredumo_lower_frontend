import { selectFooterTheme } from "@fuse/core/FuseSettings/fuseSettingsSlice";

import AppBar from "@mui/material/AppBar";
import { ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import clsx from "clsx";
import { memo, useRef, useState, useEffect, useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";
// import { selectFooterTheme } from "app/store/fuse/settingsSlice";
import IconButton from "@mui/material/IconButton";
import AppsIcon from "@mui/icons-material/Apps";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import {
  addAppToTaskBar,
  appsVisible,
  appExistsInTaskBar,
  updateActiveApp,
  viewApps,
} from "app/store/appSlice";
import TaskBarButton from "./TaskBarButton";
import { Router, Routes, useNavigate } from "react-router-dom";
// import { resetModuleState } from "app/store/admissionsSlice";
// import { resetProgAndCoursesSlice } from "src/app/main/apps/file-manager/store/progAndCoursesSlice";
// import { resetCollegeSlice } from "src/app/main/apps/file-manager/store/collegeSlice";
// import { resetSchoolSlice } from "src/app/main/apps/file-manager/store/schoolSlice";
// import { resetDepartmentSlice } from "src/app/main/apps/file-manager/store/departmentSlice";
// import { resetGradingSlice } from "src/app/main/apps/file-manager/store/gradingSystemSlice";
// import { resetSetUpSlice } from "../modules/setup/store/setUpSlice";

const checkAppExistence = (array, property, value) => {
  if (!array.length) {
    return false;
  }

  for (const obj of array) {
    if (obj[property] === value) {
      return true;
    }
  }

  return false;
};

function FooterLayout3(props) {
  const dispatch = useDispatch();
  const footerTheme = useSelector(selectFooterTheme);
  const appsVisible = useSelector((state) => state.apps.visible);
  const taskBarApps = useSelector((state) => state.apps.taskBarApps);
  const activeApp = useSelector((state) => state.apps.activeApp);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  // console.log("active App", activeApp);

  // const [open, setOpen] = useState(false);
  const handleClose = (app) => {
    // console.log("app", app);
    dispatch(viewApps(false));
    const filteredApps = taskBarApps.filter((a) => a.id !== app.id);
    dispatch(addAppToTaskBar(filteredApps));

    const exists = checkAppExistence(taskBarApps, "route", app.route);

    console.log("exists", exists);

    dispatch(appExistsInTaskBar(exists));

    if (activeApp.id == app.id) {
      navigate("/example");
      // reset all the state of that module to its default
      dispatch(updateActiveApp({ id: 0, title: "Home" }));
      dispatch(resetModuleState(app.id));
    }

    if (filteredApps.length == 0 || activeApp.id == app.id) {
      dispatch(updateActiveApp({ id: 0, title: "Home" }));
    }

    if (app.route == "programsencourses") {
      // reset the module
      //   dispatch(resetProgAndCoursesSlice());
      //   dispatch(resetCollegeSlice());
      //   dispatch(resetSchoolSlice());
      //   dispatch(resetDepartmentSlice());
      //   dispatch(resetGradingSlice());
    } else if (app.route == "setup") {
      //   dispatch(resetSetUpSlice());
    }

    // console.log("close app");
  };
  const handleToggle = () => {
    dispatch(viewApps(!appsVisible));
  };

  // const handleAppClicked = (app) => {
  //   // console.log("app", app);
  //   dispatch(viewApps(false));

  //   let exists = checkAppExistence(taskBarApps, "route", app.route);
  //   dispatch(appExistsInTaskBar(exists));
  //   if (app.title == "home" && activeApp.id != app.id) {
  //     navigate("/example");
  //     dispatch(updateActiveApp({ id: 0, title: "Home" }));
  //   } else if (activeApp.id == app.id) {
  //     dispatch(updateActiveApp(app));
  //   } else {
  //     dispatch(updateActiveApp(app));
  //     navigate(`/${app.route}`);
  //   }
  // };

  const handleAppClicked = (app) => {
    dispatch(viewApps(false));

    const exists = checkAppExistence(taskBarApps, "route", app.route);
    dispatch(appExistsInTaskBar(exists));

    const isHomeApp = app.title === "home";
    const isDifferentApp = activeApp.id !== app.id;

    if (isHomeApp && isDifferentApp) {
      navigate("/example");
      dispatch(updateActiveApp({ id: 0, title: "Home" }));
    } else {
      dispatch(updateActiveApp(app));
      if (isDifferentApp) {
        navigate(`/${app.route}`);
      }
    }
  };

  useEffect(() => {
    // Scroll to the end when the component mounts or updates
    scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [taskBarApps]);

  const onTabChange = (key) => {
    dispatch(appExistsInTaskBar(true));
    navigate(key);
  };

  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar
        // sx={{ zIndex: (theme) => theme.zIndex.drawer + 1000 }}

        id="fuse-footer"
        className={clsx("relative z-20 shadow-md", props.className)}
        color="default"
        style={{
          backgroundColor: footerTheme.palette.background.paper,
          zIndex: 9999999,
        }}
      >
        <Toolbar className="container min-h-48 md:min-h-64 px-8 sm:px-12 lg:px-20 py-0 flex items-center">
          <div
            id="slider"
            className="container relative flex grow items-center shrink-0 h-full overflow-x-auto scroll whitespace-nowrap scroll-smooth"
            style={{ overflowX: "auto", width: "95%" }}
            ref={scrollRef}
          >
            <div className="flex" style={{ width: "fit-content" }}>
              <Button
                variant="contained"
                color={activeApp.id == 0 ? "secondary" : "primary"}
                onClick={() => handleAppClicked({ id: 0, title: "home" })}
                className="mx-4"
              >
                Home
              </Button>

              {taskBarApps.map((app, index) => (
                <TaskBarButton
                  key={index}
                  title={app.title}
                  isActive={activeApp.id == app.id}
                  onClose={() => handleClose(app)}
                  onClick={() => handleAppClicked(app)}
                />
              ))}
            </div>
          </div>

          {/* <div className="flex grow shrink-0 px-12 justify-end sticky right-0">
            <Tooltip
              title="All apps"
              placement="top"
              sx={{
                zIndex: 1000000000000000000,
              }}
              style={{
                zIndex: 1000000000000000000,
              }}
            >
              <IconButton
                aria-label="delete"
                size="large"
                // color="secondary"
                style={{
                  backgroundColor: appsVisible ? "#3c52b2" : "",
                }}
                onClick={handleToggle}
              >
                <AppsIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </div> */}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(FooterLayout3);
