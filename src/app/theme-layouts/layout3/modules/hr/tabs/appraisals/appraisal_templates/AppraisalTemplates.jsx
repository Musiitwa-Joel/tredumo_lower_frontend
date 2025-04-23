import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import AppraisalTemplateForm from "./AppraisalTemplateForm";
import DataTable from "./DataTable";
import TemplatePreview from "./TemplatePreview";

function AppraisalTemplates() {
  return (
    <div
      style={{
        flex: 1,
        // backgroundColor: "red",
        height: "calc(100vh - 99.2px)",
        // padding: 10,
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
          <AppraisalTemplateForm />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 1.5,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel minSize={65}>
          {" "}
          <DataTable />{" "}
        </Panel>
      </PanelGroup>
      <TemplatePreview />
    </div>
  );
}

export default AppraisalTemplates;
