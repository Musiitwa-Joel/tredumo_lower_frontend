import { gql, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  Divider,
  Form,
  Row,
  Col,
  Select,
  Input,
  Radio,
  DatePicker,
  Checkbox,
} from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_EMPLOYEE_DETAILS } from "../../../gql/queries";
import { selectEmployeeDetails } from "../../../store/hrSlice";
import dayjs from "dayjs";

const { TextArea } = Input;

const LOAD_REQS = gql`
  query Query {
    salutations {
      id
      salutation_code
    }
    nationalities {
      id
      nationality_title
    }
    colleges {
      id
      college_code
      college_title
    }
    schools {
      id
      school_code
      school_title
    }
    departments {
      id
      dpt_title
      dpt_code
    }
    campuses {
      id
      campus_title
    }
  }
`;

function PersonalInfo({ form }) {
  const dispatch = useDispatch();
  const [motherDeceased, setMotherDeceased] = useState(false);
  const [fatherDeceased, setFatherDeceased] = useState(false);
  const { loading, error, data } = useQuery(LOAD_REQS);

  const employeeDetails = useSelector(selectEmployeeDetails);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [error]);

  useEffect(() => {
    if (employeeDetails) {
      form.setFieldsValue({
        salutation: employeeDetails.salutation_id,
        surname: employeeDetails.surname,
        othernames: employeeDetails.other_names,
        staffId: employeeDetails.staff_id,
        email: employeeDetails.email,
        nin: employeeDetails.nin,
        gender: employeeDetails.gender,
        status: employeeDetails.status,
        nationality: employeeDetails.nationality_id,
        address: employeeDetails.address,
        telno: employeeDetails.telno,
        religion: employeeDetails.religion,
        dateOfBirth: dayjs(parseInt(employeeDetails.date_of_birth)),
        marital_status: employeeDetails.marital_status,
        nok_name: employeeDetails.next_of_kin?.name,
        nok_telno: employeeDetails.next_of_kin?.telno,
        nok_relation: employeeDetails.next_of_kin?.relation,
        nok_address: employeeDetails.next_of_kin?.address,
        nok_email: employeeDetails.next_of_kin?.email,
        medical_condition: employeeDetails.medical_condition,
        emergency_contact: employeeDetails.emergency_contact,
        illnesses: employeeDetails.illnesses,
        disability: employeeDetails.disability,
        mother_deceased: employeeDetails.mother_deceased,
        father_deceased: employeeDetails.father_deceased,
        mothers_name: employeeDetails.mothers_name,
        mothers_telno: employeeDetails.mothers_telno,
        mothers_email: employeeDetails.mothers_email,
        mothers_nin: employeeDetails.mothers_nin,
        fathers_name: employeeDetails.fathers_name,
        fathers_telno: employeeDetails.fathers_telno,
        fathers_email: employeeDetails.fathers_email,
        fathers_nin: employeeDetails.fathers_nin,
      });

      setMotherDeceased(employeeDetails.mother_deceased);
      setFatherDeceased(employeeDetails.father_deceased);
    }
  }, [employeeDetails]);

  return (
    <div>
      <Form
        form={form}
        name="bioDataForm"
        initialValues={{
          remember: true,
        }}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <div>
          <Row
            gutter={16}
            // ref={scrollContainerRef}
            // onWheel={handleWheel}
          >
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Salutation"
                name="salutation"
                rules={[
                  {
                    required: true,
                    message: "Please input the Salutation!",
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
                    data?.salutations
                      ? data?.salutations.map((sal) => ({
                          value: sal.id,
                          label: sal.salutation_code,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                label="Surname"
                name="surname"
                rules={[
                  {
                    required: true,
                    message: "Please input the Surname!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Other names"
                name="othernames"
                rules={[
                  {
                    required: true,
                    message: "Please input the OtherNames!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Staff ID"
                name="staffId"
                rules={[
                  {
                    required: true,
                    message: "Please input the Staff Id!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input the Email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="National ID No."
                name="nin"
                rules={[
                  {
                    required: true,
                    message: "Please input the National ID No!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Gender"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Please select Gender!",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="M"> Male </Radio>
                  <Radio value="F"> Female </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Please input the status!",
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
                      value: "active",
                      label: "Active",
                    },
                    {
                      value: "inactive",
                      label: "Inactive",
                    },
                    {
                      value: "blocked",
                      label: "Blocked",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Nationality"
                name="nationality"
                rules={[
                  {
                    required: true,
                    message: "Please input the Nationality!",
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
                    data?.nationalities
                      ? data?.nationalities.map((n) => ({
                          value: n.id,
                          label: n.nationality_title,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input the Address!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tel No."
                name="telno"
                rules={[
                  {
                    required: true,
                    message: "Please input the Tel No!",
                  },
                ]}
              >
                <Input placeholder="+256....." />
              </Form.Item>

              <Form.Item
                label="Religion"
                name="religion"
                rules={[
                  {
                    required: true,
                    message: "Please input the Religion!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Date Of Birth"
                name="dateOfBirth"
                rules={[
                  {
                    required: true,
                    message: "Please input the Date of Birth!",
                  },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Marital Status"
                name="marital_status"
                rules={[
                  {
                    required: true,
                    message: "Please input the marital Status!",
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
                  options={[
                    {
                      label: "SINGLE",
                      value: "single",
                    },
                    {
                      label: "MARRIED",
                      value: "married",
                    },
                    {
                      label: "WIDOWED",
                      value: "widowed",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Next of Kin Information</Divider>
          <Row
            gutter={16}
            // ref={scrollContainerRef}
            // onWheel={handleWheel}
          >
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Name"
                name="nok_name"
                rules={[
                  {
                    required: true,
                    message: "Please input the name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tel No."
                name="nok_telno"
                rules={[
                  {
                    required: true,
                    message: "Please input the tel no!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Relationship"
                name="nok_relation"
                rules={[
                  {
                    required: true,
                    message: "Please input the relation!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Address"
                name="nok_address"
                rules={[
                  {
                    required: true,
                    message: "Please input the Address!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="nok_email"
                rules={[
                  {
                    required: true,
                    message: "Please input the Email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Medical Information</Divider>
          <Row
            gutter={16}
            // ref={scrollContainerRef}
            // onWheel={handleWheel}
          >
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Medical Condition"
                name="medical_condition"
                rules={[
                  {
                    required: true,
                    message: "Please select Medical Condition!",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="good"> Good </Radio>
                  <Radio value="bad"> Bad </Radio>
                  <Radio value="other"> Other </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item label="Illneses" name="illnesses">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                label="Emergency Contact."
                name="emergency_contact"
                rules={[
                  {
                    required: true,
                    message: "Please input the tel no!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Disability" name="disability">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Parent Details</Divider>
          <Row
            gutter={16}
            // ref={scrollContainerRef}
            // onWheel={handleWheel}
          >
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="mother_deceased"
                valuePropName="checked"
                label={null}
              >
                <Checkbox
                  value={motherDeceased}
                  onChange={(e) => setMotherDeceased(e.target.checked)}
                >
                  Mother Deceased
                </Checkbox>
              </Form.Item>
              {!motherDeceased && (
                <>
                  <Form.Item
                    label="Mother's Name"
                    name="mothers_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input the mother's name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Tel No."
                    name="mothers_telno"
                    rules={[
                      {
                        required: true,
                        message: "Please input the tel no!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="mothers_email"
                    rules={[
                      {
                        required: true,
                        message: "Please input the relation!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Mother's National ID No."
                    name="mothers_nin"
                  >
                    <Input />
                  </Form.Item>
                </>
              )}
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item
                name="father_deceased"
                valuePropName="checked"
                label={null}
              >
                <Checkbox
                  value={fatherDeceased}
                  onChange={(e) => setFatherDeceased(e.target.checked)}
                >
                  Father Deceased
                </Checkbox>
              </Form.Item>
              {!fatherDeceased && (
                <>
                  <Form.Item
                    label="Father's Name"
                    name="fathers_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input the father's name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Tel No."
                    name="fathers_telno"
                    rules={[
                      {
                        required: true,
                        message: "Please input the tel no!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="fathers_email"
                    rules={[
                      {
                        required: true,
                        message: "Please input the email!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Fathers's National ID No."
                    name="fathers_nin"
                  >
                    <Input />
                  </Form.Item>
                </>
              )}
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
}

export default PersonalInfo;
