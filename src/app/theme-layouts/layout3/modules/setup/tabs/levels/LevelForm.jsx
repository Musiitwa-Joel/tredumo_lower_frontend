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
import { useMutation, useQuery } from "@apollo/client";
// import { SAVE_COLLEGE } from "../../gql/mutations";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
import { SAVE_LEVEL } from "../../gql/mutations";
import { resetLevelFormState } from "../../store/setUpSlice";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { GET_STUDY_TIMES } from "../../gql/queries";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  level_code: yup.string().required("You must enter the level code"),
  level_title: yup.string().required("You must enter the level title"),
  level_study_times: yup.array().required("You must enter the level title"),
});

const defaultValues = {
  id: null,
  level_code: "",
  level_title: "",
  level_study_times: [],
  added_by: "",
  modified_by: "",
  modified_on: "",
};

function LevelForm() {
  const user = useSelector((state) => state.user.user);
  const selectedLevel = useSelector((state) => state.setUp.selectedLevel);
  const [studyTimes, setStudyTimes] = useState([]);

  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });
  const dispatch = useDispatch();

  const {
    loading: loadingStudyTimes,
    error: loadErr,
    data: loadRes,
  } = useQuery(GET_STUDY_TIMES);

  if (loadErr) {
    dispatch(
      showMessage({
        message: loadErr.message,
        variant: "error",
      })
    );
  }

  useEffect(() => {
    if (loadRes) {
      // console.log("response", loadRes.study_times);
      setStudyTimes(loadRes.study_times);
    }
  }, [loadRes]);

  const [saveLevel, { loading, data, error }] = useMutation(SAVE_LEVEL, {
    refetchQueries: ["getLevels"],
  });

  if (error) {
    dispatch(
      showMessage({
        message: "Failed to save campus " + error.message, //text or html
        variant: "error", //success error info warning null
      })
    );
  }
  // console.log("user ", user);

  useEffect(() => {
    if (selectedLevel) {
      setValue("id", selectedLevel.id);
      setValue("level_code", selectedLevel.level_code);
      setValue("level_title", selectedLevel.level_title);
      setValue(
        "level_study_times",
        selectedLevel.study_times.map((st) => st.id)
      );
      setValue(
        "added_by",
        selectedLevel.added_user
          ? `${selectedLevel.added_user.title} ${selectedLevel.added_user.staff_name}`
          : `${user.biodata.title} ${user.biodata.staff_name}`
      );
      setValue(
        "modified_by",
        selectedLevel.modified_user
          ? `${selectedLevel.modified_user.title} ${selectedLevel.modified_user.staff_name}`
          : ""
      );
      setValue(
        "modified_on",
        selectedLevel.modified_on
          ? convertTimestampToDate(selectedLevel.modified_on)
          : ""
      );
    }
  }, [selectedLevel]);

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit(data) {
    // console.log(data);
    const payload = {
      levelCode: data.level_code,
      saveLevelId: data.id,
      levelTitle: data.level_title,
      levelStudyTimes: data.level_study_times,
      addedBy: user.user_id,
    };
    const res = await saveLevel({
      variables: payload,
    });

    // console.log("the data", data);
    // console.log("the response", res);

    reset(defaultValues);
    dispatch(resetLevelFormState());

    dispatch(
      showMessage({
        message: "Level Saved Succesfully",
        variant: "info",
      })
    );
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
            {"Add Level"}
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
              name="levelForm"
              noValidate
              // className="flex flex-col justify-center w-full mt-32"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="level_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Level Code"
                    id="outlined-size-small"
                    error={!!errors.level_code}
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
                name="level_title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Level Title"
                    id="outlined-size-small"
                    error={!!errors.level_title}
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
                name="level_study_times"
                control={control}
                render={({ field }) => (
                  <FormControl
                    {...field}
                    fullWidth
                    size="small"
                    error={!!errors.level_study_times}
                    style={{
                      paddingBottom: 15,
                    }}
                    required
                  >
                    <InputLabel>Level Study Times</InputLabel>
                    <Select
                      className="uppercase"
                      multiple
                      size="small"
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value ? event.target.value : null
                        )
                      }
                      label="Level Study Times"
                      // onChange={handleChange}
                    >
                      {studyTimes.map((st) => (
                        <MenuItem key={st.id} value={st.id}>
                          {st.study_time_title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
          {" "}
          <Typography className="font-medium text-20 bold">{"Logs"}</Typography>
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
                  // value={formState.college_code}
                  // onChange={e => setFormState({...formState, college_code: e.target.value})}
                  // defaultValue="Small"
                  // required
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
                  // value={formState.college_code}
                  // onChange={e => setFormState({...formState, college_code: e.target.value})}
                  // defaultValue="Small"
                  // required
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
                  // value={formState.college_code}
                  // onChange={e => setFormState({...formState, college_code: e.target.value})}
                  // defaultValue="Small"
                  // required
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

export default LevelForm;
