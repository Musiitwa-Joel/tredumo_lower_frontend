import React, { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
// import AllCourses from "./AllCourses";
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
import {
  selectFeesVersions,
  setCopyFeesStructureModal,
} from "../../store/feesMgtSlice";
import SelectedFeesItems from "./SelectedFeesItems";
import AllFeesItems from "./AllFeesItems";

function OtherFees() {
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
          minSize={40}
          defaultSize={40}
          style={{
            backgroundColor: "#fff",
            // borderRightColor: "lightgray",
            // borderRightWidth: 1,
          }}
          onResize={(size) => {
            setContentWidth(size);
            setRightContentWidth(90 - size);
          }}
        >
          <SelectedFeesItems />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 10,
            // backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel
          minSize={35}
          defaultSize={40}
          style={{
            backgroundColor: "#fff",
            // borderLeftColor: "lightgray",
            // borderLeftWidth: 1,
          }}
        >
          <AllFeesItems />
        </Panel>
      </PanelGroup>

      {/* <StudentInfoModal />
      <StudentSearchModal /> */}
    </div>
  );
}

export default OtherFees;
