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
import { useSelector } from "react-redux";
import { selectReviewDetails } from "../../../../store/hrSlice";

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
    children: <Typography.Text>Needs Requirements</Typography.Text>,
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
    children: <Typography.Text>Needs Requirements</Typography.Text>,
  },
];
const Questionnaire = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const reviewDetails = useSelector(selectReviewDetails);

  // console.log("review", reviewDetails?.template?.sections);
  const onFinish = (values) => {
    console.log("Review form values:", values);
  };
  return (
    <>
      <div className="space-y-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="max-w-4xl mx-auto"
        >
          {reviewDetails?.template?.sections.length > 0 ? (
            reviewDetails?.template?.sections.map((section) => (
              <Card
                key={section.section_id}
                title={
                  <Typography.Title
                    style={{
                      paddingTop: 10,
                    }}
                    level={5}
                  >
                    {section.section_title}
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
                      items={
                        section?.questions?.length > 0 &&
                        section?.questions?.map((qn) => ({
                          key: qn?.question_id,
                          label: (
                            <div className="py-2">
                              <div className="font-bold">
                                {qn.question_name}
                              </div>
                              <div>{qn.description}</div>
                            </div>
                          ),
                          children: (
                            <Typography.Text>
                              Needs Requirements
                            </Typography.Text>
                          ),
                        }))
                      }
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
            ))
          ) : (
            <Typography.Text
              style={{
                textAlign: "center",
              }}
            >
              No Questions set
            </Typography.Text>
          )}
        </Form>
      </div>
    </>
  );
};
export default Questionnaire;
