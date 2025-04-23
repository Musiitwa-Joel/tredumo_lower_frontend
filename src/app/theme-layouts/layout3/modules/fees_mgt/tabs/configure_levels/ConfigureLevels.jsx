import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DataTable from "./DataTable";
import SchoolLevelForm from "./SchoolLevelForm";

function ConfigureLevels() {
  return (
    <div
      style={{
        flex: 1,
        // backgroundColor: "red",
        height: "calc(100vh - 100px)",
      }}
    >
      <PanelGroup direction="horizontal">
        <Panel
          defaultSize={60}
          minSize={55}
          style={
            {
              // backgroundColor: "#fff",
            }
          }
        >
          <DataTable />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 1.5,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel
          minSize={30}
          style={{
            backgroundColor: "#fff",
          }}
        >
          <SchoolLevelForm />
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default ConfigureLevels;
