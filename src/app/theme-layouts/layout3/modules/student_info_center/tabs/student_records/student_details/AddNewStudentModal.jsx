import React, { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { lighten, darken, alpha } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Close from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import clsx from "clsx";
import data from "./districts.json";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Form,
  Input,
  Col,
  Row,
  Space,
  Tooltip,
  ConfigProvider,
  Spin,
} from "antd";

import { Select } from "antd";
import { Key } from "@mui/icons-material";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { gql, useMutation, useQuery } from "@apollo/client";
import { selectUser } from "app/store/userSlice";
import {
  selectAddStudentModalVisible,
  selectAllStudentCourses,
  setAddStudentModalVisible,
} from "../../../store/infoCenterSlice";
import PerfectScrollbar from "perfect-scrollbar";
import { SAVE_NEW_STUDENT } from "../../../gql/mutations";

const LOAD_REQS = gql`
  query Query {
    acc_yrs {
      id
      acc_yr_title
    }
    nationalities {
      id
      nationality_title
    }
    nationality_categories {
      id
      category_title
    }
    courses {
      id
      course_code
      course_title
      course_duration
      course_versions {
        id
        version_title
      }
    }
    intakes {
      id
      intake_title
    }
    campuses {
      id
      campus_title
    }
    study_times {
      id
      study_time_title
    }
  }
`;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

function AddNewStudentModal() {
  const modalVisible = useSelector(selectAddStudentModalVisible);
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  //   const createModuleModalOpen = useSelector(selectCreateModuleModalOpen);
  const allCourses = useSelector(selectAllStudentCourses);
  const [scrollableHeight, setScrollableHeight] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const userObj = useSelector(selectUser);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    error: reqsErr,
    loading: loadingReqs,
    data: reqRes,
  } = useQuery(LOAD_REQS);

  const [
    saveNewStudent,
    { error, loading: savingNewStd, data: saveNewStudentRes },
  ] = useMutation(SAVE_NEW_STUDENT);

  useEffect(() => {
    if (reqsErr) {
      dispatch(
        showMessage({
          message: reqsErr.message,
          variant: "error",
        })
      );
    }

    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [reqsErr, error]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: false,
        minScrollbarLength: 20,
      });

      const updateScrollableHeight = () => {
        if (scrollContainerRef.current) {
          const containerHeight = scrollContainerRef.current.clientHeight;
          const contentHeight = scrollContainerRef.current.scrollHeight;
          setScrollableHeight(contentHeight - containerHeight);
        }
      };

      updateScrollableHeight();
      window.addEventListener("resize", updateScrollableHeight);

      return () => {
        if (psRef.current) {
          psRef.current.destroy();
          psRef.current = null;
        }
        window.removeEventListener("resize", updateScrollableHeight);
      };
    }
  }, [scrollContainerRef.current]);

  const handleWheel = (e) => {
    const container = scrollContainerRef.current;
    if (container) {
      const { deltaY } = e;
      const { scrollTop } = container;

      if (
        (deltaY > 0 && scrollTop >= scrollableHeight) ||
        (deltaY < 0 && scrollTop <= 0)
      ) {
        e.preventDefault();
      }
    }
  };

  const onFinish = async (values) => {
    console.log("Success:", values);

    const payload = {
      payload: {
        surname: values?.surname,
        other_names: values?.other_names,
        student_no: values?.student_no,
        reg_no: values?.regno,
        phone_no: values?.phone_no,
        study_yr: values?.study_yr,
        current_sem: values?.current_sem,
        district: values?.district || "",
        email: values?.email || "",
        entry_acc_yr: values?.entry_acc_yr,
        entry_study_yr: values?.entry_study_yr,
        gender: values?.gender,
        guardian_contact: values?.guardian_contact || "",
        guardian_name: values?.guardian_name || "",
        hall_of_attachment: values?.hall_of_attachment || "",
        hall_of_residence: values.hall_of_residence || "",
        intake_id: values?.intake,
        nationality: values?.nationality,
        billing_nationality: values?.billing_nationality,
        campus_id: values?.campus,
        completed: values?.completed,
        course_id: values?.course,
        course_version_id: values?.course_version,
        residence_status: values?.residence_status,
        sponsorship: values?.sponsorship,
        study_time_id: values?.study_time,
      },
    };

    // console.log("payload", payload);

    const res = await saveNewStudent({
      variables: payload,
    });

    form.resetFields();

    dispatch(
      showMessage({
        message: res.data?.saveNewStudent?.message,
        variant: "success",
      })
    );

    // // console.log("response", res.data);
    // dispatch(updateCreateModuleModalOpen(false));
    // dispatch(
    //   showMessage({
    //     message: res.data.saveCourseUnit.message,
    //     variant: "success",
    //   })
    // );
  };

  // console.log("grading res", gradingRes);

  // console.log("the courses", selectedCourse.course_duration);

  useEffect(() => {
    if (selectedCourse) {
      form.setFieldsValue({
        course_code: selectedCourse?.course_code,
      });
    }
  }, [selectedCourse]);

  //   console.log("selected course", selectedCourse);

  return (
    <div>
      <Dialog
        maxWidth="xl"
        open={modalVisible}
        // onClose={() => dispatch(updateCreateModuleModalOpen(false))}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        style={{
          top: -70,
          zIndex: 100000,
        }}
      >
        <Card
          className={clsx("", "shadow")}
          sx={{
            backgroundColor: (theme) =>
              darken(
                theme.palette.background.paper,
                theme.palette.mode === "light" ? 0.01 : 0.1
              ),
          }}
        >
          <Box
            sx={{
              backgroundColor: "#1e293b",
            }}
            className="p-10"
            id="draggable-dialog-title"
            style={{
              paddingLeft: 15,
              display: "flex",
              justifyContent: "space-between",
              cursor: "move",
            }}
          >
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              style={{
                //   opacity: 0.7,
                color: "white",
              }}
            >
              {"Add New Student"}
            </Typography>

            <Tooltip title="Close">
              <Close
                style={{
                  color: "white",
                  fontSize: 25,
                  cursor: "pointer",
                  //  marginRight: 10,
                }}
                onClick={() => {
                  // dispatch(updateDepartment(defaultValues));
                  dispatch(setAddStudentModalVisible(false));
                }}
              />
            </Tooltip>
          </Box>
          <div
            style={{
              padding: 15,
            }}
          >
            <Form
              form={form}
              name="moduleForm"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              {...formItemLayout}
            >
              <Row
                gutter={16}
                // ref={scrollContainerRef}
                onWheel={handleWheel}
                style={{
                  position: "relative",
                  // backgroundColor: "red",
                  width: 900,
                  height: "calc(100vh - 250px)",
                  overflow: "scroll",
                }}
              >
                <Col className="gutter-row" span={12}>
                  <div>
                    <ConfigProvider
                      theme={{
                        components: {
                          Select: {
                            /* here is your component tokens */
                            zIndexPopup: 1000000,
                          },
                        },
                      }}
                    >
                      <Form.Item
                        name="regno"
                        label="Reg Number"
                        rules={[
                          {
                            required: true,
                            message: "Please input the reg no",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="student_no"
                        label="Student No"
                        rules={[
                          {
                            required: true,
                            message: "Please input the old student no",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="surname"
                        label="Surname"
                        rules={[
                          {
                            required: true,
                            message: "Please input the surname",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="other_names"
                        label="Other Names"
                        rules={[
                          {
                            required: true,
                            message: "Please input other names",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[
                          {
                            required: true,
                            message: "Please input the gender",
                          },
                        ]}
                      >
                        <Select
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={[
                            {
                              value: "male",
                              label: "Male",
                            },
                            {
                              value: "female",
                              label: "Female",
                            },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item
                        name="district"
                        label="District"
                        rules={[
                          {
                            required: true,
                            message: "Please input the district",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            option.label
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={data[0].districts.map((district) => ({
                            label: district.name.toUpperCase(), // Displayed text in dropdown
                            value: district.name.toLowerCase(), // Value bound to the form
                          }))}
                        />
                      </Form.Item>

                      <Form.Item label="Email" name="email">
                        <Input />
                      </Form.Item>

                      <Form.Item label="Phone No." name="phone_no">
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="entry_acc_yr"
                        label="Entry Acc. Yr"
                        rules={[
                          {
                            required: true,
                            message: "Please input the entry acc yr",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          loading={loadingReqs}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={reqRes?.acc_yrs?.map((acc_yr) => ({
                            value: acc_yr.id,
                            label: acc_yr.acc_yr_title,
                          }))}
                        />
                      </Form.Item>

                      <Form.Item
                        name="entry_study_yr"
                        label="Entry Study Yr"
                        loading={loadingReqs}
                        rules={[
                          {
                            required: true,
                            message: "Please input the study yr",
                          },
                        ]}
                      >
                        <Select
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={[
                            {
                              value: 1,
                              label: "1",
                            },
                            {
                              value: 2,
                              label: "2",
                            },
                            {
                              value: 3,
                              label: "3",
                            },
                            {
                              value: 4,
                              label: "4",
                            },
                            {
                              value: 5,
                              label: "5",
                            },
                            {
                              value: 6,
                              label: "6",
                            },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item
                        name="nationality"
                        label="Nationality"
                        loading={loadingReqs}
                        rules={[
                          {
                            required: true,
                            message: "Please input the nationality",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={reqRes?.nationalities?.map((nat) => ({
                            value: nat.id,
                            label: nat.nationality_title,
                          }))}
                        />
                      </Form.Item>

                      <Form.Item
                        name="sponsorship"
                        label="Sponsorship"
                        initialValue={0}
                      >
                        <Select
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={[
                            {
                              value: 0,
                              label: "false",
                            },
                            {
                              value: 1,
                              label: "true",
                            },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Guardian Name"
                        name="guardian_name"
                        initialValue={""}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        label="Guardian Contact"
                        name="guardian_contact"
                        initialValue={""}
                      >
                        <Input />
                      </Form.Item>
                    </ConfigProvider>
                  </div>
                </Col>
                <Col className="gutter-row" span={12}>
                  <div>
                    <ConfigProvider
                      theme={{
                        components: {
                          Select: {
                            /* here is your component tokens */
                            zIndexPopup: 1000000,
                          },
                        },
                      }}
                    >
                      <Form.Item
                        name="billing_nationality"
                        label="Billing Nationality"
                        rules={[
                          {
                            required: true,
                            message: "Please input the billing nationality",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          loading={loadingReqs}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={reqRes?.nationality_categories?.map(
                            (nat) => ({
                              value: nat.id,
                              label: nat.category_title,
                            })
                          )}
                        />
                      </Form.Item>

                      <Form.Item
                        name="hall_of_attachment"
                        label="Hall of Attachment"
                      >
                        <Select
                          //   showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={[]}
                        />
                      </Form.Item>

                      <Form.Item
                        name="hall_of_residence"
                        label="Hall of Residence"
                      >
                        <Select
                          //   showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={[]}
                        />
                      </Form.Item>

                      <Form.Item
                        name="course"
                        label="Course"
                        rules={[
                          {
                            required: true,
                            message: "Please input course code!",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          loading={loadingReqs}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={reqRes?.courses?.map((course) => ({
                            value: course.id,
                            label: `${course.course_code} - ${course.course_title}`,
                          }))}
                          onSelect={(value) => {
                            const selected = reqRes.courses.find(
                              (course) => value == course?.id
                            );

                            setSelectedCourse(selected);
                            // console.log("selected", selectedCourse);
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Course Code"
                        name="course_code"
                        initialValue={""}
                      >
                        <Input readOnly />
                      </Form.Item>

                      <Form.Item
                        name="course_version"
                        label="Course Version"
                        initialValue={""}
                      >
                        <Select
                          showSearch
                          loading={loadingReqs}
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={selectedCourse?.course_versions?.map(
                            (version) => ({
                              value: version.id,
                              label: version.version_title,
                            })
                          )}
                        />
                      </Form.Item>

                      <Form.Item name="intake" label="Intake">
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={reqRes?.intakes?.map((intake) => ({
                            value: intake.id,
                            label: intake.intake_title,
                          }))}
                        />
                      </Form.Item>

                      <Form.Item name="campus" label="Campus">
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={reqRes?.campuses?.map((campus) => ({
                            value: campus.id,
                            label: campus.campus_title,
                          }))}
                        />
                      </Form.Item>

                      <Form.Item name="study_yr" label="Study Yr">
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={Array.from(
                            { length: selectedCourse?.course_duration },
                            (_, index) => ({
                              value: index + 1,
                              label: (index + 1).toString(),
                            })
                          )}
                        />
                      </Form.Item>

                      <Form.Item name="current_sem" label="Current Sem">
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={[
                            {
                              value: 1,
                              label: 1,
                            },
                            {
                              value: 2,
                              label: 2,
                            },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item
                        name="residence_status"
                        label="Residence Status"
                        initialValue={0}
                      >
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={[
                            {
                              value: 0,
                              label: "NON RESISIDENT",
                            },
                            {
                              value: 1,
                              label: "RESIDENT",
                            },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item name="study_time" label="Study Time">
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={reqRes?.study_times?.map((study_time) => ({
                            value: study_time.id,
                            label: study_time.study_time_title,
                          }))}
                        />
                      </Form.Item>

                      <Form.Item
                        name="completed"
                        label="Completed"
                        initialValue={0}
                      >
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          options={[
                            {
                              value: 0,
                              label: "false",
                            },
                            {
                              value: 1,
                              label: true,
                            },
                          ]}
                        />
                      </Form.Item>
                    </ConfigProvider>
                  </div>
                </Col>
              </Row>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Space>
                    <Button
                      onClick={() =>
                        dispatch(updateCreateModuleModalOpen(false))
                      }
                    >
                      Cancel
                    </Button>

                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        backgroundColor: "dodgerblue",
                      }}
                      loading={savingNewStd}
                      disabled={savingNewStd}
                    >
                      Save
                    </Button>
                  </Space>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </Dialog>
    </div>
  );
}

export default AddNewStudentModal;
