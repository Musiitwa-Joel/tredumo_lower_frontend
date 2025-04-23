import React, { useRef, useEffect, useState } from "react";
import { SmileOutlined } from "@ant-design/icons";
import {
  Timeline,
  Badge,
  Card,
  Radio,
  Descriptions,
  Row,
  Col,
  Button,
  ConfigProvider,
} from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";

import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";
import { Delete, Edit, Print, RemoveRedEye } from "@mui/icons-material";
import { useLazyQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

function formatCustomDate(dateString) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const date = new Date(dateString);

  const day = days[date.getDay()]; // Day abbreviation
  const month = months[date.getMonth()]; // Month abbreviation
  const dateOfMonth = date.getDate(); // Day of the month
  const year = date.getFullYear(); // Year

  // Format hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format

  return `${day}-${month}-${dateOfMonth}-${year}`;
}

const EducationInformation = () => {
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const [selectedReg, setSelectedReg] = React.useState(null);
  const [selectedModules, setSelectedModules] = useState([]);

  const handlePreviewExamPermit = async (reg) => {};

  // console.log("student file", studentFile);

  useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
      });
    }

    return () => {
      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, []);
  return (
    <>
      <div
        style={{
          marginBottom: 10,
        }}
      >
        <Radio.Group
        //    value={activeBioDataTab}
        //    onChange={handleTabChange}
        >
          <Radio.Button value="academic_info">
            Add New Education Information
          </Radio.Button>
        </Radio.Group>
      </div>
      <div
        ref={scrollContainerRef}
        style={{
          position: "relative",
          height: "calc(100vh - 350px)", // Adjust this height as needed
          // marginTop: 10,
          //   backgroundColor: "red",
          padding: 20,
          overflow: "hidden", // Hide default scrollbars
        }}
      >
        <ConfigProvider
          key={"registration"}
          theme={{
            components: {
              Timeline: {
                tailColor: "lightgray",
              },
              Card: {
                headerBg: "#f4f4f4",
                headerHeightSM: 38,
              },
            },
          }}
        >
          <Timeline
            items={[
              {
                color: "blue",
                // dot: <SmileOutlined />,
                children: (
                  <Card
                    key={"registration"}
                    title={`UCE (JAN 2012 - JAN 2017)`}
                    size="small"
                    style={{
                      borderColor: "lightgray",
                      borderWidth: 1,
                    }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={12} lg={14} xl={16}>
                        <Descriptions
                          className="custom-descriptions"
                          bordered
                          size="small"
                          style={{
                            borderColor: "lightgray",
                            borderWidth: 0.2,
                            borderRadius: 10,
                          }}
                          labelStyle={{
                            width: "40%",
                            backgroundColor: "#e7edfe",
                            color: "#0832b7",
                            fontWeight: "bold",
                          }}
                          contentStyle={{
                            borderBottomColor: "red",
                            textAlign: "left",
                          }}
                          column={2}
                          items={[
                            {
                              key: "1",
                              label: "Institution",
                              children: `KITTEBI SECONDARY SCHOOL`,
                              span: 2,
                            },
                            {
                              key: "6",
                              label: "Award Obtained",
                              children: "UCE",
                              span: 2,
                            },
                            {
                              key: "7",
                              label: "Award Type",
                              children: "O LEVEL",
                              span: 2,
                            },
                            {
                              key: "8",
                              label: "Award Duration",
                              children: "3 Years",
                              span: 2,
                            },
                            {
                              key: "9",
                              label: "Grade",
                              children: "DIVISION 1",
                              span: 2,
                            },
                          ]}
                        />
                      </Col>

                      <Col xs={24} sm={12} md={12} lg={10} xl={8}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8, // Space between buttons
                            marginTop: 2,
                            marginBottom: 10,
                          }}
                        >
                          <Button
                            type="primary"
                            ghost
                            icon={<Print />}
                            style={{ width: "100%" }}
                            // loading={loading}
                            // disabled={loading}
                            onClick={() => handlePreviewExamPermit(reg)}
                          >
                            Preview Attachment
                          </Button>

                          <Button
                            type="primary"
                            ghost
                            icon={<Edit />}
                            style={{ width: "100%" }}
                            // loading={loading}
                            // disabled={loading}
                            // onClick={() => handlePreviewExamPermit(reg)}
                          >
                            Edit Information
                          </Button>
                          <Button
                            type="primary"
                            ghost
                            danger
                            icon={<Edit />}
                            style={{ width: "100%" }}
                            // loading={loading}
                            // disabled={loading}
                            // onClick={() => handlePreviewExamPermit(reg)}
                          >
                            Delete Information
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ),
              },

              {
                color: "blue",
                dot: <SmileOutlined />,
                children: (
                  <Card
                    key={"registration"}
                    title={`UCE (JAN 2012 - JAN 2017)`}
                    size="small"
                    style={{
                      borderColor: "lightgray",
                      borderWidth: 1,
                    }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={12} lg={14} xl={16}>
                        <Descriptions
                          className="custom-descriptions"
                          bordered
                          size="small"
                          style={{
                            borderColor: "lightgray",
                            borderWidth: 0.2,
                            borderRadius: 10,
                          }}
                          labelStyle={{
                            width: "40%",
                            backgroundColor: "#e7edfe",
                            color: "#0832b7",
                            fontWeight: "bold",
                          }}
                          contentStyle={{
                            borderBottomColor: "red",
                            textAlign: "left",
                          }}
                          column={2}
                          items={[
                            {
                              key: "1",
                              label: "Institution",
                              children: `KITTEBI SECONDARY SCHOOL`,
                              span: 2,
                            },
                            {
                              key: "6",
                              label: "Award Obtained",
                              children: "UCE",
                              span: 2,
                            },
                            {
                              key: "7",
                              label: "Award Type",
                              children: "O LEVEL",
                              span: 2,
                            },
                            {
                              key: "8",
                              label: "Award Duration",
                              children: "3 Years",
                              span: 2,
                            },
                            {
                              key: "9",
                              label: "Grade",
                              children: "DIVISION 1",
                              span: 2,
                            },
                          ]}
                        />
                      </Col>

                      <Col xs={24} sm={12} md={12} lg={10} xl={8}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8, // Space between buttons
                            marginTop: 2,
                            marginBottom: 10,
                          }}
                        >
                          <Button
                            type="primary"
                            ghost
                            icon={<Print />}
                            style={{ width: "100%" }}
                            // loading={loading}
                            // disabled={loading}
                            onClick={() => handlePreviewExamPermit(reg)}
                          >
                            Preview Attachment
                          </Button>
                          <Button
                            type="primary"
                            ghost
                            icon={<Edit />}
                            style={{ width: "100%" }}
                            // loading={loading}
                            // disabled={loading}
                            // onClick={() => handlePreviewExamPermit(reg)}
                          >
                            Edit Information
                          </Button>
                          <Button
                            type="primary"
                            ghost
                            danger
                            icon={<Edit />}
                            style={{ width: "100%" }}
                            // loading={loading}
                            // disabled={loading}
                            // onClick={() => handlePreviewExamPermit(reg)}
                          >
                            Delete Information
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ),
              },
            ]}
          />
        </ConfigProvider>
      </div>
    </>
  );
};

export default EducationInformation;
