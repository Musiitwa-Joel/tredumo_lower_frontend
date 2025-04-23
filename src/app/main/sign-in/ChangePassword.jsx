import { Link } from "react-router-dom";
import {useState} from 'react'
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { url } from "app/configs/apiConfig";
import CircularProgress from "@mui/material/CircularProgress";
import { selectInitialUserProfile } from "./store/authSlice";
import api from "app/configs/api";

const schema = yup.object().shape({
  // currentPassword: yup
  //   .string()
  //   .required("Please enter your current password"),
  newPassword: yup
    .string()
    .required("Please enter your new password")
    .min(8, "Password must be at least 8 characters")
    // .matches(
    //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]$/,
    //   "Password must contain at least one letter, one number, and one special character"
    // )
    ,
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required("Please confirm your new password"),
});

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialUserProfile = useSelector(selectInitialUserProfile)
  const [loading, setLoading] = useState(false);
  
  const { control, formState, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit({ newPassword, confirmPassword }) {
    setLoading(true);
    try {

      const response = await api.post("/api/auth/change-password", { 
        email: initialUserProfile?.email,
        newPassword,
      });
      
      if (response.data?.success) {
        dispatch(
          showMessage({
            message: response.data?.message,
            variant: "success",
          })
        );
        navigate("/example");
      }
      
    } catch (error) {
      setLoading(false);
      dispatch(
        showMessage({
          message: "Failed to change password",
          variant: "error",
        })
      );
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
            Change Password
          </Typography>
          <Typography className="mt-8 text-lg tracking-tight" color="text.secondary">
            Please set a new secure password for your account
          </Typography>

          <form
            name="passwordForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Current Password"
                  type="password"
                  error={!!errors.currentPassword}
                  helperText={errors?.currentPassword?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            /> */}

            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="New Password"
                  type="password"
                  error={!!errors.newPassword}
                  helperText={errors?.newPassword?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Confirm New Password"
                  type="password"
                  error={!!errors.confirmPassword}
                  helperText={errors?.confirmPassword?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Button
              variant="contained"
              className="w-full mt-16"
              aria-label="Change Password"
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
                "Change Password"
              )}
              
            </Button>
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

        <div className="z-10 relative w-full max-w-2xl">
          <div className="text-7xl font-bold leading-none text-gray-100">
            <div>Secure Your Account</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
            Creating a strong password is an important step in protecting your account.
            Make sure to use a combination of letters, numbers, and special characters.
          </div>
        </div>
      </Box>
    </div>
  );
}

export default ChangePassword;