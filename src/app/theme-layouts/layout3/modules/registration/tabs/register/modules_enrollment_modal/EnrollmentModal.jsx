import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { darken } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Close } from "@mui/icons-material";
import Draggable from "react-draggable";
import Paper from "@mui/material/Paper";
import clsx from "clsx";
import {
  Alert,
  Form,
  Space,
  Typography as Typography2,
  Row,
  Col,
  Select,
  ConfigProvider,
  Button,
} from "antd";
import { useMutation } from "@apollo/client";
import { REGISTER_MODULE } from "../../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedEnrollment,
  selectStudentData,
} from "../../../store/registrationSlice";

const { Option } = Select;

const { Text } = Typography2;

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

const options = [
  { value: "normal", label: "NORMAL" },
  { value: "missed", label: "MISSED" },
  { value: "retake", label: "RETAKE" },
];

function EnrollmentModal({ isVisible, _module, handleClose }) {
  //   console.log("module", _module);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const studentFile = useSelector(selectStudentData);
  const selectedEnrollment = useSelector(selectSelectedEnrollment);

  //   console.log("selected enrollment", selectedEnrollment);

  const [registerModule, { error, loading, data }] = useMutation(
    REGISTER_MODULE,
    {
      refetchQueries: ["getStudentRegisteredCourseunits"],
    }
  );

  useEffect(() => {
    if (error) {
      dispatch(showMessage({ message: error.message, variant: "error" }));
    }
  }, [error]);

  const onFinish = async (values) => {
    // console.log("values from form", values);
    const payload = {
      payload: {
        course_unit_code: _module?.course_unit_code,
        status: values.status,
        student_no: studentFile?.student_no,
        study_yr: parseInt(selectedEnrollment?.study_yr),
        sem: parseInt(selectedEnrollment?.sem),
        acc_yr_id: selectedEnrollment?.acc_yr,
      },
    };

    // console.log("the payload", payload);
    const res = await registerModule({
      variables: payload,
    });

    if (res.data.register_module) {
      dispatch(
        showMessage({
          message: res.data.register_module.message,
          variant: "success",
        })
      );

      // reset the form
      form.resetFields();

      // close the modal
      handleClose();
    }
  };
  return (
    <div>
      <Dialog
        // maxWidth="xs"
        open={isVisible}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <Card
          className={clsx("", "shadow")}
          sx={{
            backgroundColor: (theme) =>
              darken(
                theme.palette.background.paper,
                theme.palette.mode === "light" ? 0.01 : 0.1
              ),
            width: 560,
            // height: 300,
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
                color: "white",
                marginRight: 20,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "80%", // Adjust this width as needed
              }}
            >
              {_module?.course_unit_title}
            </Typography>

            <Close
              style={{
                color: "white",
                fontSize: 25,
                cursor: "pointer",
                //  marginRight: 10,
              }}
              onClick={handleClose}
            />
          </Box>
          <div className="max-w-full relative">
            <Box
              // component="form"
              sx={{
                "& .MuiTextField-root": { m: 0, width: "100%" },
              }}
              autoComplete="off"
              className={"max-w-full"}
              style={{
                padding: 15,
                //   backgroundColor: "red",
              }}
            >
              <Alert
                style={{
                  padding: 0,
                }}
                message={
                  <Space size={20} wrap>
                    <div style={{ padding: "7px" }}>
                      <Text strong>MODULE CODE:</Text>{" "}
                      {_module?.course_unit_code}
                    </div>

                    <div style={{ padding: "7px" }}>
                      <Text strong>CREDIT UNITS:</Text> {_module?.credit_units}
                    </div>

                    <div style={{ padding: "7px" }}>
                      <Text strong>LEVEL:</Text>{" "}
                      {_module?.course_unit_level?.toUpperCase()}
                    </div>
                  </Space>
                }
              ></Alert>

              <div
                style={{
                  marginTop: 20,
                }}
              >
                <Form
                  // initialValues={_applicantFillForm}
                  form={form}
                  name="fee_item_form"
                  layout="vertical"
                  //   style={formStyle}
                  onFinish={onFinish}
                >
                  <Row gutter={24} align="middle">
                    <Col
                      span={24}
                      style={{
                        paddingBottom: 0,
                      }}
                    >
                      <ConfigProvider
                        theme={{
                          components: {
                            Select: {
                              zIndexPopup: 99999,
                            },
                          },
                        }}
                      >
                        <Form.Item
                          name={`status`}
                          label={`Enroll as`}
                          rules={[
                            {
                              required: true,
                              message: "Field is Required",
                            },
                          ]}
                          style={{
                            paddingBottom: 0,
                            marginBottom: 0,
                            //   width: 200,
                          }}
                        >
                          <Select
                            //   loading={loadingReqs2}
                            placeholder="Select status"
                            style={{
                              zIndex: 9999999,
                            }}
                          >
                            {options.map((opt) => (
                              <Option value={opt.value}>{opt.label}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </ConfigProvider>
                    </Col>
                  </Row>

                  <div
                    style={{
                      display: "flex",
                      marginTop: 15,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Space>
                      <Form.Item>
                        <Button onClick={handleClose}>Cancel</Button>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          loading={loading}
                          disabled={loading}
                          type="primary"
                          htmlType="submit"
                        >
                          Enroll
                        </Button>
                      </Form.Item>
                    </Space>
                  </div>
                </Form>
              </div>
            </Box>
          </div>
        </Card>
      </Dialog>
    </div>
  );
}

export default EnrollmentModal;
