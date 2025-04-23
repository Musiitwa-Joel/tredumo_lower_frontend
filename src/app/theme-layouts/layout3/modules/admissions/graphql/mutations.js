import { gql } from "@apollo/client";

const SAVE_ADMISSION_LEVEL = gql`
  mutation SaveAdmissionLevel(
    $admissionLevelTitle: String!
    $admissionLevelDescription: String!
    $progLevels: String!
    $addedBy: String!
    $saveAdmissionLevelId: ID
  ) {
    saveAdmissionLevel(
      admission_level_title: $admissionLevelTitle
      prog_levels: $progLevels
      admission_level_description: $admissionLevelDescription
      added_by: $addedBy
      id: $saveAdmissionLevelId
    ) {
      success
      message
    }
  }
`;

const SAVE_SCHEME = gql`
  mutation saveScheme(
    $schemeTitle: String!
    $description: String!
    $isActive: Int!
    $addedBy: String!
    $saveSchemeId: ID
  ) {
    saveScheme(
      scheme_title: $schemeTitle
      description: $description
      is_active: $isActive
      added_by: $addedBy
      id: $saveSchemeId
    ) {
      success
      message
    }
  }
`;

const DELETE_SCHEME = gql`
  mutation DeleteScheme($schemeId: String!) {
    deleteScheme(scheme_id: $schemeId) {
      message
      success
    }
  }
`;

const DELETE_ADMISSION_LEVEL = gql`
  mutation deleteAdmissionLevel($admissionLevelId: String!) {
    deleteAdmissionLevel(admission_level_id: $admissionLevelId) {
      message
      success
    }
  }
`;

const SAVE_RUNNING_ADMISSION = gql`
  mutation SaveRunningAdmission(
    $intakeId: String!
    $schemeId: String!
    $admissionLevelId: String!
    $accYrId: String!
    $startDate: String!
    $endDate: String!
    $noOfChoices: Int!
    $maxNoOfForms: Int!
    $formTemplateId: String!
    $nationalApplicationFees: String!
    $eastAfricanApplicationFees: String!
    $internationalApplicationFees: String!
    $activateAdmissionFees: Int!
    $description: String
    $saveRunningAdmissionId: ID
    $nationalAdmissionFees: String
    $eastAfricanAdmissionFees: String
    $internationalAdmissionFees: String
  ) {
    saveRunningAdmission(
      intake_id: $intakeId
      scheme_id: $schemeId
      admission_level_id: $admissionLevelId
      acc_yr_id: $accYrId
      start_date: $startDate
      end_date: $endDate
      no_of_choices: $noOfChoices
      max_no_of_forms: $maxNoOfForms
      form_template_id: $formTemplateId
      national_application_fees: $nationalApplicationFees
      east_african_application_fees: $eastAfricanApplicationFees
      international_application_fees: $internationalApplicationFees
      activate_admission_fees: $activateAdmissionFees
      description: $description
      id: $saveRunningAdmissionId
      national_admission_fees: $nationalAdmissionFees
      east_african_admission_fees: $eastAfricanAdmissionFees
      international_admission_fees: $internationalAdmissionFees
    ) {
      success
      message
    }
  }
`;

const DELETE_RUNNING_ADMISSION = gql`
  mutation deleteRunningAdmission($runningAdmissionId: String!) {
    deleteRunningAdmission(running_admission_id: $runningAdmissionId) {
      message
      success
    }
  }
`;

const SAVE_ADVERTISED_COURSE = gql`
  mutation saveAdvertisedCourse(
    $runningAdmissionId: String!
    $courseId: String!
    $addedBy: String!
  ) {
    saveAdvertisedCourse(
      running_admission_id: $runningAdmissionId
      course_id: $courseId
      added_by: $addedBy
    ) {
      message
      success
    }
  }
`;

const REMOVE_ADVERTISED_COURSE = gql`
  mutation removeAdvertisedCourse(
    $advertisedCourseId: String!
    $addedBy: String!
  ) {
    removeAdvertisedCourse(
      advertised_course_id: $advertisedCourseId
      added_by: $addedBy
    ) {
      message
      success
    }
  }
`;

const ADMIT_STDS = gql`
  mutation admit_students(
    $applicants: [AdmissionInput]!
    $admittedBy: String!
  ) {
    admit_students(applicants: $applicants, admitted_by: $admittedBy) {
      message
      success
    }
  }
`;

const PUSH_TO_STD_INFO_CENTER = gql`
  mutation Push_to_std_info_center($stdIds: [String]!, $pushedBy: String!) {
    push_to_std_info_center(std_ids: $stdIds, pushed_by: $pushedBy) {
      message
      success
    }
  }
`;

const SAVE_ADMISSION_LETTER = gql`
  mutation saveAdmissionLetter($payload: AdmissionLetterInput) {
    saveAdmissionLetter(payload: $payload) {
      message
      success
    }
  }
`;

const SAVE_ADMISSION_TEMPLATE = gql`
  mutation saveAdmissionTemplate($payload: AdmissionTemplateInput) {
    saveAdmissionTemplate(payload: $payload) {
      message
      success
    }
  }
`;

const SAVE_STUDENT_DETAILS = gql`
  mutation saveStudentDetails($payload: studentDetailsInput!) {
    saveStudentDetails(payload: $payload) {
      message
      success
    }
  }
`;

const UPLOAD_APPLICANTS = gql`
  mutation uploadApplicants($payload: ApplicantInput!) {
    uploadApplicants(payload: $payload) {
      success
      message
    }
  }
`;

export {
  SAVE_SCHEME,
  DELETE_SCHEME,
  SAVE_ADMISSION_LEVEL,
  DELETE_ADMISSION_LEVEL,
  SAVE_RUNNING_ADMISSION,
  DELETE_RUNNING_ADMISSION,
  SAVE_ADVERTISED_COURSE,
  REMOVE_ADVERTISED_COURSE,
  ADMIT_STDS,
  PUSH_TO_STD_INFO_CENTER,
  SAVE_ADMISSION_LETTER,
  SAVE_ADMISSION_TEMPLATE,
  SAVE_STUDENT_DETAILS,
  UPLOAD_APPLICANTS,
};
