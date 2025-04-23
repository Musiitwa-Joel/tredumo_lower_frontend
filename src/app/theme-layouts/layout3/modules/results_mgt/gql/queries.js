import { gql } from "@apollo/client";

const GET_STUDENT_MARKS = gql`
  query getStudentMarks($studentNo: String!) {
    get_student_marks(student_no: $studentNo) {
      id
      student_no
      biodata {
        surname
        other_names
        date_of_birth
        gender
      }
      registration_no
      course_details {
        version_title
        course {
          course_code
          course_title
          school {
            school_code
            school_title
          }
        }
      }
      student_marks {
        student_no
        acc_yr_title
        course_unit_code
        course_unit_title
        study_yr
        semester
        yrsem
        coursework
        exam
        credit_units
        final_mark
        grade
        grade_point
        GPA
        CGPA
        TCU
        CTCU
        CTWS
        remarks
      }
    }
  }
`;

const GET_ALL_COURSES = gql`
  query getAllCourses($campusId: String) {
    schools {
      id
      school_code
      school_title
      courses(campus_id: $campusId) {
        id
        course_code
        course_title
        course_duration
        course_versions {
          id
          version_title
        }
      }
    }
  }
`;

const GET_RESULTS_CONFIG = gql`
  query getResultsConfig {
    get_result_config {
      acc_yr
      acc_yr_id
      campus
      campus_id
      intake
      intake_id
      sem
      study_time
      study_time_id
      study_yr
    }
  }
`;

const LOAD_RESULTS = gql`
  query results($payload: ResultsInput!, $studyYr: String, $sem: String) {
    results(payload: $payload) {
      course_units {
        course_unit_code
        course_unit_title
      }
      students_marks {
        biodata {
          surname
          other_names
          gender
        }
        student_no
        registration_no
        study_time_title
        student_marks(study_yr: $studyYr, sem: $sem) {
          course_unit_title
          course_unit_code
          coursework
          exam
          final_mark
          grade_point
          retake_count
          CGPA
          remarks
        }
      }
    }
  }
`;

const LOAD_STDS_RESULTS = gql`
  query loadStdsMarks($studentNos: [String]!) {
    std_marks(student_nos: $studentNos) {
      id
      student_no
      biodata {
        surname
        other_names
        date_of_birth
        gender
      }
      registration_no
      course_details {
        version_title
        course {
          course_code
          course_title
          school {
            school_code
            school_title
          }
        }
      }
      student_marks {
        student_no
        acc_yr_title
        course_unit_code
        course_unit_title
        study_yr
        semester
        yrsem
        coursework
        exam
        credit_units
        final_mark
        grade
        grade_point
        GPA
        CGPA
        TCU
        CTCU
        CTWS
        remarks
      }
    }
  }
`;

const LOAD_RESULTS_HISTORY = gql`
  query Load_results_history($payload: ResultsHistoryInput!) {
    load_results_history(payload: $payload) {
      student_no
      student_info {
        registration_no
        biodata {
          surname
          other_names
          gender
        }
        course_details {
          version_title
        }
      }
      course_unit_code
      course_unit_title
      coursework
      exam
      final_mark
      retake_count
      credit_units
      uploaded_by_user
      cw_uploaded_by_user
      cw_uploaded_at
      date_time
    }
  }
`;

export {
  GET_STUDENT_MARKS,
  GET_ALL_COURSES,
  GET_RESULTS_CONFIG,
  LOAD_RESULTS,
  LOAD_STDS_RESULTS,
  LOAD_RESULTS_HISTORY,
};
