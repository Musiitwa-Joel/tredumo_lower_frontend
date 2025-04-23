import React, { useState } from "react";
import { Flex, Splitter, Typography } from "antd";
import AllCourses from "./AllCourses";
import ResultsDetails from "./ResultsDetails";
import ResultsConfigModal from "./ResultsConfigModal";

const Desc = (props) => (
  <Flex
    justify="center"
    align="center"
    style={{
      height: "100%",
    }}
  >
    <Typography.Title
      type="secondary"
      level={5}
      style={{
        whiteSpace: "nowrap",
      }}
    >
      {props.text}
    </Typography.Title>
  </Flex>
);

const CustomSplitter = ({ style, ...restProps }) => {
  const [panelSizes, setPanelSizes] = useState([]);
  return (
    <Splitter
      style={{
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        ...style,
      }}
      {...restProps}
      // onResize={(value) => console.log("resizing", value)}
      onResizeStart={(value) => setPanelSizes(value)}
      onResizeEnd={(value) => setPanelSizes(value)}
    >
      <Splitter.Panel collapsible defaultSize="25%" max="50%">
        <AllCourses panelWidth={panelSizes.length > 0 ? panelSizes[0] : 360} />
      </Splitter.Panel>
      <Splitter.Panel>
        <ResultsDetails />
      </Splitter.Panel>
    </Splitter>
  );
};
const ResultsView = () => (
  <Flex gap="middle" vertical>
    <CustomSplitter
      style={{
        height: "calc(100vh - 100px)",
      }}
    />
    <ResultsConfigModal />
  </Flex>
);
export default ResultsView;
