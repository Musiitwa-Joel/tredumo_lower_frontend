import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import clsx from "clsx";
import _ from "lodash";
import { darken } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { gql, useMutation, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  updateSchool,
  updateSchoolRequirements,
  updateSchools,
} from "../../store/schoolSlice";
import { SAVE_SCHOOL } from "../../gql/mutations";
import groupByCollege from "../../utilities/groupByCollege";
import Add from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";

// const _staff_members = [
//   { label: "MR. JOHN DOE", value: 1 },
//   { label: "MR. MUSINGUZI ANN", value: 2 },
//   { label: "MRS. JSREE", value: 3 },
// ];

// const _colleges = [{ label: "NKUMBA", value: 1 }];

const GET_REQUIREMENTS = gql`
  query add_school_requirements {
    staff_members {
      id
      salutation
      surname
      other_names
    }

    colleges {
      id
      college_title
      college_title
    }
  }
`;

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  school_code: yup.string().required("You must enter the school code"),
  school_title: yup.string().required("Please enter the school title."),
  dean: yup.string().required("Please enter the Dean of the provided school."),
  college: yup.string().required("Please enter the college."),
});

const defaultValues = {
  id: null,
  school_code: "",
  school_title: "",
  dean: "",
  college: "",
  added_by: "",
  // added_on: "" will be handled on the server
  modified_by: "",
};

function SchoolForm() {
  // load active user
  const user = useSelector((state) => state.user.user);
  const { colleges, staff_members } = useSelector(
    (state) => state.school.requirements
  );

  const { school } = useSelector((state) => state.school);

  // console.log("reqs", { colleges, staff_members });
  const dispatch = useDispatch();

  const {
    loading: requirementsLoading,
    data: requirements,
    error: requirementsErr,
  } = useQuery(GET_REQUIREMENTS);

  const [saveSchool, { error, loading, data }] = useMutation(SAVE_SCHOOL, {
    refetchQueries: ["getSchools"],
  });

  if (requirementsErr) {
    dispatch(
      showMessage({
        message: "Failed to load requirements",
        variant: "error",
      })
    );
  }

  if (error) {
    dispatch(
      showMessage({
        message: "Error saving school - " + error.message,
        variant: "error",
      })
    );
  }

  useEffect(() => {
    if (requirements) {
      const _colleges = requirements.colleges.map((college) => ({
        label: college.college_title,
        value: college.id,
      }));

      const _staff_members = requirements.staff_members.map((staff_member) => ({
        label: `${staff_member.salutation} ${staff_member.surname} ${staff_member.other_names}`,
        value: staff_member.id,
      }));

      // console.log("requirements", {
      //   colleges: _colleges,
      //   staff_members: _staff_members,
      // });

      dispatch(
        updateSchoolRequirements({
          colleges: _colleges,
          staff_members: _staff_members,
        })
      );
    }
  }, [requirements]);

  useEffect(() => {
    setValue("id", school.id);
    setValue("school_code", school.school_code);
    setValue("school_title", school.school_title);
    setValue("college", school.college_id);
    setValue("dean", school.school_dean_id);
  }, [school]);

  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = async ({ id, school_code, school_title, dean, college }) => {
    let payload = {
      schoolCode: school_code,
      schoolTitle: school_title,
      schoolDeanId: dean,
      collegeId: college,
      addedBy: user.biodata.id,
    };

    if (id) {
      payload = { ...payload, saveSchoolId: id };
    }

    const res = await saveSchool({
      variables: payload,
    });

    // console.log("the data", data);
    // console.log("the response", res);

    dispatch(updateSchools(groupByCollege(res.data.saveSchool)));

    reset(defaultValues);
    dispatch(updateSchool(defaultValues));

    dispatch(
      showMessage({
        message: "School Saved Succesfully",
        variant: "info",
      })
    );
    // console.log("payload", payload);
  };

  return (
    <div className="p-16">
      <Card
        className={clsx("", "shadow")}
        sx={{
          backgroundColor: (theme) =>
            darken(
              theme.palette.background.paper,
              theme.palette.mode === "light" ? 0.01 : 0.1
            ),
        }}
      >
        <Box
          sx={{
            backgroundColor: "#1e293b",
          }}
          className="p-10"
          style={{
            paddingLeft: 15,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            style={{
              //   opacity: 0.7,
              color: "white",
            }}
          >
            Add School
          </Typography>
          <Tooltip title="Add New School">
            <Add
              style={{
                color: "white",
                fontSize: 25,
                cursor: "pointer",
                //  marginRight: 10,
              }}
              onClick={() => {
                dispatch(updateSchool(defaultValues));
              }}
            />
          </Tooltip>
        </Box>
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
              name="schoolForm"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="school_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="School Code"
                    id="outlined-size-small"
                    error={!!errors.school_code}
                    style={{
                      paddingBottom: 15,
                    }}
                    required
                    size="small"
                  />
                )}
              />

              <Controller
                name="school_title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="School title"
                    id="outlined-size-small"
                    error={!!errors.school_title}
                    style={{
                      paddingBottom: 15,
                    }}
                    required
                    size="small"
                  />
                )}
              />

              <Controller
                name="dean"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    // disablePortal
                    id="combo-box-demo"
                    value={
                      staff_members.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(event, value) =>
                      field.onChange(value ? value.value : null)
                    }
                    options={staff_members}
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
                        error={!!errors.dean}
                        label="Dean"
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
                name="college"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    // disablePortal
                    id="combo-box-demo"
                    options={colleges}
                    value={
                      colleges.find((option) => option.value === field.value) ||
                      null
                    }
                    onChange={(event, value) =>
                      field.onChange(value ? value.value : null)
                    }
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
                        label="College"
                        error={!!errors.college}
                        required
                        style={{
                          paddingBottom: 15,
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
                  type="submit"
                  disabled={_.isEmpty(dirtyFields) || !isValid}
                  style={{
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {loading ? (
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
      </Card>
    </div>
  );
}

export default SchoolForm;
