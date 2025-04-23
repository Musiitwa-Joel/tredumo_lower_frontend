import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { lighten } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Backdrop from "@mui/material/Backdrop";
import { useMutation, useQuery } from "@apollo/client";
import { GET_UNIVERSITY_DETAILS } from "../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectUniversityDetails,
  updateUniversityDetails,
} from "../../store/setUpSlice";
import { SAVE_UNIVERSITY_DETAILS } from "../../gql/mutations";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [1, 2, 3, 4, 5, 6];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const schema = yup.object().shape({
  university_code: yup.string(),
  university_title: yup.string(),
  university_logo: yup.string(),
  contact_info: yup.string(),
  entry_yrs: yup.number(),
  semeters_per_acc_yr: yup.number(),
  university_x_account: yup.string(),
  university_facebook_account: yup.string(),
  university_instagram_account: yup.string(),
  favicon: yup.string(),
  primary_color: yup.string(),
  secondary_color: yup.string(),
});

const defaultValues = {
  id: null,
  university_code: "",
  university_title: "",
  university_logo: "",
  contact_info: "",
  entry_yrs: null,
  semeters_per_acc_yr: null,
  university_x_account: "",
  university_facebook_account: "",
  university_instagram_account: "",
  favicon: "",
  primary_color: "",
  secondary_color: "",
};

const steps = ["General Institution Information", "Logos and Branding"];

export default function GeneralInfoForm() {
  const theme = useTheme();
  const { control, handleSubmit, setValue, watch, formState, reset, setError } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [logoPreview, setLogoPreview] = React.useState(null);
  const [faviconPreview, setFaviconPreview] = React.useState(null);

  const universityDetails = useSelector(selectUniversityDetails);

  const dispatch = useDispatch();

  const { loading, error, data } = useQuery(GET_UNIVERSITY_DETAILS);

  const [
    saveUniversityDetails,
    { error: saveError, loading: savingDetails, data: saveResponse },
  ] = useMutation(SAVE_UNIVERSITY_DETAILS, {
    refetchQueries: ["University_details"],
  });

  if (error) {
    dispatch(
      showMessage({
        message: "Error loading University details",
        variant: "error",
      })
    );
  }

  if (saveError) {
    dispatch(
      showMessage({
        message: "Failed to save university info " + saveError.message,
        variant: "error",
      })
    );
  }

  // console.log("univesity details", universityDetails);

  React.useEffect(() => {
    if (data) {
      // console.log("response", data);
      dispatch(updateUniversityDetails(data.university_details));
    }
  }, [data]);

  React.useEffect(() => {
    setValue("id", universityDetails.id);
    setValue("university_code", universityDetails.university_code);
    setValue("university_title", universityDetails.university_title);
    setValue("contact_info", universityDetails.contact);
    setValue("entry_yrs", universityDetails.entry_yrs);
    setValue("semeters_per_acc_yr", universityDetails.semeters_per_acc_yr);
    setValue("university_x_account", universityDetails.university_x_account);
    setValue(
      "university_facebook_account",
      universityDetails.university_facebook_account
    );
    setValue(
      "university_instagram_account",
      universityDetails.university_instagram_account
    );
  }, [universityDetails]);

  const isStepOptional = (step) => step === 1;
  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setValue(name, file);
      const previewUrl = URL.createObjectURL(file);
      if (name === "logo") {
        setLogoPreview(previewUrl);
      } else if (name === "favicon") {
        setFaviconPreview(previewUrl);
      }
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box
            className="p-16 w-full rounded-16 mt-16 border"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? lighten(theme.palette.background.default, 0.5)
                  : lighten(theme.palette.background.default, 0.02),
              height: "calc(100vh - 380px)",
              overflow: "auto",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="university_code"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Institution Code"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="university_title"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Institution Title"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="semeters_per_acc_yr"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Number of semesters per accademic year"
                      variant="outlined"
                      type="number"
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="entry_yrs"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Entry Years"
                      variant="outlined"
                      type="number"
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                  )}
                />
              </Grid>
            </Grid>
            {/* <hr /> */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="contact_info"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Institution contact"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="university_x_account"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Institution X Social Address"
                      helperText="e.g. https://www.x.com/nkumba_Uni"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Controller
                  name="university_facebook_account"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Institution Facebook Social Address"
                      helperText="e.g. https://www.facebook.com/nkumbaUni"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name="university_instagram_account"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Institution Instagram Social Address"
                      helperText="e.g. https://www.instagram.com/nkumba_uni"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Grid container spacing={2} style={{ marginTop: "10px" }}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  style={{ textTransform: "none" }}
                >
                  Choose Logo
                  <input
                    type="file"
                    name="logo"
                    hidden
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </Button>
                {logoPreview && (
                  <Box
                    component="img"
                    src={logoPreview}
                    alt="Logo Preview"
                    sx={{
                      marginTop: "10px",
                      width: "100%",
                      height: "auto",
                      maxHeight: "150px",
                      objectFit: "contain",
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  style={{ textTransform: "none" }}
                >
                  Choose Favicon
                  <input
                    type="file"
                    name="favicon"
                    hidden
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </Button>
                {faviconPreview && (
                  <Box
                    component="img"
                    src={faviconPreview}
                    alt="Favicon Preview"
                    sx={{
                      marginTop: "10px",
                      width: "100%",
                      height: "auto",
                      maxHeight: "150px",
                      objectFit: "contain",
                    }}
                  />
                )}
              </Grid>
            </Grid>
            {/* <Typography variant="h6" sx={{ mt: 2 }}>
              Default color themes for the Institution
            </Typography> */}
            {/* <Grid container spacing={2}>
              <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
                <Controller
                  name="primary_color"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Primary Color"
                      id="outlined-size-small"
                      // error={!!errors.primary_color}
                      fullWidth
                      // value={formState.college_code}
                      // onChange={e => setFormState({...formState, college_code: e.target.value})}
                      // defaultValue="Small"
                      // required
                      size="small"
                    />
                  )}
                />
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: watch("primary_color"),
                    marginLeft: 2,
                    border: "1px solid #ccc",
                  }}
                />
              </Grid>
              <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
                <Controller
                  name="secondary_color"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Secondary Color"
                      size="small"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    />
                  )}
                />
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: watch("secondary_color"),
                    marginLeft: 2,
                    border: "1px solid #ccc",
                  }}
                />
              </Grid>
            </Grid> */}
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  const onSubmit = async (data) => {
    console.log(data);

    const res = await saveUniversityDetails({
      variables: {
        universityCode: data.university_code,
        universityTitle: data.university_title,
        entryYrs: data.entry_yrs,
        semetersPerAccYr: data.semeters_per_acc_yr,
        universityXAccount: data.university_x_account,
        universityFacebookAccount: data.university_facebook_account,
        universityInstagramAccount: data.university_instagram_account,
        universityLogo: data.university_logo,
        favicon: data.favicon,
        primaryColor: data.primary_color,
        secondaryColor: data.secondary_color,
        contact: data.contact_info,
        saveUniversityDetailsId: data.id,
      },
    });

    dispatch(updateUniversityDetails(res.data.saveUniversityDetails));
    dispatch(
      showMessage({
        message: "University information saved successfully",
        variant: "info",
      })
    );
  };

  return (
    <div style={{ marginTop: "10px", padding: 20, position: "relative" }}>
      <Backdrop
        sx={{
          color: "#fff",
          position: "absolute",
          left: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                // labelProps.optional = (
                //   <Typography variant="caption">Optional</Typography>
                // );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you're finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleBack}>Back</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {/* {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )} */}
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  style={{
                    marginRight: 10,
                  }}
                >
                  {savingDetails ? (
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

                {activeStep === steps.length - 1 ? null : (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color="secondary"
                  >
                    {"Go to " + steps[activeStep + 1]}
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </form>
      </Box>
    </div>
  );
}
