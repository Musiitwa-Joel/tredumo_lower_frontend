import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProgAliasForm from "./ProgAliasForm";
import DataTable from "./DataTable";

function ProgrammeAliases() {
  return (
    <div
      style={{
        flex: 1,
        // backgroundColor: "red",
        height: "calc(100vh - 125px)",
      }}
    >
      <PanelGroup direction="horizontal">
        <Panel defaultSize={30} minSize={25}>
          <ProgAliasForm />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 1.5,
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

export default ProgrammeAliases;
