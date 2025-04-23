import { gql } from "@apollo/client";

const GET_ALL_PROGRAMMES_CATEGORISED_BY_COLLEGES = gql`
  query getAllProgrammesCategorisedByColleges($campusId: String) {
    colleges {
      id
      code: college_code
      label: college_title
      children: schools {
        id
        code: school_code
        label: school_title
        children: departments {
          id
          label: dpt_title
          code: dpt_code
          children: courses(campus_id: $campusId) {
            id
            code: course_code
            label: course_title
            children: course_versions {
              id
              label: version_title
              course {
                id
                course_code
                course_title
              }
            }
          }
        }
      }
    }
  }
`;

const GET_STUDENTS = gql`
  query Students(
    $campus: String
    $intake: String
    $accYr: String
    $courseVersion: String
    $sic: Boolean
    $searchCreteria: String
    $searchValue: String
  ) {
    students(
      campus: $campus
      intake: $intake
      acc_yr: $accYr
      course_version: $courseVersion
      sic: $sic
      search_creteria: $searchCreteria
      search_value: $searchValue
    ) {
      id
      student_no
      registration_no
      biodata {
        id
        surname
        other_names
        email
        phone_no
        religion
        nationality {
          id
          nationality_title
          nationality_category
        }
        nin
        gender
        marital_status
        district_of_birth
        date_of_birth
      }
      course {
        id
        course_code
        course_title
        level_details {
          level_title
        }
        school {
          id
          school_title
          school_code
          college {
            id
            college_title
          }
        }
      }
      intake_id
      intake_title
      entry_acc_yr
      entry_acc_yr_title
      course_details {
        id
        version_title
      }
      entry_study_yr
      campus_id
      campus_title
      status
      sponsorship
      study_time_id
      study_time_title
      study_yr
      current_sem
    }
  }
`;

export { GET_ALL_PROGRAMMES_CATEGORISED_BY_COLLEGES, GET_STUDENTS };
