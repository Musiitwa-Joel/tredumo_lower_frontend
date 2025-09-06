import MyApp from "app/theme-layouts/layout3/components/my_app/MyApp";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Paper, Box } from "@mui/material";
// import { useTheme, alpha } from "@mui/material/styles";
import { Button } from "@mui/material";
import { Avatar } from "@mui/material";
import {
  addAppToTaskBar,
  appExistsInTaskBar,
  updateActiveApp,
} from "app/store/appSlice";
import { useNavigate } from "react-router";
import api from "app/configs/api";
import { selectApps, setApps } from "./store/homeSlice";
import { url } from "app/configs/apiConfig";

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

const apps = [
  {
    id: "1",
    title: "Front Office",
    route: "rims",
    logo: "http://localhost:9000/logos/front_office.png",
  },
  {
    id: "2",
    title: "Student Information Center",
    route: "jobs",
    logo: "http://localhost:9000/logos/studentInfo.png",
  },
  {
    id: "3",
    title: "Fees Management",
    route: "rims",
    logo: "http://localhost:9000/logos/fees.png",
  },
  {
    id: "4",
    title: "Elearning",
    route: "jobs",
    logo: "http://localhost:9000/logos/elearning.png",
  },

  {
    id: "5",
    title: "Examinations",
    route: "rims",
    logo: "http://localhost:9000/logos/examinations.png",
  },
  {
    id: "6",
    title: "Attendance",
    route: "jobs",
    logo: "http://localhost:9000/logos/attendance.png",
  },
  {
    id: "7",
    title: "Academics",
    route: "rims",
    logo: "http://localhost:9000/logos/academics.png",
  },
  {
    id: "8",
    title: "Human Resource",
    route: "jobs",
    logo: "https://tredumo.com/api/module_logos/admissions.png",
  },

  {
    id: "9",
    title: "Photos Manager",
    route: "rims",
    logo: "http://localhost:9000/logos/hrm.png",
  },
  {
    id: "10",
    title: "System Setup",
    route: "jobs",
    logo: "http://localhost:9000/logos/setup.png",
  },
  {
    id: "11",
    title: "System Access",
    route: "rims",
    logo: "http://localhost:9000/logos/config.png",
  },
  {
    id: "12",
    title: "Reports and Analytics",
    route: "jobs",
    logo: "http://localhost:9000/logos/reports.png",
  },
];

function Apps() {
  // const apps = useSelector((state) => state.apps.apps);
  // const apps = useSelector(selectApps);
  const taskBarApps = useSelector((state) => state.apps.taskBarApps);
  const activeApp = useSelector((state) => state.apps.activeApp);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [hoveredApp, setHoveredApp] = useState(null);

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

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
    // dispatch(viewApps(!appsVisible));
  };

  // const loadApps = async () => {
  //   try {
  //     const response = await api.get("/api/modules");

  //     console.log("response", response.data);
  //     dispatch(setApps(response.data.result));
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  // useEffect(() => {
  //   loadApps();
  // }, []);

  // console.log("apps", apps);

  // const theme = useTheme();
  const defaultWatermark = `${url}/imgs/school_logo_iso.png`;
  const watermarkSrc = hoveredApp?.logo || activeApp?.logo || defaultWatermark;

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        // backgroundColor: "red",
        height: "calc(100vh - 250px)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Watermark overlay */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <motion.img
          key={watermarkSrc}
          src={watermarkSrc}
          alt="Watermark"
          initial={{ opacity: 0, scale: 0.98, y: 6 }}
          animate={{ opacity: 0.08, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            maxWidth: "min(100vmin, 950px)",
            width: "calc(100vw - 980px)",
            height: "auto",
            filter: "grayscale(100%)",
            transform: "rotate(-12deg)",
            userSelect: "none",
          }}
        />
        {/* <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 64, sm: 96, md: 128 },
            fontWeight: 800,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: alpha(theme.palette.text.primary, 0.06),
            // transform: "rotate(-24deg)",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          Tredumo
        </Typography> */}
      </Box>

      <div
        className="p-16"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* <Typography
          variant="h4"
          className="mb-16"
          sx={{ color: "text.primary", fontWeight: 500 }}
        >
          Available Applications
        </Typography>

        <Typography
          variant="body1"
          className="mb-32"
          sx={{ color: "text.secondary" }}
        >
          Click on any application to launch it
        </Typography> */}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-24"
          style={{
            // backgroundColor: "green",
            maxHeight: "calc(100vh - 270px)",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#888 #f1f1f1",
          }}
        >
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              variants={item}
              className="flex justify-center"
              onMouseEnter={() => setHoveredApp(app)}
              onMouseLeave={() => setHoveredApp(null)}
            >
              <MyApp
                title={app.title}
                logo={app.logo}
                description={app.description}
                onClick={() => handleClick(app, index)}
                sx={{
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 3,
                  },
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Paper>
  );
}

export default Apps;
