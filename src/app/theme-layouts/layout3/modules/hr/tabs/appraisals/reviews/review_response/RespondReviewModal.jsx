import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Card,
  Radio,
  Descriptions,
  Typography,
  Rate,
  Input,
  ConfigProvider,
  Divider,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectReviewFormModal,
  setReviewFormModalVisible,
} from "../../../../store/hrSlice";

const { TextArea } = Input;

const SECTIONS = [
  {
    id: "1",
    title: "Basic Job Requirements",
  },
  {
    id: "2",
    title: "Job Specific Attributes",
  },
  {
    id: "3",
    title: "Interpersonal Skills",
  },
  {
    id: "4",
    title: "Other Comments",
  },
];

const questions = [
  {
    key: "1",
    label: (
      <div className="py-2">
        <div className="font-bold">{"1. Understanding of the Job"}</div>
        {
          <div>
            {
              "Does the emloyee have adequate knowledge to complete the tasks required by the job?"
            }
          </div>
        }
      </div>
    ),
    children: (
      <Form.Item
        // name={["ratings", record.key]}
        label="Exceeds"
        rules={[
          {
            required: true,
            message: "Required",
          },
        ]}
        noStyle
      >
        <Radio.Group>
          <Radio value="exceeds" style={{ margin: 0 }}>
            Exceeds Requirements
          </Radio>
          <Radio value="meets" style={{ margin: 0 }}>
            Meets Requirements
          </Radio>

          <Radio value="needs" style={{ margin: 0 }}>
            Needs Requirements
          </Radio>
          <Radio value="na" style={{ margin: 0 }}>
            Not Applicable
          </Radio>
        </Radio.Group>
      </Form.Item>
    ),
  },
  {
    key: "2",
    label: (
      <div className="py-2">
        <div className="font-bold">{"2. Institutional Commitment"}</div>
        {
          <div>
            {
              "Does the employee demonstrate commitment to institutional effectiveness and the College’s mission?"
            }
          </div>
        }
      </div>
    ),
    children: (
      <Form.Item
        // name={["ratings", record.key]}
        label="Exceeds"
        rules={[
          {
            required: true,
            message: "Required",
          },
        ]}
        noStyle
      >
        <Radio.Group>
          <Radio value="exceeds" style={{ margin: 0 }}>
            Exceeds Requirements
          </Radio>
          <Radio value="meets" style={{ margin: 0 }}>
            Meets Requirements
          </Radio>

          <Radio value="needs" style={{ margin: 0 }}>
            Needs Requirements
          </Radio>
          <Radio value="na" style={{ margin: 0 }}>
            Not Applicable
          </Radio>
        </Radio.Group>
      </Form.Item>
    ),
  },
];
const RespondReviewModal = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const modalOpen = useSelector(selectReviewFormModal);

  const handleOk = () => {
    dispatch(setReviewFormModalVisible(false));
  };
  const handleCancel = () => {
    dispatch(setReviewFormModalVisible(false));
  };

  const onFinish = (values) => {
    console.log("Review form values:", values);
  };
  return (
    <>
      <Modal
        open={modalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        height={300}
        footer={
          <>
            <div
              style={{
                paddingBottom: 10,
                paddingRight: 10,
              }}
            >
              <Space>
                <Button>Cancel</Button>
                <Button type="primary">Save</Button>
              </Space>
            </div>
          </>
        }
        styles={{
          body: {
            // padding: 10,
            backgroundColor: "#f5f5f5",
          },
          content: {
            padding: 0,
          },
        }}
        width={900}
        style={{
          top: 20,
        }}
      >
        <div
          className="space-y-6"
          //   style={{
          //     backgroundColor: "red",
          //   }}
        >
          <div
            style={{
              //   backgroundColor: "#fff",
              paddingTop: 15,
              paddingLeft: 10,
              paddingBottom: 0,
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <Typography.Title level={5}>
              Edit Performance Review
            </Typography.Title>
          </div>
          <Divider
            style={{
              marginBottom: 10,
            }}
          />
          <div
            style={{
              height: "calc(100vh - 195px)",
              overflow: "scroll",
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="max-w-5xl mx-auto"
            >
              {SECTIONS.map((section) => (
                <Card
                  key={section.id}
                  title={
                    <Typography.Title
                      style={{
                        paddingTop: 10,
                      }}
                      level={5}
                    >
                      {section.title}
                    </Typography.Title>
                  }
                  className="mb-10"
                >
                  <div
                    style={{
                      padding: 20,
                    }}
                  >
                    <div
                      style={{
                        marginBottom: 20,
                      }}
                    >
                      <Descriptions
                        column={1}
                        bordered
                        layout="vertical"
                        items={questions}
                      />
                    </div>

                    <Form.Item
                      name={["ratings", section, "score"]}
                      label="Rate this section"
                      rules={[
                        {
                          required: true,
                          message: "Please rate this competency",
                        },
                      ]}
                    >
                      <Rate />
                    </Form.Item>
                    {/* <Form.Item
                name={["ratings", section.id, "feedback"]}
                rules={[{ required: true, message: "Please provide feedback" }]}
              >
                <TextArea
                  rows={4}
                  placeholder={`Provide feedback for ${section.title}`}
                />
              </Form.Item> */}

                    <Form.Item
                      label="Please list the employee’s strengths. What does this employee do well?"
                      name={["ratings", section, "employee_strength"]}
                      rules={[
                        {
                          required: true,
                          message: "This is required",
                        },
                      ]}
                    >
                      <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                      label="Please list specific areas for improvement, if any"
                      name={["ratings", section, "employee_improvements"]}
                    >
                      <TextArea rows={4} />
                    </Form.Item>
                  </div>
                </Card>
              ))}
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default RespondReviewModal;
