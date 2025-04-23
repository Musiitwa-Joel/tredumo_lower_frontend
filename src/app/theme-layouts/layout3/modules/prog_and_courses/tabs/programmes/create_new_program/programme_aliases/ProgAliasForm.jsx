import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import _ from "lodash";
import * as yup from "yup";
import clsx from "clsx";
import { darken } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { lighten } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { gql, useMutation, useQuery } from "@apollo/client";
// import { SAVE_COLLEGE } from "../../gql/mutations";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Autocomplete, Snackbar } from "@mui/material";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { SAVE_COURSE_ALIAS } from "../../../../gql/mutations";
import { selectUser } from "app/store/userSlice";
import {
  selectSelectedAlias,
  selectSelectedCourseVersion,
  setSelectedAlias,
} from "../../../../store/progAndCoursesSlice";
// import { updateCollege, updateColleges } from "../../store/collegeSlice";

let REQUIREMENTS = gql`
  query programmeRequirements {
    campuses {
      value: id
      campus_title
    }

    study_times {
      value: id
      study_time_title
    }
  }
`;

const _reqs = {
  campuses: [],
  study_times: [],
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  alias_code: yup.string().required("Alias code is required"),
  study_time: yup.string().required("Study Time is required"),
  campus: yup.string().required("Campus is required"),
});

const defaultValues = {
  id: null,
  alias_code: "",
  study_time: "",
  campus: "",
};

function ProgAliasForm() {
  const dispatch = useDispatch();
  const selectedCourseVersion = useSelector(selectSelectedCourseVersion);
  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });
  const userObj = useSelector(selectUser);
  const [
    saveCourseAliases,
    { error: saveErr, loading: savingAlias, data: aliasRes },
  ] = useMutation(SAVE_COURSE_ALIAS, {
    refetchQueries: ["loadCourseAliases"],
  });
  const { error, loading: requirementsLoading, data } = useQuery(REQUIREMENTS);
  const [reqs, setReqs] = useState(_reqs);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const selectedAlias = useSelector(selectSelectedAlias);

  // console.log("selected alias", selectedAlias);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
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
  }, [error, saveErr]);

  useEffect(() => {
    if (selectedAlias) {
      setValue("alias_code", selectedAlias.alias_code);
      setValue("campus", selectedAlias.campus_id);
      setValue("study_time", selectedAlias.study_time_id);
    } else {
      setValue("alias_code", "");
      setValue("campus", "");
      setValue("study_time", "");
    }
  }, [selectedAlias]);

  useEffect(() => {
    if (data) {
      // console.log("response", data);
      setReqs(data);
    }
  }, [data]);

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = async (values) => {
    // console.log("data", values);
    const payload = {
      addedBy: userObj.user.user_id,
      alias: {
        alias_code: values.alias_code,
        campus_id: values.campus,
        course_id: selectedCourseVersion.course.id,
        id: selectedAlias ? selectedAlias.id : null,
        study_time_id: values.study_time,
      },
    };
    // console.log("payload", payload);

    const res = await saveCourseAliases({
      variables: payload,
    });

    // show alert
    setOpen(true);
    setMessage(res.data.saveCourseAlias.message);

    reset();
  };

  // async function onSubmit({ id, alias_code, college_title }) {
  //   const res = await saveCollege({
  //     variables: {
  //       collegeCode: alias_code,
  //       collegeTitle: college_title,
  //       saveCollegeId: id,
  //     },
  //   });

  //   // console.log("the data", data);
  //   // console.log("the response", res);

  //   dispatch(updateColleges(res.data.saveCollege));

  //   reset(defaultValues);
  //   dispatch(updateCollege(defaultValues));

  //   dispatch(
  //     showMessage({
  //       message: "Saved Succesfully",
  //       variant: "info",
  //     })
  //   );
  // }

  // useEffect(() => {
  //   setValue("id", college.id);
  //   setValue("alias_code", college.alias_code);
  //   setValue("college_title", college.college_title);
  // }, [college]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="p-16">
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
      <Box
        className="p-8 w-full rounded-16 border"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.1)
              : lighten(theme.palette.background.default, 0.02),
          marginRight: 10,
          overflow: "auto",
        }}
      >
        <Divider
          textAlign="left"
          style={{
            marginTop: 10,
          }}
        >
          {" "}
          <Typography className="font-medium text-20 bold">
            {"Add Program Alias"}
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
              padding: 15,
              //   backgroundColor: "red",
            }}
          >
            <form
              name="progAliasForm"
              noValidate
              // className="flex flex-col justify-center w-full mt-32"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="alias_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Alias Code"
                    id="outlined-size-small"
                    error={!!errors.alias_code}
                    style={{
                      paddingBottom: 15,
                    }}
                    // value={formState.alias_code}
                    // onChange={e => setFormState({...formState, alias_code: e.target.value})}
                    // defaultValue="Small"
                    required
                    size="small"
                  />
                )}
              />

              <Controller
                name="study_time"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={
                      reqs.study_times?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(event, value) =>
                      field.onChange(value ? value.value : null)
                    }
                    options={reqs.study_times}
                    loading={requirementsLoading}
                    getOptionLabel={(option) => option.study_time_title}
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
                        error={!!errors.study_time}
                        label="Study Time"
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
                name="campus"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={
                      reqs.campuses?.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(event, value) =>
                      field.onChange(value ? value.value : null)
                    }
                    options={reqs.campuses}
                    loading={requirementsLoading}
                    getOptionLabel={(option) => option.campus_title}
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
                        error={!!errors.campus}
                        label="Campus"
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

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    dispatch(setSelectedAlias(null));
                  }}
                  disabled={!selectedAlias}
                  style={{
                    padding: 0,
                    marginRight: 10,
                  }}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={_.isEmpty(dirtyFields) || !isValid}
                  style={{
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {savingAlias ? (
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
          </Box>
        </div>
      </Box>
    </div>
  );
}

export default ProgAliasForm;
