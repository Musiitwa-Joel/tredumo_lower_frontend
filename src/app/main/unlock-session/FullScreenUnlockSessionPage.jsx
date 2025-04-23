import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { UNLOCK_SESSION } from "app/theme-layouts/layout3/graphql/mutations";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, userLoggedOut } from "app/store/userSlice";
import {
  addAppToTaskBar,
  selectActiveApp,
  updateApps,
} from "app/store/appSlice";
import { setToken } from "app/store/tokenSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required(),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(4, "Password is too short - must be at least 4 chars."),
});

const defaultValues = {
  name: "Brian Hughes",
  password: "",
};

function SignInPage() {
  const userObj = useSelector(selectUser);
  const activeApp = useSelector(selectActiveApp);
  const [unlockSession, { data, loading, error }] = useMutation(
    UNLOCK_SESSION,
    {
      errorPolicy: "all",
    }
  );

  // const [error, setError] = useState(null)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    setValue(
      "name",
      `${userObj.user?.biodata?.salutation} ${userObj.user?.biodata?.surname} ${userObj.user?.biodata?.other_names}`
    );
  }, [userObj]);

  async function onSubmit(values) {
    // console.log("the values", values);
    const res = await unlockSession({
      variables: {
        pwd: values.password,
      },
    });

    // console.log("unlock response", res.data?.unlockSession);

    if (res.data?.unlockSession) {
      console.log("Active app", activeApp);
      dispatch(setToken(res.data?.unlockSession?.token));
      navigate(`/${activeApp ? activeApp.route : "example"}`);
      dispatch(
        showMessage({
          message: "Your Session has been restored successfully",
          variant: "success",
        })
      );
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img
            className="w-50"
            src="assets/images/logo/nkumba-uninersity.png"
            alt="logo"
          />

          <Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
            Unlock your session
          </Typography>
          <Typography className="font-medium">
            Your session is locked due to inactivity. Please enter the password
            to continue working.
          </Typography>

          <form
            name="loginForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            {error ? (
              <Alert
                variant="filled"
                severity="error"
                style={{
                  marginBottom: 10,
                }}
              >
                {error.message}
              </Alert>
            ) : null}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Full name"
                  autoFocus
                  type="name"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                  fullWidth
                  disabled
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  autoComplete="new-password"
                  // helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Button
              variant="contained"
              color="secondary"
              className=" w-full mt-16"
              aria-label="Sign in"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
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
                "Unlock Your Session"
              )}
            </Button>

            <Typography
              className="mt-32 text-lg font-large"
              color="text.secondary"
            >
              <span>I'm not</span>{" "}
              <Link
                className="ml-4"
                to="/"
                onClick={() => {
                  dispatch(setToken(null)); // remove token
                  dispatch(addAppToTaskBar([])); // close all apps
                  dispatch(userLoggedOut()); // remove the user profile
                }}
              >
                {`${userObj.user?.biodata?.salutation} ${userObj.user?.biodata?.surname} ${userObj.user?.biodata?.other_names}`}
              </Link>
            </Typography>
          </form>
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: "primary.main" }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: "primary.light" }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg>
        <Box
          component="svg"
          className="absolute -top-64 -right-64 opacity-20"
          sx={{ color: "primary.light" }}
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect
            width="220"
            height="192"
            fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
          />
        </Box>

        <div className="z-10 relative w-full max-w-2xl">
          <div className="text-7xl font-bold leading-none text-gray-100">
            <div>Welcome to</div>
            <div>Nkumba University 🎉</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
            We are thrilled to have you as part of our community on the intranet
            system. This platform is designed to streamline communication,
            collaboration, and access to important resources.
          </div>
          <div className="flex items-center mt-32">
            <AvatarGroup
              sx={{
                "& .MuiAvatar-root": {
                  borderColor: "primary.main",
                },
              }}
            >
              <Avatar src="assets/images/avatars/finance.png" />
              <Avatar src="assets/images/avatars/admissions.png" />
              <Avatar src="assets/images/avatars/assesement.png" />
              <Avatar src="assets/images/avatars/qualityAssurance.png" />
            </AvatarGroup>

            <div className="ml-16 font-medium tracking-tight text-gray-400">
              Feel free to interact with most of our modules!
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default SignInPage;
