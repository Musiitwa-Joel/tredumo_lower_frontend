import { memo, lazy } from "react";
import FuseUtils from "@fuse/utils";
import FuseLoading from "@fuse/core/FuseLoading";
import { Navigate } from "react-router-dom";
import settingsConfig from "app/configs/settingsConfig";
import SignInConfig from "../main/sign-in/SignInConfig";
import SignUpConfig from "../main/sign-up/SignUpConfig";
import SignOutConfig from "../main/sign-out/SignOutConfig";
import Error404Page from "../main/404/Error404Page";
import ExampleConfig from "../main/example/ExampleConfig";
import Example from "../main/example/Example";
import SignInPage from "../main/sign-in/SignInPage";
import OtpVerification from "../main/sign-in/OtpPage";
import ChangePassword from "../main/sign-in/ChangePassword";
import ProtectedRoute from "../auth/ProtectedRoute";
import FullScreenUnlockSessionPage from "../main/unlock-session/FullScreenUnlockSessionPage";

const ProgramsAndCourses = lazy(
  () =>
    import(
      "app/theme-layouts/layout3/modules/prog_and_courses/ProgramsAndCourses"
    )
);

const Admissions = lazy(
  () => import("app/theme-layouts/layout3/modules/admissions/Admissions")
);

const Setup = lazy(
  () => import("app/theme-layouts/layout3/modules/setup/Setup")
);

const EducationMonitoring = lazy(
  () =>
    import(
      "app/theme-layouts/layout3/modules/education_monitoring/EducationMonitoring"
    )
);

const PhotosManager = lazy(
  () => import("app/theme-layouts/layout3/modules/photos_manager/PhotosManager")
);

const Elearning = lazy(
  () => import("app/theme-layouts/layout3/modules/elearning/Elearning")
);

const StudentInformationCenter = lazy(
  () =>
    import(
      "app/theme-layouts/layout3/modules/student_info_center/StudentInformationCenter"
    )
);
const Academics = lazy(
  () => import("app/theme-layouts/layout3/modules/academics/Academics")
);

const FeesMgt = lazy(
  () => import("app/theme-layouts/layout3/modules/fees_mgt/FeesMgt")
);

const Registration = lazy(
  () => import("app/theme-layouts/layout3/modules/registration/Registration")
);

const Finance = lazy(
  () => import("app/theme-layouts/layout3/modules/finance/Finance")
);

const TredPay = lazy(
  () => import("app/theme-layouts/layout3/modules/tredpay/TredPay")
);

const SystemAccess = lazy(
  () => import("app/theme-layouts/layout3/modules/system_access/SystemAccess")
);

const HR = lazy(() => import("app/theme-layouts/layout3/modules/hr/HR"));

const ResultsMgt = lazy(
  () => import("app/theme-layouts/layout3/modules/results_mgt/ResultsMgt")
);

const Alumni = lazy(
  () => import("app/theme-layouts/layout3/modules/alumini/Alumni")
);

const Voting = lazy(
  () => import("app/theme-layouts/layout3/modules/voting/Voting")
);

const Counselling = lazy(
  () => import("app/theme-layouts/layout3/modules/counselling/Counselling")
);

const Graduation = lazy(
  () => import("app/theme-layouts/layout3/modules/graduation/Graduation")
);

const Library = lazy(
  () => import("app/theme-layouts/layout3/modules/library/Library")
);

const Rims = lazy(() => import("app/theme-layouts/layout3/modules/rims/Rims"));

const Jobs = lazy(() => import("app/theme-layouts/layout3/modules/jobs/jobs"));

const SmeHub = lazy(
  () => import("app/theme-layouts/layout3/modules/sme_hub/SmeHub")
);

const Mel = lazy(() => import("app/theme-layouts/layout3/modules/mel/Mel"));

const MemoizedProgramsAndCourses = memo(ProgramsAndCourses);
const MemoizedAdmissions = memo(Admissions);
const MemoizedSetup = memo(Setup);
const MemoizedEducationMonitoring = memo(EducationMonitoring);
const MemoizedPhotosManager = memo(PhotosManager);
const MemoizedElearning = memo(Elearning);
const MemoizedStudentInformationCenter = memo(StudentInformationCenter);
const MemoizedFeesMgt = memo(FeesMgt);
const MemoizedRegistration = memo(Registration);
const MemoizedFinance = memo(Finance);
const MemoizedTredPay = memo(TredPay);
const MemoizedSystemAccess = memo(SystemAccess);
const MemoizedHR = memo(HR);
const MemoizedResultsMgt = memo(ResultsMgt);
const MemoizedAlumni = memo(Alumni);
const MemoizedVoting = memo(Voting);
const MemoizedCounselling = memo(Counselling);
const MemoizedGraduation = memo(Graduation);
const MemoizedLibrary = memo(Library);
const MemoizedRims = memo(Rims);
const MemoizedJobs = memo(Jobs);
const MemoizedSmeHub = memo(SmeHub);
const MemoizedMel = memo(Mel);
const MemoizedAcademics = memo(Academics);

const routeConfigs = [ExampleConfig, SignOutConfig, SignInConfig, SignUpConfig];
/**
 * The routes of the application.
 */
const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs
    // settingsConfig.defaultAuth
  ),
  // {
  //   path: "example",
  //   element: <Navigate to="/example" />,
  //   // auth: settingsConfig.defaultAuth,
  // },
  {
    path: "/",
    element: <SignInPage />,
    // auth: settingsConfig.defaultAuth,
  },
  {
    path: "/otp-verification",
    element: <OtpVerification />,
    // auth: settingsConfig.defaultAuth,
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
    // auth: settingsConfig.defaultAuth,
  },
  {
    path: "loading",
    element: <FuseLoading />,
  },
  // {
  //   path: "example",
  //   element: (
  //     <ProtectedRoute>
  //       <Example />
  //     </ProtectedRoute>
  //   ),
  //   // auth: settingsConfig.defaultAuth,
  // },
  {
    path: "admissions",
    element: (
      <ProtectedRoute>
        <MemoizedAdmissions />
      </ProtectedRoute>
    ),
  },
  {
    path: "rims",
    element: (
      <ProtectedRoute>
        <MemoizedRims />
      </ProtectedRoute>
    ),
  },
  {
    path: "jobs",
    element: (
      <ProtectedRoute>
        <MemoizedJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "mel",
    element: (
      <ProtectedRoute>
        <MemoizedMel />
      </ProtectedRoute>
    ),
  },
  {
    path: "sme_hub",
    element: (
      <ProtectedRoute>
        <MemoizedSmeHub />
      </ProtectedRoute>
    ),
  },
  {
    path: "setup",
    element: (
      <ProtectedRoute>
        <MemoizedSetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "finance",
    element: (
      <ProtectedRoute>
        <MemoizedFinance />
      </ProtectedRoute>
    ),
  },
  {
    path: "tredpay",
    element: (
      <ProtectedRoute>
        <MemoizedTredPay />
      </ProtectedRoute>
    ),
  },
  {
    path: "programsencourses",
    element: (
      <ProtectedRoute>
        <MemoizedProgramsAndCourses />
      </ProtectedRoute>
    ),
  },
  {
    path: "student_assesment",
    element: (
      <ProtectedRoute>
        <MemoizedEducationMonitoring />
      </ProtectedRoute>
    ),
  },
  {
    path: "photos_manager",
    element: (
      <ProtectedRoute>
        <MemoizedPhotosManager />
      </ProtectedRoute>
    ),
  },
  {
    path: "student_information_center",
    element: (
      <ProtectedRoute>
        <MemoizedStudentInformationCenter />
      </ProtectedRoute>
    ),
  },
  {
    path: "registration",
    element: (
      <ProtectedRoute>
        <MemoizedRegistration />
      </ProtectedRoute>
    ),
  },
  {
    path: "fees_management",
    element: (
      <ProtectedRoute>
        <MemoizedFeesMgt />
      </ProtectedRoute>
    ),
  },
  {
    path: "system_access",
    element: (
      <ProtectedRoute>
        <MemoizedSystemAccess />
      </ProtectedRoute>
    ),
  },
  {
    path: "hr",
    element: (
      <ProtectedRoute>
        <MemoizedHR />
      </ProtectedRoute>
    ),
  },
  {
    path: "results_manager",
    element: (
      <ProtectedRoute>
        <MemoizedResultsMgt />
      </ProtectedRoute>
    ),
  },
  {
    path: "alumni",
    element: (
      <ProtectedRoute>
        <MemoizedAlumni />
      </ProtectedRoute>
    ),
  },
  {
    path: "elearning",
    element: (
      <ProtectedRoute>
        <MemoizedElearning />
      </ProtectedRoute>
    ),
  },
  {
    path: "elections",
    element: (
      <ProtectedRoute>
        <MemoizedVoting />
      </ProtectedRoute>
    ),
  },
  {
    path: "counselling",
    element: (
      <ProtectedRoute>
        <MemoizedCounselling />
      </ProtectedRoute>
    ),
  },
  {
    path: "graduation",
    element: (
      <ProtectedRoute>
        <MemoizedGraduation />
      </ProtectedRoute>
    ),
  },
  {
    path: "academics",
    element: (
      <ProtectedRoute>
        <MemoizedAcademics />
      </ProtectedRoute>
    ),
  },
  {
    path: "library",
    element: (
      <ProtectedRoute>
        <MemoizedLibrary />
      </ProtectedRoute>
    ),
  },
  {
    path: "404",
    element: <Error404Page />,
  },
  {
    path: "unlock_session",

    element: (
      <ProtectedRoute>
        <FullScreenUnlockSessionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "home",
    element: <h1>Home</h1>,
  },
  {
    path: "*",
    element: <Navigate to="404" />,
  },
];
export default routes;
