import { gql } from "@apollo/client";

const SAVE_NEW_STUDENT = gql`
  mutation saveNewStudent($payload: newStdInput) {
    saveNewStudent(payload: $payload) {
      message
      success
    }
  }
`;

const SAVE_STUDENT_DATA = gql`
  mutation SaveStudentData($payload: saveStdInput) {
    saveStudentData(payload: $payload) {
      message
      success
    }
  }
`;

const UPLOAD_STUDENTS = gql`
  mutation UploadStudents($payload: [uploadStdInput]!) {
    uploadStudents(payload: $payload) {
      message
      success
    }
  }
`;

export { SAVE_NEW_STUDENT, UPLOAD_STUDENTS, SAVE_STUDENT_DATA };
