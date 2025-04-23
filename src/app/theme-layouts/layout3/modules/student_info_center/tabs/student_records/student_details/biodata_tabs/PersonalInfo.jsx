import React, { useEffect } from "react";
import { Button, Form, Input, Select, Space, Row, Col, DatePicker } from "antd";
import { useSelector } from "react-redux";
import { selectSelectedStudent } from "../../../../store/infoCenterSlice";
import dayjs from "dayjs";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
// const tailLayout = {
//   wrapperCol: {
//     offset: 8,
//     span: 16,
//   },
// };
const PersonalInfo = () => {
  const selectedStudent = useSelector(selectSelectedStudent);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
  };
  const onReset = () => {
    form.resetFields();
  };
  const onFill = () => {
    form.setFieldsValue({
      note: "Hello world!",
      gender: "male",
    });
  };

  // useEffect(() => {

  // }, [selectedStudent]);

  if (selectedStudent) {
    form.setFieldsValue({
      surname: selectedStudent.biodata.surname,
      othernames: selectedStudent.biodata.other_names,
      email: selectedStudent.biodata.email,
      phoneNo: selectedStudent.biodata.phone_no,
      religion: selectedStudent.biodata.religion?.toUpperCase(),
      national_id: selectedStudent.biodata.nin?.toUpperCase(),
      gender: selectedStudent.biodata.gender?.toUpperCase(),
      marital_status: selectedStudent.biodata.marital_status?.toUpperCase(),
      date_of_birth: dayjs(parseInt(selectedStudent.biodata.date_of_birth)),
      nationality:
        selectedStudent.biodata.nationality.nationality_title?.toUpperCase(),
      billing_nationality:
        selectedStudent.biodata.nationality.nationality_category?.toUpperCase(),
    });
  }

  // console.log("selected std", selectedStudent);

  if (!selectedStudent) return;
  return (
    <>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        //   style={{
        //     maxWidth: 600,
        //   }}
      >
        <Row gutter={0}>
          <Col className="gutter-row" span={12}>
            <Form.Item
              name="surname"
              label="Surname"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="othernames"
              label="Other names"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phoneNo"
              label="Phone Number"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="religion"
              label="Religion"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="note"
              label="Guardian's Name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="note"
              label="Guardian's PhoneNo"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="national_id"
              label="National ID"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="note"
              label="Residence Status"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <div>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="marital_status"
                label="Marital Status"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="date_of_birth"
                label="Date of Birth"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker  style={{
                  width: "100%"
                }}/>
              </Form.Item>

              <Form.Item
                name="nationality"
                label="Nationality"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="billing_nationality"
                label="Billing Nationality"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="note"
                label={`Guardian's Relation`}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="note"
                label="Hall of Attachment"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="note"
                label="Hall of Residence"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
          </Col>
        </Row>

        {/* <Form.Item>
          <Space>
            <Button
              type="primary"
              style={{
                backgroundColor: "dodgerblue",
              }}
              htmlType="submit"
            >
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
            <Button type="link" htmlType="button" onClick={onFill}>
              Fill form
            </Button>
          </Space>
        </Form.Item> */}
      </Form>
    </>
  );
};
export default PersonalInfo;
