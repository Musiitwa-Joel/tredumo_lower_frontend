import { gql, useLazyQuery, useQuery } from "@apollo/client";
import Papa from "papaparse";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  Form,
  theme,
  Row,
  Col,
  Select,
  Button,
  Input,
  Space,
  Table,
  ConfigProvider,
} from "antd";
import { Download, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GET_COURSE_UNITS } from "../../../prog_and_courses/gql/queries";
import { LOAD_RESULTS_HISTORY } from "../../gql/queries";

const LOAD_REQS = gql`
  query loadReqs {
    acc_yrs {
      id
      acc_yr_title
    }
    university_details {
      entry_yrs
      semeters_per_acc_yr
    }
    courses {
      id
      course_code
      course_title
      course_versions {
        id
        version_title
      }
    }
    employees {
      id
      salutation
      surname
      other_names
    }
  }
`;

function SubmissionHistory() {
  const dispatch = useDispatch();
  const { token } = theme.useToken();
  const { error, loading, data } = useQuery(LOAD_REQS);
  const [form] = Form.useForm();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseVersions, setCourseVersions] = useState([]);
  const [courseUnits, setCoursUnits] = useState([]);
  const [uploadType, setUploadType] = useState(null);
  const [resultsHist, setResultsHist] = useState([]);
  const [getCourseUnits, { error: loadErr, loading: loadingCourseUnits }] =
    useLazyQuery(GET_COURSE_UNITS, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    });
  const [
    loadResultsHistory,
    { error: loadHistErr, loading: loadingResultsHistory },
  ] = useLazyQuery(LOAD_RESULTS_HISTORY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  });

  const columns = [
    {
      title: "#",
      dataIndex: "#",
      key: "index",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Student No",
      dataIndex: "student_no",
      ellipsis: true,
      width: 100,
    },
    {
      title: "Student Name",
      dataIndex: "student_name",
      ellipsis: true,
      width: 200,
      render: (text, record) =>
        `${record.student_info.biodata.surname} ${record.student_info.biodata.other_names}`,
    },
    {
      title: "Registration No.",
      dataIndex: "registration_no",
      ellipsis: true,
      width: 180,
      render: (text, record) => `${record.student_info.registration_no}`,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      // ellipsis: true,
      width: 70,
      render: (text, record) => `${record.student_info.biodata.gender}`,
    },
    (!uploadType || uploadType === "course_work") && {
      title: "CW. Mark",
      dataIndex: "coursework",
      ellipsis: true,
      width: 80,
    },
    (!uploadType || uploadType === "exam_mark") && {
      title: "Exam",
      dataIndex: "exam",
      ellipsis: true,
      width: 50,
    },
    !uploadType && {
      title: "Final Mark",
      dataIndex: "final_mark",
      ellipsis: true,
      width: 80,
    },
    !uploadType && {
      title: "No. Of Retakes",
      dataIndex: "no_of_retakes",
      // ellipsis: true,
      width: 100,
      render: (text, record) => `${record.retake_count}`,
    },
    {
      title: "Course Unit Code",
      dataIndex: "course_unit_code",
      // ellipsis: true,
      width: 140,
    },
    {
      title: "Title",
      dataIndex: "course_unit_title",
      ellipsis: true,
      width: 250,
    },
    {
      title: "C.Units",
      dataIndex: "credit_units",
      ellipsis: true,
      width: 70,
    },
    {
      title: "Version",
      dataIndex: "course_version",
      ellipsis: true,
      width: 80,
      render: (text, record) =>
        `${record.student_info.course_details.version_title}`,
    },
    (!uploadType || uploadType === "exam_mark") && {
      title: "Uploaded By",
      dataIndex: "uploaded_by",
      ellipsis: true,
      width: 180,
      render: (text, record) => record.uploaded_by_user,
    },
    uploadType === "course_work" && {
      title: "CW Uploaded By",
      dataIndex: "uploaded_by",
      ellipsis: true,
      width: 180,
      render: (text, record) => record.cw_uploaded_by_user,
    },
  ].filter(Boolean); // Removes falsy values from the array

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (loadErr) {
      dispatch(
        showMessage({
          message: loadErr.message,
          variant: "error",
        })
      );
    }

    if (loadHistErr) {
      dispatch(
        showMessage({
          message: loadHistErr.message,
          variant: "error",
        })
      );
    }
  }, [error, loadErr, loadHistErr]);

  const onFinish = async (values) => {
    console.log("values", values);

    const payload = {
      payload: {
        acc_yr_id: values.acc_yr,
        course_id: values.course,
        course_unit_id: values.course_unit || null,
        entry_acc_yr: values.entry_acc_yr || null,
        student_no: values.student_no || null,
        study_yr: values.study_yr || null,
        sem: values.sem || null,
        uploaded_by_id: values.uploaded_by || null,
        version_id: values.version || null,
        start: 0,
        limit: 200,
      },
    };

    const res = await loadResultsHistory({
      variables: payload,
    });

    // console.log("response", res.data);

    setResultsHist(res.data?.load_results_history);
  };

  const handleVersionChange = async (value) => {
    // console.log("value", value);
    if (value) {
      const res = await getCourseUnits({
        variables: {
          courseVersionId: value,
        },
      });

      // console.log("response", res.data);
      setCoursUnits(res.data.course_units);
    } else {
      setCoursUnits([]);
    }
  };

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: "0px 15px",
    paddingTop: 10,
    paddingBottom: 4,
    // margin: 10,
    // backgroundColor: "red",
  };

  const exportToCSV = () => {
    const data = resultsHist.map((result) => ({
      "Student No": result.student_no,
      "Student Name": `${result.student_info.biodata.surname} ${result.student_info.biodata.other_names}`,
      "Registration Number": result.registration_no,
      Gender: result.student_info.biodata.gender,
      "Course Work Marks": result.coursework,
      "Exam Marks": result.exam,
      "Final Mark": result.final_mark,
      "Retake Count": result.retake_count,
      "Course Unit Code": result.course_unit_code,
      "Course Unit Title": result.course_unit_title,
      "Credit Units": result.credit_units,
      "Course Work Uploaded By": result.cw_uploaded_by_user,
      "Uploaded By": result.uploaded_by_user,

      // Email: user.email,
      // Downloads: user.downloads,
      // Logins: user.logins,
      // Views: user.views,
      // LastActive: new Date(user.lastActive).toLocaleDateString(),
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "student-marks.csv");
  };

  return (
    <div>
      <Form
        // initialValues={_applicantFillForm}
        form={form}
        name="advanced_search"
        style={formStyle}
        onFinish={onFinish}
      >
        <Row gutter={16} align="middle">
          <Col
            span={4}
            style={{
              //   backgroundColor: "green",
              paddingBottom: 0,
            }}
          >
            <Form.Item
              name={`acc_yr`}
              label={`Academic Year`}
              rules={[
                {
                  required: true,
                  message: "Field is Required",
                },
              ]}
              style={{
                paddingBottom: 0,
                marginBottom: 10,
              }}
            >
              <Select
                loading={loading}
                placeholder="Acc Yr"
                // size="small"
              >
                {data &&
                  data?.acc_yrs.map((acc_yr) => (
                    <Option value={acc_yr.id}>{acc_yr.acc_yr_title}</Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item
              name={`study_yr`}
              label={`Study Year`}
              rules={[
                {
                  required: true,
                  message: "Select study Yr",
                },
              ]}
              style={{
                paddingBottom: 0,
                marginBottom: 10,
              }}
            >
              <Select loading={loading} placeholder="Study Year">
                {data &&
                  Array.from(
                    { length: data.university_details.entry_yrs },
                    (_, index) => (
                      <Option value={`${index + 1}`}>{`${index + 1}`}</Option>
                    )
                  )}
              </Select>
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item
              name={`sem`}
              label={`Sem`}
              rules={[
                {
                  required: true,
                  message: "Select Sem",
                },
              ]}
              style={{
                paddingBottom: 0,
                marginBottom: 10,
              }}
            >
              <Select loading={loading} placeholder="Sem">
                {data &&
                  Array.from(
                    { length: data.university_details.semeters_per_acc_yr },
                    (_, index) => (
                      <Option value={`${index + 1}`}>{`${index + 1}`}</Option>
                    )
                  )}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label={`Course`}
              name={`course`}
              rules={[
                {
                  required: true,
                  message: "Select Course",
                },
              ]}
              style={{
                paddingBottom: 0,
                marginBottom: 10,
              }}
            >
              <Select
                showSearch
                loading={loading}
                placeholder="Select Course"
                options={
                  data
                    ? data?.courses.map((course) => ({
                        value: course.id,
                        label: `(${course.course_code}) - ${course.course_title}`,
                      }))
                    : []
                }
                onChange={(value) => {
                  const item = data?.courses.filter((i) => i.id == value);
                  //   console.log("selected", item);
                  setSelectedCourse(item[0]);
                  setCourseVersions(item[0].course_versions);
                }}
                filterOption={(input, option) =>
                  option?.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item
              name={`version`}
              label={`Version`}
              style={{
                paddingBottom: 0,
                marginBottom: 10,
              }}
            >
              <Select
                loading={loading}
                placeholder="Version"
                onChange={handleVersionChange}
                allowClear
              >
                {courseVersions.map((version) => (
                  <Option value={version.id}>{version.version_title}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              name={`course_unit`}
              //   label={`Course Unit`}
            >
              <Select
                showSearch
                loading={loadingCourseUnits}
                placeholder="Course Unit"
                allowClear
                options={courseUnits.map((unit) => ({
                  value: unit.id,
                  label: `(${unit.course_unit_code}) - ${unit.course_unit_title}`,
                }))}
                filterOption={(input, option) =>
                  option?.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item
              name={`upload_type`}
              //   label={`Uploaded By`}
            >
              <Select
                showSearch
                loading={loading}
                placeholder="Uploaded Type"
                allowClear
                options={[
                  { label: "Course Work", value: "course_work" },
                  { label: "Exam Mark", value: "exam_mark" },
                ]}
                filterOption={(input, option) =>
                  option?.label.toLowerCase().includes(input.toLowerCase())
                }
                onChange={(value) => {
                  setUploadType(value);
                }}
              />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item
              name={`uploaded_by`}
              //   label={`Uploaded By`}
            >
              <Select
                showSearch
                loading={loading}
                placeholder="Uploaded By"
                allowClear
                options={
                  data
                    ? data?.employees.map((employee) => ({
                        value: employee.id,
                        label: `${employee.salutation} ${employee.surname} ${employee.other_names}`,
                      }))
                    : []
                }
                filterOption={(input, option) =>
                  option?.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item
              name={`entry_acc_yr`}
              //   label={`Entry Acc Yr`}
            >
              <Select loading={loading} placeholder="Entry Acc. Yr" allowClear>
                {data &&
                  data?.acc_yrs.map((acc_yr) => (
                    <Option value={acc_yr.id}>{acc_yr.acc_yr_title}</Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item
              name={`student_no`}
              //   label={`Student No.`}
            >
              <Input placeholder="Student No." />
            </Form.Item>
          </Col>

          <Col span={2}>
            <div
              style={{
                paddingBottom: 0,
                marginBottom: 10,
              }}
            >
              <Space size="middle">
                <Button
                  type="primary"
                  danger
                  htmlType="submit"
                  disabled={loadingResultsHistory}
                  loading={loadingResultsHistory}
                >
                  Load
                </Button>

                <Button
                  type="primary"
                  icon={<Download size={15} />}
                  onClick={exportToCSV}
                  disabled={resultsHist.length == 0}
                ></Button>

                <Button
                  type="primary"
                  ghost
                  danger
                  htmlType="submit"
                  icon={<Trash size={15} />}
                  //   disabled={loadingSummary}
                  //   loading={loadingSummary}
                ></Button>
              </Space>
            </div>
          </Col>

          {/* <Col span={4} style={{ marginLeft: "auto", textAlign: "right" }}>
                <Button
                  style={{
                    backgroundColor: "#fff",
                  }}
                  size="small"
                >
                  View Incomplete Forms
                </Button>
              </Col> */}
        </Row>
      </Form>

      <div>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                borderColor: "lightgray",
                borderRadius: 0,
                headerBorderRadius: 0,
              },
            },
          }}
        >
          <Table
            bordered
            columns={columns}
            dataSource={resultsHist}
            rowKey={(record) => {
              return `${record.student_no}-${record.course_unit_code}`;
            }}
            showHeader={true}
            size="small"
            loading={loadingResultsHistory}
            rowSelection={{
              type: "checkbox",
            }}
            scroll={{
              y: "calc(100vh - 330px)",
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}

export default SubmissionHistory;
