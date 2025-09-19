import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import * as yup from "yup";
import _ from "lodash";
import TextField from "@mui/material/TextField";
import { lighten } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
import {
  resetSubjectFormState,
  updateSubjects,
} from "../../store/academicsSlice";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  subject_code: yup.string().required("You must enter the subject code"),
  subject_title: yup.string().required("You must enter the subject title"),
});

const defaultValues = {
  id: null,
  subject_code: "",
  subject_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

function SubjectForm() {
  const user = useSelector((state) => state.user.user);
  const selectedSubject = useSelector(
    (state) => state.academics.selectedSubject
  );
  const [isSaving, setIsSaving] = useState(false);

  const { control, formState, handleSubmit, reset, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    if (selectedSubject) {
      setValue("id", selectedSubject.id);
      setValue("subject_code", selectedSubject.subject_code);
      setValue("subject_title", selectedSubject.subject_title);
      setValue(
        "added_by",
        selectedSubject.added_user
          ? `${selectedSubject.added_user.title} ${selectedSubject.added_user.staff_name}`
          : user && user.biodata
            ? `${user.biodata.title} ${user.biodata.staff_name}`
            : ""
      );
      setValue(
        "modified_by",
        selectedSubject.modified_user
          ? `${selectedSubject.modified_user.title} ${selectedSubject.modified_user.staff_name}`
          : ""
      );
      setValue(
        "modified_on",
        selectedSubject.modified_on
          ? convertTimestampToDate(selectedSubject.modified_on)
          : ""
      );
    }
  }, [selectedSubject, setValue, user]);

  async function onSubmit(data) {
    setIsSaving(true);
    const payload = {
      id: data.id || Date.now(),
      subject_code: data.subject_code,
      subject_title: data.subject_title,
      added_by:
        user && user.biodata
          ? `${user.biodata.title} ${user.biodata.staff_name}`
          : "",
      modified_by: "",
      modified_on: new Date().toISOString(),
    };

    // Get current subjects from Redux
    const currentSubjects =
      typeof window !== "undefined" && window.store
        ? window.store.getState().academics.subjects
        : [];
    // Fallback: try to get from useSelector if available
    // (in function body, can't useSelector directly)

    // Add or update subject in the list
    let updatedSubjects;
    if (data.id) {
      // Edit mode: replace existing
      updatedSubjects = currentSubjects.map((subj) =>
        subj.id === data.id ? payload : subj
      );
    } else {
      // Add mode: append
      updatedSubjects = [...currentSubjects, payload];
    }

    // Simulate API delay
    setTimeout(() => {
      dispatch(updateSubjects(updatedSubjects));
      setIsSaving(false);
      reset(defaultValues);
      dispatch(resetSubjectFormState());
      dispatch(
        showMessage({
          message: "Subject Saved Successfully",
          variant: "info",
        })
      );
    }, 500);
  }

  return (
    <div className="p-16">
      <Box
        className="p-8 w-full rounded-16 border"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.001)
              : lighten(theme.palette.background.default, 0.02),
          marginRight: 10,
          overflow: "auto",
        }}
      >
        <Divider
          textAlign="left"
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Typography className="font-medium text-20 bold">
            {"Add Subject"}
          </Typography>
        </Divider>

        <div className="max-w-full relative">
          <Box
            sx={{
              "& .MuiTextField-root": { m: 0, width: "100%" },
            }}
            autoComplete="off"
            className={"max-w-full"}
            style={{
              padding: 15,
            }}
          >
            <form
              name="subjectForm"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="subject_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Subject Code"
                    id="outlined-size-small"
                    error={!!errors.subject_code}
                    helperText={errors.subject_code?.message}
                    style={{
                      paddingBottom: 15,
                    }}
                    required
                    size="small"
                  />
                )}
              />
              <Controller
                name="subject_title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Subject Title"
                    id="outlined-size-small"
                    error={!!errors.subject_title}
                    helperText={errors.subject_title?.message}
                    style={{
                      paddingBottom: 15,
                    }}
                    required
                    size="small"
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
                  {isSaving ? (
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

      <Box
        className="p-8 w-full rounded-16 border"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.001)
              : lighten(theme.palette.background.default, 0.02),
          marginRight: 10,
          overflow: "auto",
          marginTop: 3,
        }}
      >
        <Divider
          textAlign="left"
          style={{
            marginTop: 10,
          }}
        >
          <Typography className="font-medium text-20 bold">{"Logs"}</Typography>
        </Divider>
        <div className="max-w-full relative">
          <Box
            sx={{
              "& .MuiTextField-root": { m: 0, width: "100%" },
            }}
            autoComplete="off"
            className={"max-w-full"}
            style={{
              padding: 15,
            }}
          >
            <Controller
              name="added_by"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Added By"
                  id="outlined-size-small"
                  error={!!errors.added_by}
                  style={{
                    paddingBottom: 15,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  size="small"
                />
              )}
            />

            <Controller
              name="modified_by"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Modified By"
                  id="outlined-size-small"
                  error={!!errors.modified_by}
                  style={{
                    paddingBottom: 15,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  size="small"
                />
              )}
            />

            <Controller
              name="modified_on"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Modified On"
                  id="outlined-size-small"
                  error={!!errors.modified_on}
                  style={{
                    paddingBottom: 15,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                  size="small"
                />
              )}
            />
          </Box>
        </div>
      </Box>
    </div>
  );
}

export default SubjectForm;
