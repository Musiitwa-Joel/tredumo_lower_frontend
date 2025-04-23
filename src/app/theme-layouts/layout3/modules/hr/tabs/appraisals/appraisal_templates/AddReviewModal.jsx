import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Form, Input, Space, DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAddReviewModalVisible,
  setAddReviewModalVisible,
} from "../../../store/hrSlice";
import { gql, useMutation, useQuery } from "@apollo/client";
import { SAVE_PERFORMANCE_REVIEW } from "../../../gql/mutations";
import formatDateToYYYYMMDD from "app/theme-layouts/layout3/utils/convertDateToYYMMDD";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const LOAD_REQS = gql`
  query Query($active: Boolean) {
    employees(active: $active) {
      id
      salutation
      surname
      other_names
    }
    evaluation_templates {
      template_id
      template_name
    }
  }
`;

const AddReviewModal = () => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(selectAddReviewModalVisible);
  const { error, loading, data } = useQuery(LOAD_REQS, {
    variables: {
      active: true,
    },
  });
  const [form] = Form.useForm();
  const [
    savePerformanceReview,
    { error: saveErr, loading: savingReview, data: saveRes },
  ] = useMutation(SAVE_PERFORMANCE_REVIEW, {
    refetchQueries: ["loadPerformanceReview"],
  });

  const onFinish = async (values) => {
    const payload = {
      payload: {
        id: null,
        employee_id: values.employee,
        template_id: values.template,
        status: values.status,
        start_date: formatDateToYYYYMMDD(values.start_date.$d),
        end_date: formatDateToYYYYMMDD(values.end_date.$d),
      },
    };

    // console.log("payload", payload);
    const res = await savePerformanceReview({
      variables: payload,
    });

    form.resetFields();
    dispatch(setAddReviewModalVisible(false));
    dispatch(
      showMessage({
        message: res.data.savePerformanceReview.message,
        variant: "success",
      })
    );
  };

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (saveErr) {
      dispatch(
        showMessage({
          message: saveErr.message,
          variant: "error",
        })
      );
    }
  }, [error, saveErr]);

  const handleOk = () => {
    dispatch(setAddReviewModalVisible(false));
  };
  const handleCancel = () => {
    dispatch(setAddReviewModalVisible(false));
  };
  return (
    <>
      <Modal
        title="Performance Review"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          name="reviewForm"
          layout="vertical"
          form={form}
          //   labelCol={{
          //     span: 8,
          //   }}
          //   wrapperCol={{
          //     span: 16,
          //   }}
          style={{
            width: "100%",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Employee"
            name="employee"
            rules={[
              {
                required: true,
                message: "Field is required",
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
                data
                  ? data.employees.map((e) => ({
                      value: e.id,
                      label: `${e.salutation} ${e.surname} ${e.other_names}`,
                    }))
                  : []
              }
            />
          </Form.Item>

          <Form.Item
            label="Template"
            name="template"
            loading={loading}
            rules={[
              {
                required: true,
                message: "Field is required",
              },
            ]}
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={
                data
                  ? data.evaluation_templates.map((e) => ({
                      value: e.template_id,
                      label: e.template_name,
                    }))
                  : []
              }
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: "Field is required",
              },
            ]}
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: "pending",
                  label: "Pending",
                },
                {
                  value: "submitted",
                  label: "Submitted",
                },
                {
                  value: "completed",
                  label: "Completed",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="start_date"
            rules={[
              {
                required: true,
                message: "Field is required",
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
            label="End Date"
            name="end_date"
            rules={[
              {
                required: true,
                message: "Field is required",
              },
            ]}
          >
            <DatePicker
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Space>
              <Form.Item label={null}>
                <Button
                  onClick={() => dispatch(setAddReviewModalVisible(false))}
                >
                  Cancel
                </Button>
              </Form.Item>
              <Form.Item label={null}>
                <Button type="primary" htmlType="submit" loading={savingReview}>
                  Save
                </Button>
              </Form.Item>
            </Space>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default AddReviewModal;
