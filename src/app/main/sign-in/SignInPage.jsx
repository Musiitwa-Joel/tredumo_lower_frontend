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
import { updateApps } from "app/store/appSlice";
import { setToken } from "app/store/tokenSlice";
import UseJwtAuth from "src/app/auth/services/jwt/useJwtAuth";
import config from "../../auth/services/jwt/jwtAuthConfig";
import { GET_MY_PROFILE } from "app/theme-layouts/layout3/graphql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import jwtDecode from "jwt-decode";
import { url, url2 } from "app/configs/apiConfig";
import api from "app/configs/api";
import { setInitialUserProfile } from "./store/authSlice";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(4, "Password is too short - must be at least 4 chars."),
});

const user = {
  data: {
    my_profile: {
      id: "58",
      user_id: "7c556b82-940e-4711-a328-5c6082c5d141-1734207433413",
      email: "judlub@gmail.com",
      has_set_sec_qns: 0,
      sys_gen_pwd: 1,
      biodata: {
        id: "7c556b82-940e-4711-a328-5c6082c5d141-1734207433413",
        email: "judlub@gmail.com",
        salutation: "Prof.",
        surname: "LUBEGA",
        other_names: "JUDE",
        telno: "+2567766262626",
        __typename: "Employee",
      },
      last_logged_in: [
        {
          id: "1414",
          machine_ipaddress: "149.255.39.32",
          logged_in: "1744320338000",
          __typename: "UserLogin",
        },
      ],
      role: {
        id: "29",
        role_name: "Vice Chancellor",
        _modules: [
          {
            id: "3",
            title: "Admissions",
            route: "admissions",
            logo: "https://tredumo.com/api/module_logos/admissions.png",
            __typename: "Module",
          },
          {
            id: "17",
            title: "Registration",
            route: "registration",
            logo: "https://tredumo.com/api/module_logos/registration.png",
            __typename: "Module",
          },
          {
            id: "2",
            title: "Photo Booth",
            route: "photos_manager",
            logo: "https://tredumo.com/api/module_logos/photomanage.png",
            __typename: "Module",
          },
          {
            id: "4",
            title: "Students Information Hub",
            route: "student_information_center",
            logo: "https://tredumo.com/api/module_logos/studentInfo.png",
            __typename: "Module",
          },
          {
            id: "11",
            title: "Course Administration Hub",
            route: "programsencourses",
            logo: "https://tredumo.com/api/module_logos/programcourses.png",
            __typename: "Module",
          },
          {
            id: "8",
            title: "Education Monitoring And Tracking",
            route: "student_assesment",
            logo: "https://tredumo.com/api/module_logos/assesement.png",
            __typename: "Module",
          },
          {
            id: "13",
            title: "Examinations",
            route: "examinations",
            logo: "https://tredumo.com/api/module_logos/examinations.png",
            __typename: "Module",
          },
          {
            id: "1",
            title: "Results Management",
            route: "results_manager",
            logo: "https://tredumo.com/api/module_logos/results.png",
            __typename: "Module",
          },
          {
            id: "14",
            title: "Fees Management",
            route: "fees_management",
            logo: "https://tredumo.com/api/module_logos/fees_module.png",
            __typename: "Module",
          },
          {
            id: "20",
            title: "Voting",
            route: "elections",
            logo: "https://tredumo.com/api/module_logos/votingLogo.png",
            __typename: "Module",
          },
          {
            id: "5",
            title: "Alumni",
            route: "alumni",
            logo: "https://tredumo.com/api/module_logos/alumni.png",
            __typename: "Module",
          },
          {
            id: "6",
            title: "Finance",
            route: "finance",
            logo: "https://tredumo.com/api/module_logos/finance.png",
            __typename: "Module",
          },
          {
            id: "7",
            title: "Quality Assurance",
            route: "quality_assurance",
            logo: "https://tredumo.com/api/module_logos/qualityAssurance.png",
            __typename: "Module",
          },
          {
            id: "15",
            title: "Graduation",
            route: "graduation",
            logo: "https://tredumo.com/api/module_logos/graduation.png",
            __typename: "Module",
          },
          {
            id: "16",
            title: "Media",
            route: "media",
            logo: "https://tredumo.com/api/module_logos/media.png",
            __typename: "Module",
          },
          {
            id: "9",
            title: "Human Resource",
            route: "hr",
            logo: "https://tredumo.com/api/module_logos/staff.png",
            __typename: "Module",
          },
          {
            id: "10",
            title: "System Access",
            route: "system_access",
            logo: "https://tredumo.com/api/module_logos/config.png",
            __typename: "Module",
          },
          {
            id: "12",
            title: "Setup",
            route: "setup",
            logo: "https://tredumo.com/api/module_logos/setup.png",
            __typename: "Module",
          },
          {
            id: "19",
            title: "User Guide",
            route: "user_guide",
            logo: "https://tredumo.com/api/module_logos/user_guide.png",
            __typename: "Module",
          },
          {
            id: "22",
            title: "Elearning",
            route: "elearning",
            logo: "https://tredumo.com/api/module_logos/elearning.png",
            __typename: "Module",
          },
          {
            id: "23",
            title: "Scholarships",
            route: "scholarships",
            logo: "https://tredumo.com/api/module_logos/scholarships.png",
            __typename: "Module",
          },
          {
            id: "26",
            title: "Library",
            route: "library",
            logo: "https://tredumo.com/api/module_logos/library.png",
            __typename: "Module",
          },
          {
            id: "24",
            title: "TredPay",
            route: "tredpay",
            logo: "https://tredumo.com/api/module_logos/tredpay.png",
            __typename: "Module",
          },
        ],
        __typename: "Role",
      },
      __typename: "User",
    },
  },
};

const defaultValues = {
  email: "",
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
  const { signIn } = UseJwtAuth();
  const [loading, setLoading] = useState(false);

  // const [
  //   loadMyProfile,
  //   { data: myProfileRes, error: myProfileErr, loading: myProfileLoading },
  // ] = useLazyQuery(GET_MY_PROFILE, {
  //   fetchPolicy: "network-only",
  // });

  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { control, formState, handleSubmit, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit({ email, password }) {
    try {
      setError(null);
      setLoading(true);
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (response.data?.success) {
        localStorage.setItem('jwt_access_token', response.data.token);
        dispatch(setToken(response.data.token));
        dispatch(setInitialUserProfile(response.data.user));

        try {
          const profileResponse = await api.get('/api/users/myProfile');
          
          if (profileResponse.data?.success) {
            dispatch(userLogin(profileResponse.data.result));

            if (response.data.requirePasswordChange) {
              navigate("/otp-verification");
            } else {
              navigate("/example");
            }
          }
        } catch (profileError) {
          console.error("Profile fetch error:", profileError);
          dispatch(
            showMessage({
              message: "Failed to load user profile",
              variant: "error",
            })
          );
        }
      }
    } catch (error) {
      console.log("error", error);
      setError({
        type: "manual",
        message: error.response?.data?.error,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img
            className="w-80"
            src={`${url}/imgs/ruforum.png`}
            alt="logo"
            style={{
              width: 220,
            }}
          />

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
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
                  type="email"
                  error={!!errors.email}
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
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
              style={{
                backgroundColor:
                  _.isEmpty(dirtyFields) || !isValid ? "" : "#9b4005",
                color: _.isEmpty(dirtyFields) || !isValid ? "" : "#fff",
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
        sx={{ backgroundColor: "#513503" }}
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
            sx={{ color: "#609645" }}
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
            <div>Ruforum Central Identity System 🎉</div>
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
