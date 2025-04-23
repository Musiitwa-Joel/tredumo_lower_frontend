import MyApp from "app/theme-layouts/layout3/components/my_app/MyApp";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
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
    title: "RIMS",
    route: "rims",
    logo: "https://tredumo.com/api/module_logos/admissions.png",
  },
  {
    id: "2",
    title: "Jobs",
    route: "jobs",
    logo: "https://tredumo.com/api/module_logos/admissions.png",
  },
];

function Apps() {
  // const apps = useSelector((state) => state.apps.apps);
  const apps = useSelector(selectApps);
  const taskBarApps = useSelector((state) => state.apps.taskBarApps);
  const activeApp = useSelector((state) => state.apps.activeApp);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const loadApps = async () => {
    try {
      const response = await api.get("/api/modules");

      console.log("response", response.data);
      dispatch(setApps(response.data.result));
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  // console.log("apps", apps);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        backgroundColor: 'transparent',
        height: 'calc(100vh - 290px)',
        overflow: 'hidden'
      }}
    >
      <div className="p-24">
        <Typography 
          variant="h4" 
          className="mb-16"
          sx={{ color: 'text.primary', fontWeight: 500 }}
        >
          Available Applications
        </Typography>
        
        <Typography 
          variant="body1" 
          className="mb-32"
          sx={{ color: 'text.secondary' }}
        >
          Click on any application to launch it
        </Typography>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-24"
          style={{
            maxHeight: 'calc(100vh - 400px)',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #f1f1f1',
          }}
        >
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              variants={item}
              className="flex justify-center"
            >
              <MyApp
                title={app.title}
                logo={app.logo}
                description={app.description}
                onClick={() => handleClick(app, index)}
                sx={{
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  }
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
