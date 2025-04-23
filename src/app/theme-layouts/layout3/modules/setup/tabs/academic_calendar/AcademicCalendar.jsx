import React, { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import DataTable from "./DataTable";
import AccademicCalendarForm from "./AccademicCalendarForm";
import { FloatButton, Modal, Switch } from "antd";
import { Settings } from "@mui/icons-material";
import "./styles.css";

function AcademicCalendar() {
  const [settingModalOpen, setSettingsModalOpen] = useState(false);

  const handleOk = () => {
    setSettingsModalOpen(false);
  };
  const handleCancel = () => {
    setSettingsModalOpen(false);
  };
  return (
    <div
      style={{
        flex: 1,
        // backgroundColor: "red",
        height: "calc(100vh - 100px)",
      }}
    >
      <Modal
        title="Settings"
        open={settingModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
      >
        <div
          style={{
            borderTopColor: "lightgray",
            borderTopWidth: 1,
            borderBottomColor: "lightgray",
            borderBottomWidth: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 5,
            }}
          >
            <div>Automatically Close And Open Semesters</div>
            <div>
              {" "}
              <Switch
                defaultChecked

                // onChange={onChange}
              />
            </div>
          </div>
        </div>
      </Modal>
      <PanelGroup direction="horizontal">
        <Panel
          defaultSize={30}
          minSize={25}
          style={{
            backgroundColor: "#fff",
          }}
        >
          <AccademicCalendarForm />
        </Panel>
        <PanelResizeHandle
          style={{
            width: 1,
            backgroundColor: "lightgray",
            opacity: 0.6,
          }}
        />
        <Panel minSize={65}>
          {" "}
          <DataTable />{" "}
        </Panel>
      </PanelGroup>

      <FloatButton
        style={{
          bottom: 70,
        }}
        onClick={() => setSettingsModalOpen(true)}
        icon={<Settings />}
        tooltip={<div>Settings</div>}
      />
    </div>
  );
}

export default AcademicCalendar;
