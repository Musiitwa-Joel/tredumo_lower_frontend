import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ClassesDataTable from "./ClassesDataTable";
import LevelForm from "./ClassesForm";

function Sections() {
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
          defaultSize={30}
          minSize={25}
          style={{
            backgroundColor: "#fff",
          }}
        >
          <LevelForm />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 2,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel minSize={65}>
          <ClassesDataTable />
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default Sections;
