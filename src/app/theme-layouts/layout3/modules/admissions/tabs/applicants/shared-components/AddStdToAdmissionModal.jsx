import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Modal,
  Typography,
  Form,
  Input,
  Select,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAddStdToAdmissionModalVisible,
  selectApplicantsAdmissionList,
  selectApplicationForm,
  setAddStdToAdmissionModalVisible,
  setApplicanntsAdmissionList,
} from "../../../admissionsSlice";
import { Close } from "@mui/icons-material";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const AddStdToAdmissionModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(selectAddStdToAdmissionModalVisible);
  const applicationForm = useSelector(selectApplicationForm);
  const applicantsAdmissionList = useSelector(selectApplicantsAdmissionList);
  const applicationDetails = applicationForm?.application;
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudyTime, setSelectedStudyTime] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (applicationDetails) {
      const course = applicationDetails.program_choices.find(
        (choice) => choice.choice_no == 1
      );

      const _campuses = course.course.campuses
        ? JSON.parse(course.course.campuses)
        : [];

      const _studyTimes = course.course.study_times
        ? JSON.parse(course.course.study_times)
        : [];

      console.log({
        _campuses,
        _studyTimes,
      });

      const _campus = _campuses.find((c) => c.value == course.campus_id);

      const _studytime = _studyTimes.find(
        (s) => s.value == course.study_time_id
      );

      setSelectedCourse(course);
      setSelectedStudyTime(_studytime);
      setSelectedCampus(_campus);

      form.setFieldsValue({
        program_choice: course?.course_id,
        campus: course?.campus_id,
        study_time: course?.study_time_id,
        entry_yr: course?.entry_yr,
      });
    }
  }, [applicationDetails?.form_no]);

  const campuses = selectedCourse?.course.campuses
    ? JSON.parse(selectedCourse.course.campuses)
    : [];
  const studyTimes = selectedCourse?.course.study_times
    ? JSON.parse(selectedCourse?.course.study_times)
    : [];
  const entryYrs = selectedCourse?.course.entry_yrs
    ? JSON.parse(selectedCourse?.course.entry_yrs)
    : [];

  const onFinish = async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();

      const payload = {
        ...values,
        courseDetails: selectedCourse,
        campusDetails: selectedCampus,
        studyTimeDetails: selectedStudyTime,
        application: applicationDetails,
      };

      // console.log("payload", payload);

      const updatedList = [...applicantsAdmissionList, payload];

      dispatch(setApplicanntsAdmissionList(updatedList));

      dispatch(setAddStdToAdmissionModalVisible(false));

      // form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    dispatch(setAddStdToAdmissionModalVisible(false));
  };

  if (!applicationDetails) return null;

  return (
    <>
      <Modal
        title={
          <Typography.Text
            style={{
              color: "#fff",
            }}
          >
            {`ADD ${applicationDetails.applicant.surname} ${applicationDetails.applicant.other_names} TO ADMISSION LIST`}
          </Typography.Text>
        }
        open={isModalOpen}
        onOk={onFinish}
        onCancel={handleCancel}
        okButtonProps={{
          htmlType: "submit",
        }}
        zIndex={1000}
        maskClosable={false}
        closeIcon={
          <Close
            style={{
              color: "#fff",
            }}
          />
        }
        styles={{
          body: {
            paddingLeft: 10,
            paddingRight: 10,
            height: "auto",

            // Ensure the content is not clipped
          },
          content: {
            padding: 0,
            height: "auto",
            // Ensure the content is not clipped
          },
          footer: {
            padding: 10,
          },
          header: {
            backgroundColor: "#2f405d",
            padding: "7px 10px",
          },
        }}
        okText="Add Student To List"
      >
        <div
          style={{
            margin: "8px 0px",
          }}
        >
          <Alert message="Please confirm the student's admission information carefully" />
        </div>

        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item
            name="program_choice"
            label="Programme Choice"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Select Programme Choice"
              allowClear
              onChange={(value) => {
                const course = applicationDetails.program_choices.find(
                  (choice) => choice.course_id == value
                );

                setSelectedCourse(course);
              }}
            >
              {applicationDetails.program_choices.map((choice) => (
                <Option
                  key={choice.choice_no}
                  value={choice.course_id}
                >{`${choice.choice_no} - (${choice.course.course_code}) ${choice.course.course_title}`}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="campus"
            label="Campus"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Select Campus"
              onChange={(value) => {
                const campus = campuses.find((c) => c.value == value);

                setSelectedCampus(campus);
              }}
              allowClear
            >
              {campuses.map((campus) => (
                <Option key={campus.value} value={campus.value}>
                  {campus.campus_title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="study_time"
            label="Study Time"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Select Study time"
              onChange={(value) => {
                const studytime = studyTimes.find((s) => s.value == value);

                setSelectedStudyTime(studytime);
              }}
              allowClear
            >
              {studyTimes.map((study_time) => (
                <Option key={study_time.value} value={study_time.label}>
                  {study_time.study_time_title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="entry_yr"
            label="Entry Year"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select Entry Year  " allowClear>
              {entryYrs.map((entry_yr) => (
                <Option key={entry_yr.value} value={entry_yr.label}>
                  {entry_yr.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default AddStdToAdmissionModal;
