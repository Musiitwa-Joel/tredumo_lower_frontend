import FuseDialog from "@fuse/core/FuseDialog";
import { styled } from "@mui/material/styles";
import FuseMessage from "@fuse/core/FuseMessage";

import FuseSuspense from "@fuse/core/FuseSuspense";
import clsx from "clsx";
import {
  memo,
  useContext,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import AppContext from "app/AppContext";
import { selectFuseCurrentLayoutConfig } from "@fuse/core/FuseSettings/fuseSettingsSlice";
import FooterLayout3 from "./components/FooterLayout3";
import LeftSideLayout3 from "./components/LeftSideLayout3";
import { motion } from "framer-motion";
import NavbarWrapperLayout3 from "./components/NavbarWrapperLayout3";
import RightSideLayout3 from "./components/RightSideLayout3";

import ToolbarLayout3 from "./components/ToolbarLayout3";
import FuseSvgIcon from "../../../@fuse/core/FuseSvgIcon";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";

import MyApp from "./components/my_app/MyApp";

import { selectFooterTheme } from "@fuse/core/FuseSettings/fuseSettingsSlice";
import {
  addAppToTaskBar,
  appExistsInTaskBar,
  filterApps,
  selectIsLocked,
  setIsLocked,
  updateActiveApp,
  updateApps,
  viewApps,
} from "app/store/appSlice";
import bgApps from "./assets/bg-apps3.png";
import { selectToken } from "app/store/tokenSlice";
import { Tooltip } from "antd";
import SettingsPanel from "../shared-components/configurator/SettingsPanel";

const Root = styled("div")(({ theme, config }) => ({
  ...(config.mode === "boxed" && {
    clipPath: "inset(0)",
    maxWidth: `${config.containerWidth}px`,
    margin: "0 auto",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  }),
  ...(config.mode === "container" && {
    "& .container": {
      maxWidth: `${config.containerWidth}px`,
      width: "100%",
      margin: "0 auto",
    },
  }),
}));

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

function Layout3(props) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isLocked = useSelector(selectIsLocked);
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const appContext = useContext(AppContext);
  const appsVisible = useSelector((state) => state.apps.visible);
  const apps = useSelector((state) => state.apps.apps);
  const taskBarApps = useSelector((state) => state.apps.taskBarApps);
  const [searchField, setSearchField] = useState("");
  const [filteredApps, setFilteredApps] = useState(apps);
  const navigate = useNavigate();
  const currentRoute = useLocation();
  const [_activeApp, setActiveApp] = useState({
    id: 0,
    title: "Home",
    route: "home",
  });

  const footerTheme = useSelector(selectFooterTheme);
  const activeApp = useSelector((state) => state.apps.activeApp);

  useEffect(() => {
    setFilteredApps(apps);
  }, [apps]);

  const handleClick = (app) => {
    let exists = checkAppExistence(taskBarApps, "route", app.route);
    dispatch(appExistsInTaskBar(exists));

    if (exists) {
      dispatch(updateActiveApp(app));
    } else {
      // find the index of the active app
      const activeAppIndex = taskBarApps.findIndex(
        (item) => item.id === activeApp.id
      );

      // insert the new app right next to the active app
      let insertIndex = activeAppIndex == -1 ? 0 : activeAppIndex + 1;

      const newArray = [
        ...taskBarApps.slice(0, insertIndex),
        app,
        ...taskBarApps.slice(insertIndex),
      ];

      dispatch(addAppToTaskBar(newArray));

      dispatch(updateActiveApp(app));
    }

    navigate(`/${app.route}`);
    dispatch(viewApps(!appsVisible));
  };

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.6 },
    show: { opacity: 1, scale: 1 },
  };

  const { routes } = appContext;

  // let inactivityTimer;

  // // Reset the inactivity timer on any user activity
  // const resetTimer = () => {
  //   if (isLocked) {
  //     dispatch(setIsLocked(false));
  //   }
  //   clearTimeout(inactivityTimer);
  //   inactivityTimer = setTimeout(() => {
  //     dispatch(setIsLocked(true));
  //     navigate("/unlock_session");
  //   }, 300000); // 5 minutes
  // };

  // // Set up event listeners for activity
  // useEffect(() => {
  //   if (!token || currentRoute.pathname == "/") return;
  //   // Set up event listeners for user activity
  //   window.addEventListener("mousemove", resetTimer);
  //   window.addEventListener("keypress", resetTimer);
  //   window.addEventListener("click", resetTimer);
  //   window.addEventListener("scroll", resetTimer);

  //   // Start the timer
  //   resetTimer();

  //   // Clean up event listeners on component unmount
  //   return () => {
  //     clearTimeout(inactivityTimer);
  //     window.removeEventListener("mousemove", resetTimer);
  //     window.removeEventListener("keypress", resetTimer);
  //     window.removeEventListener("click", resetTimer);
  //     window.removeEventListener("scroll", resetTimer);
  //   };
  // }, []);

  return (
    <>
      {/* {console.log("locked", isLocked)} */}
      <Root
        id="fuse-layout"
        className="w-full flex"
        config={config}
        style={{
          // backgroundColor: "red",
          minWidth: 1100,
          // overflowX: "scroll",
        }}
      >
        <Backdrop
          sx={{
            color: "#fff",
            // backgroundColor: "white",
            // position: "relative",
            // backdropFilter: "blur(30px)",
            // backgroundColor: "orange",
            // position: "relative",
            // backgroundImage: `url(${bgApps})`, // Replace with your image URL
            // backgroundRepeat: "no-repeat",
            // filter: "blur(50px)",
            // backgroundSize: "cover",
            width: "100%",
            height: "100%",
            // backgroundPosition: "center",
            // flex: 1,
            zIndex: (theme) => theme.zIndex.drawer + 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",

            // height: "100%",
            // alignItems: "flex-start",
          }}
          open={appsVisible}
          // TransitionComponent={Slide}
          transitionDuration={100}
          // onClick={handleClose}
        >
          <img
            src={bgApps}
            alt="Your image description"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: -1,
              // filter: "blur(80px)",
              transition: "filter 2s ease-in-out",
            }}
          />
          {/* <StyledBackdrop open={appsVisible}> */}
          <div>
            <Paper
              className="flex items-center h-44  px-16 py-16 rounded-8 shadow"
              style={{
                marginTop: 20,
                width: 500,
              }}
            >
              <Input
                placeholder="Search..."
                disableUnderline
                value={searchField}
                style={{
                  fontSize: "1.6rem",
                }}
                onChange={(e) => {
                  setSearchField(e.target.value);
                  let tempArr = [];
                  apps.map((app) => {
                    if (
                      app.title
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    ) {
                      tempArr.push(app);
                    }
                  });
                  setFilteredApps(tempArr);
                  // console.log("filtered apps ", tempArr);
                  // dispatch(filterApps(tempArr));
                }}
                fullWidth
                autoFocus
                inputProps={{
                  "aria-label": "Search",
                }}
              />
              <FuseSvgIcon color="action">heroicons-outline:search</FuseSvgIcon>
            </Paper>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "scroll", // Enable vertical scrolling
            }}
          >
            <div>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex items-center overflow-y-scroll scroll whitespace-nowrap scroll-smooth"
                style={{
                  marginTop: 20,

                  display: "flex",
                  alignItems: "flex-start",
                  // backgroundColor: "yellow",
                  // flex: 1,
                  flexWrap: "wrap",
                  justifyContent: "center",
                  // maxWidth: 900,
                  maxHeight: "calc(100vh - 150px)",
                  scrollbarWidth: "none", // Hide the scrollbar for Firefox
                  "-ms-overflow-style": "none",
                  // overflow: "hidden",
                  // "-ms-overflow-style": "none",
                  // overflowY: "scroll",
                  // maxHeight: "calc(100% - 0px)",
                  // padding: 10,
                  // height: 500,
                }}
              >
                {filteredApps.map((app, index) => (
                  <MyApp
                    key={index}
                    title={app.title}
                    logo={app.logo}
                    onClick={() => handleClick(app, index)}
                  />
                ))}
              </motion.div>
            </div>
          </div>
          {/* </StyledBackdrop> */}
          {/* <CircularProgress color="inherit" /> */}
        </Backdrop>

        {config.leftSidePanel.display && <LeftSideLayout3 />}

        <div className="flex flex-col flex-auto min-w-0">
          <main
            id="fuse-main"
            className="flex flex-col flex-auto min-h-full min-w-0 relative"
          >
            {/* {config.navbar.display && (
              // <NavbarWrapperLayout3
              //   className={clsx(
              //     config.navbar.style === "fixed" && "sticky top-0 z-50"
              //   )}
              // />
            )} */}

            {config.toolbar.display && currentRoute.pathname == "/example" && (
              <ToolbarLayout3
                className={clsx(
                  config.toolbar.style === "fixed" && "sticky top-0",
                  config.toolbar.position === "above" && "order-first z-40"
                )}
              />
            )}

            {/* <div className="sticky top-0 z-99">
              <Settings />
            </div> */}

            <div className="flex flex-col flex-auto min-h-0 relative z-10">
              <FuseDialog />

              <FuseSuspense logo={activeApp?.logo}>
                {useRoutes(routes)}
              </FuseSuspense>

              {props.children}
            </div>

            {config.footer.display &&
              currentRoute.pathname !== "/" &&
              currentRoute.pathname !== "/unlock_session" && (
                <FooterLayout3
                  className={
                    config.footer.style === "fixed" ? "sticky bottom-0" : ""
                  }
                />
              )}
          </main>
        </div>

        {config.rightSidePanel.display && <RightSideLayout3 />}
      </Root>

      <FuseMessage />
    </>
  );
}

export default memo(Layout3);
