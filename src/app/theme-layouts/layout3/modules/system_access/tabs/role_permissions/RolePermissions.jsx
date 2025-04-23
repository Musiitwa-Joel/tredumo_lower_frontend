import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import RolesTable from "./RolesTable";
import CreateRoleModal from "./CreateRoleModal";
import RolePermissionsTable from "./RolePermissionsTable";
import EditRoleModal from "./EditRoleModal";
import AllIntranetModules from "./AllIntranetModules";

function RolePermissions() {
  return (
    <>
      <PanelGroup
        direction="horizontal"
        style={{
          backgroundColor: "rgb(223, 229, 239)",
        }}
      >
        <Panel defaultSize={30} minSize={30}>
          <RolesTable />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 1,
            backgroundColor: "",
            opacity: 0.5,
          }}
        />
        <Panel minSize={60}>
          <RolePermissionsTable />
        </Panel>
      </PanelGroup>

      <CreateRoleModal />
      <EditRoleModal />
      <AllIntranetModules />
    </>
  );
}

export default RolePermissions;
