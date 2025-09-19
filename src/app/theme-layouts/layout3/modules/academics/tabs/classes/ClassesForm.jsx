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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
import { resetClassFormState, updateClasses } from "../../store/academicsSlice";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  class_code: yup.string().required("You must enter the class code"),
  class_title: yup.string().required("You must enter the class title"),
  class_sections: yup.array().min(1, "Select at least one section"),
});

const defaultValues = {
  id: null,
  class_code: "",
  class_title: "",
  class_sections: [],
  added_by: "",
  modified_by: "",
  modified_on: "",
};

function ClassesForm() {
  const user = useSelector((state) => state.user.user);
  const selectedClass = useSelector((state) => state.academics.selectedClass);
  const [isSaving, setIsSaving] = useState(false);

  const { control, formState, handleSubmit, reset, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    if (selectedClass) {
      setValue("id", selectedClass.id);
      setValue("class_code", selectedClass.class_code || "");
      setValue("class_title", selectedClass.class_title || "");
      setValue("class_sections", selectedClass.class_sections || []);
      setValue(
        "added_by",
        selectedClass.added_user
          ? `${selectedClass.added_user.title} ${selectedClass.added_user.staff_name}`
          : user && user.biodata
            ? `${user.biodata.title} ${user.biodata.staff_name}`
            : ""
      );
      setValue(
        "modified_by",
        selectedClass.modified_user
          ? `${selectedClass.modified_user.title} ${selectedClass.modified_user.staff_name}`
          : ""
      );
      setValue(
        "modified_on",
        selectedClass.modified_on
          ? convertTimestampToDate(selectedClass.modified_on)
          : ""
      );
    }
  }, [selectedClass, setValue, user]);

  async function onSubmit(data) {
    setIsSaving(true);
    const payload = {
      id: data.id || Date.now(),
      class_code: data.class_code,
      class_title: data.class_title,
      class_sections: data.class_sections || [],
      added_by:
        user && user.biodata
          ? `${user.biodata.title} ${user.biodata.staff_name}`
          : "",
      modified_by: "",
      modified_on: new Date().toISOString(),
    };

    // Get current classes from Redux
    const currentClasses =
      typeof window !== "undefined" && window.store
        ? window.store.getState().academics.classes
        : [];

    // Add or update class in the list
    let updatedClasses;
    if (data.id) {
      // Edit mode: replace existing
      updatedClasses = currentClasses.map((cls) =>
        cls.id === data.id ? payload : cls
      );
    } else {
      // Add mode: append
      updatedClasses = [...currentClasses, payload];
    }

    // Simulate API delay
    setTimeout(() => {
      dispatch(updateClasses(updatedClasses));
      setIsSaving(false);
      reset(defaultValues);
      dispatch(resetClassFormState());
      dispatch(
        showMessage({
          message: "Class Saved Successfully",
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
            {"Add Section"}
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
            <form name="classForm" noValidate onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="class_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Class Code"
                    id="outlined-size-small"
                    error={!!errors.class_code}
                    helperText={errors.class_code?.message}
                    style={{
                      paddingBottom: 15,
                    }}
                    required
                    size="small"
                  />
                )}
              />
              <Controller
                name="class_sections"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    style={{ paddingBottom: 15 }}
                    error={!!errors.class_sections}
                    required
                  >
                    <InputLabel>Class Sections</InputLabel>
                    <Select
                      {...field}
                      multiple
                      label="Class Sections"
                      value={field.value || []}
                      onChange={(event) => field.onChange(event.target.value)}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {["East", "West", "North"].map((section) => (
                        <MenuItem key={section} value={section}>
                          {section}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.class_sections && (
                      <Typography color="error" variant="caption">
                        {errors.class_sections.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="class_title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Class Title"
                    id="outlined-size-small"
                    error={!!errors.class_title}
                    helperText={errors.class_title?.message}
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

export default ClassesForm;
