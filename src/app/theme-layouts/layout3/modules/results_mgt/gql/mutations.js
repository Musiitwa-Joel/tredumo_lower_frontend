import { gql } from "@apollo/client";

const SAVE_RESULTS_CONFIG = gql`
  mutation SaveResultsConfig($payload: ResultsConfigInput!) {
    saveResultsConfig(payload: $payload) {
      message
      success
    }
  }
`;

const SEND_RESULTS_UPLOAD_SECURITY_CODE = gql`
  mutation sendResultsUploadVerificationCode {
    sendResultsUploadVerificationCode {
      success
      message
    }
  }
`;

const UPLOAD_COURSE_WORK_MARKS = gql`
  mutation uploadCourseWorkMarks($payload: [MrksInput]!, $securityCode: Int!) {
    uploadCourseWorkMarks(payload: $payload, security_code: $securityCode) {
      message
      success
    }
  }
`;

const UPLOAD_FINAL_EXAM_MARKS = gql`
  mutation uploadFinalExamMarks($securityCode: Int!, $payload: [MrksInput]!) {
    uploadFinalExamMarks(security_code: $securityCode, payload: $payload) {
      message
      success
    }
  }
`;

export {
  SAVE_RESULTS_CONFIG,
  SEND_RESULTS_UPLOAD_SECURITY_CODE,
  UPLOAD_COURSE_WORK_MARKS,
  UPLOAD_FINAL_EXAM_MARKS,
};
