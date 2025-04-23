import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Paper from "@mui/material/Paper";
import { motion } from "framer-motion";
import { lighten, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import _ from "lodash";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import Grid from "@mui/material/Grid";
import { CircularProgress } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { SAVE_ADMISSION_LEVEL } from "../../../graphql/mutations";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectAdmissionLevel,
  selectProgramLevels,
  selectScheme,
  setProgrammeLevels,
  setScheme,
} from "../../../admissionsSlice";
import AdmissionLevelsTable from "./AdmissionLevelsTable";
import { GET_LEVELS } from "app/theme-layouts/layout3/modules/setup/gql/queries";
// import { selectWidgets } from "../../../store/widgetsSlice";

const schema = yup.object().shape({
  admission_level_title: yup
    .string()
    .required("You must enter the scheme title"),
  prog_levels: yup
    .array()
    .min(1, "Select at least one programme level")
    .required("Campuses are required."),
  admission_level_description: yup.string(),
});

const prog_levels = [
  { label: "BACHELORS", id: 1 },
  { label: "DIPLOMA", id: 2 },
];

const defaultValues = {
  id: null,
  admission_level_title: "",
  prog_levels: [],
  admission_level_description: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

function AdmissionLevels(props) {
  // const widgets = useSelector(selectWidgets);
  const user = useSelector((state) => state.user.user);

  const selected_admission_level = useSelector(selectAdmissionLevel);
  const program_levels = useSelector(selectProgramLevels);
  const dispatch = useDispatch();
  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "all",
      defaultValues,
      resolver: yupResolver(schema),
    });

  const [saveAdmissionLevel, { error, loading, data }] = useMutation(
    SAVE_ADMISSION_LEVEL,
    {
      refetchQueries: ["getAdmissionLevels"],
    }
  );

  const {
    error: getLevelsErr,
    loading: loadingLevels,
    data: levelsData,
  } = useQuery(GET_LEVELS, {
    notifyOnNetworkStatusChange: true,
  });

  if (error) {
    showMessage({
      message: error.message,
      variant: "error",
    });
  }

  if (getLevelsErr) {
    showMessage({
      message: getLevelsErr.message,
      variant: "error",
    });
  }

  useEffect(() => {
    if (levelsData) {
      // console.log("levels", levelsData);
      const arr = levelsData.levels.map((level) => ({
        value: level.id,
        label: level.level_title,
      }));
      dispatch(setProgrammeLevels(arr));
    }
  }, [levelsData]);

  useEffect(() => {
    setValue("id", selected_admission_level.id);
    setValue(
      "admission_level_title",
      selected_admission_level.admission_level_title
    );
    setValue("prog_levels", JSON.parse(selected_admission_level.prog_levels));
    setValue(
      "admission_level_description",
      selected_admission_level.admission_level_description
    );
  }, [selected_admission_level]);

  const { isValid, dirtyFields, errors } = formState;

  const theme = useTheme();

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  async function onSubmit(data) {
    const payload = {
      admissionLevelTitle: data.admission_level_title,
      admissionLevelDescription: data.admission_level_description,
      progLevels: JSON.stringify(data.prog_levels),
      addedBy: user.user_id,
      saveAdmissionLevelId: data.id,
    };
    const res = await saveAdmissionLevel({
      variables: payload,
    });

    // console.log("the data", data);
    // // console.log("the response", res);

    reset(defaultValues);

    dispatch(
      showMessage({
        message: res.data.saveAdmissionLevel.message,
        variant: "info",
      })
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <motion.div variants={item}>
          <Paper
            sx={{
              width: "100%",
              // mb: 2,
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              // backgroundColor: "red",
              minHeight: "calc(100vh - 190px)",
            }}
            className="flex flex-col flex-auto p-16 shadow  overflow-hidden h-full"
          >
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
                    {"Add Admission Level"}
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
                      name="admissionLevelForm"
                      noValidate
                      // className="flex flex-col justify-center w-full mt-32"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <Controller
                        name="admission_level_title"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Title"
                            id="outlined-size-small"
                            error={!!errors.scheme_title}
                            style={{
                              paddingBottom: 15,
                            }}
                            // value={formState.college_code}
                            // onChange={e => setFormState({...formState, college_code: e.target.value})}
                            // defaultValue="Small"
                            required
                            size="small"
                          />
                        )}
                      />

                      <Controller
                        name="prog_levels"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            multiple
                            // disablePortal
                            id="multiple-limit-tags"
                            options={program_levels}
                            getOptionLabel={(option) => option.label}
                            loading={loadingLevels}
                            loadingText="Loading levels..."
                            getOptionSelected={(option, value) =>
                              option.value === value.value
                            }
                            value={field.value || []}
                            onChange={(event, newValue) =>
                              field.onChange(newValue)
                            }
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
                                error={!!errors.prog_levels}
                                label="Prgramme level(s)"
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
                        name="admission_level_description"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            id="outlined-multiline-static"
                            multiline
                            rows={4}
                            // placeholder="Scheme Description"
                            label="Description"
                            error={!!errors.description}
                            style={{
                              paddingBottom: 15,
                            }}
                            // value={formState.college_code}
                            // onChange={e => setFormState({...formState, college_code: e.target.value})}
                            // defaultValue="Small"
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
                          // type="submit"
                          onClick={() => {
                            reset(defaultValues);
                            dispatch(setScheme(defaultValues));
                          }}
                          // disabled={}
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
              </Box>
            </div>
          </Paper>
        </motion.div>
      </Grid>

      <Grid item xs={8}>
        <motion.div variants={item}>
          <AdmissionLevelsTable />
        </motion.div>
      </Grid>
    </Grid>
  );
}

export default memo(AdmissionLevels);
