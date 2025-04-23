import React, { useEffect } from "react";
import {
  Layout,
  Form,
  theme,
  Select,
  Row,
  Col,
  Button,
  ConfigProvider,
} from "antd";
import ReportDetails from "./ReportDetails";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { LOAD_STD_REGISTRATION_REPORT } from "../../../gql/queries";
import {
  selectRegReportInput,
  setRegistrationReport,
  setRegistrationReportLoading,
  setRegReportInput,
} from "../../../store/registrationSlice";
import StudentsModal from "./StudentsModal";

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const options = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
];

const GET_REQS = gql`
  query Query {
    campuses {
      id
      campus_title
    }
    colleges {
      id
      college_title
      college_code
    }
    acc_yrs {
      id
      acc_yr_title
    }
    intakes {
      id
      intake_title
    }
    study_times {
      id
      study_time_title
    }
  }
`;

function RegisteredStudentsReport() {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const dispatch = useDispatch();
  const regReportInput = useSelector(selectRegReportInput);
  const { loading, error, data } = useQuery(GET_REQS);
  const [
    loadStdRegistrationReport,
    { error: loadErr, loading: loadingReport, data: loadResponse },
  ] = useLazyQuery(LOAD_STD_REGISTRATION_REPORT, {
    fetchPolicy: "network-only",
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

    if (loadErr) {
      dispatch(
        showMessage({
          message: loadErr.message,
          variant: "error",
        })
      );
    }
  }, [error, loadErr]);

  useEffect(() => {
    dispatch(setRegistrationReportLoading(loadingReport));
  }, [loadingReport]);

  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 5,
    // backgroundColor: "red",
  };

  const handleLoadReport = async (payload) => {
    const res = await loadStdRegistrationReport({
      variables: payload,
    });

    // console.log("response", res.data);
    dispatch(setRegistrationReport(res.data.student_registration_report));
  };

  const onFinish = (values) => {
    console.log("values", values);
    dispatch(setRegReportInput(values));
    const payload = {
      payload: {
        acc_yr_id: values.acc_yr_id,
        campus_id: values.campus_id,
        college_id: values.college_id,
        intake_id: values.intake_id,
        semester: parseInt(values.sem),
        study_time_id: values.study_time_id,
      },
    };

    handleLoadReport(payload);
  };

  return (
    <div>
      <Header
        style={{
          padding: 0,
          background: "#c6e3ff",
          height: "auto",
        }}
      >
        <Form
          form={form}
          name="regReportForm"
          initialValues={regReportInput}
          style={formStyle}
          onFinish={onFinish}
        >
          <Row gutter={10} align="middle" justify="space-between">
            <ConfigProvider
              theme={{
                token: {
                  colorTextPlaceholder: "gray",
                },
              }}
            >
              <Col span={3}>
                <Form.Item
                  name={`campus_id`}
                  rules={[
                    {
                      required: true,
                      message: "Select Campus",
                    },
                  ]}
                  style={{ paddingBottom: 0, marginBottom: 0 }}
                >
                  <Select placeholder="Campus" loading={loading}>
                    {data?.campuses.length > 0 && (
                      <Option value={"all_campuses"}>{"ALL CAMPUSES"}</Option>
                    )}
                    {data?.campuses.map((opt) => (
                      <Option key={opt.id} value={opt.id}>
                        {opt.campus_title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item
                  name={`college_id`}
                  rules={[
                    {
                      required: true,
                      message: "Select College",
                    },
                  ]}
                  style={{ paddingBottom: 0, marginBottom: 0 }}
                >
                  <Select placeholder="College">
                    {data?.colleges.map((opt) => (
                      <Option key={opt.id} value={opt.id}>
                        {opt.college_title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item
                  name={`acc_yr_id`}
                  rules={[
                    {
                      required: true,
                      message: "Select a scheme",
                    },
                  ]}
                  style={{ paddingBottom: 0, marginBottom: 0 }}
                >
                  <Select placeholder="Acc Yr">
                    {data?.acc_yrs.map((opt) => (
                      <Option key={opt.id} value={opt.id}>
                        {opt.acc_yr_title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item
                  name={`intake_id`}
                  rules={[
                    {
                      required: true,
                      message: "Select an intake",
                    },
                  ]}
                  style={{ paddingBottom: 0, marginBottom: 0 }}
                >
                  <Select placeholder="Intake">
                    {data?.intakes.map((opt) => (
                      <Option key={opt.id} value={opt.id}>
                        {opt.intake_title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item
                  name={`sem`}
                  rules={[
                    {
                      required: true,
                      message: "Select sem",
                    },
                  ]}
                  style={{ paddingBottom: 0, marginBottom: 0 }}
                >
                  <Select placeholder="Semester">
                    {options.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item
                  name={`study_time_id`}
                  rules={[
                    {
                      required: true,
                      message: "Select a study time",
                    },
                  ]}
                  style={{ paddingBottom: 0, marginBottom: 0 }}
                >
                  <Select placeholder="Study Time">
                    {data?.campuses.length > 0 && (
                      <Option value={"all_study_times"}>
                        {"ALL STUDY TIMES"}
                      </Option>
                    )}
                    {data?.study_times.map((opt) => (
                      <Option key={opt.id} value={opt.id}>
                        {opt.study_time_title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </ConfigProvider>

            {/* Button placed at the extreme end */}
            <Col span={6} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                danger
                htmlType="submit"
                loading={loadingReport}
                disabled={loadingReport}
              >
                Load
              </Button>
            </Col>
          </Row>
        </Form>
      </Header>
      <Content
        style={{
          margin: "10px 10px",
        }}
      >
        <div
          style={{
            padding: 0,
            // minHeight: 360,
            height: "calc(100vh - 162px)",
            background: "rgb(240, 242, 245)",
            borderRadius: 10,
            // backgroundColor: "red",
          }}
        >
          <ReportDetails />
        </div>
      </Content>
      <StudentsModal />
    </div>
  );
}

export default RegisteredStudentsReport;
