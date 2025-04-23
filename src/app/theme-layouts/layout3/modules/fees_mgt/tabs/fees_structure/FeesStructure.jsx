import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DataTable from "./DataTable";
import FeesStructureForm from "./FeesStructureForm";

function FeesStructure() {
  return (
    <div
      style={{
        flex: 1,
        // backgroundColor: "red",
        height: "calc(100vh - 99.2px)",
      }}
    >
      <PanelGroup direction="horizontal">
        <Panel
          defaultSize={35}
          minSize={30}
          style={{
            backgroundColor: "#fff",
          }}
        >
          <FeesStructureForm />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 1,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel minSize={65}>
          <DataTable />
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default FeesStructure;
