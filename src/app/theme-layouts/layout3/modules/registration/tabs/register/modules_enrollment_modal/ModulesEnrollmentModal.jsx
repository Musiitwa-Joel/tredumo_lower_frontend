import * as React from "react";
import Dialog from "@mui/material/Dialog";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useDispatch, useSelector } from "react-redux";

import {
  selectModulesEnrollmentModalOpen,
  selectSelectedEnrollment,
  selectStudentData,
  setModulesEnrollmentModalOpen,
} from "../../../store/registrationSlice";
import AllModules from "./AllModules";
import SelectedModules from "./SelectedModules";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function ModulesEnrollmentModal() {
  const studentFile = useSelector(selectStudentData);
  const selectedEnrollment = useSelector(selectSelectedEnrollment);
  const moduleEnrollmentModalOpen = useSelector(
    selectModulesEnrollmentModalOpen
  );

  // console.log("selected enrollment", selectedEnrollment);

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const dispatch = useDispatch();

  //   console.log("modal open", createProgrammeModalOpen);
  return (
    <Dialog
      fullScreen
      open={moduleEnrollmentModalOpen}
      onClose={() => dispatch(setModulesEnrollmentModalOpen(false))}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => dispatch(setModulesEnrollmentModalOpen(false))}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {`Modules Registration - ${studentFile?.biodata?.surname} ${studentFile?.biodata?.other_names} (YEAR ${selectedEnrollment?.study_yr}, SEMESTER ${selectedEnrollment?.sem})`}
          </Typography>
        </Toolbar>
      </AppBar>

      <PanelGroup
        direction="horizontal"
        style={{
          padding: 15,
          backgroundColor: "rgb(223, 229, 239)",
          height: "calc(100vh - 116px)",
        }}
      >
        <Panel
          minSize={40}
          defaultSize={40}
          style={{
            backgroundColor: "#fff",
            // borderRightColor: "lightgray",
            // borderRightWidth: 1,
          }}
        >
          <AllModules />
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
          <SelectedModules />
        </Panel>
      </PanelGroup>
    </Dialog>
  );
}
