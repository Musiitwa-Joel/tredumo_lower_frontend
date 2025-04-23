import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import _ from "lodash";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import {
  Button as Button2,
  Form,
  Input,
  Space,
  Checkbox,
  Select,
  DatePicker,
} from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import dayjs from "dayjs";

import { gql, useMutation, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import formatDateToYYYYMMDD from "app/theme-layouts/layout3/utils/convertDateToYYMMDD";
import { SAVE_ACADEMIC_SCHEDULE } from "../../gql/mutations";
import {
  selectSelectedEvent,
  setSelectedEvent,
  updateAccYrs,
} from "../../store/setUpSlice";
const { TextArea } = Input;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const LOAD_REQS = gql`
  query Query {
    acc_yrs {
      id
      acc_yr_title
    }
    intakes {
      id
      intake_title
    }
    semesters {
      id
      title
    }
  }
`;

function AccademicCalendarForm() {
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const selectedIntake = useSelector((state) => state.setUp.selectedIntake);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { error, loading, data } = useQuery(LOAD_REQS);
  const [
    saveAcademicSchedule,
    { error: saveERR, loading: savingSchedule, data: saveRes },
  ] = useMutation(SAVE_ACADEMIC_SCHEDULE, {
    refetchQueries: ["getAcademicSchedules"],
  });
  const selectedEvent = useSelector(selectSelectedEvent);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (saveERR) {
      dispatch(
        showMessage({
          message: saveERR.message,
          variant: "error",
        })
      );
    }
  }, [error, saveERR]);

  useEffect(() => {
    if (data) {
      dispatch(updateAccYrs(data.acc_yrs));
    }
  }, [data]);

  useEffect(() => {
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

  // console.log(
  //   "selected event",
  //   new Date(parseInt(selectedEvent.selectedRow.start_date))
  // );

  useEffect(() => {
    if (selectedEvent) {
      form.setFieldsValue({
        acc_yr: selectedEvent?.selectedRow.acc_yr.id,
        intake: selectedEvent?.selectedRow.intake.id,
        sem: selectedEvent?.selectedRow.semester,
        start_date: dayjs(parseInt(selectedEvent.selectedRow.start_date)),
        end_date: dayjs(parseInt(selectedEvent.selectedRow.end_date)),
      });
    }
  }, [selectedEvent]);

  const onFinish = async (values) => {
    const payload = {
      accYrId: values.acc_yr,
      intakeId: values.intake,
      semester: values.sem,
      startDate: formatDateToYYYYMMDD(values.start_date.$d),
      endDate: formatDateToYYYYMMDD(values.end_date.$d),
      addedBy: user.user_id,
      saveAcademicScheduleId: selectedEvent
        ? selectedEvent.selectedRow.id
        : null,
    };

    // console.log("payload", payload);
    const res = await saveAcademicSchedule({
      variables: payload,
    });

    form.resetFields();
    dispatch(setSelectedEvent(null));

    dispatch(
      showMessage({
        message: res.data.saveAcademicSchedule.message,
        variant: "success",
      })
    );
  };

  useEffect(() => {
    form.setFieldsValue({
      has_amount: true,
      // item_name: "jsdjkdj",
    });
  }, []);

  const handleClear = () => {
    form.resetFields();
    dispatch(setSelectedEvent(null));
  };

  return (
    <div className="p-16">
      <Box
        className="p-8 w-full rounded-16 border"
        sx={{
          backgroundColor: "#fff",
          marginRight: 10,
          overflow: "hidden",
          borderColor: "lightgray",
        }}
      >
        <Divider
          textAlign="left"
          style={{
            marginTop: 10,
            marginBottom: 10,
            // color: "red",
            borderColor: "red",
          }}
        >
          <Typography className="font-medium text-20 bold">
            {"Add Event"}
          </Typography>
        </Divider>

        <div
          ref={scrollContainerRef}
          style={{
            height: "calc(100vh - 200px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="max-w-full relative">
            <Box
              // component="form"
              sx={{
                "& .MuiTextField-root": { m: 0, width: "100%" },
              }}
              autoComplete="off"
              className={"max-w-full"}
              style={{
                padding: 8,
                //   backgroundColor: "red",
              }}
            >
              <Form
                name="basic"
                form={form}
                layout="vertical"
                initialValues={{
                  has_amount: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Academic Year"
                  name="acc_yr"
                  rules={[
                    {
                      required: true,
                      message: "Please input the accademic year",
                    },
                  ]}
                >
                  <Select
                    loading={loading}
                    // placeholder="Select a option and change input text above"
                    // onChange={onGenderChange}
                    allowClear
                    placeholder="Select Academic Year"
                  >
                    {data?.acc_yrs.map((acc_yr) => (
                      <Select.Option value={acc_yr.id}>
                        {acc_yr.acc_yr_title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Intake"
                  name="intake"
                  rules={[
                    {
                      required: true,
                      message: "Please input the intake",
                    },
                  ]}
                >
                  <Select
                    loading={loading}
                    // placeholder="Select a option and change input text above"
                    // onChange={onGenderChange}
                    allowClear
                    placeholder="Select Intake"
                  >
                    {data?.intakes.map((intake) => (
                      <Select.Option value={intake.id}>
                        {intake.intake_title}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="sem"
                  label="Semester"
                  rules={[
                    {
                      required: true,
                      message: "Semester is required",
                    },
                  ]}
                >
                  <Select
                    loading={loading}
                    allowClear
                    placeholder="Select Semester"
                  >
                    {data?.semesters.map((sem) => (
                      <Select.Option value={sem.id}>{sem.title}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="start_date"
                  label="Start Date"
                  rules={[
                    {
                      required: true,
                      message: "Start Date is required",
                    },
                  ]}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="end_date"
                  label="End Date"
                  rules={[
                    {
                      required: true,
                      message: "End Date is required",
                    },
                  ]}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
                {/* 
              <Form.Item label="Comment" name="comment">
                <TextArea rows={3} placeholder="Add Comment" />
              </Form.Item> */}

                <Space
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Form.Item
                  // wrapperCol={{
                  //   offset: 8,
                  //   span: 16,
                  // }}
                  >
                    <Button2 onClick={handleClear}>Clear</Button2>
                  </Form.Item>
                  <Form.Item
                  // wrapperCol={{
                  //   offset: 8,
                  //   span: 16,
                  // }}
                  >
                    <Button2
                      type="primary"
                      htmlType="submit"
                      loading={savingSchedule}
                      disabled={savingSchedule}
                    >
                      Save
                    </Button2>
                  </Form.Item>
                </Space>
              </Form>
            </Box>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default AccademicCalendarForm;
