import React from "react";
import { motion } from "framer-motion";
import TimeCollections from "./TimeCollections";
import TredPieReport from "./TredPieReport";
import TredPayBarReport from "./TredPayBarReport";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import TredPayBarRace from "./TredBarRace";

function FeesStructure() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        height: "calc(100vh - 100px)",
      }}
    >
      <TimeCollections />

      <div style={{ marginTop: 10, height: "calc(100vh - 200px)" }}>
        <PanelGroup direction="horizontal">
          <Panel
            defaultSize={50}
            minSize={10}
            style={{
              backgroundColor: "#fff",
            }}
          >
            <TredPieReport />
          </Panel>
          <PanelResizeHandle
            style={{
              width: 3,
              backgroundColor: "lightgray",
              opacity: 0.6,
            }}
          />
          <Panel
            defaultSize={50}
            minSize={10}
            style={{
              backgroundColor: "#fff",
            }}
          >
            <div>
              <TredPayBarReport />
            </div>
            <TredPayBarRace />
          </Panel>
        </PanelGroup>
      </div>
    </motion.div>
  );
}

export default FeesStructure;
