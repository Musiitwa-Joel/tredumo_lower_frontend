import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "@lodash";
import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Space } from "antd";
import { selectSelectedTab, setSelectedTab } from "./store/homeSlice";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateString";
// import { getProjects, selectProjects } from "./store/projectsSlice";


function ProjectDashboardAppHeader(props) {
  const dispatch = useDispatch();
  // const dispatch = useDispatch();
  // const projects = useSelector(selectProjects);
  const projects = [
    {
      id: 1,
      name: "Apps",
    },
  ];
  const userObj = useSelector((state) => state.user.user);
  const selectedTab = useSelector(selectSelectedTab);

  const [selectedProject, setSelectedProject] = useState({
    id: 1,
    menuEl: null,
  });

  // useEffect(() => {
  //   dispatch(getProjects());
  // }, [dispatch]);

  function handleChangeProject(id) {
    setSelectedProject({
      id,
      menuEl: null,
    });
  }

  function handleTabClick(event, name) {
    // setSelectedTab(name);
    dispatch(setSelectedTab(name));
  }

  function handleOpenProjectMenu(event) {
    setSelectedProject({
      id: selectedProject.id,
      menuEl: event.currentTarget,
    });
  }

  function handleCloseProjectMenu() {
    setSelectedProject({
      id: selectedProject.id,
      menuEl: null,
    });
  }

  if (_.isEmpty(projects)) {
    return null;
  }

  return (
    <div className="flex flex-col w-full px-24 sm:px-32">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-24 sm:my-32">
        <div className="flex flex-auto items-center min-w-0">
        <Avatar
            className="flex-0 w-80 h-80 border-2"
            alt="user photo"
            src={userObj?.user?.photo}
            sx={{
              backgroundColor: '#825505',
              fontSize: '1.5rem'
            }}
          >
            {!userObj?.user?.photo && userObj?.user?.first_name && userObj?.user?.other_names
              ? `${userObj?.user?.first_name[0]}${userObj?.user?.other_names[0]}`
              : ''}
          </Avatar>
          <div className="flex flex-col min-w-0 mx-16">
            <Typography 
              className="text-2xl md:text-4xl font-semibold tracking-tight leading-7 md:leading-snug truncate"
              sx={{ color: 'primary.main' }}
            >
              {`Welcome back, ${userObj?.user?.first_name} ${userObj?.user?.other_names}!`}
            </Typography>

            <Typography
              variant="body"
              className="mt-2 leading-6 truncate"
              color="text.secondary"
            >
              Last logged in: {userObj?.lastLogin?.logged_in ? formatDateString(userObj?.lastLogin?.logged_in) : "_"}
            </Typography>
          </div>
        </div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-8">
          <Button
            className="whitespace-nowrap px-16"
            variant="contained"
            color="primary"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>}
            sx={{ borderRadius: '8px', textTransform: 'none', backgroundColor: "#825505" }}

          >
            Messages
          </Button>
          <Button
            className="whitespace-nowrap px-16"
            variant="outlined"
            color="primary"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            Settings
          </Button>
        </div>
      </div>
      <div className="flex items-center mb-8">
        <div className="flex space-x-2">
          {['apps', 'notices', 'feedback'].map((tab) => (
            <Button
              key={tab}
              onClick={(e) => handleTabClick(e, tab)}
              className="h-48 px-24 text-15"
              sx={{
                backgroundColor: selectedTab === tab ? 'rgba(81, 53, 3, 0.08)' : '#fff',
                color: selectedTab === tab ? '#513503' : 'text.secondary',
                borderRadius: '12px 12px 0 0',
                borderColor: 'divider',
                borderBottom: 0,
                '&:hover': {
                  backgroundColor: selectedTab === tab ? 'rgba(81, 53, 3, 0.12)' : 'rgba(81, 53, 3, 0.04)',
                },
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectDashboardAppHeader;
