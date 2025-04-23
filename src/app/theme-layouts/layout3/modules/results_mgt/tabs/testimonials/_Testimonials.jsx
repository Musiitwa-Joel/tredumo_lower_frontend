import React from "react";
import {
  Button,
  Input,
  Form,
  ConfigProvider,
  Card,
  Space,
  Row,
  Col,
  Descriptions,
  Typography,
  Divider,
} from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { Print, SearchOutlined } from "@mui/icons-material";
import ResultsTable from "./ResultsTable";
const { Search } = Input;

function Testimonials() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Values", values);
  };
  return (
    <div
      style={{
        padding: 10,
        backgroundColor: "#dfe5ef",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ConfigProvider
          theme={{
            token: {
              colorBorder: "lightgray",
            },
          }}
        >
          <Form
            name="testimonialSearchForm"
            form={form}
            layout="vertical"
            initialValues={
              {
                //   student_no: studentNo,
              }
            }
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="student_no"
              rules={[
                {
                  required: true,
                  message: "Please input a student number",
                },
              ]}
              style={{
                // backgroundColor: "red",
                padding: 0,
                marginBottom: 10,
              }}
            >
              <Search
                style={{ marginBottom: 0, borderColor: "black", width: 300 }}
                // loading={loading}
                placeholder="Enter Student No."
                variant="outlined"
                // loading={loadingStudentFile}
                enterButton={
                  false ? (
                    <Button disabled={true}>
                      <SyncOutlined
                        style={{
                          fontSize: 19,
                        }}
                        spin
                      />
                    </Button>
                  ) : (
                    <Button
                      htmlType="submit"
                      onClick={() => console.log("search..")}
                    >
                      <SearchOutlined />
                    </Button>
                  )
                }
                enterKeyHint="search"
                size="middle"
              />
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>

      <Card
        className="flex flex-col shadow"
        style={{
          borderRadius: 10,
          // backgroundColor: "red",
          borderColor: "lightgray",
          borderWidth: 0.5,
          height: "calc(100vh - 165px)",
        }}
        title={
          <>
            <div
              style={{
                padding: 10,
              }}
            >
              <span
                style={{
                  fontSize: "2.0rem",
                }}
              >
                Testimonial
              </span>
            </div>
          </>
        }
        extra={
          <>
            <Space
              style={{
                marginTop: 5,
              }}
            >
              <Button
                type="primary"
                ghost
                size="small"
                icon={<Print size={19} />}
                onClick={() => dispatch(setRespondReviewVisible(false))}
              >
                Print Testimonial
              </Button>

              <Button
                type="primary"
                ghost
                size="small"
                //   icon={<Action size={19} />}
                onClick={() => refetch()}
              >
                Actions
              </Button>
            </Space>
          </>
        }
      >
        <div
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <Row gutter={16}>
            <Col span={11}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: "lightgray",
                    marginRight: 10,
                    flexWrap: "nowrap",
                    flexShrink: 0,
                    flexGrow: 0,
                  }}
                >
                  <img
                    src={`http://localhost:2222/api/student_image/26767673`}
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                    }}
                  />
                </div>

                <div>
                  <Typography.Title level={4}>
                    {"AKAMPEREZA DARLINGTON"}
                  </Typography.Title>
                  <div
                    style={{
                      display: "flex",
                      marginBottom: 5,
                      alignItems: "center",
                    }}
                  >
                    {/* <Email
                      style={{
                        marginRight: 10,
                        color: "dodgerblue",
                      }}
                    /> */}
                    <Typography.Text>
                      {"(SCI) - SCHOOL OF COMPUTING AND INFORMATICS"}
                    </Typography.Text>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      marginBottom: 5,
                      alignItems: "center",
                    }}
                  >
                    {/* <Phone
                      style={{
                        marginRight: 10,
                        color: "dodgerblue",
                      }}
                    /> */}
                    <Typography.Text>
                      {"BCS - BACHELOR OF SCIENCE IN COMPUTER SCIENCE (V2020) "}
                    </Typography.Text>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={13}>
              <Descriptions
                // size="middle"
                bordered
                column={2}
                // title="Custom Size"
                // size={size}
                // extra={<Button type="primary">Edit</Button>}
                items={[
                  {
                    key: "1",
                    label: "Student No.",
                    children: "2000101041",
                  },
                  {
                    key: "2",
                    label: "Reg No.",
                    children: "2021/FEB/BCS/B227811/DAY",
                  },
                  {
                    key: "3",
                    label: "Date of Birth.",
                    children: "2000-08-08",
                  },
                  {
                    key: "4",
                    label: "Gender",
                    children: "M",
                  },
                ]}
              />
            </Col>
          </Row>
        </div>
        {/* <Divider
          style={{
            margin: 0,
            padding: 0,
            backgroundColor: "lightgray",
            marginBottom: 10,
          }}
        /> */}
        <ResultsTable />
      </Card>
    </div>
  );
}

export default Testimonials;
