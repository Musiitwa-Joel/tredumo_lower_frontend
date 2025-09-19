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
  resetSectionFormState,
  updateSections,
} from "../../store/academicsSlice";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  section_name: yup.string().required("You must enter the section name"),
});

const defaultValues = {
  id: null,
  section_name: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

function SectionsForm() {
  const user = useSelector((state) => state.user.user);
  const selectedSection = useSelector(
    (state) => state.academics.selectedSection
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
    if (selectedSection) {
      setValue("id", selectedSection.id);
      setValue("section_name", selectedSection.section_name);
      setValue(
        "added_by",
        selectedSection.added_user
          ? `${selectedSection.added_user.title} ${selectedSection.added_user.staff_name}`
          : user && user.biodata
            ? `${user.biodata.title} ${user.biodata.staff_name}`
            : ""
      );
      setValue(
        "modified_by",
        selectedSection.modified_user
          ? `${selectedSection.modified_user.title} ${selectedSection.modified_user.staff_name}`
          : ""
      );
      setValue(
        "modified_on",
        selectedSection.modified_on
          ? convertTimestampToDate(selectedSection.modified_on)
          : ""
      );
    }
  }, [selectedSection, setValue, user]);

  async function onSubmit(data) {
    setIsSaving(true);
    const payload = {
      id: data.id || Date.now(),
      section_name: data.section_name,
      added_by:
        user && user.biodata
          ? `${user.biodata.title} ${user.biodata.staff_name}`
          : "",
      modified_by: "",
      modified_on: new Date().toISOString(),
    };

    // Get current sections from Redux
    const currentSections =
      typeof window !== "undefined" && window.store
        ? window.store.getState().academics.sections
        : [];

    // Add or update section in the list
    let updatedSections;
    if (data.id) {
      // Edit mode: replace existing
      updatedSections = currentSections.map((section) =>
        section.id === data.id ? payload : section
      );
    } else {
      // Add mode: append
      updatedSections = [...currentSections, payload];
    }

    // Simulate API delay
    setTimeout(() => {
      dispatch(updateSections(updatedSections));
      setIsSaving(false);
      reset(defaultValues);
      dispatch(resetSectionFormState());
      dispatch(
        showMessage({
          message: "Section Saved Successfully",
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
            <form
              name="sectionForm"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="section_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Section Name"
                    id="outlined-size-small"
                    error={!!errors.section_name}
                    helperText={errors.section_name?.message}
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

export default SectionsForm;
