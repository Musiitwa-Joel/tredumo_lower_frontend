import { Button, Col, Form, Row, Select, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  loadInitialApplicantRequirements,
  selectApplicantFillForm,
  selectApplicantRequirements,
  selectApplicantsSummary,
  setApplicantFillForm,
  setApplicantSelectedRowKey,
  setApplicantsSummary,
} from "src/app/theme-layouts/layout3/modules/admissions/admissionsSlice.js";
import { useEffect } from "react";
import { selectUserDetails, selectUserPermissions } from "app/store/userSlice";
import hasPermission from "src/utils/hasPermission";
const { Option } = Select;

// Dummy data to replace GraphQL queries
const dummyData = {
  acc_yrs: [
    { id: "1", acc_yr_title: "2023/2024" },
    { id: "2", acc_yr_title: "2024/2025" },
    { id: "3", acc_yr_title: "2025/2026" },
  ],
  term: [
    { id: "1", scheme_title: "1" },
    { id: "2", scheme_title: "2" },
    { id: "3", scheme_title: "3" },
  ],
  classes: [
    { id: "c_1", class_title: "SENIOR 1" },
    { id: "c_2", class_title: "SENIOR 2" },
    { id: "c_3", class_title: "SENIOR 3" },
  ],
  schools: [
    { id: "1", school_code: "NORTH", school_title: "North" },
    { id: "2", school_code: "SOUTH", school_title: "South" },
    { id: "3", school_code: "EAST", school_title: "East" },
  ],
};

// Mock applicants summary data
const dummyApplicantsSummary = {
  applicantsSammary: [
    {
      id: "1",
      name: "John Doe",
      program: "Computer Science",
      status: "Pending",
    },
    {
      id: "2",
      name: "Jane Smith",
      program: "Mechanical Engineering",
      status: "Approved",
    },
  ],
};

// Dummy user details to simulate user data
const dummyUserDetails = {
  school_id: null, // Set to null to simulate a user without a specific school, forcing the school selection dropdown
  user_id: "USR001",
  name: "Admin User",
};

const ApplicantsFillForm = () => {
  const dispatch = useDispatch();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const applicantReqs = useSelector(selectApplicantRequirements);
  const _applicantFillForm = useSelector(selectApplicantFillForm);
  const applicantSummary = useSelector(selectApplicantsSummary);
  const userPermissions = useSelector(selectUserPermissions);
  const userDetails = useSelector(selectUserDetails) || dummyUserDetails; // Fallback to dummyUserDetails if null

  const can_manage_all_applicants = hasPermission(
    userPermissions,
    "can_manage_all_applicants"
  );

  // Load dummy data on component mount
  useEffect(() => {
    dispatch(loadInitialApplicantRequirements(dummyData));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setApplicantSelectedRowKey(null));
  }, [applicantSummary, dispatch]);

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: "0px 15px",
    paddingTop: 10,
    paddingBottom: 4,
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        accYrId: values.acc_yr,
        termId: values.term,
        classId: values.class,
        streamId: values.stream,
        completed: true,
        schoolId: userDetails.school_id ? userDetails.school_id : values.stream,
      };

      dispatch(setApplicantFillForm(values));
      dispatch(setApplicantsSummary(dummyApplicantsSummary.applicantsSammary));
    } catch (error) {
      dispatch(
        showMessage({
          message: "Error loading applicants summary",
          variant: "error",
        })
      );
    }
  };

  return (
    <>
      <Form
        initialValues={_applicantFillForm}
        form={form}
        name="advanced_search"
        style={formStyle}
        onFinish={onFinish}
      >
        <Row gutter={24} align="middle">
          <Col span={5} style={{ paddingBottom: 0 }}>
            <Form.Item
              name={`acc_yr`}
              label={`Academic Year`}
              rules={[{ required: true, message: "Field is Required" }]}
              style={{ paddingBottom: 0, marginBottom: 0 }}
            >
              <Select placeholder="Academic Year">
                {applicantReqs.acc_yrs.map((acc_yr) => (
                  <Option key={acc_yr.id} value={acc_yr.id}>
                    {acc_yr.acc_yr_title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              name={`term`}
              label={`Term/Semester`}
              rules={[{ required: true, message: "Select a term/semester" }]}
              style={{ paddingBottom: 0, marginBottom: 0 }}
            >
              <Select placeholder="Term/Semester">
                {applicantReqs.term?.map((term) => (
                  <Option key={term.id} value={term.id}>
                    {term.scheme_title || term.term_title || term.id}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              name={`class`}
              label={`Class`}
              rules={[{ required: true, message: "Select a class" }]}
              style={{ paddingBottom: 0, marginBottom: 0 }}
            >
              <Select placeholder="Class">
                {applicantReqs.classes?.map((cls) => (
                  <Option key={cls.id} value={cls.id}>
                    {cls.class_title || cls.intake_title || cls.id}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {!userDetails?.school_id && (
            <Col span={7}>
              <Form.Item
                name="stream"
                label="Stream"
                rules={[{ required: true, message: "Select a school" }]}
                style={{ paddingBottom: 0, marginBottom: 0 }}
              >
                <Select placeholder="School/Faculty">
                  <Option value={"all"}>{`ALL STREAMS`}</Option>
                  {applicantReqs.schools.map((school) => (
                    <Option key={school.id} value={school.id}>
                      {`(${school.school_code}) ${school.school_title}`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col span={2}>
            <Button type="primary" danger htmlType="submit" size="small">
              Load
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ApplicantsFillForm;
