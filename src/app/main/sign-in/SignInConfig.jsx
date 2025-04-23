import SignInPage from "./SignInPage";
import OtpVerification from "./OtpPage";
import ChangePassword from "./ChangePassword";
import authRoles from "../../auth/authRoles";

const SignInConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/",
      element: <SignInPage />,
    },
    {
      path: "/otp-verification",
      element: <OtpVerification />,
    },
    {
      path: "/change-password",
      element: <ChangePassword />,
    },
  ],
};
export default SignInConfig;
