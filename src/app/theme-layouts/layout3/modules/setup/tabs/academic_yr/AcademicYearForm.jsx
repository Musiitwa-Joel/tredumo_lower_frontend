import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import * as yup from "yup";
import _ from "lodash";
import TextField from "@mui/material/TextField";
import { lighten } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useMutation } from "@apollo/client";
// import { SAVE_COLLEGE } from "../../gql/mutations";
import { useDispatch, useSelector } from "react-redux";
import Add from "@mui/icons-material/Add";
import { SAVE_ACC_YR } from "../../gql/mutations";
import { resetAccYrFormState } from "../../store/setUpSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  acc_yr_title: yup.string().required("You must enter the accademic year"),
});

const defaultValues = {
  id: null,
  acc_yr_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

function AcademicYearForm() {
  const user = useSelector((state) => state.user.user);
  const selectedAccYr = useSelector((state) => state.setUp.selectedAccYr);

  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });
  const dispatch = useDispatch();

  const [saveAccYr, { loading, data, error }] = useMutation(SAVE_ACC_YR, {
    refetchQueries: ["getAccYrs"],
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
    setValue("id", selectedAccYr.id);
    setValue("acc_yr_title", selectedAccYr.acc_yr_title);
    setValue(
      "added_by",
      selectedAccYr.added_user
        ? `${selectedAccYr.added_user.title} ${selectedAccYr.added_user.staff_name}`
        : `${user.biodata.title} ${user.biodata.staff_name}`
    );
    setValue(
      "modified_by",
      selectedAccYr.modified_user
        ? `${selectedAccYr.modified_user.title} ${selectedAccYr.modified_user.staff_name}`
        : ""
    );
    setValue(
      "modified_on",
      selectedAccYr.modified_on
        ? convertTimestampToDate(selectedAccYr.modified_on)
        : ""
    );
  }, [selectedAccYr]);

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit(data) {
    const res = await saveAccYr({
      variables: {
        accYrTitle: data.acc_yr_title,
        addedBy: user.user_id,
        saveAccYrId: data.id,
      },
    });

    // console.log("the data", data);
    // console.log("the response", res);

    reset(defaultValues);
    dispatch(resetAccYrFormState());

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
            {"Add Academic Year"}
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
                name="acc_yr_title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Academic Year"
                    id="outlined-size-small"
                    error={!!errors.acc_yr_title}
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

export default AcademicYearForm;
