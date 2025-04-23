import React, { useEffect, useState, useRef, useMemo } from "react";
import Box from "@mui/material/Box";
import _ from "lodash";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { Button as Button2, Form, Input, Space, Checkbox, Select } from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import {
  CALCULATE_FEES_STRUCTURE,
  GET_FEES_CATEGORIES,
  LOAD_OTHER_FEES,
} from "../../gql/queries";
import {
  selectFeesCategories,
  selectFeesStructureForm,
  selectOtherFeesInStructure,
  selectSelectedFeeItemRow,
  selectSelectedFeesStructureCourse,
  setFeesCategories,
  setFeesStructure,
  setFeesStructureForm,
  setLoadingFeesStructure,
  setOtherFees,
  setOtherFeesInStructure,
  setSelectedFeeItemRow,
  setSelectedFeesStructureCourse,
} from "../../store/feesMgtSlice";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { SAVE_FEES_ITEM } from "../../gql/mutations";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
const { TextArea } = Input;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const formItemLayout = {
  labelCol: {
    // xs: {
    //   span: 24,
    // },
    sm: {
      span: 6,
    },
  },
};

const LOAD_REQS = gql`
  query Query {
    courses {
      id
      course_title
      course_code
      level_details {
        id
        level_code
        level_title
      }
      course_duration
      course_study_times {
        id
        study_time_title
      }
    }
    intakes {
      id
      intake_title
    }
    campuses {
      id
      campus_title
    }
    acc_yrs {
      id
      acc_yr_title
    }
    nationality_categories {
      id
      category_title
    }
  }
`;

function FeesStructureForm() {
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const feesCategories = useSelector(selectFeesCategories);
  const selectedRow = useSelector(selectSelectedFeeItemRow);
  const selectedCourse = useSelector(selectSelectedFeesStructureCourse);
  const formState = useSelector(selectFeesStructureForm);
  const otherFees = useSelector(selectOtherFeesInStructure);

  const [calculateFeesStructure, { error, loading, data }] = useLazyQuery(
    CALCULATE_FEES_STRUCTURE,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  const [
    loadOtherFees,
    { error: loadErr, loading: loadingOtherFees, data: loadRes },
  ] = useLazyQuery(LOAD_OTHER_FEES, {
    notifyOnNetworkStatusChange: true,
  });
  const {
    error: reqsErr,
    loading: loadingRequirements,
    data: reqsRes,
  } = useQuery(LOAD_REQS);

  useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: false,
        minScrollbarLength: 20,
      });

      return () => {
        if (psRef.current) {
          psRef.current.destroy();
          psRef.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (reqsErr) {
      dispatch(
        showMessage({
          message: reqsErr.message,
          variant: "error",
        })
      );
    }

    if (loadErr) {
      dispatch(
        showMessage({
          message: loadErr.message,
          variant: "error",
        })
      );
    }

    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [reqsErr, loadErr, error]);

  useEffect(() => {
    if (selectedRow) {
      form.setFieldsValue({
        item_code: selectedRow.item_code,
        item_name: selectedRow.item_name,
        item_decription: selectedRow.item_description,
        category: selectedRow.category.id,
        is_mandatory: Boolean(selectedRow.mandatory),
      });
    }
  }, [selectedRow]);

  useEffect(() => {
    dispatch(setLoadingFeesStructure(loading));
  }, [loading]);

  // console.log("response", reqsRes);

  const onFinish = async (values) => {
    console.log("values from form", values);
    console.log("Course details", selectedCourse);

    const payload = {
      accYrId: values.entry_acc_yr,
      campusId: values.campus,
      intakeId: values.intake,
      courseId: values.course,
      nationalityCategoryId: values.nationality,
      studyTimeId: values.study_time,
      levelId: selectedCourse.level_details.id,
      studyYrs: values.study_yr,
      otherFees: values.other_fees ? values.other_fees : [],
      courseDuration: selectedCourse.course_duration,
    };

    const res = await calculateFeesStructure({
      variables: payload,
    });

    // console.log("response", res.data);
    dispatch(setFeesStructure(res.data.calculateFeesStructure));

    // console.log("patload:", payload);

    // const res = await saveFeesItems({
    //   variables: payload,
    // });

    // form.resetFields();
    // dispatch(setSelectedFeeItemRow(null));

    // dispatch(
    //   showMessage({
    //     message: res.data.saveFeesItem.message,
    //     variant: "success",
    //   })
    // );
  };

  useEffect(() => {
    form.setFieldsValue({
      has_amount: true,
      // item_name: "jsdjkdj",
    });
  }, []);

  const handleClear = () => {
    form.resetFields();
    dispatch(setSelectedFeeItemRow(null));
  };

  const handleLoadOtherFees = async () => {
    const { acc_yr, campus, intake, nationality } = formState;

    if (acc_yr && campus && intake && nationality) {
      const payload = {
        accYrId: acc_yr,
        campusId: campus,
        intakeId: intake,
        nationalityCategoryId: nationality,
      };

      // console.log("payload", payload);
      const res = await loadOtherFees({
        variables: payload,
      });

      // console.log("res", res.data);

      dispatch(setOtherFeesInStructure(res.data.other_fees));
    }
  };

  const memoized_data = useMemo(() => (reqsRes ? reqsRes : null), [reqsRes]);
  const memoized_other_fees_data = useMemo(
    () => (otherFees ? otherFees : null),
    [otherFees]
  );

  // console.log("formState", formState);

  return (
    <div
      className="p-16"
      // ref={scrollContainerRef}
      // style={{
      //   height: 100,
      // }}
    >
      <Box
        className="p-8 w-full rounded-16 border"
        sx={{
          backgroundColor: "#fff",
          marginRight: 10,
          overflow: "hidden",
          borderColor: "lightgray",
        }}
      >
        <Divider
          textAlign="left"
          style={{
            marginTop: 10,
            marginBottom: 10,
            // color: "red",
            borderColor: "red",
          }}
        >
          <Typography className="font-medium text-20 bold">
            {"Enter Fees Structure Details"}
          </Typography>
        </Divider>

        <div className="max-w-full relative">
          <Box
            // component="form"
            sx={{
              "& .MuiTextField-root": { m: 0, width: "100%" },
            }}
            autoComplete="off"
            className={"max-w-full"}
            style={{
              padding: 8,
              //   backgroundColor: "red",
            }}
          >
            <Form
              name="feesStructureForm"
              form={form}
              layout="horizontal"
              {...formItemLayout}
              initialValues={{
                has_amount: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Course"
                name="course"
                rules={[
                  {
                    required: true,
                    message: "Please select the course",
                  },
                ]}
              >
                <Select
                  showSearch
                  loading={loadingRequirements}
                  placeholder="Select Course"
                  options={memoized_data?.courses.map((course) => ({
                    value: course.id,
                    label: `(${course.course_code})-${course.course_title}`,
                  }))}
                  onChange={(value) => {
                    const item = memoized_data?.courses.filter(
                      (i) => i.id == value
                    );
                    // console.log("selected", item);
                    dispatch(setSelectedFeesStructureCourse(item[0]));
                    form.setFieldsValue({
                      course_level: item[0].level_details.level_title,
                    });
                  }}
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
              <Form.Item
                label="Course Level"
                name="course_level"
                rules={[
                  {
                    required: true,
                    message: "Please select the course",
                  },
                ]}
              >
                <Input placeholder="Course Level" readOnly />
              </Form.Item>

              <Form.Item
                label="Intake"
                name="intake"
                rules={[
                  {
                    required: true,
                    message: "Please select the intake",
                  },
                ]}
              >
                <Select
                  showSearch
                  loading={loadingRequirements}
                  placeholder="Select Intake"
                  options={memoized_data?.intakes.map((intake) => ({
                    value: intake.id,
                    label: `${intake.intake_title}`,
                  }))}
                  onChange={(value) => {
                    dispatch(setFeesStructureForm({ intake: value }));
                    handleLoadOtherFees();
                  }}
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              <Form.Item
                name="campus"
                label="Campus"
                rules={[
                  {
                    required: true,
                    message: "Campus is required",
                  },
                ]}
              >
                <Select
                  loading={loadingRequirements}
                  // placeholder="Select a option and change input text above"
                  // onChange={onGenderChange}
                  allowClear
                  onChange={(value) => {
                    dispatch(setFeesStructureForm({ campus: value }));
                    handleLoadOtherFees();
                  }}
                  placeholder="Select Campus"
                >
                  {memoized_data?.campuses.map((campus) => (
                    <Select.Option value={campus.id}>
                      {campus.campus_title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="entry_acc_yr"
                label="Entry Acc Yr"
                rules={[
                  {
                    required: true,
                    message: "Entry Accademic year is required",
                  },
                ]}
              >
                <Select
                  loading={loadingRequirements}
                  // placeholder="Select a option and change input text above"
                  // onChange={onGenderChange}
                  allowClear
                  onChange={(value) => {
                    dispatch(setFeesStructureForm({ acc_yr: value }));
                    handleLoadOtherFees();
                  }}
                  placeholder="Select Entry Acc Yr"
                >
                  {memoized_data?.acc_yrs.map((acc_yr) => (
                    <Select.Option value={acc_yr.id}>
                      {acc_yr.acc_yr_title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="nationality"
                label="Nationality"
                rules={[
                  {
                    required: true,
                    message: "Nationality is required",
                  },
                ]}
              >
                <Select
                  loading={loadingRequirements}
                  allowClear
                  placeholder="Select Nationality"
                  onChange={(value) => {
                    dispatch(setFeesStructureForm({ nationality: value }));
                    handleLoadOtherFees();
                  }}
                >
                  {memoized_data?.nationality_categories.map((cat) => (
                    <Select.Option value={cat.id}>
                      {cat.category_title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="study_yr"
                label="Study Year"
                rules={[
                  {
                    required: true,
                    message: "Study Year is required",
                  },
                ]}
              >
                <Select
                  loading={loadingRequirements}
                  mode="multiple"
                  allowClear
                  placeholder="Select Study Year"
                  onChange={(value) => {
                    handleLoadOtherFees();
                  }}
                >
                  {Array.from(
                    { length: selectedCourse?.course_duration },
                    (_, i) => (
                      <Select.Option value={`${i + 1}`}>{i + 1}</Select.Option>
                    )
                  )}
                </Select>
              </Form.Item>

              <Form.Item
                name="study_time"
                label="Study Time"
                rules={[
                  {
                    required: true,
                    message: "Study Time is required",
                  },
                ]}
              >
                <Select
                  loading={loadingRequirements}
                  allowClear
                  placeholder="Select Study Time"
                  onChange={(value) => {
                    handleLoadOtherFees();
                  }}
                >
                  {selectedCourse?.course_study_times.map((st) => (
                    <Select.Option value={st.id}>
                      {st.study_time_title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="other_fees" label="Other Fees">
                <Select
                  showSearch
                  loading={loadingOtherFees}
                  mode="multiple"
                  placeholder="Select Other Fees"
                  options={memoized_other_fees_data.map((fee) => ({
                    value: fee.id,
                    label: fee.fee_item.item_name,
                  }))}
                  filterOption={(input, option) =>
                    option?.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              <Space
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Form.Item
                // wrapperCol={{
                //   offset: 8,
                //   span: 16,
                // }}
                >
                  <Button2 onClick={handleClear}>Clear</Button2>
                </Form.Item>
                <Form.Item
                // wrapperCol={{
                //   offset: 8,
                //   span: 16,
                // }}
                >
                  <Button2
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: !loading ? "dodgerblue" : "",
                    }}
                    loading={loading}
                    disabled={loading}
                  >
                    Generate Fees Preview
                  </Button2>
                </Form.Item>
              </Space>
            </Form>
          </Box>
        </div>
      </Box>
    </div>
  );
}

export default FeesStructureForm;
