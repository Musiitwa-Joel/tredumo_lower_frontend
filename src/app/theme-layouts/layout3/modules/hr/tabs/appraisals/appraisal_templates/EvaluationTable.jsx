import React from "react";
import { Button, Form, message, Table, Input } from "antd";
import { EVALUATION_CRITERIA } from "./constants";
import { getTableColumns } from "./columns";
import { tableStyles } from "./styles";

const { TextArea } = Input;

const SectionOneAdditionalForms = () => {
  return (
    <div
      style={{
        marginTop: 20,
      }}
    >
      <Form.Item
        label="Please list the employee’s strengths. What does this employee do well?"
        name="employee_strength"
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
        name="employee_improvements"
      >
        <TextArea rows={4} />
      </Form.Item>
    </div>
  );
};

const EvaluationTable = ({ questions = [], section }) => {
  const [form] = Form.useForm();

  const data = questions.map((item) => ({
    key: item.question_id,
    label: item.question_name,
    description: item.description,
    rating: null,
  }));

  // console.log("secttion", section);

  const handleFinish = (values) => {
    console.log("Form Values:", values);
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    message.error("Please fill in all fields");
  };

  return (
    <div
      style={{
        height: "calc(100vh - 260px)",
        overflow: "scroll",
        padding: 5,
      }}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        initialValues={{
          ratings: {}, // Initialize ratings as an empty object
        }}
      >
        <Table
          columns={getTableColumns()}
          dataSource={data}
          pagination={false}
          bordered
          // title={() => (
          //   <div style={tableStyles.sectionHeader}>
          //     {EVALUATION_CRITERIA[0].section}
          //   </div>
          // )}
          style={{
            border: "1px solid #d9d9d9",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          components={{
            header: {
              cell: ({ children, ...restProps }) => (
                <th {...restProps} style={{ ...restProps.style, padding: 0 }}>
                  {children}
                </th>
              ),
            },
          }}
          scroll={{
            y: "calc(100vh - 420px)",
          }}
        />

        {section.section_id == "1" && <SectionOneAdditionalForms />}
        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
      </Form>
    </div>
  );
};

export default EvaluationTable;
