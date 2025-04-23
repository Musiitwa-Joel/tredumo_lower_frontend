import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { lighten } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { SyncOutlined } from "@ant-design/icons";

import { motion } from "framer-motion";
import Avatar from "@mui/material/Avatar";
import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Descriptions,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  Typography,
  Input as Input2,
  Space,
} from "antd";
import PerfectScrollbar from "perfect-scrollbar";

import { useDispatch, useSelector } from "react-redux";
import { Download, SearchOutlined } from "@mui/icons-material";
import ResultsTable from "./ResultsTable";
import { useLazyQuery } from "@apollo/client";
import { GET_STUDENT_MARKS } from "../../gql/queries";
import {
  selectMarksDetails,
  selectStdNo,
  setMarksDetails,
  setStdNo,
} from "../../store/resultsSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";

const { Search } = Input2;

function Testimonials() {
  const dispatch = useDispatch();
  const studentNo = useSelector(selectStdNo);
  const [form] = Form.useForm();
  const [getStudentMarks, { error, loading, data }] = useLazyQuery(
    GET_STUDENT_MARKS,
    {
      fetchPolicy: "network-only",
    }
  );
  const marksDetails = useSelector(selectMarksDetails);

  const scrollContainerRef = React.useRef(null);
  const psRef = React.useRef(null);

  React.useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [error]);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: false,
        minScrollbarLength: 20,
      });

      return () => {
        if (psRef.current) {
          psRef.current.destroy();
          psRef.current = null;
        }
      };
    }
  }, []);

  const onFinish = async (values) => {
    // console.log("values", values);
    dispatch(setStdNo(values.student_no));

    const res = await getStudentMarks({
      variables: {
        studentNo: values.student_no,
      },
    });

    if (!res.data.get_student_marks) {
      Modal.info({
        title: "Student Not Found",
        style: {
          top: "32%",
        },
        content: (
          <div>
            <p>{`Student with Student Number ${values.student_no} not found`}</p>
          </div>
        ),
        onOk() {},
      });
    } else {
      // console.log("student marks", res.data.get_student_marks);
      dispatch(setMarksDetails(res.data.get_student_marks));
    }
  };

  return (
    <div
      className="flex-auto p-10 sm:p-24"
      style={{
        height: "calc(100vh - 99.2px)",
        // backgroundColor: "red",
        backgroundColor: "#dfe5ef",
      }}
    >
      <div
        // className="border-2 border-dashed rounded-2xl"
        style={{
          height: "calc(100vh - 138px)",
          borderColor: "lightgray",
          // backgroundColor: "red",
        }}
      >
        <motion.div
          // className="flex flex-wrap p-24"
          //  variants={container}
          initial="hidden"
          animate="show"
          // initial={{ scale: 0 }}
          // animate={{ scale: 1, transition: { delay: 0.1 } }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid xs={3.3}>
                <Card
                  className="flex flex-col shadow"
                  style={{
                    borderRadius: 0,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    // backgroundColor: "red",
                    borderColor: "lightgray",
                    borderWidth: 0.5,
                  }}
                >
                  <CardContent
                    className="flex flex-col flex-auto p-0"
                    style={{
                      height: "calc(100vh - 138px)",
                      backgroundColor: "white",
                      overflowY: "hidden",
                      padding: 10,
                      paddingTop: 20,
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
                        name="basic"
                        form={form}
                        layout="vertical"
                        initialValues={{
                          student_no: studentNo,
                        }}
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
                            style={{ marginBottom: 0, borderColor: "black" }}
                            // loading={loading}
                            placeholder="Enter Student No."
                            variant="outlined"
                            // loading={loadingStudentFile}
                            enterButton={
                              loading ? (
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
                                  // onClick={() => console.log("search..")}
                                >
                                  <SearchOutlined />
                                </Button>
                              )
                            }
                            enterKeyHint="search"
                            // width={100}

                            size="middle"
                            //   onChange={onSearchChange}
                          />
                        </Form.Item>
                      </Form>
                    </ConfigProvider>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // marginTop: -2,
                        marginBottom: 10,
                        // height: "100vh",
                      }}
                    >
                      <div
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 75,
                          backgroundColor: "lightgray",
                          marginRight: 10,
                          flexWrap: "nowrap",
                          flexShrink: 0,
                          flexGrow: 0,
                        }}
                      >
                        <img
                          src={` https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${marksDetails?.student_no}`}
                          style={{
                            width: 150,
                            height: 150,
                            borderRadius: 75,
                          }}
                        />
                      </div>
                    </div>

                    <div
                      ref={scrollContainerRef}
                      style={{
                        marginTop: 10,
                        position: "relative",
                      }}
                    >
                      <div>
                        <Descriptions
                          column={2}
                          //   title="User Info"
                          bordered
                          labelStyle={{
                            backgroundColor: "#e7edfe",
                            color: "#0832b7",
                            fontWeight: "bold",
                            width: "34%",
                          }}
                          size="small"
                          items={[
                            {
                              key: "1",
                              label: "Name",
                              children: (
                                <Typography.Text
                                  ellipsis={{
                                    row: 1,
                                    tooltip: `${marksDetails?.biodata?.surname} ${marksDetails?.biodata?.other_names}`,
                                  }}
                                  style={{
                                    width: 208,
                                  }}
                                >
                                  {marksDetails?.biodata &&
                                    `${marksDetails?.biodata?.surname} ${marksDetails?.biodata?.other_names}`}
                                </Typography.Text>
                              ),

                              span: 3,
                            },
                            {
                              key: "7",
                              label: "Student No.",
                              children: marksDetails?.student_no,
                              span: 3,
                            },

                            {
                              key: "3",
                              label: "Reg No.",
                              children: (
                                <Typography.Text
                                  ellipsis={{
                                    row: 1,
                                    tooltip: marksDetails?.registration_no,
                                  }}
                                  style={{
                                    width: 208,
                                  }}
                                >
                                  {marksDetails?.registration_no}
                                </Typography.Text>
                              ),

                              span: 3,
                            },
                            {
                              key: "8",
                              label: "DOB.",
                              children:
                                marksDetails?.biodata?.date_of_birth &&
                                convertTimestampToDate(
                                  marksDetails?.biodata?.date_of_birth
                                ),
                              span: 3,
                            },
                            {
                              key: "4",
                              label: "Gender",
                              children: marksDetails?.biodata?.gender,
                              span: 3,
                            },
                            {
                              key: "4",
                              label: "Course",
                              children: (
                                <Typography.Text
                                  ellipsis={{
                                    row: 1,
                                    tooltip: `${marksDetails?.course_details?.course?.course_code} - ${marksDetails?.course_details?.course?.course_title}`,
                                  }}
                                  style={{
                                    width: 208,
                                  }}
                                >
                                  {marksDetails?.course_details &&
                                    `${marksDetails?.course_details?.course?.course_code} - ${marksDetails?.course_details?.course?.course_title}`}
                                </Typography.Text>
                              ),

                              span: 3,
                            },
                            {
                              key: "5",
                              label: "Version",
                              children:
                                marksDetails?.course_details?.version_title,
                              span: 3,
                            },
                            {
                              key: "6",
                              label: "School",
                              children: (
                                <Typography.Text
                                  ellipsis={{
                                    row: 1,
                                    tooltip: `${marksDetails?.course_details?.course?.school?.school_code} - ${marksDetails?.course_details?.course?.school?.school_title}`,
                                  }}
                                  style={{
                                    width: 208,
                                  }}
                                >
                                  {marksDetails?.course_details?.course &&
                                    `${marksDetails?.course_details?.course?.school?.school_code} - ${marksDetails?.course_details?.course?.school?.school_title}`}
                                </Typography.Text>
                              ),
                              span: 3,
                            },
                          ]}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={8.7}>
                <div
                  style={{
                    paddingTop: 12,
                    paddingLeft: 10,
                    paddingBottom: 10,
                    // backgroundColor: "red",
                  }}
                >
                  <Card
                    style={{
                      width: "100%",
                      borderColor: "lightgray",
                      height: "calc(100vh - 165px)",
                      padding: 0,
                      borderTopRightRadius: 10,
                      borderBottomRightRadius: 10,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                    size="small"
                    //   tabList={tabListNoTitle}
                    //   activeTabKey={activeTabKey}
                    bordered
                    //   onTabChange={onTabChange}
                    tabProps={{
                      size: "small",
                    }}
                  >
                    <Spin spinning={loading}>
                      <ResultsTable />
                    </Spin>
                  </Card>
                </div>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </div>
    </div>
  );
}

export default Testimonials;
