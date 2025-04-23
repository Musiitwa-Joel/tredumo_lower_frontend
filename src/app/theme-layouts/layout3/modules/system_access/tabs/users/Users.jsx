import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DataTable from "./DataTable";
import AddNewUserForm from "./AddNewUserForm";

function Users() {
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
          <AddNewUserForm />
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

export default Users;
