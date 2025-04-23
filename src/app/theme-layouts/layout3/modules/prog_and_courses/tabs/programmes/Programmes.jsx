import React, { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import AllCourses from "./create_new_program/AllCourses";
import CourseUnitsDatable from "./CourseUnitsDataTable";
import { Box, Typography } from "@mui/material";
import { Button, Space, Tooltip } from "antd";
import {
  Add,
  CopyAll,
  Download,
  Edit,
  Refresh,
  Upload,
} from "@mui/icons-material";
import CreateProgrammeModal from "./create_new_program/CreateProgrammeModal";
import UploadProgrammesModal from "./UploadProgrammesModal";
import AllProgrammesModal from "./AllProgrammesModal";
import { useDispatch, useSelector } from "react-redux";
import {
  resetProgrammeFormDetails,
  selectSelectedItem,
  setCourseVersionToEdit,
  setCreateNewCourse,
  setReloadCourses,
  setSelectedCourseVersion,
  updateAddVersionModalOpen,
  updatecreateProgrammeModalOpen,
  updateDownloadProgrammesModalOpen,
  updateUploadProgrammesModalOpen,
} from "../../store/progAndCoursesSlice";
import CreateVersionModal from "./CreateVersionModal";
import CreateModuleForm from "./CreateModuleForm";
import UploadModulesModal from "./create_new_program/UploadModulesModal";
import CourseUnitDetails from "./create_new_program/CourseUnitDetails";
// import TestTable from "./TestTable";

function Programmes() {
  const [contentWidth, setContentWidth] = useState(30);
  const [rightContentWidth, setRightContentWidth] = useState(60);
  const dispatch = useDispatch();

  const selectedItem = useSelector(selectSelectedItem);

  const handleCreateNewCourse = () => {
    dispatch(setCreateNewCourse(true));
    dispatch(resetProgrammeFormDetails());
    dispatch(updatecreateProgrammeModalOpen(true));
  };

  const handleCoursesUpload = () => {
    dispatch(updateUploadProgrammesModalOpen(true));
  };

  const handleCoursesDownload = () => {
    dispatch(updateDownloadProgrammesModalOpen(true));
  };

  const handleCreateCourseVersion = () => {
    // console.log("add version");
    dispatch(setCourseVersionToEdit(null));
    dispatch(updateAddVersionModalOpen(true));
  };

  const handleReload = () => {
    // console.log("add version");
    dispatch(setReloadCourses(true));
  };

  const handleEditVersion = () => {
    // console.log("add version");
    dispatch(updateAddVersionModalOpen(true));
  };

  // console.log("selected item", selectedItem);

  return (
    <div
      style={{
        height: "calc(100vh - 113px)",
        backgroundColor: "#ecf0f6",
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
        <div>
          <Space wrap>
            <Button size="small" icon={<Add />} onClick={handleCreateNewCourse}>
              Create New Course
            </Button>

            <Button
              size="small"
              icon={<Add />}
              disabled={!selectedItem || selectedItem.typename != "Course"}
              onClick={handleCreateCourseVersion}
            >
              Create Course Version
            </Button>

            <Button
              disabled={
                !selectedItem || selectedItem.typename != "CourseVersion"
              }
              onClick={handleEditVersion}
              size="small"
              icon={<Edit />}
            >
              Edit Version
            </Button>

            <Button
              size="small"
              icon={<Upload />}
              onClick={handleCoursesUpload}
            >
              Upload Courses
            </Button>

            <Button
              size="small"
              icon={<Download />}
              onClick={handleCoursesDownload}
            >
              Download Courses
            </Button>

            <Button disabled size="small" icon={<CopyAll />}>
              Copy Version
            </Button>

            <Button
              onClick={handleReload}
              size="small"
              icon={
                <Refresh
                // onClick={async () => {
                //   await refetch();
                //   console.log("refetch...");
                //   // if (networkStatus === NetworkStatus.refetch) {
                //   //   console.log("Refetching...");
                //   // }
                // }}
                />
              }
            >
              Reload Courses
            </Button>

            <Button
              // onClick={handleReload}
              size="small"
              disabled
              icon={
                <Refresh
                // onClick={async () => {
                //   await refetch();
                //   console.log("refetch...");
                //   // if (networkStatus === NetworkStatus.refetch) {
                //   //   console.log("Refetching...");
                //   // }
                // }}
                />
              }
            >
              Reload Modules
            </Button>
          </Space>
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
            width: 1,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel minSize={60} defaultSize={60}>
          {/* <ModulesDataTable /> */}
          <CourseUnitsDatable panelWidth={rightContentWidth} />
          {/* <TestTable2 /> */}
        </Panel>
      </PanelGroup>
      <CreateProgrammeModal />
      <UploadProgrammesModal />
      <AllProgrammesModal />
      <CreateVersionModal />
      <CreateModuleForm />
      <UploadModulesModal />
      <CourseUnitDetails />
    </div>
  );
}

export default Programmes;
