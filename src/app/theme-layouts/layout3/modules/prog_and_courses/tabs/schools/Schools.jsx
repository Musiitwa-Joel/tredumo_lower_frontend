import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DataTable from "./DataTable";
import SchoolForm from "./SchoolForm";

function Schools() {
  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={30} minSize={30}>
          <SchoolForm />
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

export default Schools;
