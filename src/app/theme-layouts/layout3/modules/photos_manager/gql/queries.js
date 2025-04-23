import { gql } from "@apollo/client";

const STUDENTS_AUTOCOMPLETE = gql`
  query studentAutocomplete($query: String!) {
    student_autocomplete(query: $query) {
      id
      student_no
      name
      registration_no
      course {
        course_code
      }
    }
  }
`;

const GET_RECENTLY_UPLOADED_IMAGES = gql`
  query getRecentlyUploadedImages {
    getRecentlyUploadedImages {
      id
      stdno
      student {
        biodata {
          surname
          other_names
        }
      }
      modified_on
      uploaded_on
      added_user {
        staff_name
        title
      }
      modified_user {
        staff_name
        title
      }
      upload_status
    }
  }
`;

export { STUDENTS_AUTOCOMPLETE, GET_RECENTLY_UPLOADED_IMAGES };
