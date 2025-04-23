import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Paper from "@mui/material/Paper";
import { motion } from "framer-motion";
import { lighten, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import _ from "lodash";
import Box from "@mui/material/Box";

import * as yup from "yup";

import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import Grid from "@mui/material/Grid";
import SchemesTable from "./SchemesTable";
import {
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { SAVE_SCHEME } from "../../../graphql/mutations";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { selectScheme, setScheme } from "../../../admissionsSlice";
// import { selectWidgets } from "../../../store/widgetsSlice";

const schema = yup.object().shape({
  scheme_title: yup.string().required("You must enter the scheme title"),
  description: yup.string(),
  isActive: yup.boolean(),
});

const defaultValues = {
  id: null,
  scheme_title: "",
  description: "",
  isActive: false,
  added_by: "",
  modified_by: "",
  modified_on: "",
};

function Schemes(props) {
  // const widgets = useSelector(selectWidgets);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const selectedScheme = useSelector(selectScheme);
  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "all",
      defaultValues,
      resolver: yupResolver(schema),
    });

  const [saveScheme, { error, loading, data }] = useMutation(SAVE_SCHEME, {
    refetchQueries: ["getSchemes"],
  });

  if (error) {
    showMessage({
      message: error.message,
      variant: "error",
    });
  }

  useEffect(() => {
    setValue("id", selectedScheme.id);
    setValue("scheme_title", selectedScheme.scheme_title);
    setValue("description", selectedScheme.description);
    setValue("isActive", Boolean(selectedScheme.is_active));
  }, [selectedScheme]);

  const { isValid, dirtyFields, errors } = formState;

  const theme = useTheme();

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  async function onSubmit(data) {
    const payload = {
      schemeTitle: data.scheme_title,
      description: data.description,
      isActive: Number(data.isActive),
      addedBy: user.user_id,
      saveSchemeId: data.id,
    };
    const res = await saveScheme({
      variables: payload,
    });

    // console.log("the data", payload);
    // console.log("the response", res);

    reset(defaultValues);

    dispatch(
      showMessage({
        message: res.data.saveScheme.message,
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
                    {"Add Scheme"}
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
                      name="schemeForm"
                      noValidate
                      // className="flex flex-col justify-center w-full mt-32"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <Controller
                        name="scheme_title"
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
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            id="outlined-multiline-static"
                            multiline
                            rows={4}
                            // placeholder="Scheme Description"
                            label="Scheme Description"
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

                      <Controller
                        name="isActive"
                        control={control}
                        render={({
                          field: { onChange, value, onBlur, ref },
                        }) => (
                          <FormControlLabel
                            value="end"
                            control={
                              <Checkbox
                                checked={value}
                                onBlur={onBlur}
                                onChange={(ev) => onChange(ev.target.checked)}
                                inputRef={ref}
                                required
                              />
                            }
                            className="font-medium text-20 bold"
                            style={{
                              fontSize: 15,
                            }}
                            label="Is Active?"
                            labelPlacement="end"
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
          <SchemesTable />
        </motion.div>
      </Grid>
    </Grid>
  );
}

export default memo(Schemes);
