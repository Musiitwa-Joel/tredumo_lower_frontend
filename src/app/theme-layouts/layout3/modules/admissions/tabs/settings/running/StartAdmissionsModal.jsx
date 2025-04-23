import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { darken, useTheme } from "@mui/material/styles";
import clsx from "clsx";
import _ from "lodash";
import Draggable from "react-draggable";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdmissionSetUpReqs,
  selectRunningAdmission,
  selectStartAdmissionsModalVisible,
  setAdmissionSetUpReqs,
  setSelectedRunningAdmission,
  setStartAdmissionsModalVisible,
} from "../../../admissionsSlice";
import Close from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_ADMISSION_SETUP_REQUIREMENTS } from "../../../graphql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { SAVE_RUNNING_ADMISSION } from "../../../graphql/mutations";
import {
  Button,
  message,
  Steps,
  theme,
  Modal,
  Checkbox,
  Form,
  Input,
  Row,
  Col,
  Radio,
  DatePicker,
  Space,
  Divider,
  Select,
  Collapse,
} from "antd";
import { Add } from "@mui/icons-material";
import formatDateToYYYYMMDD from "app/theme-layouts/layout3/utils/convertDateToYYMMDD";
import dayjs from "dayjs";

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

function StartAdmissionsModal() {
  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [form1] = Form.useForm();
  const [values, setValues] = useState(null);
  const startAdmissionsModalVisible = useSelector(
    selectStartAdmissionsModalVisible
  );
  const admissionSetUpReqs = useSelector(selectAdmissionSetUpReqs);
  const user = useSelector((state) => state.user.user);
  const selectedAdmission = useSelector(selectRunningAdmission);

  const {
    error,
    loading: loadingRequirements,
    data,
  } = useQuery(LOAD_ADMISSION_SETUP_REQUIREMENTS);

  //   console.log("selected", selectedAdmission);

  const [
    saveRunningAdmission,
    { error: saveError, loading: savingAdmission, data: saveResponse },
  ] = useMutation(SAVE_RUNNING_ADMISSION, {
    refetchQueries: ["getRunningAdmissions"],
  });

  useEffect(() => {
    if (saveError) {
      dispatch(
        showMessage({
          message: saveError.message,
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
  }, [saveError, error]);

  useEffect(() => {
    if (selectedAdmission) {
      form1.setFieldsValue({
        intake_id: selectedAdmission.intake.id,
        scheme_id: selectedAdmission.scheme.id,
        admission_level_id: selectedAdmission.admission_level.id,
        acc_yr_id: selectedAdmission.acc_yr.id,
        start_date: dayjs(parseInt(selectedAdmission.start_date)),
        end_date: dayjs(parseInt(selectedAdmission.end_date)),
        no_of_choices: selectedAdmission.no_of_choices,
        max_no_of_forms: selectedAdmission.max_no_of_forms,
        form_id: selectedAdmission.form_template_id,
        national_application_fees: selectedAdmission.national_application_fees,
        east_african_application_fees:
          selectedAdmission.east_african_application_fees,
        international_application_fees:
          selectedAdmission.international_application_fees,
        active_admission_fees: selectedAdmission.active_admission_fees,
        description: selectedAdmission.description,
        national_admission_fees: selectedAdmission.national_admission_fees,
        east_african_admission_fees:
          selectedAdmission.east_african_admission_fees,
        international_admission_fees:
          selectedAdmission.international_admission_fees,
      });
    } else {
      form1.resetFields();
    }
  }, [selectedAdmission]);

  if (data) {
    // console.log("data...", data);
    dispatch(setAdmissionSetUpReqs(data));
  }

  const handleClose = () => {
    // setOpen(false);
    dispatch(setStartAdmissionsModalVisible(false));
  };

  const steps = [
    {
      title: "General settings",
      content: (
        <>
          <div
            style={{
              position: "relative",
              //   backgroundColor: "red",
              // width: 900,
              height: "calc(100vh - 430px)",
              overflowY: "scroll",
              overflowX: "hidden",
              padding: 10,
            }}
          >
            <Row
              gutter={16}
              // ref={scrollContainerRef}
              // onWheel={handleWheel}
            >
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label="Intake"
                  name="intake_id"
                  rules={[
                    {
                      required: true,
                      message: "Please select the intake!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Intake"
                    loading={loadingRequirements}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      data?.intakes
                        ? data?.intakes.map((intake) => ({
                            value: intake.id,
                            label: intake.intake_title,
                          }))
                        : []
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Admission Level"
                  name="admission_level_id"
                  rules={[
                    {
                      required: true,
                      message: "Please select the admission level!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Admission Level"
                    loading={loadingRequirements}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      data?.admission_levels
                        ? data?.admission_levels.map((level) => ({
                            value: level.id,
                            label: level.admission_level_title,
                          }))
                        : []
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Start Date"
                  name="start_date"
                  rules={[
                    {
                      required: true,
                      message: "Please select the start date!",
                    },
                  ]}
                >
                  <DatePicker
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="No. of choices"
                  name="no_of_choices"
                  rules={[
                    {
                      required: true,
                      message: "Please input the number of choices!",
                    },
                  ]}
                  initialValue={1}
                >
                  <Input type="number" />
                </Form.Item>

                <Form.Item
                  label="Form ID"
                  name="form_id"
                  rules={[
                    {
                      required: true,
                      message: "Please input the form ID!",
                    },
                  ]}
                  initialValue={"default"}
                >
                  <Select
                    showSearch
                    placeholder="Select Form ID"
                    loading={loadingRequirements}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: "default",
                        label: "Default",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <Form.Item
                  label="Scheme"
                  name="scheme_id"
                  rules={[
                    {
                      required: true,
                      message: "Please select the scheme!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Scheme"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      data?.schemes
                        ? data?.schemes.map((scheme) => ({
                            value: scheme.id,
                            label: scheme.scheme_title,
                          }))
                        : []
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Academic Yr"
                  name="acc_yr_id"
                  rules={[
                    {
                      required: true,
                      message: "Academic Yr is required!",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Academic Yr"
                    loading={loadingRequirements}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={
                      data?.acc_yrs
                        ? data?.acc_yrs.map((acc_yr) => ({
                            value: acc_yr.id,
                            label: acc_yr.acc_yr_title,
                          }))
                        : []
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="End Date"
                  name="end_date"
                  rules={[
                    {
                      required: true,
                      message: "Please select the end date!",
                    },
                  ]}
                >
                  <DatePicker
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="No Of Forms"
                  name="max_no_of_forms"
                  rules={[
                    {
                      required: true,
                      message: "Please input the max number of forms",
                    },
                  ]}
                  initialValue={1}
                >
                  <Input type="number" />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  initialValue={""}
                >
                  <Input.TextArea rows={4} placeholder="Description" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </>
      ),
    },
    {
      title: "Application Fees",
      content: (
        <div
          style={{
            position: "relative",
            // backgroundColor: "red",
            // width: 900,
            height: "calc(100vh - 430px)",
            overflowY: "scroll",
            overflowX: "hidden",
            padding: 10,
          }}
        >
          <Row
            gutter={16}
            // ref={scrollContainerRef}
            // onWheel={handleWheel}
          >
            <Col className="gutter-row" span={20}>
              <Form.Item
                label="National Application Fees"
                name="national_application_fees"
                rules={[
                  {
                    required: true,
                    message: "Please input the National Application Fees",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="East African Application Fees"
                name="east_african_application_fees"
                rules={[
                  {
                    required: true,
                    message: "Please select the East African Application Fees!",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="International Application Fees"
                name="international_application_fees"
                rules={[
                  {
                    required: true,
                    message:
                      "Please select the International Application Fees!",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: "Admission Fees",
      content: (
        <div
          style={{
            position: "relative",
            // backgroundColor: "red",
            // width: 900,
            height: "calc(100vh - 430px)",
            overflowY: "scroll",
            overflowX: "hidden",
            padding: 10,
          }}
        >
          <Row
            gutter={16}
            // ref={scrollContainerRef}
            // onWheel={handleWheel}
          >
            <Col className="gutter-row" span={20}>
              <Form.Item
                label="National Admission Fees"
                name="national_admission_fees"
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="East African Admission Fees"
                name="east_african_admission_fees"
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                label="International Admission Fees"
                name="international_admission_fees"
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item
                name="active_admission_fees"
                valuePropName="checked"
                label={null}
                initialValue={false}
              >
                <Checkbox>Active admission fees</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: "Instructions",
      content: (
        <div
          style={{
            position: "relative",
            width: "100%", // Ensure it takes the full width of the parent
            height: "calc(100vh - 430px)",
            overflowY: "scroll",
            padding: 10,
          }}
        >
          <Form.Item
            name="instructions"
            style={{ width: "100%" }}
            initialValue={""}
          >
            <Input.TextArea
              rows={10}
              placeholder="Type something..."
              style={{
                width: 1000,
              }}
            />
          </Form.Item>
        </div>
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle = {
    // lineHeight: "260px",
    // textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    paddingTop: 10,
  };

  const onFinish = async (v) => {
    const allValues = { ...values, v };

    const payload = {
      intakeId: allValues.intake_id,
      schemeId: allValues.scheme_id,
      admissionLevelId: allValues.admission_level_id,
      accYrId: allValues.acc_yr_id,
      startDate: formatDateToYYYYMMDD(allValues.start_date.$d),
      endDate: formatDateToYYYYMMDD(allValues.end_date.$d),
      noOfChoices: parseInt(allValues.no_of_choices),
      maxNoOfForms: parseInt(allValues.max_no_of_forms),
      formTemplateId: allValues.form_id,
      nationalApplicationFees: allValues.national_application_fees,
      eastAfricanApplicationFees: allValues.east_african_application_fees,
      internationalApplicationFees: allValues.international_application_fees,
      activateAdmissionFees: Number(allValues.active_admission_fees),
      description: allValues.description,
      saveRunningAdmissionId: selectedAdmission ? selectedAdmission.id : null,
      nationalAdmissionFees: allValues.national_admission_fees,
      eastAfricanAdmissionFees: allValues.east_african_admission_fees,
      internationalAdmissionFees: allValues.international_admission_fees,
    };

    // console.log("payload", payload);

    const res = await saveRunningAdmission({
      variables: payload,
    });

    dispatch(setStartAdmissionsModalVisible(false));
    dispatch(setSelectedRunningAdmission(null));

    dispatch(
      showMessage({
        message: res.data.saveRunningAdmission.message,
        variant: "info",
      })
    );

    form1.resetFields();
    setCurrent(0);
  };

  //   console.log("admission SetupReqs", admissionSetUpReqs);
  return (
    <Modal
      open={startAdmissionsModalVisible}
      closable={false}
      styles={{
        body: {
          padding: 0,
          //   backgroundColor: "red",
        },
        content: {
          padding: 0,
          borderRadius: 20,
        },
      }}
      width={900}
      okButtonProps={{
        style: {
          display: "none",
        },
      }}
      cancelButtonProps={{
        style: {
          display: "none",
        },
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
            {"Admission Setup"}
          </Typography>

          <Close
            style={{
              color: "white",
              fontSize: 25,
              cursor: "pointer",
              //  marginRight: 10,
            }}
            onClick={() => {
              // dispatch(updateDepartment(defaultValues));
              handleClose();
            }}
          />
        </Box>
        <div
          className="max-w-full relative"
          style={{
            width: 900,
            padding: 10,
          }}
        >
          <Steps size="small" current={current} items={items} />

          <Form
            name="admissionSetupForm"
            form={form1}
            labelCol={{
              span: current === 3 ? "" : 8,
            }}
            wrapperCol={{
              span: current === 3 ? "" : 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            //  onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div style={contentStyle}>{steps[current].content}</div>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                {/* {current === 2 && (
                  <Button
                    type="primary"
                    style={{
                      alignSelf: "flex-start",
                    }}
                    // onClick={addQualification}
                    icon={<Add />}
                  >
                    Add Academic Information
                  </Button>
                )} */}
              </div>

              <div>
                {current > 0 && (
                  <Button
                    style={{
                      margin: "0 8px",
                    }}
                    onClick={() => prev()}
                  >
                    Previous
                  </Button>
                )}
                {current < steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={async () => {
                      // first validate before going next
                      const form1Valid = await form1.validateFields();
                      if (form1Valid) {
                        // console.log("values so far", form1.getFieldsValue());
                        next();
                        setValues({ ...values, ...form1.getFieldsValue() });
                      }
                    }}
                  >
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={savingAdmission}
                    disabled={savingAdmission}
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </div>
      </Card>
    </Modal>
  );
}

export default StartAdmissionsModal;
