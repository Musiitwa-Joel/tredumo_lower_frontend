import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import GradingSystemsTable from "./GradingSystemsTable";
import GradingDetailsTable from "./GradingDetailsTable";

function GradingSystems() {
  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={25} minSize={25}>
          <GradingSystemsTable />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 2,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel minSize={65}>
          <GradingDetailsTable />
        </Panel>
      </PanelGroup>
    </>
  );
}

export default GradingSystems;
