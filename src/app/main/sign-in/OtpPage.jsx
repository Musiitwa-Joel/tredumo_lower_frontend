import {useState} from "react"; 
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Alert from "@mui/material/Alert";
import _ from "@lodash";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { url } from "app/configs/apiConfig";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { selectInitialUserProfile } from "./store/authSlice";
import api from "app/configs/api";

const schema = yup.object().shape({
  otp: yup
    .string()
    .required("Please enter the OTP code")
    .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
});

const defaultValues = {
  otp: "",
};

function OtpVerificationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialUserProfile = useSelector(selectInitialUserProfile)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)
  
  const { control, formState, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  async function onSubmit({ otp }) {
    setError(null)
    setLoading(true);
    try {
      const response = await api.post("/api/auth/verify-otp", {email: initialUserProfile?.email, otp });

      if (response.data?.success) {
          dispatch(showMessage({ message: response.data?.message, variant: "success" }));
          navigate("/change-password");
      }
      
    } catch (error) {
        setLoading(false);
        setError({
            type: "error",
            message: error.response?.data?.message || "Something went wrong",
        })
     
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
            Enter OTP Code
          </Typography>
          <Typography className="mt-8 text-lg tracking-tight" color="text.secondary">
            Please enter the 6-digit code sent to your email
          </Typography>

          <form
            name="otpForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
             {error ? (
              <Alert
                variant="filled"
                severity="error"
                className="mb-8"
                style={{
                  marginBottom: 10,
                }}
              >
                {error.message}
              </Alert>
            ) : null}
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24 mt-8"
                  label="OTP Code"
                  type="text"
                  error={!!errors.otp}
                  helperText={errors?.otp?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Button
              variant="contained"
              className="w-full mt-8"
              aria-label="Verify"
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
                "Verify OTP"
              )}
             
            </Button>

            <Link
              to="/"
              className="mt-20 text-md text-center text-gray-500 hover:text-gray-600"
            >
              Back to Sign in
            </Link>

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
            <div>Verify Your Identity</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
            For your security, we've sent a one-time password to your registered email address.
            Please check your inbox and enter the code to continue.
          </div>
        </div>
      </Box>
    </div>
  );
}

export default OtpVerificationPage;