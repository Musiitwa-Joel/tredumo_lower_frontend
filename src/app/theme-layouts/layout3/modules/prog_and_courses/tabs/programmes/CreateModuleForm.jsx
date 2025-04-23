import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { lighten, darken, alpha } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Close from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllCourses,
  selectCreateModuleModalOpen,
  selectEditModule,
  selectModuleEdited,
  selectSelectedCourseVersion,
  selectSelectedUnit,
  updateCreateModuleModalOpen,
} from "../../store/progAndCoursesSlice";
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
import { GENERATE_MODULE_CODE, SAVE_COURSE_UNIT } from "../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { gql, useMutation, useQuery } from "@apollo/client";
import { selectUser } from "app/store/userSlice";

const GET_GRADING = gql`
  query Grading {
    grading {
      id
      grading_title
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

function CreateModuleForm() {
  // const { createModuleModalOpen, selectedCourseVersion, allCourses } =
  //   useSelector((state) => state.progAndCourses);
  const createModuleModalOpen = useSelector(selectCreateModuleModalOpen);
  const selectedCourseVersion = useSelector(selectSelectedCourseVersion);
  const editModule = useSelector(selectEditModule);
  const allCourses = useSelector(selectAllCourses);
  const selectedUnit = useSelector(selectSelectedUnit);
  const moduleEdited = useSelector(selectModuleEdited);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [gradingSystems, setGradingSystems] = useState([]);
  const userObj = useSelector(selectUser);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [
    generateModuleCode,
    { error: generateErr, loading: generatingModuleCode, data },
  ] = useMutation(GENERATE_MODULE_CODE);

  const [saveCourseUnit, { error: cuErr, loading: savingUnit, data: saveRes }] =
    useMutation(SAVE_COURSE_UNIT, {
      refetchQueries: ["getCourseUnits"],
    });

  const { error, loading, data: gradingRes } = useQuery(GET_GRADING);

  if (generateErr) {
    dispatch(
      showMessage({
        message: "Failed to generate code!!!",
        variant: "error",
      })
    );
  }

  if (cuErr) {
    dispatch(
      showMessage({
        message: "Error saving unit " + saveErr.message,
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

  const onFinish = async (values) => {
    // console.log("Success:", values);
    const payload = {
      courseUnit: {
        course_id: values.course_title,
        course_unit_code: values.course_unit_code,
        course_unit_level: values.course_unit_level,
        course_unit_sem: values.course_unit_sem,
        course_unit_title: values.course_unit_title,
        course_unit_year: values.course_unit_year,
        course_version_id: values.course_version,
        credit_units: values.credit_units,
        grading_id: values.grading_id,
        id: null,
      },
      savedBy: userObj.user.user_id,
    };

    // console.log("payload", payload);

    const res = await saveCourseUnit({
      variables: payload,
    });

    form.resetFields();

    // console.log("response", res.data);
    dispatch(updateCreateModuleModalOpen(false));
    dispatch(
      showMessage({
        message: res.data.saveCourseUnit.message,
        variant: "success",
      })
    );
  };

  useEffect(() => {
    if (gradingRes) {
      setGradingSystems(gradingRes.grading);
    }
  }, [gradingRes]);

  // console.log("grading res", gradingRes);

  const handleGenerateCode = async () => {
    if (!selectedCourseVersion) {
      return dispatch(
        showMessage({
          message: "First select a course version please!!!",
          variant: "info",
        })
      );
    }
    const res = await generateModuleCode({
      variables: {
        courseCode: selectedCourseVersion.parent.code,
      },
    });

    form.setFieldValue("course_unit_code", res.data.generateModuleCode);

    // console.log("response", res.data.generateModuleCode);
  };

  useEffect(() => {
    if (selectedCourseVersion) {
      form.setFieldsValue({
        course_code: selectedCourseVersion?.parent?.code,
        course_title: selectedCourseVersion?.parent?.label,
        course_version: selectedCourseVersion.selected?.id,
      });
    }
  }, [selectedCourseVersion, createModuleModalOpen]);

  // console.log("the courses", selectedCourse.course_duration);

  const prefixSelector = (
    <div
      style={{
        width: 20,
      }}
      onClick={handleGenerateCode}
    >
      <Tooltip title="Auto generate Module code" zIndex={10000}>
        {generatingModuleCode ? (
          <Spin size="small" />
        ) : (
          <Key
            style={{
              cursor: "pointer",
            }}
          />
        )}
      </Tooltip>
    </div>
  );

  // console.log("selected version", selectedCourseVersion);

  return (
    <div>
      <Dialog
        maxWidth="xl"
        open={createModuleModalOpen}
        // onClose={() => dispatch(updateCreateModuleModalOpen(false))}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        style={{
          top: -150,
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
              {editModule
                ? `(${selectedUnit?.selectedRow.course_unit_code}) ${selectedUnit?.selectedRow.course_unit_title}`
                : "Create New Module/Course Unit"}
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
                  dispatch(updateCreateModuleModalOpen(false));
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
                style={{
                  // backgroundColor: "red",
                  width: 900,
                }}
              >
                <Col className="gutter-row" span={12}>
                  <div>
                    <Form.Item
                      name="course_unit_code"
                      label="Module Code"
                      rules={[
                        {
                          required: true,
                          message: "Please input your course unit code",
                        },
                      ]}
                    >
                      <Input addonAfter={prefixSelector} />
                    </Form.Item>

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
                        name="course_title"
                        label="Course Title"
                        rules={[
                          {
                            required: true,
                            message: "Please input your course unit code",
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
                          options={allCourses.map((course) => ({
                            value: course.id,
                            label: course.course_title,
                          }))}
                          onChange={(e) => {
                            const selected = allCourses.filter(
                              (c) => c.id == e
                            );

                            // console.log("selected", selected);
                            setSelectedCourse(selected[0]);

                            form.setFieldValue(
                              "course_code",
                              selected[0].course_code
                            );
                          }}
                        />
                      </Form.Item>
                    </ConfigProvider>

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
                        name="course_version"
                        label="Course Version"
                        rules={[
                          {
                            required: true,
                            message: "Please input the course version",
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
                          options={
                            selectedCourseVersion
                              ? allCourses
                                  ?.filter(
                                    (c) =>
                                      c.id == selectedCourseVersion?.parent?.id
                                  )[0]
                                  ?.course_versions.map((version) => ({
                                    value: version.id,
                                    label: version.version_title,
                                  }))
                              : selectedCourse
                                ? selectedCourse?.course_versions.map(
                                    (version) => ({
                                      value: version.id,
                                      label: version.version_title,
                                    })
                                  )
                                : []
                          }
                        />
                      </Form.Item>
                    </ConfigProvider>

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
                        name="course_unit_year"
                        label="Course Unit Year"
                        rules={[
                          {
                            required: true,
                            message: "Please input the course unit year",
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
                          options={
                            selectedCourseVersion
                              ? Array.from(
                                  {
                                    length: allCourses.filter(
                                      (c) =>
                                        c.id == selectedCourseVersion.parent.id
                                    )[0]?.course_duration,
                                  },
                                  (_, index) => ({
                                    value: `${index + 1}`,
                                    label: `${index + 1}`,
                                  })
                                )
                              : selectedCourse
                                ? Array.from(
                                    {
                                      length: selectedCourse?.course_duration
                                        ? selectedCourse?.course_duration
                                        : 0,
                                    },
                                    (_, index) => ({
                                      value: `${index + 1}`,
                                      label: `${index + 1}`,
                                    })
                                  )
                                : []
                          }
                        />
                      </Form.Item>
                    </ConfigProvider>

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
                        name="course_unit_level"
                        label="Course Unit Level"
                        rules={[
                          {
                            required: true,
                            message: "Please input the course unit Level",
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
                          options={[
                            {
                              value: "elective",
                              label: "Elective",
                            },
                            {
                              value: "core",
                              label: "Core",
                            },
                          ]}
                        />
                      </Form.Item>
                    </ConfigProvider>
                  </div>
                </Col>
                <Col className="gutter-row" span={12}>
                  <div>
                    <Form.Item
                      label="Module Title"
                      name="course_unit_title"
                      rules={[
                        {
                          required: true,
                          message: "Please input the title!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Course Code"
                      name="course_code"
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                    >
                      <Input readOnly />
                    </Form.Item>

                    <Form.Item
                      label="Credit Units"
                      name="credit_units"
                      rules={[
                        {
                          required: true,
                          message: "Please input your username!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

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
                        name="course_unit_sem"
                        label="Course Unit Sem"
                        rules={[
                          {
                            required: true,
                            message: "Please input the course unit sem",
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
                          options={[
                            {
                              value: "1",
                              label: "1",
                            },
                            {
                              value: "2",
                              label: "2",
                            },
                          ]}
                        />
                      </Form.Item>
                    </ConfigProvider>

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
                        name="grading_id"
                        label="Grading"
                        rules={[
                          {
                            required: true,
                            message: "Please input the grading",
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
                          options={gradingSystems.map((g) => ({
                            value: g.id,
                            label: g.grading_title,
                          }))}
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
                      loading={savingUnit}
                      disabled={savingUnit}
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

export default CreateModuleForm;
