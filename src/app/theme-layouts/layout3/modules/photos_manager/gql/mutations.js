import { gql } from "@apollo/client";

const SAVE_STUDENT_IMAGE = gql`
  mutation saveStudentImage(
    $stdno: String!
    $saveStudentImageId: ID
    $uploadedBy: String!
    $file: Upload
  ) {
    saveStudentImage(
      stdno: $stdno
      id: $saveStudentImageId
      uploaded_by: $uploadedBy
      file: $file
    ) {
      message
      success
    }
  }
`;

export { SAVE_STUDENT_IMAGE };
