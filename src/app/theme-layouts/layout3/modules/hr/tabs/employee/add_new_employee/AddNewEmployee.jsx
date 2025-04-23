import React, { useEffect, useState } from "react";
import {
  Button,
  message,
  Steps,
  theme,
  Modal,
  Checkbox,
  Form,
  Input,
  Row,
  Col,
  Radio,
  DatePicker,
  Space,
  Divider,
  Select,
  Collapse,
} from "antd";
import BioDataForm from "./BioDataForm";
import { Add, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAddNewEmpModalVisible,
  selectDesignations,
  setAddNewEmpModalVisible,
  setDesignationModalVisible,
  setDesignations,
} from "../../../store/hrSlice";
import { gql, useMutation, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { LOAD_DESIGNATIONS } from "../../../gql/queries";
import { SAVE_EMPLOYEE } from "../../../gql/mutations";
import formatDateToYYYYMMDD from "app/theme-layouts/layout3/utils/convertDateToYYMMDD";

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

const AddNewEmployee = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const [form1] = Form.useForm();
  const [values, setValues] = useState(null);
  const [motherDeceased, setMotherDeceased] = useState(false);
  const [fatherDeceased, setFatherDeceased] = useState(false);
  const [employmentStatus, setEmploymentStatus] = useState("contract");
  const isModalOpen = useSelector(selectAddNewEmpModalVisible);
  const { loading, error, data } = useQuery(LOAD_REQS);
  const designations = useSelector(selectDesignations);
  const [qualifications, setQualifications] = useState([{ key: Date.now() }]);
  const {
    error: desERR,
    loading: loadingDes,
    data: desRes,
  } = useQuery(LOAD_DESIGNATIONS, {
    notifyOnNetworkStatusChange: true,
  });

  const addQualification = async () => {
    await form1.validateFields();
    setQualifications([...qualifications, { key: Date.now() }]);
  };

  const removeQualification = (key) => {
    if (qualifications.length === 1)
      return dispatch(
        showMessage({
          message: "Atleast one qualification is required",
          variant: "info",
        })
      );

    const updatedQualifications = qualifications.filter(
      (item) => item.key !== key
    );
    setQualifications(updatedQualifications);
  };

  const [
    saveEmployee,
    { error: saveErr, loading: savingEmployee, data: saveRes },
  ] = useMutation(SAVE_EMPLOYEE, {
    refetchQueries: ["AllEmployees"],
  });

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (desERR) {
      dispatch(
        showMessage({
          message: desERR.message,
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
  }, [error, desERR, saveErr]);

  useEffect(() => {
    if (desRes) dispatch(setDesignations(desRes.designations));
  }, [desRes]);

  const onFinish = async (reporting) => {
    // console.log("all values", );
    const allValues = { ...values, reporting };

    // console.log("values", allValues);

    const quals = values.qualifications.map((q) => ({
      id: null,
      institution: q.institution,
      start_date: formatDateToYYYYMMDD(q.start_date.$d),
      end_date: formatDateToYYYYMMDD(q.end_date.$d),
      grade: q.grade,
      award_obtained: q.award_obtained,
      award_duration: q.award_duration,
    }));

    const payload = {
      payload: {
        id: null,
        surname: values.surname,
        other_names: values.othernames,
        telno: values.telno,
        religion: values.religion,
        gender: values.gender,
        email: values.email,
        campus_id: values.campus || null,
        college_id: values.college || null,
        address: values.address,
        dpt_id: values.department || null,
        designation_id: values.designation,
        date_of_birth: formatDateToYYYYMMDD(values.dateOfBirth.$d),
        contract_start_date: values.contract_start_date
          ? formatDateToYYYYMMDD(values.contract_start_date.$d)
          : null,
        contract_end_date: values.contract_end_date
          ? formatDateToYYYYMMDD(values.contract_end_date.$d)
          : null,
        employee_cv: null,
        application_letter: null,
        employment_type: employmentStatus || null,
        father_deceased: values.father_deceased,
        fathers_email: values.fathers_email || null,
        fathers_name: values.fathers_name || null,
        fathers_nin: values.fathers_nin || null,
        fathers_telno: values.fathers_telno || null,
        joining_date: values.joining_date
          ? formatDateToYYYYMMDD(values.joining_date.$d)
          : null,
        marital_status: values.marital_status,
        mother_deceased: values.mother_deceased || null,
        mothers_email: values.mothers_email || null,
        mothers_name: values.mothers_name || null,
        mothers_nin: values.mothers_nin || null,
        mothers_telno: values.mothers_telno || null,
        nationality_id: values.nationality || null,
        nin: values.nin,
        nok_address: values.nok_address,
        nok_email: values.nok_email,
        nok_name: values.nok_name,
        nok_telno: values.nok_telno,
        nok_relation: values.nok_relation,
        nssf_no: values.nssf_no,
        salary: values.salary || "0",
        salutation_id: values.salutation,
        school_id: values.school || null,
        staff_id: values.staffId,
        status: values.status,
        tin_no: values.tin_no || null,
        qualifications: quals,
        medical_condition: values.medical_condition,
        emergency_contact: values.emergency_contact,
        disability: values.disability || null,
        illnesses: values.illnesses || null,
      },
    };

    // console.log("the payload", payload);

    const res = await saveEmployee({
      variables: payload,
    });

    form1.resetFields();
    setValues(null);
    setCurrent(0);

    // close the modal
    dispatch(setAddNewEmpModalVisible(false));

    dispatch(
      showMessage({
        message: res.data.saveEmployee.message,
        variant: "success",
      })
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const steps = [
    {
      title: "Personal Data",
      content: (
        <>
          <div
            style={{
              position: "relative",
              // backgroundColor: "red",
              // width: 900,
              height: "calc(100vh - 350px)",
              overflowY: "scroll",
              overflowX: "hidden",
              padding: 10,
            }}
          >
            <Divider
              style={{
                margin: 0,
                marginBottom: 10,
              }}
            >
              Biography
            </Divider>
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
        </>
      ),
    },
    {
      title: "Employee Info And Designation",
      content: (
        <div
          style={{
            position: "relative",
            // backgroundColor: "red",
            // width: 900,
            height: "calc(100vh - 350px)",
            overflowY: "scroll",
            overflowX: "hidden",
            padding: 10,
          }}
        >
          <Row
            gutter={16}
            // ref={scrollContainerRef}
            // onWheel={handleWheel}
          >
            <Col className="gutter-row" span={12}>
              {/* <Form.Item
              label={
                <Space>
                  <span>Designation</span>
                  <Button
                    size="small"
                    type="primary"
                    icon={<Add />}
                    onClick={() => dispatch(setDesignationModalVisible(true))}
                  />
                </Space>
              }
              name="designation"
              rules={[
                {
                  required: true,
                  message: "Please input the Designation!",
                },
              ]}
            >
              <Select
                showSearch
                loading={loadingDes}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={designations.map((des) => ({
                  value: des.id,
                  label: des.designation_name,
                }))}
              />
            </Form.Item> */}
              {/* 
              <Form.Item label="Salary" name="salary">
                <Input type="number" />
              </Form.Item> */}

              <Form.Item
                label="NSSF Number"
                name="nssf_no"
                rules={[
                  {
                    required: true,
                    message: "Please input the NSSF NUMBER!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="TIN Number"
                name="tin_no"
                rules={[
                  {
                    required: true,
                    message: "Please input the Tin No!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Employment Type" name="employment_type">
                <Select
                  allowClear
                  showSearch
                  loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    {
                      label: "Contract",
                      value: "contract",
                    },
                    {
                      label: "Part Time",
                      value: "part_time",
                    },
                    {
                      label: "Full Time",
                      value: "full_time",
                    },
                  ]}
                  onChange={(v) => setEmploymentStatus(v)}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item label="College" name="college">
                <Select
                  allowClear
                  showSearch
                  loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    data?.colleges
                      ? data?.colleges.map((c) => ({
                          value: c.id,
                          label: `${c.college_code} (${c.college_title})`,
                        }))
                      : []
                  }
                />
              </Form.Item>
              <Form.Item label="School/Faculty" name="school">
                <Select
                  allowClear
                  showSearch
                  loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    data?.schools
                      ? data?.schools.map((s) => ({
                          value: s.id,
                          label: `${s.school_code} (${s.school_title})`,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item label="Department" name="department">
                <Select
                  allowClear
                  showSearch
                  loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    data?.departments
                      ? data?.departments.map((d) => ({
                          value: d.id,
                          label: `${d.dpt_code} (${d.dpt_title})`,
                        }))
                      : []
                  }
                />
              </Form.Item>

              <Form.Item label="Campus" name="campus">
                <Select
                  allowClear
                  showSearch
                  loading={loading}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    data?.campuses
                      ? data?.campuses.map((c) => ({
                          value: c.id,
                          label: `${c.campus_title} CAMPUS`,
                        }))
                      : []
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          {employmentStatus == "contract" ? (
            <>
              <Divider>Contract Information</Divider>
              <Row
                gutter={16}
                // ref={scrollContainerRef}
                // onWheel={handleWheel}
              >
                <Col className="gutter-row" span={12}>
                  <Form.Item
                    label="Contract Start Date"
                    name="contract_start_date"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Contract Start Date!",
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
                    label="Contract End Date"
                    name="contract_end_date"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Contract End Date!",
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
                    label={
                      <Space>
                        <span>Designation</span>
                        <Button
                          size="small"
                          type="primary"
                          icon={<Add />}
                          onClick={() =>
                            dispatch(setDesignationModalVisible(true))
                          }
                        />
                      </Space>
                    }
                    name="designation"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Designation!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      loading={loadingDes}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={designations.map((des) => ({
                        value: des.id,
                        label: des.designation_name,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item label="Salary" name="salary">
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item
                    label="Application Letter"
                    name="application_letter"
                  >
                    <Input type="file" value={""} />
                  </Form.Item>

                  <Form.Item label="Employee CV" name="employee_cv">
                    <Input type="file" value={""} />
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Divider>Employment Information</Divider>
              <Row
                gutter={16}
                // ref={scrollContainerRef}
                // onWheel={handleWheel}
              >
                <Col className="gutter-row" span={12}>
                  <Form.Item
                    label="Joining Date"
                    name="joining_date"
                    rules={[
                      {
                        required: true,
                        message: "Please input the joining Date!",
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
                    label={
                      <Space>
                        <span>Designation</span>
                        <Button
                          size="small"
                          type="primary"
                          icon={<Add />}
                          onClick={() =>
                            dispatch(setDesignationModalVisible(true))
                          }
                        />
                      </Space>
                    }
                    name="designation"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Designation!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      loading={loadingDes}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={designations.map((des) => ({
                        value: des.id,
                        label: des.designation_name,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item label="Salary" name="salary">
                    <Input type="number" />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Form.Item
                    label="Application Letter"
                    name="application_letter"
                  >
                    <Input type="file" value={""} />
                  </Form.Item>

                  <Form.Item label="Employee CV" name="employee_cv">
                    <Input type="file" value={""} />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Education Information",
      content: (
        <div
          style={{
            position: "relative",
            // backgroundColor: "red",
            // width: 900,
            height: "calc(100vh - 350px)",
            overflowY: "scroll",
            padding: 10,
            // overflowX: "hidden",z
          }}
        >
          <Collapse
            accordion={true}
            items={[
              {
                key: "1",
                label: "O LEVEL INFORMATION",
                children: (
                  <>
                    <Checkbox>I DID NOT SIT FOR O LEVEL EXAMINATIONS</Checkbox>
                  </>
                ),
              },
              {
                key: "2",
                label: "A LEVEL INFORMATION",
                children: (
                  <>
                    <Checkbox>I DID NOT SIT FOR A LEVEL EXAMINATIONS</Checkbox>
                  </>
                ),
              },
              {
                key: "3",
                label: "OTHER QUALIFICATIONS",
                children: (
                  <>
                    {qualifications.map((qualification, index) => (
                      <div
                        key={qualification.key}
                        style={{ marginBottom: "20px" }}
                      >
                        <Divider
                          style={{
                            borderColor: "#7cb305",
                            marginTop: 0,
                          }}
                          dashed
                        >
                          Qualification {index + 1}
                        </Divider>
                        <Row gutter={16}>
                          <Col className="gutter-row" span={12}>
                            <Form.Item
                              label="Institution"
                              name={["qualifications", index, "institution"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input the Institution!",
                                },
                              ]}
                            >
                              <Input placeholder="e.g., Nkumba University" />
                            </Form.Item>

                            <Form.Item
                              label="Award Obtained"
                              name={["qualifications", index, "award_obtained"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input the Award Obtained!",
                                },
                              ]}
                            >
                              <Input placeholder="e.g., Degree" />
                            </Form.Item>

                            <Form.Item
                              label="Award Type"
                              name={["qualifications", index, "award_type"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input the Award Type!",
                                },
                              ]}
                            >
                              <Input placeholder="e.g., Bachelor" />
                            </Form.Item>

                            <Form.Item
                              label="Award Duration"
                              name={["qualifications", index, "award_duration"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input the Award Duration!",
                                },
                              ]}
                            >
                              <Input placeholder="e.g., 3 years" />
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={12}>
                            <Form.Item
                              label="Grade"
                              name={["qualifications", index, "grade"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input the Grade!",
                                },
                              ]}
                            >
                              <Input placeholder="e.g., First Class" />
                            </Form.Item>

                            <Form.Item
                              label="Start Date"
                              name={["qualifications", index, "start_date"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input the Start Date!",
                                },
                              ]}
                            >
                              <DatePicker
                                format="YYYY-MM-DD"
                                style={{ width: "100%" }}
                              />
                            </Form.Item>

                            <Form.Item
                              label="End Date"
                              name={["qualifications", index, "end_date"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Please input the End Date!",
                                },
                              ]}
                            >
                              <DatePicker
                                format="YYYY-MM-DD"
                                style={{ width: "100%" }}
                              />
                            </Form.Item>

                            <Form.Item
                              label="Attachment"
                              name={["qualifications", index, "attachment"]}
                            >
                              <Input type="file" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Button
                          type="primary"
                          danger
                          icon={<Delete />}
                          onClick={() => removeQualification(qualification.key)}
                          style={{ marginTop: "10px" }}
                        >
                          Delete Qualification
                        </Button>
                      </div>
                    ))}
                  </>
                ),
              },
            ]}
            defaultActiveKey={["3"]}
          />
        </div>
      ),
    },
    {
      title: "Reporting",
      content: (
        <div
          style={{
            position: "relative",
            // backgroundColor: "red",
            // width: 900,
            height: "calc(100vh - 350px)",
            overflowY: "scroll",
            padding: 10,
            // overflowX: "hidden",z
          }}
        >
          <Row
            gutter={16}
            // ref={scrollContainerRef}
            // onWheel={handleWheel}
          >
            <Col className="gutter-row" span={20}>
              <Form.Item
                label="First Level Approver"
                name="first_level_approver"
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Second Level Approver"
                name="second_level_approver"
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Third Level Approver"
                name="third_level_approver"
              >
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

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
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    paddingTop: 10,
  };
  return (
    <Modal
      title="Add New Employee"
      open={isModalOpen}
      width={1100}
      footer={false}
      onCancel={() => dispatch(setAddNewEmpModalVisible(false))}
      style={{
        top: 50,
      }}
    >
      <Steps current={current} items={items} />

      <Form
        name="bioDataForm"
        form={form1}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div style={contentStyle}>{steps[current].content}</div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            {current === 2 && (
              <Button
                type="primary"
                style={{
                  alignSelf: "flex-start",
                }}
                onClick={addQualification}
                icon={<Add />}
              >
                Add Academic Information
              </Button>
            )}
          </div>

          <div>
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
                onClick={async () => {
                  // first validate before going next
                  const form1Valid = await form1.validateFields();
                  if (form1Valid) {
                    // console.log("values so far", form1.getFieldsValue());
                    next();
                    setValues({ ...values, ...form1.getFieldsValue() });
                  }
                }}
              >
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                htmlType="submit"
                loading={savingEmployee}
                disabled={savingEmployee}
              >
                Save
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
};
export default AddNewEmployee;
