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
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { LOGIN_USER } from "app/theme-layouts/layout3/graphql/mutations";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserDetails,
  setUserPermissions,
  userLogin,
} from "app/store/userSlice";
import { selectAppTheme, updateApps } from "app/store/appSlice";
import { setToken } from "app/store/tokenSlice";
import UseJwtAuth from "src/app/auth/services/jwt/useJwtAuth";
import config from "../../auth/services/jwt/jwtAuthConfig";
import { GET_MY_PROFILE } from "app/theme-layouts/layout3/graphql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import jwtDecode from "jwt-decode";
import { url, url2 } from "app/configs/apiConfig";
import { setInitialUserProfile } from "./store/authSlice";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  username: yup.string().required("You must enter a username"),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(4, "Password is too short - must be at least 4 chars."),
});

const defaultValues = {
  username: "",
  password: "",
  remember: true,
};
const facebookClick = (e) => {
  e.preventDefault(); // Prevent the default behavior of the link
  const facebookLink = "https://www.facebook.com/nkumbaUni";
  window.open(facebookLink, "_blank");
};
const instagramClick = (e) => {
  e.preventDefault(); // Prevent the default behavior of the link
  const instagramLink = "https://www.instagram.com/nkumba_uni";
  window.open(instagramLink, "_blank");
};
const twitterClick = (e) => {
  e.preventDefault(); // Prevent the default behavior of the link
  const twitterLink = "https://www.twitter.com/NkumbaUni";
  window.open(twitterLink, "_blank");
};

function SignInPage() {
  const appTheme = useSelector(selectAppTheme);
  const [loading, setLoading] = useState(false);

  const [login, { data: loginRes, error: loginErr, loading: logingIn }] =
    useMutation(LOGIN_USER);

  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { control, formState, handleSubmit, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit({ username, password }) {
    try {
      setError(null);
      setLoading(true);

      const response = await login({
        variables: {
          username,
          password,
        },
      });

      if (response.data?.login?.success) {
        localStorage.setItem("jwt_access_token", response.data.login.token);
        dispatch(setToken(response.data.login.token));
        dispatch(setInitialUserProfile(response.data.login.user));

        navigate("/example");
      }
    } catch (error) {
      console.log("error", error);
      setError({
        type: "manual",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <div
            style={{
              display: "flex",
              // alignItems: "center",
              // justifyContent: "center",
            }}
          >
            <img
              className="w-80"
              src={`${url}/imgs/school_logo_iso.png`}
              alt="logo"
              style={{
                width: 100,
              }}
            />
            <div className="text-6xl font-bold leading-none mt-10">
              <div className="text-red-600">Kitebi S.S</div>
              <div className="text-md mt-5">IN SEARCH OF KNOWLEDGE</div>
            </div>
          </div>

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Sign in
          </Typography>
          {/* <div className="flex items-baseline mt-2 font-medium">
            <Typography>Don't have an account?</Typography>
            <Link className="ml-4" to="/reset">
              Sign up
            </Link>
          </div> */}

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
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Username"
                  type="text"
                  error={!!errors.username}
                  autoComplete="off"
                  // helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
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

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <FormControlLabel
                      label="Remember me"
                      control={<Checkbox size="small" {...field} />}
                    />
                  </FormControl>
                )}
              />

              <Link className="text-md font-medium" to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <Button
              variant="contained"
              // color="secondary"
              className=" w-full mt-16"
              aria-label="Sign in"
              disabled={_.isEmpty(dirtyFields) || !isValid || logingIn}
              type="submit"
              size="large"
              style={{
                backgroundColor:
                  _.isEmpty(dirtyFields) || !isValid
                    ? ""
                    : appTheme?.primary_color || "#9b4005",
                color: _.isEmpty(dirtyFields) || !isValid ? "" : "#fff",
              }}
            >
              {loading || logingIn ? (
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
                "Sign in"
              )}
            </Button>

            <div className="flex items-center mt-32">
              <div className="flex-auto mt-px border-t" />
              <Typography className="mx-8" color="text.secondary">
                Follow Us On
              </Typography>
              <div className="flex-auto mt-px border-t" />
            </div>

            <div className="flex items-center mt-32 space-x-16">
              <Button
                variant="outlined"
                className="flex-auto"
                onClick={facebookClick}
              >
                <FuseSvgIcon size={20} color="action">
                  feather:facebook
                </FuseSvgIcon>
              </Button>
              <Button
                variant="outlined"
                className="flex-auto"
                onClick={twitterClick}
              >
                <Icon
                  color="action"
                  icon="pajamas:twitter"
                  width="20"
                  height="20"
                />
              </Button>
              <Button
                variant="outlined"
                className="flex-auto"
                onClick={instagramClick}
              >
                <FuseSvgIcon size={20} color="action">
                  feather:instagram
                </FuseSvgIcon>
              </Button>
            </div>
          </form>
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: appTheme?.primary_color || "#513503" }}
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
            sx={{ color: appTheme?.circles_color || "#64748b" }}
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
            <div>Kitebi Secondary School 🎉</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
            We are thrilled to have you as part of our community on the central
            identity system. This platform is designed to streamline
            communication, collaboration, and access to important resources.
          </div>
          <div className="flex items-center mt-32">
            <AvatarGroup
              sx={{
                "& .MuiAvatar-root": {
                  borderColor: "primary.main",
                },
              }}
            >
              <Avatar src={`${url}/logos/rims.png`} />
              <Avatar src={`${url}/logos/alumni.png`} />
              <Avatar src={`${url}/logos/sme_hub.png`} />
              <Avatar src={`${url}/logos/elearning.png`} />
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
