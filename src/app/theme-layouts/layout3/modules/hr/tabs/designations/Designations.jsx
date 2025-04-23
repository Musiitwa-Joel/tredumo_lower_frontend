import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DataTable from "./DataTable";
import DesignationForm from "./DesignationForm";

function Designations() {
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
          defaultSize={30}
          minSize={25}
          style={{
            backgroundColor: "#fff",
          }}
        >
          <DesignationForm />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 1.5,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel minSize={65}>
          <DataTable />{" "}
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default Designations;
