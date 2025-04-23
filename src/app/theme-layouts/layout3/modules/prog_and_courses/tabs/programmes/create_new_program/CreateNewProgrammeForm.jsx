import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import _ from "lodash";
import { Box } from "@mui/system";
import { lighten } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Button } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectCourseVersionDetails,
  selectCreateNewCourse,
  selectSelectedCourseVersion,
  updateCreateProgrammeReqs,
  updateProgrammeFormDetails,
} from "../../../store/progAndCoursesSlice";
import { SAVE_COURSE } from "../../../gql/mutations";
import {
  GET_DEPARTMENTS,
  GET_SCHOOLS,
  LOAD_COURSE_VERSION_DETAILS,
} from "../../../gql/queries";

// const staff_members = [
//   { label: "MR. AKAMPA DARLINGTON", value: 1 },
//   { label: "MR. MULINDE HAKIM", value: 2 },
//   { label: "MR. MUKIIBI JOHN", value: 3 },
// ];

const schema = yup.object().shape({
  course_code: yup.string().required("Course code is required."),
  course_title: yup.string().required("Course title is required."),
  course_version: yup.string().required("Course version is required."),
  course_duration: yup.string().required("Course duration is required."),
  duration_measure: yup.string().required("Duration measure is required."),
  course_head: yup.string(),
  campuses: yup
    .array()
    .min(1, "Select at least one campus")
    .required("Campuses are required."),
  entry_yrs: yup
    .array()
    .min(1, "Select at least one entry year")
    .required("Entry yrs are required."),
  college_id: yup.string().required("College is required."),
  school_id: yup.string().required("School is required."),
  department_id: yup.string().required("Department is required."),
  level: yup.string().required("Level is required."),
  award: yup.string().required("Award is required."),
  grading_id: yup.string().required("Grading is required."),
  study_times: yup
    .array()
    .min(1, "Select at least one studytime")
    .required("Study time is required."),
  isShortCourse: yup.boolean(),
});

let REQUIREMENTS = gql`
  query programmeRequirements {
    staff_members {
      value: id
      staff_name
      title
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

const defaultValues = {
  id: null,
  course_code: "",
  course_title: "",
  course_version: "",
  course_duration: "",
  duration_measure: "",
  course_head_id: "",
  campuses: [],
  entry_yrs: [],
  college_id: "",
  school_id: "",
  department_id: "",
  level: "",
  award: "",
  grading_id: "",
  study_times: [],
  course_version_id: "",
  isShortCourse: false,
};

const duration_measures = [
  { label: "YEARS", value: "YEARS" },
  { label: "MONTHS", value: "MONTHS" },
];

function CreateNewProgrammeForm() {
  const user = useSelector((state) => state.user.user);
  const { error, loading: requirementsLoading, data } = useQuery(REQUIREMENTS);
  const [
    getSchoolsInCollege,
    { error: fetchSchoolsErr, loading: schoolsLoading, data: schoolsResponse },
  ] = useLazyQuery(GET_SCHOOLS_IN_COLLEGE);
  const [
    getDepartmentsInSchool,
    { error: fetchDptsErr, loading: dptsLoading, data: dptsResponse },
  ] = useLazyQuery(GET_DEPARTMENTS_IN_SCHOOL);

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  // console.log("course details", courseVersionDetails);

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

  const programmeFormDetails = useSelector(
    (state) => state.progAndCourses.programmeFormDetails
  );

  if (saveCourseErr) {
    console.log("errr", saveCourseErr.message);
  }

  const [schoolsInCollege, setSchoolsInCollege] = useState([]);
  const [dptsInSchool, setDptsInSchool] = useState([]);
  const {
    awards,
    campuses,
    colleges,
    levels,
    staff_members,
    grading,
    study_times,
  } = useSelector((state) => state.progAndCourses.createProgrammeReqs);
  const dispatch = useDispatch();
  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });

  const [entry_yrs, setEntryYrs] = useState([]);

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = async (data) => {
    const payload = {
      courseCode: data.course_code,
      courseTitle: data.course_title,
      courseDuration: parseInt(data.course_duration),
      durationMeasure: data.duration_measure,
      campuses: JSON.stringify(data.campuses),
      entryYrs: JSON.stringify(data.entry_yrs),
      collegeId: data.college_id,
      schoolId: data.school_id,
      departmentId: data.department_id,
      level: data.level,
      award: data.award,
      gradingId: data.grading_id,
      studyTimes: JSON.stringify(data.study_times),
      isShortCourse: Number(data.isShortCourse),
      courseVersion: data.course_version,
      addedBy: user.user_id,
      courseHeadId: data.course_head_id,
      saveCourseId: data.id,
      courseVersionId: data.course_version_id,
    };

    // console.log("payload", data);
    // if (id) {
    //   payload = { ...payload, saveDepartmentId: id };
    // }

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
        campuses: JSON.parse(res.data.saveCourse.course.campuses),
        entry_yrs: JSON.parse(res.data.saveCourse.course.entry_yrs),
        college_id: res.data.saveCourse.course.college_id,
        school_id: res.data.saveCourse.course.school_id,
        department_id: res.data.saveCourse.course.department_id,
        level: res.data.saveCourse.course.level,
        award: res.data.saveCourse.course.award,
        grading_id: res.data.saveCourse.course.grading_id,
        study_times: JSON.parse(res.data.saveCourse.course.study_times),
        course_version_id: res.data.saveCourse.id,
        isShortCourse: Boolean(res.data.saveCourse.course.is_short_course),
      };

      dispatch(updateProgrammeFormDetails(extractedData));
    }

    // reset(defaultValues);
    // dispatch(updateDepartment(defaultValues));

    // show alert
    setOpen(true);
    setMessage("Programme Saved Successfully!");

    // dispatch(
    //   showMessage({
    //     message: "Programme Saved Succesfully",
    //     variant: "info",
    //   })
    // );
  };

  useEffect(() => {
    // Iterate over each key in defaultValues object
    Object.keys(defaultValues).forEach((key) => {
      // Set value using setValue function
      setValue(key, programmeFormDetails[key] || defaultValues[key]);
    });
  }, [programmeFormDetails, setValue]);

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

  // console.log("createProgrammeReqs", {
  //   awards,
  //   campuses,
  //   colleges,
  //   levels,
  //   staff_members,
  //   grading,
  //   study_times,
  // });

  // const entry_yrs = [
  //   { label: "1", value: 1 },
  //   { label: "2", value: 2 },
  //   { label: "3", value: 3 },
  //   { label: "4", value: 4 },
  // ];

  useEffect(() => {
    if (data) {
      // console.log("response", data);
      let entry_years = [];
      for (let i = 1; i <= data.university_details.entry_yrs; i++) {
        entry_years.push({ label: i.toString(), value: i });
      }
      // console.log("entry years", entry_years);
      setEntryYrs(entry_years);
      dispatch(updateCreateProgrammeReqs(data));
    }
  }, [data]);

  const handleClick = () => {
    setOpen(true);
  };

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
      <form name="programmeForm" noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={1} spacing={1}>
          <Grid
            xs={6}
            sx={{
              position: "relative",
            }}
          >
            <Backdrop
              sx={{
                color: "#fff",
                position: "absolute",
                left: 0,
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={savingCourse}
              // onClick={handleClose}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
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
              <Controller
                name="course_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Programme Code"
                    id="outlined-size-small"
                    error={!!errors.course_code}
                    style={{
                      paddingBottom: 15,
                      width: "100%",
                    }}
                    required
                    size="small"
                  />
                )}
              />

              <Controller
                name="course_title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Programme title"
                    id="outlined-size-small"
                    error={!!errors.course_title}
                    style={{
                      paddingBottom: 15,
                      width: "100%",
                    }}
                    required
                    size="small"
                  />
                )}
              />

              <Controller
                name="course_version"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Programme version"
                    id="outlined-size-small"
                    error={!!errors.course_version}
                    style={{
                      paddingBottom: 15,
                      width: "100%",
                    }}
                    required
                    size="small"
                  />
                )}
              />

              <Controller
                name="course_duration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Programme Duration"
                    id="outlined-size-small"
                    type="number"
                    error={!!errors.course_duration}
                    style={{
                      paddingBottom: 15,
                      width: "100%",
                    }}
                    required
                    size="small"
                  />
                )}
              />

              <Controller
                name="duration_measure"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={
                      duration_measures?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(event, value) =>
                      field.onChange(value ? value.value : null)
                    }
                    options={duration_measures}
                    // loading={requirementsLoading}
                    sx={{
                      width: "100%",
                      "& .muiltr-u0wmug-MuiInputBase-root-MuiOutlinedInput-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-1ka647-MuiFormLabel-root-MuiInputLabel-root": {
                        fontSize: "1.5rem",
                        // marginBottom: 20,
                      },

                      "& .muiltr-1gyreyl-MuiFormLabel-root-MuiInputLabel-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-12cruda-MuiPaper-root-MuiAutocomplete-paper": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-input": {
                        padding: 10,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        padding: 0,
                      },
                      "& .MuiAutocomplete-groupLabel": {
                        backgroundColor: "red",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.duration_measure}
                        label="Duration measure"
                        required
                        // hiddenLabel={true}
                        style={{
                          paddingBottom: 15,
                        }}
                        size="small"
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="campuses"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    disablePortal
                    id="multiple-limit-tags"
                    options={campuses}
                    getOptionLabel={(option) => option.campus_title}
                    getOptionSelected={(option, value) =>
                      option.value === value.value
                    }
                    value={field.value || []}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiFormLabel-root.MuiInputLabel-root": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-paper": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-input": {
                        padding: 10,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        padding: 0,
                      },
                      "& .MuiAutocomplete-groupLabel": {
                        backgroundColor: "red",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.campuses}
                        label="Campus(s)"
                        required
                        style={{
                          paddingBottom: 15,
                          width: "100%",
                        }}
                        size="small"
                      />
                    )}
                    ChipProps={{
                      size: "small",
                      style: {
                        fontSize: "1.2rem", // Adjust font size here
                        height: "24px", // Adjust height here
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="entry_yrs"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    disablePortal
                    id="multiple-limit-tags"
                    options={entry_yrs}
                    getOptionLabel={(option) => option.label}
                    getOptionSelected={(option, value) =>
                      option.value === value.value
                    }
                    value={field.value || []}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiFormLabel-root.MuiInputLabel-root": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-paper": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-input": {
                        padding: 10,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        padding: 0,
                      },
                      "& .MuiAutocomplete-groupLabel": {
                        backgroundColor: "red",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.entry_yrs}
                        label="Entry Yr(s)"
                        required
                        style={{
                          paddingBottom: 15,
                          width: "100%",
                        }}
                        size="small"
                      />
                    )}
                    ChipProps={{
                      size: "small",
                      style: {
                        fontSize: "1.2rem", // Adjust font size here
                        height: "24px", // Adjust height here
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="course_head_id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={
                      staff_members?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(event, value) =>
                      field.onChange(value ? value.value : null)
                    }
                    options={staff_members}
                    loading={requirementsLoading}
                    getOptionLabel={(option) =>
                      `${option.title} ${option.staff_name}`
                    }
                    sx={{
                      width: "100%",
                      "& .muiltr-u0wmug-MuiInputBase-root-MuiOutlinedInput-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-1ka647-MuiFormLabel-root-MuiInputLabel-root": {
                        fontSize: "1.5rem",
                        // marginBottom: 20,
                      },

                      "& .muiltr-1gyreyl-MuiFormLabel-root-MuiInputLabel-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-12cruda-MuiPaper-root-MuiAutocomplete-paper": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-input": {
                        padding: 10,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        padding: 0,
                      },
                      "& .MuiAutocomplete-groupLabel": {
                        backgroundColor: "red",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.course_head}
                        label="Programme Head"
                        // required
                        // hiddenLabel={true}
                        style={{
                          paddingBottom: 15,
                          width: "100%",
                        }}
                        size="small"
                      />
                    )}
                  />
                )}
              />

              {/* <div className="flex flex-wrap -m-8 mt-8"></div> */}
            </Box>
          </Grid>
          <Grid
            xs={6}
            sx={{
              position: "relative",
            }}
          >
            <Backdrop
              sx={{
                color: "#fff",
                position: "absolute",
                left: 0,
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={savingCourse}
              // onClick={handleClose}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <Box
              className="p-16 w-full rounded-16 mb-8 border"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? lighten(theme.palette.background.default, 0.5)
                    : lighten(theme.palette.background.default, 0.02),
                height: "calc(100vh - 240px)",

                overflow: "auto",
              }}
            >
              <Controller
                name="college_id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={
                      colleges?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={async (event, value) => {
                      field.onChange(value ? value.value : null);
                      // console.log("the value", value);
                      const res = await getSchoolsInCollege({
                        variables: {
                          collegeId: value ? value.value : null,
                        },
                      });

                      setSchoolsInCollege(res.data.schools_in_college);
                    }}
                    getOptionLabel={(option) => option.college_title}
                    options={colleges}
                    loading={requirementsLoading}
                    sx={{
                      width: "100%",
                      "& .muiltr-u0wmug-MuiInputBase-root-MuiOutlinedInput-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-1ka647-MuiFormLabel-root-MuiInputLabel-root": {
                        fontSize: "1.5rem",
                        // marginBottom: 20,
                      },

                      "& .muiltr-1gyreyl-MuiFormLabel-root-MuiInputLabel-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-12cruda-MuiPaper-root-MuiAutocomplete-paper": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-input": {
                        padding: 10,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        padding: 0,
                      },
                      "& .MuiAutocomplete-groupLabel": {
                        backgroundColor: "red",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.college_id}
                        label="College"
                        required
                        // hiddenLabel={true}
                        style={{
                          paddingBottom: 15,
                          width: "100%",
                        }}
                        size="small"
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="school_id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={
                      schoolsInCollege?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={async (event, value) => {
                      field.onChange(value ? value.value : null);
                      console.log("the value", value.value);
                      const res = await getDepartmentsInSchool({
                        variables: {
                          schoolId: value ? value.value : null,
                        },
                      });

                      // console.log("res", res);

                      setDptsInSchool(res.data.departments_in_school);
                    }}
                    options={schoolsInCollege}
                    loading={schoolsLoading}
                    getOptionLabel={(option) =>
                      `(${option.school_code}) ${option.school_title}`
                    }
                    loadingText="Loading..."
                    sx={{
                      width: "100%",
                      "& .muiltr-u0wmug-MuiInputBase-root-MuiOutlinedInput-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-1ka647-MuiFormLabel-root-MuiInputLabel-root": {
                        fontSize: "1.5rem",
                        // marginBottom: 20,
                      },

                      "& .muiltr-1gyreyl-MuiFormLabel-root-MuiInputLabel-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-12cruda-MuiPaper-root-MuiAutocomplete-paper": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-input": {
                        padding: 10,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        padding: 0,
                      },
                      "& .MuiAutocomplete-groupLabel": {
                        backgroundColor: "red",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.school_id}
                        label="School"
                        required
                        // hiddenLabel={true}
                        style={{
                          paddingBottom: 15,
                          width: "100%",
                        }}
                        size="small"
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="department_id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={
                      dptsInSchool?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(event, value) =>
                      field.onChange(value ? value.value : null)
                    }
                    options={dptsInSchool}
                    getOptionLabel={(option) =>
                      `(${option.dpt_code}) ${option.dpt_title}`
                    }
                    loading={dptsLoading}
                    sx={{
                      width: "100%",
                      "& .muiltr-u0wmug-MuiInputBase-root-MuiOutlinedInput-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-1ka647-MuiFormLabel-root-MuiInputLabel-root": {
                        fontSize: "1.5rem",
                        // marginBottom: 20,
                      },

                      "& .muiltr-1gyreyl-MuiFormLabel-root-MuiInputLabel-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-12cruda-MuiPaper-root-MuiAutocomplete-paper": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-input": {
                        padding: 10,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        padding: 0,
                      },
                      "& .MuiAutocomplete-groupLabel": {
                        backgroundColor: "red",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.department_id}
                        label="Department"
                        required
                        // hiddenLabel={true}
                        style={{
                          paddingBottom: 15,
                          width: "100%",
                        }}
                        size="small"
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={
                      levels?.find((option) => option.value === field.value) ||
                      null
                    }
                    onChange={(event, value) =>
                      field.onChange(value ? value.value : null)
                    }
                    options={levels}
                    getOptionLabel={(option) => option.level_title}
                    loading={requirementsLoading}
                    sx={{
                      width: "100%",
                      "& .muiltr-u0wmug-MuiInputBase-root-MuiOutlinedInput-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-1ka647-MuiFormLabel-root-MuiInputLabel-root": {
                        fontSize: "1.5rem",
                        // marginBottom: 20,
                      },

                      "& .muiltr-1gyreyl-MuiFormLabel-root-MuiInputLabel-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-12cruda-MuiPaper-root-MuiAutocomplete-paper": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-input": {
                        padding: 10,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        padding: 0,
                      },
                      "& .MuiAutocomplete-groupLabel": {
                        backgroundColor: "red",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.level}
                        label="Level"
                        required
                        // hiddenLabel={true}
                        style={{
                          paddingBottom: 15,
                          width: "100%",
                        }}
                        size="small"
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="award"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={
                      awards?.find((option) => option.value === field.value) ||
                      null
                    }
                    onChange={(event, value) =>
                      field.onChange(value ? value.value : null)
                    }
                    getOptionLabel={(option) => option.award_title}
                    options={awards}
                    loading={requirementsLoading}
                    sx={{
                      width: "100%",
                      "& .muiltr-u0wmug-MuiInputBase-root-MuiOutlinedInput-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-1ka647-MuiFormLabel-root-MuiInputLabel-root": {
                        fontSize: "1.5rem",
                        // marginBottom: 20,
                      },

                      "& .muiltr-1gyreyl-MuiFormLabel-root-MuiInputLabel-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-12cruda-MuiPaper-root-MuiAutocomplete-paper": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-input": {
                        padding: 10,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        padding: 0,
                      },
                      "& .MuiAutocomplete-groupLabel": {
                        backgroundColor: "red",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.award}
                        label="Award"
                        required
                        // hiddenLabel={true}
                        style={{
                          paddingBottom: 15,
                          width: "100%",
                        }}
                        size="small"
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="grading_id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={
                      grading?.find((option) => option.value === field.value) ||
                      null
                    }
                    onChange={(event, value) =>
                      field.onChange(value ? value.value : null)
                    }
                    options={grading}
                    getOptionLabel={(option) => option.grading_title}
                    loading={requirementsLoading}
                    sx={{
                      width: "100%",
                      "& .muiltr-u0wmug-MuiInputBase-root-MuiOutlinedInput-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-1ka647-MuiFormLabel-root-MuiInputLabel-root": {
                        fontSize: "1.5rem",
                        // marginBottom: 20,
                      },

                      "& .muiltr-1gyreyl-MuiFormLabel-root-MuiInputLabel-root":
                        {
                          fontSize: "1.5rem",
                        },
                      "& .muiltr-12cruda-MuiPaper-root-MuiAutocomplete-paper": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-input": {
                        padding: 10,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        padding: 0,
                      },
                      "& .MuiAutocomplete-groupLabel": {
                        backgroundColor: "red",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.grading_id}
                        label="Grading"
                        required
                        // hiddenLabel={true}
                        style={{
                          paddingBottom: 15,
                          width: "100%",
                        }}
                        size="small"
                      />
                    )}
                  />
                )}
              />

              <Controller
                name="study_times"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    disablePortal
                    id="multiple-limit-tags"
                    options={study_times}
                    getOptionLabel={(option) => option.study_time_title}
                    getOptionSelected={(option, value) =>
                      option.value === value.value
                    }
                    value={field.value || []}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiFormLabel-root.MuiInputLabel-root": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-paper": {
                        fontSize: "1.5rem",
                      },
                      "& .MuiAutocomplete-input": {
                        padding: 10,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        padding: 0,
                      },
                      "& .MuiAutocomplete-groupLabel": {
                        backgroundColor: "red",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!errors.study_times}
                        label="Study Time(s)"
                        required
                        style={{
                          paddingBottom: 15,
                          width: "100%",
                        }}
                        size="small"
                      />
                    )}
                    ChipProps={{
                      size: "small",
                      style: {
                        fontSize: "1.2rem", // Adjust font size here
                        height: "24px", // Adjust height here
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="isShortCourse"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    value="end"
                    control={<Checkbox {...field} />}
                    className="font-medium text-20 bold"
                    style={{
                      fontSize: 15,
                    }}
                    label="Is Short Course?"
                    labelPlacement="start"
                  />
                )}
              />

              {/* <div className="flex flex-wrap -m-8 mt-8 mb-10"></div> */}
            </Box>
          </Grid>
        </Grid>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={_.isEmpty(dirtyFields) || !isValid}
          >
            {savingCourse ? (
              <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                  color: "#fff",
                  animationDuration: "550ms",
                }}
                size={18}
                thickness={6}
              />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateNewProgrammeForm;
