import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Modal,
  Divider,
  Typography,
} from "antd";
import {
  selectResultsConfigModalVisible,
  selectResultsConfigurations,
  setResultsConfigModalVisible,
} from "../store/resultsSlice";
import { gql, useMutation, useQuery } from "@apollo/client";
import { SAVE_RESULTS_CONFIG } from "../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  // wrapperCol: {
  //   span: 16,
  // },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const LOAD_REQS = gql`
  query loadReqs {
    campuses {
      id
      campus_title
    }
    intakes {
      id
      intake_title
    }
    acc_yrs {
      id
      acc_yr_title
    }
    study_times {
      id
      study_time_title
    }
  }
`;

const ResultsConfigModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(selectResultsConfigModalVisible);
  const configurations = useSelector(selectResultsConfigurations);
  const [form] = Form.useForm();
  const [saveResultsConfig, { error, loading, data }] = useMutation(
    SAVE_RESULTS_CONFIG,
    {
      refetchQueries: ["getResultsConfig"],
    }
  );
  const {
    error: loadErr,
    loading: loadingReqs,
    data: loadRes,
  } = useQuery(LOAD_REQS);

  useEffect(() => {
    if (loadErr) {
      dispatch(
        showMessage({
          message: loadErr.message,
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
  }, [loadErr, error]);

  useEffect(() => {
    if (configurations) {
      form.setFieldsValue({
        acc_yr: configurations.acc_yr_id,
        campus: configurations.campus_id,
        intake: configurations.intake_id || "all",
        study_time: configurations.study_time_id || "all",
        study_yr: configurations.study_yr,
        sem: configurations.sem,
      });
    }
  }, [configurations]);
  const onFinish = async (values) => {
    // console.log(values);

    const payload = {
      acc_yr_id: values.acc_yr,
      campus_id: values.campus,
      intake: values.intake,
      study_time: values.study_time,
      study_yr: values.study_yr || null,
      sem: values.sem || null,
    };

    const res = await saveResultsConfig({
      variables: {
        payload,
      },
    });

    // console.log("res", res.data);
    if (res.data.saveResultsConfig) {
      dispatch(
        showMessage({
          message: res.data.saveResultsConfig.message,
          variant: "success",
        })
      );
    }
  };

  const handleOk = () => {
    dispatch(setResultsConfigModalVisible(false));
  };

  const handleCancel = () => {
    dispatch(setResultsConfigModalVisible(false));
  };

  return (
    <>
      <Modal
        title={
          <div
            style={{
              backgroundColor: "#1890ff", // A nice blue color
              padding: "12px 20px", // Add padding for better spacing
              // margin: "-16px -24px 0 -24px", // Adjust margins to align with modal edges
              borderRadius: "8px 8px 0 0", // Rounded corners at the top
              color: "#fff", // White text color
              fontSize: "16px", // Increase font size
              fontWeight: "bold", // Make the text bold
            }}
          >
            Results Display Settings
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        styles={{
          body: {
            paddingRight: 0,
          },
          content: {
            padding: 0,
          },
        }}
        footer={false}
      >
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ padding: 10 }}
          {...layout}
        >
          <Form.Item
            name="acc_yr"
            label="Academic Year"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Academic Year"
              loading={loadingReqs}
              options={
                loadRes
                  ? loadRes.acc_yrs.map((acc_yr) => ({
                      label: acc_yr.acc_yr_title,
                      value: acc_yr.id,
                    }))
                  : []
              }
            />
          </Form.Item>

          <Form.Item name="campus" label="Campus" rules={[{ required: true }]}>
            <Select
              placeholder="Campus"
              loading={loadingReqs}
              style={{
                width: "100%",
              }}
              // onChange={handleChange}
              options={
                loadRes
                  ? loadRes.campuses.map((campus) => ({
                      label: campus.campus_title,
                      value: campus.id,
                    }))
                  : []
              }
            />
          </Form.Item>

          <Form.Item name="intake" label="Intake" rules={[{ required: true }]}>
            <Select
              placeholder="Intake"
              style={{
                width: "100%",
              }}
              loading={loadingReqs}
              options={
                loadRes
                  ? [
                      {
                        label: "All Intakes",
                        value: "all",
                      },
                      ...loadRes.intakes.map((intake) => ({
                        label: intake.intake_title,
                        value: intake.id,
                      })),
                    ]
                  : []
              }
            />
          </Form.Item>

          <Form.Item
            name="study_time"
            label="Study Time"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Study time"
              style={{
                width: "100%", // Ensures the Select component takes full width
              }}
              loading={loadingReqs} // Shows a loading spinner when options are being fetched
              options={
                loadRes
                  ? [
                      {
                        label: "All Study Times",
                        value: "all",
                      },

                      ...loadRes.study_times.map((study_time) => ({
                        label: study_time.study_time_title,
                        value: study_time.id,
                      })),
                    ]
                  : []
              }
            />
          </Form.Item>

          <Form.Item name="study_yr" label="Study Year">
            <Select placeholder="Select Study Year" allowClear>
              {Array.from({ length: 8 }, (_, index) => (
                <Option value={`${index + 1}`}>{`${index + 1}`}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="sem" label="Semester">
            <Select placeholder="Select Semester" allowClear>
              {Array.from({ length: 2 }, (_, index) => (
                <Option value={`${index + 1}`}>{`${index + 1}`}</Option>
              ))}
            </Select>
          </Form.Item>

          <Divider
            variant="dashed"
            style={{
              borderColor: "#1890ff",

              padding: 0,
              marginTop: 10,
              marginBottom: 10,
            }}
          />

          <Form.Item>
            <Space
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                htmlType="button"
                onClick={() => dispatch(setResultsConfigModalVisible(false))}
              >
                Close
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ResultsConfigModal;
