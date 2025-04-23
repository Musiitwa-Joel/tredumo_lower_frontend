import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import UniversityLogo from "./UniversityLogo";
import GeneralInfoForm from "./GeneralInfoForm";
// import CollegeForm from "./CollegeForm";
// import DataTable from "./DataTable";

function GeneralInformation() {
  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={35} minSize={35}>
          <UniversityLogo />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 2,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel minSize={65}>
          <GeneralInfoForm />
        </Panel>
      </PanelGroup>
    </>
  );
}

export default GeneralInformation;
