import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CategoryForm from "./CategoryForm";
import DataTable from "./DataTable";

function FeesCategories() {
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
          <CategoryForm />
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

export default FeesCategories;
