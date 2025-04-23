import React from "react";
import Dialog from "@mui/material/Dialog";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { useDispatch, useSelector } from "react-redux";
import {
  selectManageProgramsModalVisible,
  selectRunningAdmission,
  setManageProgramsModalVisible,
} from "../../../admissionsSlice";
import AllProgrammesTable from "./AllProgrammesTable";
import AdvertisedProgrammes from "./AdvertisedProgrammes";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ManageProgramsModal() {
  const dispatch = useDispatch();
  const manageProgramsModalVisible = useSelector(
    selectManageProgramsModalVisible
  );
  const selectedAdmission = useSelector(selectRunningAdmission);

  //   console.log("selected", selectedAdmission);
  if (!selectedAdmission) return null;
  return (
    <Dialog
      fullScreen
      open={manageProgramsModalVisible}
      onClose={() => dispatch(setManageProgramsModalVisible(false))}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => dispatch(setManageProgramsModalVisible(false))}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {`MANAGE PROGRAMS - ${selectedAdmission.scheme.scheme_title} SCHEME, ${selectedAdmission.intake.intake_title} INTAKE ${selectedAdmission.acc_yr.acc_yr_title}`}
          </Typography>
        </Toolbar>
      </AppBar>

      <PanelGroup direction="horizontal">
        <Panel defaultSize={50} minSize={25}>
          {/* <CollegeForm /> */}
          <div
            style={{
              padding: 10,
            }}
          >
            <AllProgrammesTable />
          </div>
        </Panel>
        <PanelResizeHandle
          style={{
            width: 2,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel minSize={25}>
          <div
            style={{
              padding: 10,
            }}
          >
            <AdvertisedProgrammes />
          </div>
        </Panel>
      </PanelGroup>
    </Dialog>
  );
}

export default ManageProgramsModal;
