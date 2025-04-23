import { Modal, Form, Select, Radio, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAddEnrollmentModalVisible,
  selectEnrollmentStatuses,
  selectSelectedEnrollment,
  selectStudentData,
  setAddEnrollmentModelVisible,
} from "../../../../store/registrationSlice";
import { gql, useMutation } from "@apollo/client";
import { selectAccYrs } from "app/theme-layouts/layout3/modules/setup/store/setUpSlice";
import { SAVE_PAST_ENROLLMENT } from "../../../../gql/mutations";
import { selectUser } from "app/store/userSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    // span: 8,
  },
};

const AddPastEnrollmentModel = () => {
  const dispatch = useDispatch();
  const modalVisible = useSelector(selectAddEnrollmentModalVisible);
  const [form] = Form.useForm();
  const acc_yrs = useSelector(selectAccYrs);
  const enrollmentStatuses = useSelector(selectEnrollmentStatuses);
  const user = useSelector(selectUser);
  const selectedEnrollment = useSelector(selectSelectedEnrollment);
  //   console.log("modal is visible", modalVisible);
  const studentFile = useSelector(selectStudentData);

  const [savePastEnrollment, { error, loading, data }] = useMutation(
    SAVE_PAST_ENROLLMENT,
    {
      refetchQueries: ["loadStudentFile"],
    }
  );

  const handleOk = () => {
    // setIsModalOpen(false);
    dispatch(setAddEnrollmentModelVisible(false));
  };
  const handleCancel = () => {
    // setIsModalOpen(false);
    dispatch(setAddEnrollmentModelVisible(false));
  };

  const onEnroll = async (values) => {
    // console.log("Received values of form: ", values);
    // console.log(studentFile);
    // console.log(user);
    const payload = {
      studentId: studentFile.id,
      studentNo: studentFile.student_no,
      accYr: values.acc_yr,
      studyYr: values.study_yr,
      semester: values.semester,
      intake: studentFile.intake_id,
      enrollmentStatus: values.enrollment_status,
      enrolledBy: user.user.user_id,
    };

    // console.log("payload", payload);
    const res = await savePastEnrollment({
      variables: payload,
    });

    // console.log("res...", res.data);
    form.resetFields();

    dispatch(setAddEnrollmentModelVisible(false));
    dispatch(
      showMessage({
        message: res.data.savePastEnrollment.message,
        variant: "success",
      })
    );
  };
  return (
    <>
      {studentFile && (
        <Modal
          title="Add Past Enrollment"
          style={{ top: "25%" }}
          open={modalVisible}
          //   onOk={handleOk}
          onCancel={handleCancel}
          maskClosable={false}
          okText="Enroll"
          okButtonProps={{
            autoFocus: true,
            htmlType: "submit",
            danger: true,
            loading: loading,
            disabled: loading,
          }}
          modalRender={(dom) => (
            <Form
              //   layout="vertical"
              {...layout}
              form={form}
              name="form_in_modal"
              initialValues={{
                add_invoice: 1,
              }}
              clearOnDestroy
              onFinish={(values) => onEnroll(values)}
            >
              {dom}
            </Form>
          )}
        >
          <Form.Item
            name="acc_yr"
            label="Academic Year"
            rules={[
              {
                required: true,
                message: "Academic Year is required",
              },
            ]}
            // style={{
            //   marginBottom: 15,
            // }}
          >
            <Select
              placeholder="Select Academic Year"
              //   onChange={onGenderChange}
              allowClear
            >
              {acc_yrs.map((acc_yr) => (
                <Option value={acc_yr.id}>{acc_yr.acc_yr_title}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="study_yr"
            label="Study Year"
            rules={[
              {
                required: true,
                message: "Please select the Study Year",
              },
            ]}
          >
            <Select placeholder="Select Study Year" allowClear>
              {Array.from(
                { length: studentFile?.course_details.course.course_duration },
                (_, i) => (
                  <Option value={i + 1}>{i + 1}</Option>
                )
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="semester"
            label="Semester"
            rules={[
              {
                required: true,
                message: "Please select the semester",
              },
            ]}
            // style={{
            //   marginBottom: 15,
            // }}
          >
            <Select
              placeholder="Select Semester"
              //   onChange={onGenderChange}
              allowClear
            >
              <Option value={1}>1</Option>
              <Option value={2}>2</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="enrollment_status"
            label="Enrollment Status"
            rules={[
              {
                required: true,
                message: "Please select the enrollment status",
              },
            ]}
          >
            <Select placeholder="Select Enrollment Status" allowClear>
              {enrollmentStatuses?.map((status) => (
                <Option value={status.id}>{status.title}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="add_invoice"
            label="Add Invoice"
            layout="horizontal"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Modal>
      )}
    </>
  );
};
export default AddPastEnrollmentModel;
