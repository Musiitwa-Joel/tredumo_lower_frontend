import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DataTable from "./SubjectDataTable";
import LevelForm from "./SubjectForm";

function Subjects() {
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
          <DataTable />
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default Subjects;
