import React, { useState, useEffect } from "react";
import { Layout, Card, Statistic, Col, Space, ConfigProvider } from "antd";
import {
  UserAddOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import ReportLineChart from "./ReportLineChart";
import ReportTable from "./ReportTable";
import ReportGauge from "./ReportGauge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { selectRegistrationReport } from "../../../store/registrationSlice";
const { Header, Footer, Sider, Content } = Layout;

const facultyData = [
  { school_code: "SCI", registered: 300, provisional: 150, enrolled: 200 },
];

function aggregateFacultyData(reportSummaries) {
  return Object.values(
    reportSummaries.reduce((aggregated, summary) => {
      const {
        school_code,
        total_registered,
        total_provisional,
        total_enrolled,
      } = summary;

      // Check if the school_code already exists in the aggregated object
      if (!aggregated[school_code]) {
        aggregated[school_code] = {
          school_code,
          total_registered: 0,
          total_provisional: 0,
          total_enrolled: 0,
        };
      }

      // Aggregate the totals
      aggregated[school_code].total_registered += total_registered;
      aggregated[school_code].total_provisional += total_provisional;
      aggregated[school_code].total_enrolled += total_enrolled;

      return aggregated;
    }, {})
  );
}

const contentStyle = {
  //   textAlign: "center",
  maxHeight: "calc(100vh - 380px)",
  minHeight: "calc(100vh - 380px)",
  //   lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#fff",
  padding: "0px 0px",
  //   borderColor: "lightgray",
  //   borderWidth: 1,
  borderRadius: 10,
};
const siderStyle = {
  //   lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#f4f4f4",
  display: "flex",
  flexDirection: "column",
  overflow: "scroll",
  justifyContent: "space-between", // Ensures space distribution
  height: "100vh", // Makes sure the Sider takes the full height
};
const footerStyle = {
  //   textAlign: "center",
  maxHeight: "calc(100vh - 515px)",
  minHeight: "calc(100vh - 610px)",
  //   height: "50%",
  //   height: "calc(100vh)",
  color: "#fff",
  backgroundColor: "#f4f4f4",
  padding: 0,
  marginTop: 10,
  overflow: "hidden",
  //   borderColor: "lightgray",
  //   borderWidth: 0,
  //   borderRadius: 10,
};
const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "calc(100%)",
  maxWidth: "calc(100%)",
  height: "calc(100vh - 160px)",
  //   backgroundColor: "red",
};
const ReportDetails = () => {
  const [height, setHeight] = useState(window.innerHeight - 602);
  const regReport = useSelector(selectRegistrationReport);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight - 602); // Update height when window is resized (example: half of the window height)
    };

    // Add event listener for window resizing
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [height]);
  return (
    <Layout
      style={{
        borderRadius: 8,
        overflow: "hidden",
        width: "calc(100%)",
        maxWidth: "calc(100%)",
        height: "calc(100vh - 160px)",
        // backgroundColor: "red",
      }}
    >
      <div
        style={{
          height: "calc(100vh - 160px)",
        }}
      >
        <div
          style={{
            height: "calc(100vh - 386px)",
            backgroundColor: "#fff",
            marginBottom: 10,
          }}
        >
          <ReportTable />
        </div>
        <div
          style={{
            minHeight: 400,
          }}
        >
          <Card
            title="Student Statistics per Faculty"
            bordered={true}
            style={{
              // backgroundColor: "#f0f5ff",
              borderRadius: "8px",
              borderColor: "lightgray",
              borderWidth: 1,
            }}
          >
            <ResponsiveContainer width="100%" height={125}>
              <LineChart
                data={aggregateFacultyData(regReport?.report_summary || [])}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="school_code" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total_registered"
                  stroke="#1890ff"
                  activeDot={{ r: 8 }}
                  name="Registered Students"
                />
                <Line
                  type="monotone"
                  dataKey="total_provisional"
                  stroke="#fa8c16"
                  name="Provisionally Registered Students"
                />
                <Line
                  type="monotone"
                  dataKey="total_enrolled"
                  stroke="#52c41a"
                  name="Enrolled Students"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      <Sider width="20%" style={siderStyle}>
        <div
          style={{
            flexGrow: 1,
            //   backgroundColor: "red",
            height: "calc(100vh - 358px)",
          }}
        >
          <ConfigProvider
            theme={{
              components: {
                Card: {
                  headerBg: "#fff",
                },
              },
            }}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: "flex",
                padding: "0px 0px",
                paddingLeft: 10,
              }}
            >
              <Card
                title="Enrolled Students"
                size="small"
                bordered={true}
                extra={
                  <UserAddOutlined
                    style={{ fontSize: "24px", color: "#1890ff" }}
                  />
                }
                style={{
                  // backgroundColor: "#f0f5ff",
                  borderRadius: "8px",
                  borderColor: "lightgray",
                  borderWidth: 1,
                }}
              >
                <Statistic
                  value={regReport?.totals.total_enrolled || 0}
                  valueStyle={{
                    fontSize: "2.8rem",
                    fontWeight: "bold",
                    color: "#1890ff",
                  }}
                  prefix={<UserOutlined />}
                  // suffix="students"
                />
              </Card>

              {/* Provisionally Registered Students Card */}

              <Card
                title="Provisional Students"
                size="small"
                bordered={true}
                extra={
                  <UserAddOutlined
                    style={{ fontSize: "24px", color: "#fa8c16" }}
                  />
                }
                style={{
                  // backgroundColor: "#fff7e6",
                  borderRadius: "8px",
                  borderColor: "lightgray",
                  borderWidth: 1,
                }}
              >
                <Statistic
                  value={regReport?.totals.total_provisional || 0}
                  valueStyle={{
                    fontSize: "2.8rem",
                    fontWeight: "bold",
                    color: "#fa8c16",
                  }}
                  prefix={<UserOutlined />}
                  //   suffix="students"
                />
              </Card>

              {/* Enrolled Students Card */}

              <Card
                title="Registered Students"
                size="small"
                bordered={true}
                extra={
                  <CheckCircleOutlined
                    style={{ fontSize: "24px", color: "#52c41a" }}
                  />
                }
                style={{
                  // backgroundColor: "#f6ffed",
                  borderRadius: "8px",
                  borderColor: "lightgray",
                  borderWidth: 1,
                }}
              >
                <Statistic
                  value={regReport?.totals.total_registered || 0}
                  valueStyle={{
                    fontSize: "2.8rem",
                    fontWeight: "bold",
                    color: "#52c41a",
                  }}
                  prefix={<UserOutlined />}
                  //   suffix="students"
                />
              </Card>
            </Space>
          </ConfigProvider>
        </div>

        <div
          style={{
            padding: "0px 0px",
            paddingLeft: 10,
          }}
        >
          <ConfigProvider
            theme={{
              token: {
                paddingSM: 0,
                padding: 0,
              },
            }}
          >
            <Card
              title="% of Registered Students"
              size="small"
              bordered={true}
              style={{
                // backgroundColor: "#f6ffed",
                borderRadius: "8px",
                borderColor: "lightgray",
                borderWidth: 1,
              }}
            >
              <ReportGauge />
            </Card>
          </ConfigProvider>
        </div>
      </Sider>
    </Layout>
  );
};
export default ReportDetails;
