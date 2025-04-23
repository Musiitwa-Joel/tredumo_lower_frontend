import React from "react";
import { Modal, Form, Input, Select, DatePicker, Button, Divider } from "antd";

const FilterEmployeesModal = ({ visible, onCancel, onFilter }) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
  };

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    onFilter(values);
  };

  return (
    <Modal
      title="Filter Employees"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="reset" onClick={handleReset}>
          Reset
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="apply" type="primary" onClick={handleSubmit}>
          Apply Filters
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <Form.Item name="name" label="Employee Name">
            <Input placeholder="Search by name" />
          </Form.Item>
          <Form.Item name="employeeNumber" label="Employee Number">
            <Input placeholder="Search by employee number" />
          </Form.Item>
          <Form.Item name="department" label="Department">
            <Select
              allowClear
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
            <Input placeholder="Search by job title" />
          </Form.Item>
          <Form.Item name="employmentStatus" label="Employment Status">
            <Select
              allowClear
              placeholder="Select employment status"
              options={[
                { value: "Full Time", label: "Full Time" },
                { value: "Part Time", label: "Part Time" },
                { value: "Contract", label: "Contract" },
                { value: "Intern", label: "Intern" },
              ]}
            />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Select
              allowClear
              placeholder="Select location"
              options={[
                { value: "Uganda", label: "Uganda" },
                { value: "Kenya", label: "Kenya" },
                { value: "United States", label: "United States" },
                { value: "United Kingdom", label: "United Kingdom" },
              ]}
            />
          </Form.Item>
          <Form.Item name="joinDateRange" label="Join Date Range">
            <DatePicker.RangePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="manager" label="Manager">
            <Select
              allowClear
              placeholder="Select manager"
              options={[
                { value: "Musiitwa Joel", label: "Musiitwa Joel" },
                { value: "Muwanga Christopher", label: "Muwanga Christopher" },
              ]}
            />
          </Form.Item>
        </div>

        <Divider orientation="left">Advanced Filters</Divider>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <Form.Item name="gender" label="Gender">
            <Select
              allowClear
              placeholder="Select gender"
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
            />
          </Form.Item>
          <Form.Item name="maritalStatus" label="Marital Status">
            <Select
              allowClear
              placeholder="Select marital status"
              options={[
                { value: "Single", label: "Single" },
                { value: "Married", label: "Married" },
                { value: "Divorced", label: "Divorced" },
                { value: "Widowed", label: "Widowed" },
              ]}
            />
          </Form.Item>
          <Form.Item name="payGrade" label="Pay Grade">
            <Select
              allowClear
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
          <Form.Item name="accessLevel" label="Access Level">
            <Select
              allowClear
              placeholder="Select access level"
              options={[
                { value: "Admin", label: "Admin" },
                { value: "Manager", label: "Manager" },
                { value: "Employee", label: "Employee" },
              ]}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default FilterEmployeesModal;
