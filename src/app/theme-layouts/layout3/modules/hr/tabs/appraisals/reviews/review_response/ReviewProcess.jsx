import React, { useState } from "react";
import {
  Button,
  message,
  Steps,
  theme,
  Card,
  Form,
  Rate,
  Input,
  Descriptions,
  Radio,
  Typography,
} from "antd";

const { TextArea } = Input;

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
const steps = [
  {
    title: "Questionnaire",
    content: (
      <div className="space-y-6">
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
                  { required: true, message: "Please rate this competency" },
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
      </div>
    ),
  },
  {
    title: "Goals And Objectives",
    content: "Second-content",
  },
  {
    title: "Summary",
    content: "Last-content",
  },
];
const ReviewProcess = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    // lineHeight: "260px",
    // textAlign: "center",
    // color: token.colorTextTertiary,
    // backgroundColor: token.colorFillAlter,
    // borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const onFinish = (values) => {
    console.log("Review form values:", values);
  };
  return (
    <>
      <Steps current={current} items={items} />
      <div style={contentStyle}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="max-w-5xl mx-auto"
        >
          {steps[current].content}
        </Form>
      </div>
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: current <= 0 ? "flex-end" : "space-between",
        }}
      >
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => next()}
            style={{
              alignSelf: "flex-end",
            }}
          >
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
      </div>
    </>
  );
};
export default ReviewProcess;
