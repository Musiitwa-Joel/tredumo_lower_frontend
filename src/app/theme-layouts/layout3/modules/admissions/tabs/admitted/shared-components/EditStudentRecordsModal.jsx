import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Typography,
  Checkbox,
  Form,
  Input,
  Row,
  Col,
  Select,
  Divider,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEditStudentsRecordsModalVisible,
  selectSelectedAdmittedStudent,
  setEditStudentRecordsModalVisible,
} from "../../../admissionsSlice";
import { Close } from "@mui/icons-material";
import { gql, useMutation, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { SAVE_STUDENT_DETAILS } from "../../../graphql/mutations";

const LOAD_REQS = gql`
  query loadReqs {
    courses {
      id
      course_code
      course_title
    }
    intakes {
      id
      intake_title
    }
    study_times {
      id
      study_time_title
    }
    campuses {
      id
      campus_title
    }
  }
`;

const EditStudentRecordsModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(selectEditStudentsRecordsModalVisible);
  const selectedAdmittedStudent = useSelector(selectSelectedAdmittedStudent);
  const [form] = Form.useForm();
  const { data, error, loading } = useQuery(LOAD_REQS);
  const [saveStudentDetails, { error: saveErr, loading: savingStdDetails }] =
    useMutation(SAVE_STUDENT_DETAILS, {
      refetchQueries: ["loadAdmittedStudents"],
    });

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [error]);

  useEffect(() => {
    if (selectedAdmittedStudent) {
      form.setFieldsValue({
        student_name: `${selectedAdmittedStudent.biodata.surname} ${selectedAdmittedStudent.biodata.other_names}`,
        student_no: selectedAdmittedStudent.student_no,
        nationality:
          selectedAdmittedStudent.biodata.nationality.nationality_title,
        gender: selectedAdmittedStudent.biodata.gender?.toUpperCase(),
        reg_no: selectedAdmittedStudent.registration_no,
        course: selectedAdmittedStudent.course.id,
        intake: selectedAdmittedStudent.intake_id,
        study_time: selectedAdmittedStudent.study_time_id,
        campus: selectedAdmittedStudent.campus_id,
        is_resident: selectedAdmittedStudent.is_resident,
      });
    }
  }, [selectedAdmittedStudent]);

  const handleCancel = () => {
    dispatch(setEditStudentRecordsModalVisible(false));
  };

  const handleSave = async () => {
    try {
      await form.validateFields();

      const values = form.getFieldsValue();

      const payload = {
        payload: {
          std_id: selectedAdmittedStudent.std_id,
          student_no: values.student_no,
          registration_no: values.reg_no,
          course_id: values.course,
          intake_id: values.intake,
          study_time_id: values.study_time,
          campus_id: values.campus,
          is_resident: values.is_resident,
          hall_of_residence: values.hall_of_residence,
        },
      };

      const res = await saveStudentDetails({
        variables: payload,
      });

      //   console.log("response", res.data);
      if (res.data.saveStudentDetails) {
        dispatch(
          showMessage({
            message: res.data.saveStudentDetails.message,
            variant: "success",
          })
        );

        dispatch(setEditStudentRecordsModalVisible(false));
      }
    } catch (error) {
      dispatch(
        showMessage({
          message: "Please fill in all the fields",
          variant: "info",
        })
      );
    }
  };

  if (!selectedAdmittedStudent) return null;

  return (
    <>
      <Modal
        title={
          <Typography.Text
            style={{
              color: "#fff",
            }}
          >
            {`EDIT STUDENT DETAILS`}
          </Typography.Text>
        }
        maskClosable={false}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={handleCancel}
        width={800}
        closeIcon={
          <Close
            style={{
              color: "#fff",
            }}
          />
        }
        styles={{
          body: {
            padding: "10px 10px",
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
        okText="Save"
        okButtonProps={{
          loading: savingStdDetails,
          disabled: savingStdDetails,
        }}
      >
        <Form
          name="studentRecordForm"
          form={form}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col md={12}>
              <Divider
                orientation="left"
                orientationMargin={0}
                style={{
                  margin: 0,
                  marginBottom: 10,
                }}
              >
                Editable Fields
              </Divider>
              <Form.Item
                label="Reg Number"
                name="reg_no"
                rules={[
                  {
                    required: true,
                    message: "Reg Number is required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Course"
                name="course"
                rules={[
                  {
                    required: true,
                    message: "Course is required!",
                  },
                ]}
              >
                <Select
                  showSearch
                  loading={loading}
                  options={
                    data
                      ? data.courses.map((course) => ({
                          value: course.id,
                          label: `(${course.course_code}) ${course.course_title}`,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                label="Intake"
                name="intake"
                loading={loading}
                rules={[
                  {
                    required: true,
                    message: "Study Time is required!",
                  },
                ]}
              >
                <Select
                  showSearch
                  options={
                    data
                      ? data.intakes.map((intake) => ({
                          value: intake.id,
                          label: intake.intake_title,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                label="Study Time"
                name="study_time"
                loading={loading}
                rules={[
                  {
                    required: true,
                    message: "Please input your reg_no!",
                  },
                ]}
              >
                <Select
                  showSearch
                  options={
                    data
                      ? data.study_times.map((study_time) => ({
                          value: study_time.id,
                          label: study_time.study_time_title,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                label="Campus"
                name="campus"
                loading={loading}
                rules={[
                  {
                    required: true,
                    message: "Please input your reg_no!",
                  },
                ]}
              >
                <Select
                  showSearch
                  options={
                    data
                      ? data.campuses.map((campus) => ({
                          value: campus.id,
                          label: campus.campus_title,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                name="is_resident"
                valuePropName="checked"
                label={"Is resident"}
              >
                <Checkbox></Checkbox>
              </Form.Item>

              <Form.Item
                label="Hall Of Residence"
                name="hall_of_residence"
                initialValue={null}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Divider
                orientation="left"
                orientationMargin={0}
                style={{
                  margin: 0,
                  marginBottom: 10,
                }}
              >
                Non-Editable Fields
              </Divider>
              <Form.Item
                label="Student Name"
                name="student_name"
                rules={[
                  {
                    required: true,
                    message: "Please input your stdno!",
                  },
                ]}
              >
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label="Student Number"
                name="student_no"
                rules={[
                  {
                    required: true,
                    message: "Please input your stdno!",
                  },
                ]}
              >
                <Input readOnly />
              </Form.Item>

              <Form.Item
                label="Nationality"
                name="nationality"
                rules={[
                  {
                    required: true,
                    message: "Please input your stdno!",
                  },
                ]}
              >
                <Input readOnly />
              </Form.Item>

              <Form.Item
                label="Gender"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Please input your stdno!",
                  },
                ]}
              >
                <Input readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default EditStudentRecordsModal;
