import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import * as yup from "yup";
import clsx from "clsx";
import { darken } from "@mui/material/styles";
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
import Select from "@mui/material/Select";
import { MenuItem, FormControl, InputLabel } from "@mui/material";
// import { updateCollege, updateColleges } from "../../store/collegeSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import Add from "@mui/icons-material/Add";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
import { SAVE_AWARD } from "../../gql/mutations";
import { resetAwardFormState, updateLevels } from "../../store/setUpSlice";
import { GET_LEVELS } from "../../gql/queries";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  level_id: yup.string().required("You must enter the level"),
  award_title: yup.string().required("You must enter the award"),
});

const defaultValues = {
  id: null,
  level_id: "",
  award_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

function AwardForm() {
  const user = useSelector((state) => state.user.user);
  const selectedAward = useSelector((state) => state.setUp.selectedAward);

  const levels = useSelector((state) => state.setUp.levels);

  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });
  const dispatch = useDispatch();

  const {
    error: fetchLevelsError,
    loading: loadingLevels,
    data: levelsResponse,
  } = useQuery(GET_LEVELS, {
    notifyOnNetworkStatusChange: true,
  });

  const [saveAward, { loading, data, error }] = useMutation(SAVE_AWARD, {
    refetchQueries: ["getAwards"],
  });

  if (error) {
    dispatch(
      showMessage({
        message: "Failed to save award " + error.message, //text or html
        variant: "error", //success error info warning null
      })
    );
  }

  if (fetchLevelsError) {
    dispatch(
      showMessage({
        message: "Failed to load levels " + fetchLevelsError.message, //text or html
        variant: "error", //success error info warning null
      })
    );
  }
  console.log("selected award ", selectedAward);

  useEffect(() => {
    setValue("id", selectedAward.id);
    setValue("level_id", selectedAward.level_id);
    setValue("award_title", selectedAward.award_title);
    setValue(
      "added_by",
      selectedAward.added_user
        ? `${selectedAward.added_user.title} ${selectedAward.added_user.staff_name}`
        : `${user.biodata.title} ${user.biodata.staff_name}`
    );
    setValue(
      "modified_by",
      selectedAward.modified_user
        ? `${selectedAward.modified_user.title} ${selectedAward.modified_user.staff_name}`
        : ""
    );
    setValue(
      "modified_on",
      selectedAward.modified_on
        ? convertTimestampToDate(selectedAward.modified_on)
        : ""
    );
  }, [selectedAward]);

  useEffect(() => {
    if (levelsResponse) {
      // console.log("data", data);
      dispatch(updateLevels(levelsResponse.levels));
    }
  }, [levelsResponse]);

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit(data) {
    const res = await saveAward({
      variables: {
        addedBy: user.user_id,
        levelId: data.level_id,
        awardTitle: data.award_title,
        saveAwardId: data.id,
      },
    });

    // console.log("the data", data);
    // console.log("the response", res);

    reset(defaultValues);
    dispatch(resetAwardFormState());

    dispatch(
      showMessage({
        message: "Campus Saved Succesfully",
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
            {"Add Award"}
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
              name="campusForm"
              noValidate
              // className="flex flex-col justify-center w-full mt-32"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="level_id"
                control={control}
                render={({ field }) => (
                  <FormControl
                    {...field}
                    fullWidth
                    size="small"
                    error={!!errors.level_id}
                    style={{
                      paddingBottom: 15,
                    }}
                    required
                  >
                    <InputLabel>Level</InputLabel>
                    <Select
                      className="uppercase"
                      size="small"
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value ? event.target.value : null
                        )
                      }
                      label="Level"
                      // onChange={handleChange}
                    >
                      {levels.map((level) => (
                        <MenuItem key={level.id} value={level.id}>
                          {level.level_title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="award_title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Award Title"
                    id="outlined-size-small"
                    error={!!errors.award_title}
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

export default AwardForm;
