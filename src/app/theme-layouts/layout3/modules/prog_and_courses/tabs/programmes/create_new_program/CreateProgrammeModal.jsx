import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
// import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { Card, ConfigProvider, Tabs, theme } from "antd";
import "./courseStyles.css";

import CreateNewProgrammeForm from "./CreateNewProgrammeForm";
import ProgrammeAliases from "./programme_aliases/ProgrammeAliases";
import {
  selectCreateNewCourse,
  selectCreateProgrammeModalOpen,
  selectProgrammeFormDetails,
  selectSelectedCourseVersion,
  updatecreateProgrammeModalOpen,
} from "../../../store/progAndCoursesSlice";
// import ModulesDataTable from "./ModulesDataTable";
import ProgrammeDescription from "./ProgrammeDescription";
import TestTable2 from "../TestTable2";
import CourseUnits from "./CourseUnits";
import CreateNewCourseForm from "./CreateNewCourseForm";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function CustomTabPanelNoPadding(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const tabListNoTitle = [
  {
    key: "course_details",
    label: "Course Details",
  },
  {
    key: "course_aliases",
    label: "Course Aliases",
  },
  {
    key: "course_desc",
    label: "Course Description",
  },
  {
    key: "course_units",
    label: "Course Units",
  },
];

const contentListNoTitle = {
  course_details: <CreateNewCourseForm />,
  course_aliases: <ProgrammeAliases />,
  course_desc: <ProgrammeDescription />,
  course_units: <CourseUnits />,
};

export default function CreateProgrammeModal() {
  // const { createProgrammeModalOpen } = useSelector(
  //   (state) => state.progAndCourses
  // );
  const [activeTabKey2, setActiveTabKey2] = React.useState("course_details");
  const createProgrammeModalOpen = useSelector(selectCreateProgrammeModalOpen);
  const selectedCourseVersion = useSelector(selectSelectedCourseVersion);
  const createNew = useSelector(selectCreateNewCourse);
  const programFormDetails = useSelector(selectProgrammeFormDetails);
  const onTab2Change = (key) => {
    setActiveTabKey2(key);
  };

  // console.log("selected Couse version", selectedCourseVersion);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dispatch = useDispatch();

  //   console.log("modal open", createProgrammeModalOpen);
  return (
    <Dialog
      fullScreen
      open={createProgrammeModalOpen}
      onClose={() => dispatch(updatecreateProgrammeModalOpen(false))}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => dispatch(updatecreateProgrammeModalOpen(false))}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {selectedCourseVersion && !createNew
              ? `(${selectedCourseVersion.parent.code}) ${selectedCourseVersion.parent.label} - ${selectedCourseVersion.selected.label}`
              : "CREATE A NEW PROGRAMME/COURSE"}
          </Typography>
          {/* <Button
            autoFocus
            color="inherit"
            onClick={() => dispatch(updatecreateProgrammeModalOpen(false))}
          >
            save
          </Button> */}
        </Toolbar>
      </AppBar>

      <ConfigProvider
        theme={{
          components: {
            Card: {
              borderRadius: 0,
              borderRadiusLG: 0,
            },
          },
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <Card
          style={{
            width: "100%",
            borderColor: "lightgray",
          }}
          size="small"
          tabList={tabListNoTitle}
          activeTabKey={activeTabKey2}
          bordered
          onTabChange={onTab2Change}
          tabProps={{
            size: "small",
          }}
        >
          {contentListNoTitle[activeTabKey2]}
        </Card>
      </ConfigProvider>

      {/* <ConfigProvider
        theme={{
          token: {
            colorBorder: "lightgray",
          },
          components: {
            Tabs: {
              cardBg: "#f0f0f0",
              cardGutter: 5,
              cardPadding: 30,
              // // itemActiveColor: "black",
              itemColor: "#000",
              itemSelectedColor: "dodgerblue",
              fontSize: 20,
              fontWeight: "bold",

              // itemHoverColor: "#fff",
            },
          },
        }}
      >
        <Tabs
          defaultActiveKey="1"
          // tabPosition="left"
          tabBarStyle={{
            // backgroundColor: "#384c6e",
            paddingTop: 10,
            paddingLeft: 5,
          }}
          // centered
          type="card"
          style={{
            height: "100%",
          }}
          items={[
            {
              label: `Course Details`,
              key: "course_details",
              // disabled: i === 28,
              children: (
                <div
                  style={{
                    marginTop: 15,
                    marginRight: 20,
                  }}
                >
                  <CreateNewCourseForm />
                </div>
              ),
            },
            {
              label: `Course Aliases`,
              key: "course_aliases",
              // disabled: i === 28,
              children: (
                <div
                  style={{
                    marginTop: 10,
                    marginRight: 20,
                  }}
                >
                  <ProgrammeAliases />
                </div>
              ),
            },
            {
              label: `Course Description`,
              key: "course_desc",
              // disabled: i === 28,
              children: (
                <div
                  style={{
                    marginTop: 10,
                    marginRight: 20,
                  }}
                >
                  <ProgrammeDescription />
                </div>
              ),
            },
            {
              label: `Course Units`,
              key: "course_units",
              // disabled: i === 28,
              children: (
                <div
                  style={{
                    marginTop: 10,
                    marginRight: 20,
                  }}
                >
                  <CourseUnits />
                </div>
              ),
            },
          ]}
        />
      </ConfigProvider> */}
    </Dialog>
  );
}
