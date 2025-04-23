import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import clsx from "clsx";
import CircularProgress from "@mui/material/CircularProgress";
import { darken } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import _ from "lodash";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  updateDepartment,
  updateDepartmentRequirements,
  updateDepartments,
} from "../../store/departmentSlice";
import { SAVE_DEPARTMENT } from "../../gql/mutations";
import groupBySchool from "../../utilities/groupBySchool";
import Add from "@mui/icons-material/Add";
import { Tooltip } from "@mui/material";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const GET_REQUIREMENTS = gql`
  query Query {
    staff_members {
      id
      salutation
      surname
      other_names
    }
    schools {
      id
      school_code
      school_title
    }
  }
`;

// const staff_members = [
//   { label: "MR. JOHN DOE", value: 1 },
//   { label: "MR. MUSINGUZI ANN", value: 2 },
//   { label: "MRS. JSREE", value: 3 },
// ];

// const schools = [
//   { label: "SBA (SCHOOL OF BUSINESS ADMISNISTRATION)", value: 1 },
//   { label: "SCI (SCHOOL OF COMPUTING AND INFORMATICS)", value: 2 },
// ];

const schema = yup.object().shape({
  department_code: yup.string().required("Department code is required."),
  department_title: yup.string().required("Department title is required."),
  department_head: yup.string().required("Department Head is required"),
  school_id: yup.string().required("School is required"),
});

const defaultValues = {
  id: null,
  department_code: "",
  department_title: "",
  department_head: "",
  school_id: "",
  added_by: "",
  modified_by: "",
};

function DepartmentForm() {
  const user = useSelector((state) => state.user.user);
  const { schools, staff_members } = useSelector(
    (state) => state.department.requirements
  );

  const { department } = useSelector((state) => state.department);

  const dispatch = useDispatch();
  const {
    loading: requirementsLoading,
    data: requirements,
    error: requirementsErr,
  } = useQuery(GET_REQUIREMENTS);

  const [saveDepartment, { error, loading, data }] = useMutation(
    SAVE_DEPARTMENT,
    {
      refetchQueries: ["getDepartments"],
    }
  );

  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });

  const { isValid, dirtyFields, errors } = formState;

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
        message: error.message,
        variant: "error",
      })
    );
  }

  useEffect(() => {
    if (requirements) {
      // console.log("requirements", requirements);
      const _schools = requirements.schools.map((sch) => ({
        label: `(${sch.school_code}) ${sch.school_title}`,
        value: sch.id,
      }));

      const _staff_members = requirements.staff_members.map((staff_member) => ({
        label: `${staff_member.salutation} ${staff_member.surname} ${staff_member.other_names}`,
        value: staff_member.id,
      }));

      dispatch(
        updateDepartmentRequirements({
          schools: _schools,
          staff_members: _staff_members,
        })
      );
    }
  }, [requirements]);

  const onSubmit = async ({
    id,
    department_code,
    department_title,
    department_head,
    school_id,
  }) => {
    let payload = {
      dptCode: department_code,
      dptTitle: department_title,
      dptHeadId: department_head,
      schoolId: school_id,
      addedBy: user.biodata.id,
    };

    console.log("payload", payload);
    if (id) {
      payload = { ...payload, saveDepartmentId: id };
    }

    const res = await saveDepartment({
      variables: payload,
    });

    dispatch(updateDepartments(groupBySchool(res.data.saveDepartment)));

    reset(defaultValues);
    dispatch(updateDepartment(defaultValues));

    dispatch(
      showMessage({
        message: "Department Saved Succesfully",
        variant: "info",
      })
    );
  };

  useEffect(() => {
    setValue("id", department.id);
    setValue("department_code", department.dpt_code);
    setValue("department_title", department.dpt_title);
    setValue("department_head", department.dpt_head_id);
    setValue("school_id", department.school_id);
  }, [department]);

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
            Add Department
          </Typography>

          <Tooltip title="Create new department">
            <Add
              style={{
                color: "white",
                fontSize: 25,
                cursor: "pointer",
                //  marginRight: 10,
              }}
              onClick={() => {
                dispatch(updateDepartment(defaultValues));
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
              name="departmentForm"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="department_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department Code"
                    id="outlined-size-small"
                    error={!!errors.department_code}
                    style={{
                      paddingBottom: 15,
                    }}
                    required
                    size="small"
                  />
                )}
              />

              <Controller
                name="department_title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department Title"
                    id="outlined-size-small"
                    error={!!errors.department_title}
                    style={{
                      paddingBottom: 15,
                    }}
                    required
                    size="small"
                  />
                )}
              />

              <Controller
                name="department_head"
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
                        error={!!errors.department_head}
                        label="Head Of Department"
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
                name="school_id"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    // disablePortal
                    id="combo-box-demo"
                    value={
                      schools.find((option) => option.value === field.value) ||
                      null
                    }
                    onChange={(event, value) =>
                      field.onChange(value ? value.value : null)
                    }
                    options={schools}
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
                        error={!!errors.school_id}
                        label="School"
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

export default DepartmentForm;
