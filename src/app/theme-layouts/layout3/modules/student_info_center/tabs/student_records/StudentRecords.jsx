import React, { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import AllCourses from "./AllCourses";
import { Box } from "@mui/material";
import { Button, Space, Tooltip } from "antd";
import {
  Add,
  CopyAll,
  Download,
  Edit,
  Refresh,
  SearchSharp,
  Tune,
  Upload,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import StudentDetails from "./StudentDetails";
import StudentInfoModal from "./StudentInfoModal";
import StudentSearchModal from "./StudentSearchModal";
import {
  setAddStudentModalVisible,
  setReloadStdCourses,
  setStudentSearchModalVisible,
  setUploadStudentsModalVisible,
} from "../../store/infoCenterSlice";
import AddNewStudentModal from "./student_details/AddNewStudentModal";
import UploadStudentsModal from "./student_details/UploadStudentsModal";

// import TestTable from "./TestTable";

function StudentRecords() {
  const [contentWidth, setContentWidth] = useState(30);
  const [rightContentWidth, setRightContentWidth] = useState(60);
  const dispatch = useDispatch();

  const handleSearchStudent = () => {
    dispatch(setStudentSearchModalVisible(true));
  };

  // console.log("selected item", selectedItem);

  return (
    <div
      style={{
        height: "calc(100vh - 113px)",
        // backgroundColor: "red",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderColor: "lightgray",
          borderWidth: 1,
          // marginBottom: 1,
        }}
        className="p-8"
        style={{
          paddingLeft: 15,
          paddingRight: 15,
          marginTop: 7,
          marginBottom: 7,
          // marginLeft: 10,
          // marginRight: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Space wrap>
            <Tooltip title="Search Student">
              <Button
                size="small"
                danger
                type="primary"
                ghost
                icon={
                  <SearchSharp
                    style={{
                      fontSize: 13,
                    }}
                  />
                }
                onClick={handleSearchStudent}
              >
                Search Student
              </Button>
            </Tooltip>

            <Button
              size="small"
              icon={<Add />}
              // disabled={!selectedItem || selectedItem.typename != "Course"}
              onClick={() => dispatch(setAddStudentModalVisible(true))}
            >
              Add New Student
            </Button>

            <Button
              size="small"
              icon={<Upload />}
              onClick={() => dispatch(setUploadStudentsModalVisible(true))}
            >
              Upload Students
            </Button>

            <Button
              size="small"
              icon={<Download />}
              // onClick={handleCoursesDownload}
            >
              Download Students
            </Button>

            <Tooltip title="Reload Courses">
              <Button
                onClick={() => {
                  dispatch(setReloadStdCourses(true));
                }}
                size="small"
                icon={<Refresh />}
              >
                Reload Courses
              </Button>
            </Tooltip>
          </Space>

          {/* <Space>
            <Tooltip title="Switch Data View">
              <Button
                size="small"
                icon={<Tune />}
                // onClick={handleCoursesDownload}
              >
                Switch View To List View
              </Button>
            </Tooltip>
          </Space> */}
        </div>
      </Box>
      <PanelGroup direction="horizontal">
        <Panel
          minSize={25}
          defaultSize={30}
          onResize={(size) => {
            setContentWidth(size);
            setRightContentWidth(90 - size);
          }}
        >
          {/* <AllProgrammes panelWidth={contentWidth} /> */}
          <AllCourses panelWidth={contentWidth} />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 1.5,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel minSize={60} defaultSize={60}>
          {/* <ModulesDataTable /> */}
          <StudentDetails panelWidth={rightContentWidth} />
          {/* <TestTable2 /> */}
        </Panel>
      </PanelGroup>
      <StudentInfoModal />
      <StudentSearchModal />
      <AddNewStudentModal />
      <UploadStudentsModal />
    </div>
  );
}

export default StudentRecords;
