import Box from "@mui/material/Box";
import {
  Form,
  Row,
  Col,
  ConfigProvider,
  Select,
  Input,
  Space,
  Button,
  InputNumber,
  Checkbox,
  theme,
} from "antd";
import { lighten } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_DEPARTMENTS, GET_SCHOOLS } from "../../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  updateCreateProgrammeReqs,
  updateProgrammeFormDetails,
} from "../../../store/progAndCoursesSlice";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { SAVE_COURSE } from "../../../gql/mutations";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 16,
    },
    sm: {
      span: 6,
    },
  },
  //   wrapperCol: {
  //     xs: {
  //       span: 24,
  //     },
  //     sm: {
  //       span: 16,
  //     },
  //   },
};

let REQUIREMENTS = gql`
  query programmeRequirements {
    # staff_members {
    #   value: id
    #   staff_name
    #   title
    # }
    employees {
      id
      salutation
      surname
      other_names
    }
    campuses {
      value: id
      campus_title
    }
    awards {
      value: id
      award_title
    }
    levels {
      value: id
      level_title
    }
    colleges {
      value: id
      college_title
    }
    study_times {
      value: id
      study_time_title
    }
    grading {
      value: id
      grading_title
    }
    university_details {
      entry_yrs
    }
  }
`;

let GET_SCHOOLS_IN_COLLEGE = gql`
  query get_schools_in_college($collegeId: ID!) {
    schools_in_college(college_id: $collegeId) {
      value: id
      school_code
      school_title
    }
  }
`;

let GET_DEPARTMENTS_IN_SCHOOL = gql`
  query get_departments_in_school($schoolId: ID!) {
    departments_in_school(school_id: $schoolId) {
      value: id
      dpt_code
      dpt_title
    }
  }
`;

const duration_measures = [
  { label: "YEARS", value: "YEARS" },
  { label: "MONTHS", value: "MONTHS" },
];

function CreateNewCourseForm() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { error, loading: requirementsLoading, data } = useQuery(REQUIREMENTS);
  const [
    getSchoolsInCollege,
    { error: fetchSchoolsErr, loading: schoolsLoading, data: schoolsResponse },
  ] = useLazyQuery(GET_SCHOOLS_IN_COLLEGE);
  const [
    getDepartmentsInSchool,
    { error: fetchDptsErr, loading: dptsLoading, data: dptsResponse },
  ] = useLazyQuery(GET_DEPARTMENTS_IN_SCHOOL);

  const {
    error: getSchoolsErr,
    loading: loadingSchools,
    data: allSchoolsResponse,
  } = useQuery(GET_SCHOOLS);

  const {
    error: getDptsErr,
    loading: loadingDpts,
    data: allDptsResponse,
  } = useQuery(GET_DEPARTMENTS);

  const [
    saveCourse,
    { error: saveCourseErr, loading: savingCourse, data: saveCourseRespoanse },
  ] = useMutation(SAVE_COURSE, {
    refetchQueries: [
      "getAllProgrammesCategorisedBySchools",
      "loadCourseVersionDetails",
    ],
  });

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [entry_yrs, setEntryYrs] = useState([]);
  const [schoolsInCollege, setSchoolsInCollege] = useState([]);
  const [dptsInSchool, setDptsInSchool] = useState([]);
  const programmeFormDetails = useSelector(
    (state) => state.progAndCourses.programmeFormDetails
  );

  const {
    awards,
    campuses,
    colleges,
    levels,
    employees,
    grading,
    study_times,
  } = useSelector((state) => state.progAndCourses.createProgrammeReqs);

  useEffect(() => {
    if (allSchoolsResponse) {
      const _schools = allSchoolsResponse.schools.map((sch) => ({
        ...sch,
        value: sch.id,
      }));
      // console.log("the response", _schools);
      setSchoolsInCollege(_schools);
    }

    if (allDptsResponse) {
      const _dpts = allDptsResponse.departments.map((dpt) => ({
        ...dpt,
        value: dpt.id,
      }));
      // console.log("the response", allDptsResponse);
      setDptsInSchool(_dpts);
    }
  }, [allSchoolsResponse, allDptsResponse]);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: "Failed to load resources " + error.message,
          variant: "error",
        })
      );
    }

    if (fetchDptsErr) {
      dispatch(
        showMessage({
          message: "error " + fetchDptsErr.message,
          variant: "error",
        })
      );
    }

    if (saveCourseErr) {
      dispatch(
        showMessage({
          message: "error " + saveCourseErr.message,
          variant: "error",
        })
      );
    }
  }, [error, fetchDptsErr, saveCourseErr]);

  useEffect(() => {
    if (data) {
      //   console.log("response", data);
      let entry_years = [];
      for (let i = 1; i <= data.university_details.entry_yrs; i++) {
        entry_years.push({ label: i.toString(), value: i });
      }
      // console.log("entry years", entry_years);
      setEntryYrs(entry_years);
      dispatch(updateCreateProgrammeReqs(data));
    }
  }, [data]);

  const onFinish = async (values) => {
    console.log("values", values);
    // temporarily format campuses
    const filteredCampuses = campuses.filter((campus) =>
      values.campuses.includes(campus.value)
    );

    const filteredEntryYrs = entry_yrs.filter((entry_yr) =>
      values.entry_yrs.includes(entry_yr.value)
    );

    const filteredStudyTimes = study_times.filter((st) =>
      values.study_times.includes(st.value)
    );

    const payload = {
      courseCode: values.course_code,
      courseTitle: values.course_title,
      courseDuration: parseInt(values.course_duration),
      durationMeasure: values.duration_measure,
      campuses: JSON.stringify(filteredCampuses),
      entryYrs: JSON.stringify(filteredEntryYrs),
      collegeId: values.college_id,
      schoolId: values.school_id,
      departmentId: values.department_id,
      level: values.level,
      award: values.award,
      gradingId: values.grading_id,
      studyTimes: JSON.stringify(filteredStudyTimes),
      isShortCourse: values.isShortCourse,
      courseVersion: values.course_version,
      // addedBy: user.user_id,
      courseHeadId: values.course_head_id,
      saveCourseId: programmeFormDetails.id ? programmeFormDetails.id : null,
      courseVersionId: programmeFormDetails.course_version_id
        ? programmeFormDetails.course_version_id
        : null,
      totalCreditUnits: values.total_credit_units,
    };

    // console.log("payload", payload);

    const res = await saveCourse({
      variables: payload,
    });

    // console.log("res", res.data);
    if (res.data.saveCourse) {
      const extractedData = {
        id: res.data.saveCourse.course.id,
        course_code: res.data.saveCourse.course.course_code,
        course_title: res.data.saveCourse.course.course_title,
        course_version: res.data.saveCourse.version_title,
        course_duration: res.data.saveCourse.course.course_duration,
        duration_measure: res.data.saveCourse.course.duration_measure,
        course_head_id: res.data.saveCourse.course.course_head_id,
        campuses: JSON.parse(res.data.saveCourse.course.campuses).map(
          (campus) => campus.value
        ),
        entry_yrs: JSON.parse(res.data.saveCourse.course.entry_yrs).map(
          (entry_yr) => entry_yr.value
        ),
        college_id: res.data.saveCourse.course.college_id,
        school_id: res.data.saveCourse.course.school_id,
        department_id: res.data.saveCourse.course.department_id,
        level: res.data.saveCourse.course.level,
        award: res.data.saveCourse.course.award,
        grading_id: res.data.saveCourse.course.grading_id,
        study_times: JSON.parse(res.data.saveCourse.course.study_times).map(
          (st) => st.value
        ),
        course_version_id: res.data.saveCourse.id,
        total_credit_units: res.data.saveCourse.total_credit_units,
        isShortCourse: res.data.saveCourse.course.is_short_course,
      };

      //   console.log("extractedData", extractedData);

      dispatch(updateProgrammeFormDetails(extractedData));
    }

    // reset(defaultValues);
    // dispatch(updateDepartment(defaultValues));

    // show alert
    setOpen(true);
    setMessage("Programme Saved Successfully!");
  };

  useEffect(() => {
    // Iterate over each key in defaultValues object

    if (programmeFormDetails) {
      form.setFieldsValue({
        course_code: programmeFormDetails.course_code,
        course_title: programmeFormDetails.course_title,
        course_version: programmeFormDetails.course_version,
        course_duration: programmeFormDetails.course_duration,
        duration_measure: programmeFormDetails.duration_measure,
        campuses: programmeFormDetails.campuses,
        entry_yrs: programmeFormDetails.entry_yrs,
        course_head_id: programmeFormDetails.course_head_id,
        college_id: programmeFormDetails.college_id,
        school_id: programmeFormDetails.school_id,
        department_id: programmeFormDetails.department_id,
        level: programmeFormDetails.level,
        award: programmeFormDetails.award,
        grading_id: programmeFormDetails.grading_id,
        study_times: programmeFormDetails.study_times,
        total_credit_units: programmeFormDetails.total_credit_units,
        isShortCourse: programmeFormDetails.isShortCourse,
      });
    }
  }, [programmeFormDetails]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%", zIndex: 10000 }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Form
        form={form}
        name="courseForm"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        //   onFinishFailed={onFinishFailed}
        autoComplete="off"
        {...formItemLayout}
      >
        <Row
          gutter={16}
          style={
            {
              // backgroundColor: "red",
              // width: 900,
            }
          }
        >
          <Col className="gutter-row" span={12}>
            <Box
              className="p-16 w-full rounded-16 mb-8 border"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? lighten(theme.palette.background.default, 0.5)
                    : lighten(theme.palette.background.default, 0.02),
                height: "calc(100vh - 240px)",
                // position: "relative",
                overflow: "auto",
              }}
            >
              <ConfigProvider
                theme={{
                  components: {
                    Select: {
                      /* here is your component tokens */
                      zIndexPopup: 1000000,
                    },
                  },
                  algorithm: theme.defaultAlgorithm,
                }}
              >
                <div>
                  <Form.Item
                    name="course_code"
                    label="Course Code"
                    rules={[
                      {
                        required: true,
                        message: "Please input the course code",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="course_title"
                    label="Course Title"
                    rules={[
                      {
                        required: true,
                        message: "Please input the course title",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="course_version"
                    label="Course Version"
                    rules={[
                      {
                        required: true,
                        message: "Please input the course version",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="course_duration"
                    label="Course Duration"
                    rules={[
                      {
                        required: true,
                        message: "Please input the course duration",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="duration_measure"
                    label="Duration Measure"
                    rules={[
                      {
                        required: true,
                        message: "Please input the duration measure",
                      },
                    ]}
                  >
                    <Select showSearch options={duration_measures} />
                  </Form.Item>

                  <Form.Item
                    name="campuses"
                    label="Campuses"
                    rules={[
                      {
                        required: true,
                        message: "Please input the campuses",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      mode="multiple"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={campuses.map((campus) => ({
                        value: campus.value,
                        label: campus.campus_title,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name="entry_yrs"
                    label="Entry Years"
                    rules={[
                      {
                        required: true,
                        message: "Please input the entry years",
                      },
                    ]}
                  >
                    <Select mode="multiple" showSearch options={entry_yrs} />
                  </Form.Item>

                  <Form.Item
                    name="course_head_id"
                    label="Course Head"
                    rules={[
                      {
                        required: true,
                        message: "Please input the course head",
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
                      options={employees?.map((emp) => ({
                        value: emp.id,
                        label: `${emp.salutation} ${emp.surname} ${emp.other_names}`,
                      }))}
                    />
                  </Form.Item>
                </div>
              </ConfigProvider>
            </Box>
          </Col>
          <Col className="gutter-row" span={12}>
            <Box
              className="p-16 w-full rounded-16 mb-8 border"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? lighten(theme.palette.background.default, 0.5)
                    : lighten(theme.palette.background.default, 0.02),
                height: "calc(100vh - 240px)",
                // position: "relative",
                overflow: "auto",
              }}
            >
              <ConfigProvider
                theme={{
                  components: {
                    Select: {
                      /* here is your component tokens */
                      zIndexPopup: 1000000,
                    },
                  },
                  algorithm: theme.defaultAlgorithm,
                }}
              >
                <div>
                  <Form.Item
                    name="college_id"
                    label="College"
                    rules={[
                      {
                        required: true,
                        message: "Please input the college!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      loading={requirementsLoading}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={async (value) => {
                        // console.log("the value", value);
                        const res = await getSchoolsInCollege({
                          variables: {
                            collegeId: value ? value : null,
                          },
                        });

                        setSchoolsInCollege(res.data.schools_in_college);
                      }}
                      options={colleges.map((college) => ({
                        value: college.value,
                        label: college.college_title,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name="school_id"
                    label="School/Faculty"
                    rules={[
                      {
                        required: true,
                        message: "Please input the faculty!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      loading={requirementsLoading}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={async (value) => {
                        const res = await getDepartmentsInSchool({
                          variables: {
                            schoolId: value ? value : null,
                          },
                        });

                        // console.log("res", res);

                        setDptsInSchool(res.data.departments_in_school);
                      }}
                      options={schoolsInCollege.map((sch) => ({
                        value: sch.value,
                        label: sch.school_title,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name="department_id"
                    label="Department"
                    rules={[
                      {
                        required: true,
                        message: "Please input the Department!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      loading={requirementsLoading}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={dptsInSchool.map((dpt) => ({
                        value: dpt.value,
                        label: dpt.dpt_title,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name="level"
                    label="Level"
                    rules={[
                      {
                        required: true,
                        message: "Please input the course level",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      loading={requirementsLoading}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={levels.map((level) => ({
                        value: level.value,
                        label: level.level_title,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name="award"
                    label="Award"
                    rules={[
                      {
                        required: true,
                        message: "Please input the award",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      loading={requirementsLoading}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={awards?.map((award) => ({
                        value: award.value,
                        label: award.award_title,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name="grading_id"
                    label="Grading"
                    rules={[
                      {
                        required: true,
                        message: "Please input the grading",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      loading={requirementsLoading}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={grading.map((gr) => ({
                        value: gr.value,
                        label: gr.grading_title,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name="study_times"
                    label="Study Times"
                    rules={[
                      {
                        required: true,
                        message: "Please input the study times",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      mode="multiple"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      loading={requirementsLoading}
                      options={study_times.map((st) => ({
                        value: st.value,
                        label: st.study_time_title,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name="total_credit_units"
                    label="Minimum Credit Units"
                    rules={[
                      {
                        required: true,
                        message: "Please input the total Credit Units",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="isShortCourse"
                    valuePropName="checked"
                    label={null}
                    initialValue={false}
                  >
                    <Checkbox>Is Short Course?</Checkbox>
                  </Form.Item>
                </div>
              </ConfigProvider>
            </Box>
          </Col>
        </Row>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Space>
              <Button
                onClick={() => dispatch(updateCreateModuleModalOpen(false))}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={savingCourse}
                disabled={savingCourse}
              >
                Save
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateNewCourseForm;
