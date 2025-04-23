import React, { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
// import AllCourses from "./AllCourses";
import { Box, Typography } from "@mui/material";
import { Button, ConfigProvider, Space, Tooltip } from "antd";
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
import AllLevels from "./AllLevels";
import FeesDetails from "./FeesDetails";
import {
  selectFeesVersions,
  setCopyFeesStructureModal,
} from "../../store/feesMgtSlice";
import { FloatButton } from "antd";
// import StudentDetails from "./StudentDetails";
// import StudentInfoModal from "./StudentInfoModal";
// import StudentSearchModal from "./StudentSearchModal";
// import {
//   setReloadStdCourses,
//   setStudentSearchModalVisible,
// } from "../../store/infoCenterSlice";

// import TestTable from "./TestTable";

function FunctionalFees() {
  const [contentWidth, setContentWidth] = useState(30);
  const [rightContentWidth, setRightContentWidth] = useState(60);
  const dispatch = useDispatch();
  const feesVersions = useSelector(selectFeesVersions);

  const { selectedItem } = useSelector((state) => state.progAndCourses);

  // const handleSearchStudent = () => {
  //   dispatch(setStudentSearchModalVisible(true));
  // };

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
            <Tooltip title="Create Fees Structure">
              <Button
                size="small"
                icon={<CopyAll />}
                // disabled={!selectedItem || selectedItem.typename != "Course"}
                onClick={() => dispatch(setCopyFeesStructureModal(true))}
              >
                Copy Fees Structure
              </Button>
            </Tooltip>

            <Tooltip title="Reload">
              <Button
                // onClick={() => {
                //   dispatch(setReloadStdCourses(true));
                // }}
                size="small"
                icon={<Refresh />}
              >
                Reload
              </Button>
            </Tooltip>
          </Space>
        </div>
      </Box>
      <PanelGroup direction="horizontal">
        <Panel
          minSize={35}
          defaultSize={35}
          onResize={(size) => {
            setContentWidth(size);
            setRightContentWidth(90 - size);
          }}
        >
          {/* <AllProgrammes panelWidth={contentWidth} /> */}
          {/* <AllCourses panelWidth={contentWidth} /> */}
          <AllLevels />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 1.5,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel minSize={50} defaultSize={50}>
          <FeesDetails />
        </Panel>
      </PanelGroup>

      {/* <StudentInfoModal />
      <StudentSearchModal /> */}
    </div>
  );
}

export default FunctionalFees;
