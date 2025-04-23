import React from "react";

import { useState } from "react";
import {
  Modal,
  Steps,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Divider,
} from "antd";

const { Step } = Steps;

const InviteEmployeeModal = ({ visible, onCancel, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const steps = [
    {
      title: "Mandatory User Information",
      content: (
        <div style={{ padding: "20px 0" }}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="employeeNumber"
            label="Employee Number"
            rules={[
              { required: true, message: "Please enter employee number" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="userLevel"
            label="User Level"
            rules={[{ required: true, message: "Please select user level" }]}
          >
            <Select
              placeholder="Select user level"
              options={[
                { value: "Admin", label: "Admin" },
                { value: "Manager", label: "Manager" },
                { value: "Employee", label: "Employee" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Please select country" }]}
          >
            <Select
              showSearch
              placeholder="Select country"
              options={[
                { value: "Uganda", label: "Uganda" },
                { value: "Kenya", label: "Kenya" },
                { value: "United States", label: "United States" },
                { value: "United Kingdom", label: "United Kingdom" },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Other Optional Details",
      content: (
        <div style={{ padding: "20px 0" }}>
          <Form.Item name="joinedDate" label="Joined Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="timezone" label="Time Zone">
            <Select
              placeholder="Select timezone"
              options={[
                { value: "UTC", label: "UTC" },
                { value: "Europe/London", label: "Europe/London" },
                { value: "America/New_York", label: "America/New_York" },
                { value: "Asia/Tokyo", label: "Asia/Tokyo" },
                { value: "Africa/Nairobi", label: "Africa/Nairobi" },
              ]}
            />
          </Form.Item>
          <Form.Item name="department" label="Department">
            <Select
              placeholder="Select department"
              options={[
                { value: "Computing", label: "Computing" },
                { value: "Engineering", label: "Engineering" },
                { value: "Finance", label: "Finance" },
                { value: "Human Resources", label: "Human Resources" },
                { value: "Marketing", label: "Marketing" },
              ]}
            />
          </Form.Item>
          <Form.Item name="jobTitle" label="Job Title">
            <Input />
          </Form.Item>
          <Form.Item name="directManager" label="Direct Manager">
            <Select
              placeholder="Select manager"
              options={[
                { value: "Musiitwa Joel", label: "Musiitwa Joel" },
                { value: "Muwanga Christopher", label: "Muwanga Christopher" },
              ]}
            />
          </Form.Item>
          <Form.Item name="employmentStatus" label="Employment Status">
            <Select
              placeholder="Select employment status"
              options={[
                { value: "Full Time", label: "Full Time" },
                { value: "Part Time", label: "Part Time" },
                { value: "Contract", label: "Contract" },
                { value: "Intern", label: "Intern" },
              ]}
            />
          </Form.Item>
          <Form.Item name="payGrade" label="Pay Grade">
            <Select
              placeholder="Select pay grade"
              options={[
                { value: "A1", label: "A1" },
                { value: "A2", label: "A2" },
                { value: "B1", label: "B1" },
                { value: "B2", label: "B2" },
                { value: "C1", label: "C1" },
              ]}
            />
          </Form.Item>
        </div>
      ),
    },
  ];

  const next = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = async () => {
    try {
      setSubmitting(true);
      // Convert DatePicker values to strings
      const formattedValues = {
        ...values,
        joinedDate: values.joinedDate
          ? values.joinedDate.format("YYYY-MM-DD")
          : "",
      };
      await onSubmit(formattedValues);
      message.success("Invitation sent successfully");
      onCancel();
    } catch (error) {
      message.error("Failed to send invitation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Invite an Employee"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
      destroyOnClose
      afterClose={() => {
        form.resetFields();
        setCurrentStep(0);
      }}
    >
      <Steps current={currentStep} style={{ marginBottom: 20 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          userLevel: "Employee",
          timezone: "UTC",
        }}
      >
        <div>{steps[currentStep].content}</div>

        <Divider />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {currentStep > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prev}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" htmlType="submit" loading={submitting}>
              Send Invitation
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default InviteEmployeeModal;
