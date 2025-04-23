import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { darken, lighten, useTheme } from "@mui/material/styles";
import * as yup from "yup";
import clsx from "clsx";
import _ from "lodash";
import Draggable from "react-draggable";
import { yupResolver } from "@hookform/resolvers/yup";
import { Backdrop, CircularProgress } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import MUIRichTextEditor from "mui-rte";
import MenuItem from "@mui/material/MenuItem";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { useDispatch, useSelector } from "react-redux";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  selectAdmissionSetUpReqs,
  selectRunningAdmission,
  selectStartAdmissionsModalVisible,
  setAdmissionSetUpReqs,
  setStartAdmissionsModalVisible,
} from "../../../admissionsSlice";
import Close from "@mui/icons-material/Close";
import { Tooltip, TextField, FormControlLabel } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { useMutation, useQuery } from "@apollo/client";
import { LOAD_ADMISSION_SETUP_REQUIREMENTS } from "../../../graphql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { SAVE_RUNNING_ADMISSION } from "../../../graphql/mutations";

const intakes = [
  { id: "1", label: "AUGUST" },
  { id: "2", label: "FEB" },
  { id: "3", label: "MAY" },
];

const schemes = [
  { id: "1", label: "CERTIFICATE" },
  { id: "2", label: "DIRECT ENTRY" },
  { id: "3", label: "DIPLOAMA" },
];

const admissionLevels = [
  { id: "1", label: "UNDERGRADUATE" },
  { id: "2", label: "POSTGRADUATE" },
  { id: "3", label: "PHD" },
];

const acc_yrs = [
  { id: "1", label: "2024/2025" },
  { id: "2", label: "2023/2024" },
  { id: "3", label: "2022/2023" },
];

const forms = [{ id: "1", label: "default_form" }];

const defaultValues = {
  id: null,
  intake_id: "",
  scheme_id: "",
  admission_level_id: "",
  acc_yr: "",
  start_date: "",
  end_date: "",
  no_of_choices: 1,
  max_no_of_forms: 1,
  form_id: "1",
  description: "",
  national_application_fees: "",
  east_african_application_fees: "",
  international_application_fees: "",
  active_admission_fees: false,
  _national_admission_fees: "",
  east_african_admission_fees: "",
  international_admission_fees: "",
  instructions: "",
};

const schema = yup.object().shape({
  intake_id: yup.string().required("You must enter the intake"),
  scheme_id: yup.string().required("Scheme is required"),
  admission_level_id: yup.string().required("Admission Level is required"),
  acc_yr: yup.string().required("Accademic year is required"),
  start_date: yup.string().required("Start Date is required"),
  end_date: yup.string().required("End date is required"),
  no_of_choices: yup.number().required("No of Choices is required"),
  max_no_of_forms: yup.number().required("Maximum number of forms is required"),
  form_id: yup.string().required("Form is required"),
  national_application_fees: yup
    .string()
    .required("National Application fees is required"),
  east_african_application_fees: yup
    .string()
    .required("East African Application fees is required"),
  international_application_fees: yup
    .string()
    .required("International Application fees is required"),
  active_admission_fees: yup.boolean(),
  //   _national_admission_fees: yup.number(),
  //   east_african_admission_fees: yup.number(),
  //   international_admission_fees: yup.number(),
  instructions: yup.string(),
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function StartAdmissionsModal() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const startAdmissionsModalVisible = useSelector(
    selectStartAdmissionsModalVisible
  );
  const admissionSetUpReqs = useSelector(selectAdmissionSetUpReqs);
  const user = useSelector((state) => state.user.user);
  const [activeStep, setActiveStep] = React.useState(0);
  const selectedAdmission = useSelector(selectRunningAdmission);
  const handleSubmitRef = React.useRef();
  const {
    error,
    loading: loadingRequirements,
    data,
  } = useQuery(LOAD_ADMISSION_SETUP_REQUIREMENTS);

  const [
    saveRunningAdmission,
    { error: saveError, loading: savingAdmission, data: saveResponse },
  ] = useMutation(SAVE_RUNNING_ADMISSION, {
    refetchQueries: ["getRunningAdmissions"],
  });

  if (saveError) {
    console.log("save error", saveError);
    dispatch(
      showMessage({
        message: saveError.message,
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

  if (data) {
    // console.log("data...", data);
    dispatch(setAdmissionSetUpReqs(data));
  }

  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    // id: null,
    // intake_id: "",
    // scheme_id: "",
    // admission_level_id: "",
    // acc_yr: "",
    // start_date: "",
    // end_date: "",
    // no_of_choices: 1,
    // max_no_of_forms: 1,
    // form_id: "1",
    // description: "",
    // national_application_fees: "",
    // east_african_application_fees: "",
    // international_application_fees: "",
    // active_admission_fees: false,
    // _national_admission_fees: "",
    // east_african_admission_fees: "",
    // international_admission_fees: "",
    // instructions: "",
    if (selectedAdmission) {
      setValue("id", selectedAdmission.id);
      setValue("intake_id", selectedAdmission.intake.id);
      setValue("scheme_id", selectedAdmission.scheme.id);
      setValue("admission_level_id", selectedAdmission.admission_level.id);
      setValue("acc_yr", selectedAdmission.acc_yr.id);
      setValue("start_date", new Date(parseInt(selectedAdmission.start_date)));
      setValue("end_date", new Date(parseInt(selectedAdmission.end_date)));
      setValue("no_of_choices", selectedAdmission.no_of_choices);
      setValue("max_no_of_forms", selectedAdmission.max_no_of_forms);
      setValue("form_id", selectedAdmission.form_template_id);
      setValue("description", selectedAdmission.description);
      setValue(
        "national_application_fees",
        selectedAdmission.national_application_fees
      );
      setValue(
        "east_african_application_fees",
        selectedAdmission.east_african_application_fees
      );
      setValue(
        "international_application_fees",
        selectedAdmission.international_application_fees
      );

      setValue(
        "active_admission_fees",
        selectedAdmission.active_admission_fees
      );
      setValue(
        "_national_admission_fees",
        selectedAdmission.national_admission_fees
      );
      setValue(
        "east_african_admission_fees",
        selectedAdmission.east_african_admission_fees
      );
      setValue(
        "international_admission_fees",
        selectedAdmission.international_admission_fees
      );
      setValue("instructions", selectedAdmission.instructions);
    } else {
      reset(defaultValues);
    }
  }, [selectedAdmission]);

  const steps = [
    {
      label: (
        <Typography className="text-16 bold">{"General settings"}</Typography>
      ),
      description: (
        <Grid container rowSpacing={1} spacing={1}>
          <Grid
            xs={6}
            sx={{
              position: "relative",
            }}
          >
            <div>
              <Controller
                name="intake_id"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.intake_id}
                    style={{
                      paddingBottom: 15,
                    }}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Intake
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...field}
                      //   value={intake}
                      label="Intake"
                      //   onChange={handleChangeIntake}
                    >
                      {admissionSetUpReqs &&
                        admissionSetUpReqs.intakes.map((intake) => (
                          <MenuItem value={intake.id}>
                            {intake.intake_title}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>

            <div>
              <Controller
                name="admission_level_id"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.admission_level_id}
                    style={{
                      paddingBottom: 15,
                    }}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Admission Level
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...field}
                      //   value={intake}
                      label="Admission Level"
                      //   onChange={handleChangeIntake}
                    >
                      {admissionSetUpReqs &&
                        admissionSetUpReqs.admission_levels.map((level) => (
                          <MenuItem value={level.id}>
                            {level.admission_level_title}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>

            <div>
              <Controller
                name="start_date"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    value={new Date(value)}
                    onChange={onChange}
                    slotProps={{
                      textField: {
                        id: "start_date",
                        label: "Start Date",
                        InputLabelProps: {
                          shrink: true,
                        },
                        fullWidth: true,
                        variant: "outlined",
                        error: !!errors.start_date,
                        size: "small",
                        style: {
                          paddingBottom: 15,
                        },
                      },
                    }}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="no_of_choices"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="No. Of Choices"
                    id="outlined-size-small"
                    fullWidth
                    error={!!errors.no_of_choices}
                    style={{
                      paddingBottom: 15,
                    }}
                    required
                    size="small"
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="form_id"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.form_id}
                    style={{
                      paddingBottom: 15,
                    }}
                  >
                    <InputLabel id="demo-simple-select-label">Form</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      //   value={intake}
                      label="Form"
                      {...field}
                      //   onChange={handleChangeIntake}
                    >
                      {forms.map((form) => (
                        <MenuItem value={form.id}>{form.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </Grid>

          <Grid
            xs={6}
            sx={{
              position: "relative",
            }}
          >
            <div>
              <Controller
                name="scheme_id"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.scheme_id}
                    style={{
                      paddingBottom: 15,
                    }}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Scheme
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...field}
                      //   value={intake}
                      label="Scheme"
                      //   onChange={handleChangeIntake}
                    >
                      {admissionSetUpReqs &&
                        admissionSetUpReqs.schemes.map((scheme) => (
                          <MenuItem value={scheme.id}>
                            {scheme.scheme_title}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>

            <div>
              <Controller
                name="acc_yr"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.acc_yr}
                    style={{
                      paddingBottom: 15,
                    }}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Academic Year
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...field}
                      //   value={intake}
                      label="Academic Year"
                      //   onChange={handleChangeIntake}
                    >
                      {admissionSetUpReqs &&
                        admissionSetUpReqs.acc_yrs.map((acc_yr) => (
                          <MenuItem value={acc_yr.id}>
                            {acc_yr.acc_yr_title}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>

            <div>
              <Controller
                name="end_date"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    value={new Date(value)}
                    onChange={onChange}
                    slotProps={{
                      textField: {
                        id: "end_date",
                        label: "End Date",
                        InputLabelProps: {
                          shrink: true,
                        },
                        fullWidth: true,
                        variant: "outlined",
                        error: !!errors.end_date,
                        size: "small",
                        style: {
                          paddingBottom: 15,
                        },
                      },
                    }}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="max_no_of_forms"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Max. No of Forms"
                    id="outlined-size-small"
                    fullWidth
                    error={!!errors.max_no_of_forms}
                    style={{
                      paddingBottom: 15,
                    }}
                    required
                    size="small"
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    id="outlined-multiline-static"
                    {...field}
                    multiline
                    rows={5}
                    label="Description"
                    error={!!errors.description}
                    style={{
                      paddingBottom: 15,
                      width: "100%",
                    }}
                    required
                    size="small"
                  />
                )}
              />
            </div>
          </Grid>
        </Grid>
      ),
    },
    {
      label: (
        <Typography className="text-16 bold">{"Application Fees"}</Typography>
      ),
      description: (
        <Grid container rowSpacing={1} spacing={1}>
          <Grid
            xs={6}
            sx={{
              position: "relative",
            }}
          >
            <Controller
              name="national_application_fees"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="National Application Fees"
                  id="outlined-size-small"
                  fullWidth
                  error={!!errors.national_application_fees}
                  style={{
                    paddingBottom: 15,
                    //   width: 400,
                  }}
                  type="number"
                  required
                  size="small"
                />
              )}
            />

            <Controller
              name="east_african_application_fees"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="East African Application Fees"
                  id="outlined-size-small"
                  fullWidth
                  error={!!errors.east_african_application_fees}
                  style={{
                    paddingBottom: 15,
                    //   width: 400,
                  }}
                  type="number"
                  required
                  size="small"
                />
              )}
            />

            <Controller
              name="international_application_fees"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="International Application Fees"
                  id="outlined-size-small"
                  error={!!errors.international_application_fees}
                  style={{
                    paddingBottom: 15,
                    //   width: 400,
                  }}
                  type="number"
                  required
                  size="small"
                />
              )}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      label: (
        <Typography className="text-16 bold">{"Admission Fees"}</Typography>
      ),
      description: (
        <>
          <div>
            <Controller
              name="active_admission_fees"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  {...field}
                  value="end"
                  control={<Checkbox {...field} />}
                  className="font-medium text-20 bold"
                  style={{
                    fontSize: 15,
                    paddingBottom: 15,
                  }}
                  label="Activate Admission Fees"
                  labelPlacement="start"
                />
              )}
            />
          </div>
          <Controller
            name="_national_admission_fees"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="National Admission Fees"
                id="outlined-size-small"
                error={!!errors._national_admission_fees}
                style={{
                  paddingBottom: 15,
                }}
                type="number"
                size="small"
              />
            )}
          />

          <Controller
            name="east_african_admission_fees"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="East African Admission Fees"
                id="outlined-size-small"
                error={!!errors.east_african_admission_fees}
                style={{
                  paddingBottom: 15,
                  // width: 400,
                }}
                type="number"
                size="small"
              />
            )}
          />

          <Controller
            name="international_admission_fees"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="International Admission Fees"
                fullWidth
                id="outlined-size-small"
                error={!!errors.international_admission_fees}
                style={{
                  paddingBottom: 15,
                }}
                type="number"
                size="small"
              />
            )}
          />
        </>
      ),
    },
    {
      label: <Typography className="text-16 bold">{"Instructions"}</Typography>,
      description: (
        <>
          <Controller
            name="instructions"
            control={control}
            render={({ field }) => (
              <MUIRichTextEditor
                label="Type Something here..."
                defaultValue={field.value}
                onSave={(data) => {
                  field.onChange(data);
                }}
              />
            )}
          />
        </>
      ),
    },
  ];

  handleSubmitRef.current = handleSubmit(async (data) => {
    const payload = {
      intakeId: data.intake_id,
      schemeId: data.scheme_id,
      admissionLevelId: data.admission_level_id,
      accYrId: data.acc_yr,
      startDate: data.start_date,
      endDate: data.end_date,
      noOfChoices: data.no_of_choices,
      maxNoOfForms: data.max_no_of_forms,
      formTemplateId: data.form_id,
      nationalApplicationFees: data.national_application_fees,
      eastAfricanApplicationFees: data.east_african_application_fees,
      internationalApplicationFees: data.international_application_fees,
      activateAdmissionFees: Number(data.active_admission_fees),
      addedBy: user.user_id,
      description: data.description,
      saveRunningAdmissionId: data.id,
      nationalAdmissionFees: data._national_admission_fees,
      eastAfricanAdmissionFees: data.east_african_admission_fees,
      internationalAdmissionFees: data.international_admission_fees,
    };

    // console.log("payload", payload);

    const res = await saveRunningAdmission({
      variables: payload,
    });

    // // console.log("the data", data);
    // console.log("the response", res);

    reset(defaultValues);
    setActiveStep(0);
    // dispatch(resetAccYrFormState());

    dispatch(setStartAdmissionsModalVisible(false));

    dispatch(
      showMessage({
        message: res.data.saveRunningAdmission.message,
        variant: "info",
      })
    );
  });

  const maxSteps = steps.length;
  const handleNext = () => {
    if (activeStep < maxSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      handleSubmitRef.current();
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  const handleClose = () => {
    // setOpen(false);
    dispatch(setStartAdmissionsModalVisible(false));
  };

  //   console.log("admission SetupReqs", admissionSetUpReqs);
  return (
    <Dialog
      maxWidth="lg"
      open={startAdmissionsModalVisible}
      //   onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
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
          id="draggable-dialog-title"
          style={{
            paddingLeft: 15,
            display: "flex",
            justifyContent: "space-between",
            cursor: "move",
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
            {"Admission Setup"}
          </Typography>

          <Tooltip title="Close">
            <Close
              style={{
                color: "white",
                fontSize: 25,
                cursor: "pointer",
                //  marginRight: 10,
              }}
              onClick={() => {
                // dispatch(updateDepartment(defaultValues));
                handleClose();
              }}
            />
          </Tooltip>
        </Box>
        <div className="max-w-full relative">
          <Box sx={{ flexGrow: 1 }}>
            <Paper
              square
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                height: 40,
                pl: 2,
                bgcolor: "background.default",
              }}
            >
              <Typography>{steps[activeStep].label}</Typography>
            </Paper>
            <form
              name="generalSettingForm"
              noValidate
              onSubmit={handleSubmitRef.current}
            >
              <Backdrop
                sx={{
                  color: "#fff",
                  position: "absolute",
                  left: 0,
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loadingRequirements || savingAdmission}
                // onClick={handleClose}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
              <Box
                sx={{
                  p: 2,
                }}
                style={{
                  // backgroundColor: "red",
                  height: "calc(100vh - 370px)",
                  minHeight: "calc(100vh - 370px)",
                  width: "calc(100vw - 690px)",
                  minWidth: "760px",
                  overflow: "auto",
                }}
              >
                {steps[activeStep].description}
              </Box>

              <MobileStepper
                variant="text"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                  activeStep == maxSteps - 1 ? (
                    <Button
                      size="small"
                      //   type={activeStep == maxSteps - 1 ? "submit" : "button"}
                      disabled={
                        _.isEmpty(dirtyFields) || !isValid || savingAdmission
                      }
                      onClick={handleNext}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      onClick={handleNext}
                      //   disabled={activeStep === maxSteps - 1}
                      type="button"
                    >
                      Next
                      {theme.direction === "rtl" ? (
                        <KeyboardArrowLeft />
                      ) : (
                        <KeyboardArrowRight />
                      )}
                    </Button>
                  )
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                    Back
                  </Button>
                }
              />
            </form>
          </Box>
        </div>
      </Card>
      {/* <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleClose}>Subscribe</Button>
  </DialogActions> */}
    </Dialog>
  );
}

export default StartAdmissionsModal;
