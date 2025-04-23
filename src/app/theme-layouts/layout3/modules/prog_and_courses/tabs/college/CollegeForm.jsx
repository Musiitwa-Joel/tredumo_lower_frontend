import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import _ from "lodash";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import * as yup from "yup";
import clsx from "clsx";
import { darken } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useMutation } from "@apollo/client";
import { SAVE_COLLEGE } from "../../gql/mutations";
import { useDispatch, useSelector } from "react-redux";
import { updateCollege, updateColleges } from "../../store/collegeSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  college_code: yup.string().required("You must enter the college code"),
  college_title: yup.string().required("Please enter the college title."),
});

const defaultValues = {
  id: null,
  college_code: "",
  college_title: "",
};

function CollegeForm() {
  const { college } = useSelector((state) => state.college);

  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });
  const dispatch = useDispatch();

  const [saveCollege, { loading, data, error }] = useMutation(SAVE_COLLEGE, {
    refetchQueries: ["Colleges"],
  });

  if (error) {
    dispatch(
      showMessage({
        message: "Failed to save college", //text or html
        variant: "error", //success error info warning null
      })
    );
  }

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit({ id, college_code, college_title }) {
    const res = await saveCollege({
      variables: {
        collegeCode: college_code,
        collegeTitle: college_title,
        saveCollegeId: id,
      },
    });

    // console.log("the data", data);
    // console.log("the response", res);

    dispatch(updateColleges(res.data.saveCollege));

    reset(defaultValues);
    dispatch(updateCollege(defaultValues));

    dispatch(
      showMessage({
        message: "Saved Succesfully",
        variant: "info",
      })
    );
  }

  useEffect(() => {
    setValue("id", college.id);
    setValue("college_code", college.college_code);
    setValue("college_title", college.college_title);
  }, [college]);

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
            Add College
          </Typography>
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
              name="collegeForm"
              noValidate
              // className="flex flex-col justify-center w-full mt-32"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="college_code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="College Code"
                    id="outlined-size-small"
                    error={!!errors.college_code}
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
                name="college_title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="College title"
                    id="outlined-size-small"
                    error={!!errors.college_title}
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
      </Card>
    </div>
  );
}

export default CollegeForm;
