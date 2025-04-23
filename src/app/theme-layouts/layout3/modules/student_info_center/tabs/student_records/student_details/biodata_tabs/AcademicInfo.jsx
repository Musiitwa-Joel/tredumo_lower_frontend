import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Space, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedStudent } from "../../../../store/infoCenterSlice";
import { gql, useQuery } from "@apollo/client";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const LOAD_REQS = gql`
  query Intakes {
    intakes {
      id
      intake_title
    }
    acc_yrs {
      id
      acc_yr_title
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
    levels {
      id
      level_code
      level_title
    }
    campuses {
      id
      campus_title
    }
    study_times {
      id
      study_time_title
    }
    schools {
      id
      school_code
      school_title
      departments {
        id
        dpt_title
      }
    }
    colleges {
      id
      college_title
    }
  }
`;
const AcademicInfo = ({ form }) => {
  const dispatch = useDispatch();
  const selectedStudent = useSelector(selectSelectedStudent);
  const { loading, error, data } = useQuery(LOAD_REQS);
  const [selectedCourse, setSelectedCourse] = useState();
  // const [form] = Form.useForm();

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

  const onFinish = (values) => {
    console.log(values);
  };

  if (!selectedStudent) return;

  useEffect(() => {
    if (selectedStudent) {
      const selected = data?.courses.find(
        (course) => course.id == selectedStudent.course.id
      );

      setSelectedCourse(selected);

      form.setFieldsValue({
        course_code: selected?.course_code,
      });

      // console.log("selected", selectedStudent);

      form.setFieldsValue({
        student_no: selectedStudent.student_no,
        reg_no: selectedStudent.registration_no,
        intake: selectedStudent.intake_id,
        entry_acc_yr: selectedStudent.entry_acc_yr,
        // course_code: selectedStudent.course.course_code,
        course_title: selectedStudent.course.id,
        course_version: selectedStudent.course_details.id,
        entry_study_yr: selectedStudent.entry_study_yr,
        level: selectedStudent.course.level_details.level_title,
        campus: selectedStudent.campus_id,
        status: selectedStudent.status == 1 ? "Active" : "Inactive",
        sponsorhip: selectedStudent.sponsorhip,
        study_time: selectedStudent.study_time_id,
        current_yr: selectedStudent.study_yr,
        sem: selectedStudent.current_sem,
        college: selectedStudent.course.school.college.id,
        school: selectedStudent.course.school.id,
      });
    }
  }, [selectedStudent, data]);

  // useEffect(() => {

  // }, [selectedStudent]);
  return (
    <>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        //   style={{
        //     maxWidth: 600,
        //   }}
      >
        <Row gutter={0}>
          <Col className="gutter-row" span={12}>
            <Form.Item
              name="student_no"
              label="Student Number"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              name="reg_no"
              label="Reg No"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="intake"
              label="Intake"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                showSearch
                loading={loading}
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
              name="entry_acc_yr"
              label="Entry Acc Yr"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                showSearch
                loading={loading}
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
              name="course_title"
              label="Course Title"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                showSearch
                loading={loading}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(course_id) => {
                  const selected = data?.courses.find(
                    (course) => course.id == course_id
                  );

                  form.setFieldsValue({
                    course_code: selected?.course_code,
                  });

                  setSelectedCourse(selected);
                }}
                options={
                  data?.courses
                    ? data?.courses.map((course) => ({
                        value: course.id,
                        label: course.course_title,
                      }))
                    : []
                }
              />
            </Form.Item>

            <Form.Item
              name="course_code"
              label="Course Code"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input readOnly />
            </Form.Item>

            <Form.Item
              name="course_version"
              label="Course Version"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                showSearch
                loading={loading}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={
                  selectedCourse
                    ? selectedCourse?.course_versions.map((version) => ({
                        value: version.id,
                        label: version.version_title,
                      }))
                    : []
                }
              />
            </Form.Item>

            <Form.Item
              name="entry_study_yr"
              label="Entry Study Year"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                showSearch
                loading={loading}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={
                  selectedCourse
                    ? Array.from(
                        { length: selectedCourse?.course_duration },
                        (_, i) => {
                          const value = i + 1;
                          return { value, label: value };
                        }
                      )
                    : []
                }
              />
            </Form.Item>

            <Form.Item
              name="level"
              label="Level"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                showSearch
                loading={loading}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={
                  data?.levels
                    ? data?.levels.map((level) => ({
                        value: level.id,
                        label: level.level_title,
                      }))
                    : []
                }
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <div>
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
                  showSearch
                  loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    data?.campuses
                      ? data?.campuses.map((campus) => ({
                          value: campus.id,
                          label: campus.campus_title,
                        }))
                      : []
                  }
                />
              </Form.Item>
              <Form.Item
                name="status"
                label="Status"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="sponsorship"
                label="Sponsorship"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
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
                  showSearch
                  loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    data?.study_times
                      ? data?.study_times.map((st) => ({
                          value: st.id,
                          label: st.study_time_title,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                name="current_yr"
                label="Current Year"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="sem"
                label="Current Sem"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="college"
                label="College"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  showSearch
                  loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    data?.colleges
                      ? data?.colleges.map((c) => ({
                          value: c.id,
                          label: c.college_title,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                name="school"
                label="Faculty/School"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  showSearch
                  loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    data?.schools
                      ? data?.schools.map((sch) => ({
                          value: sch.id,
                          label: `(${sch.school_code}) ${sch.school_title}`,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                name="dpt"
                label="Department"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          </Col>
        </Row>

        {/* <Form.Item>
          <Space>
            <Button
              type="primary"
              style={{
                backgroundColor: "dodgerblue",
              }}
              htmlType="submit"
            >
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
            <Button type="link" htmlType="button" onClick={onFill}>
              Fill form
            </Button>
          </Space>
        </Form.Item> */}
      </Form>
    </>
  );
};
export default AcademicInfo;
