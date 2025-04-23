import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CollegeForm from "./CollegeForm";
import DataTable from "./DataTable";

function College() {
  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={25} minSize={25}>
          <CollegeForm />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 2,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel minSize={65}>
          <DataTable />
        </Panel>
      </PanelGroup>
    </>
  );
}

export default College;
