import { gql } from "@apollo/client";

const GET_ADMISSION_LEVELS = gql`
  query getAdmissionLevels {
    admission_levels {
      admission_level_title
      prog_levels
      admission_level_description
      id
      created_user {
        title
        staff_name
        id
      }
      modified_user {
        id
        staff_name
        title
      }
      created_by
      modified_by
      created_on
      modified_on
    }
  }
`;

const GET_SCHEMES = gql`
  query getSchemes {
    schemes {
      id
      scheme_title
      is_active
      created_by
      created_on
      modified_on
      description
      created_user {
        id
        staff_name
        title
      }
      modified_user {
        id
        staff_name
        title
      }
    }
  }
`;

const LOAD_ADMISSION_SETUP_REQUIREMENTS = gql`
  query loadAdmissionSetupRequirements {
    intakes {
      id
      intake_title
    }
    schemes {
      id
      scheme_title
    }
    admission_levels {
      id
      admission_level_title
    }
    acc_yrs {
      id
      acc_yr_title
    }
  }
`;

const GET_RUNNING_ADMISSIONS = gql`
  query getRunningAdmissions {
    running_admissions {
      id
      start_date
      end_date
      national_application_fees
      east_african_application_fees
      international_application_fees
      national_admission_fees
      east_african_admission_fees
      international_admission_fees
      no_of_choices
      max_no_of_forms
      activate_admission_fees
      form_template_id
      created_on
      intake {
        id
        intake_title
      }
      scheme {
        id
        scheme_title
      }
      acc_yr {
        id
        acc_yr_title
      }
      admission_level {
        id
        admission_level_title
      }
      created_user {
        title
        staff_name
      }
      modified_on
      modified_user {
        staff_name
        title
      }
    }
  }
`;

const GET_COURSES_BASED_ON_LEVEL = gql`
  query getCoursesBasedOnLevel($admissionLevelId: String!) {
    courses_based_on_level(admission_level_id: $admissionLevelId) {
      id
      course_code
      course_title
      study_times
      course_duration
      school {
        id
        school_code
        school_title
      }
      level_details {
        id
        level_code
        level_title
      }
    }
  }
`;

const GET_ADVERTISED_COURSES = gql`
  query getAdvertisedCourses($runningAdmissionId: String!) {
    advertised_courses(running_admission_id: $runningAdmissionId) {
      id
      course_code
      course_title
      study_times
      advertised_course_id
      course_duration
      school {
        id
        school_code
        school_title
      }
      level_details {
        id
        level_code
        level_title
      }
    }
  }
`;

const LOAD_APPLICANT_REQS = gql`
  query loadApplicantRequirements {
    acc_yrs {
      id
      acc_yr_title
    }
    schemes {
      id
      scheme_title
    }
    intakes {
      id
      intake_title
    }
    schools {
      id
      school_code
      school_title
    }
  }
`;

const LOAD_APPLICANTS_SUMMARY = gql`
  query ApplicantsSammary(
    $accYrId: String!
    $schemeId: String!
    $intakeId: String!
    $completed: Boolean
    $schoolId: String!
  ) {
    applicantsSammary(
      acc_yr_id: $accYrId
      scheme_id: $schemeId
      intake_id: $intakeId
      completed: $completed
      school_id: $schoolId
    ) {
      admissions_id
      campus_id
      campus_title
      course_id
      course_code
      student_count
      course_title
    }
  }
`;

const LOAD_APPLICATIONS = gql`
  query loadApplications(
    $admissionsId: String
    $courseId: String
    $campusId: String
    $isCompleted: Boolean
  ) {
    applications(
      admissions_id: $admissionsId
      course_id: $courseId
      campus_id: $campusId
      is_completed: $isCompleted
    ) {
      id
      form_no
      is_admitted
      is_completed
      running_admissions {
        id
        scheme {
          scheme_title
        }
        intake {
          intake_title
        }
        acc_yr {
          acc_yr_title
        }
        admission_level {
          id
          admission_level_title
        }
        start_date
        end_date
      }
      status
      is_paid
      creation_date
      application_fee
      applicant {
        id
        surname
        other_names
        gender
        email
      }
      program_choices {
        id
        choice_no
        course {
          course_code
          course_title
        }
        course_id
      }
      std_id
    }
  }
`;

const LOAD_APPLICATION_DETAILS = gql`
  query loadApplicationDetails(
    $admissionsId: String
    $applicantId: String!
    $formNo: String
    $admissionLevelId: String!
  ) {
    application(
      admissions_id: $admissionsId
      applicant_id: $applicantId
      form_no: $formNo
    ) {
      id
      form_no
      admissions_id
      applicant_id
      creation_date
      is_completed
      is_paid
      is_verified
      is_admitted
      status
      has_other_qualifications
      has_attachments
      completed_section_ids
      running_admissions {
        id
        intake {
          id
          intake_title
        }
        scheme {
          id
          scheme_title
        }
        acc_yr {
          id
          acc_yr_title
        }
        admission_level {
          admission_level_title
        }
        start_date
        end_date
      }
      applicant {
        id
        salutation_id
        surname
        other_names
        salutation
        nin
        date_of_birth
        district_of_birth
        district_of_origin
        place_of_residence
        religion
        created_at
        email
        gender
        nationality {
          nationality_title
        }

        phone_no
        is_verified
        marital_status
        is_complete
      }
      program_choices {
        id
        choice_no
        course_id
        campus_id
        campus_title
        study_time_id
        study_time_title
        entry_yr
        course {
          id
          course_code
          course_title
          campuses
          entry_yrs
          study_times
        }
      }
      olevel_info {
        id
        did_exams
        school {
          id
          center_number
          center_name
        }
        index_no
        year_of_sitting
        uneb_results {
          id
          subject {
            id
            uneb_subject_code
            uneb_subject_title
          }
          grade
        }
        total_distinctions
        total_credits
        total_passes
      }
      alevel_info {
        id
        did_exams
        school {
          id
          center_number
          center_name
        }
        index_no
        year_of_sitting
        uneb_results {
          id
          subject {
            id
            uneb_subject_code
            uneb_subject_title
          }
          grade
        }
      }
      other_qualifications {
        id
        institute_name
        award_obtained
        award_type
        award_duration
        awarding_body
        start_date
        end_date
        grade
      }
      attachments {
        id
        file_name
        description
        url
      }
      next_of_kin {
        id
        full_name
        email
        address
        phone_no
        relation
      }
      application_fee
      application_fee
      submission_date
      is_completed
    }
    applicant_form_sections(admission_level_id: $admissionLevelId) {
      section_id
      section_title
    }
  }
`;

const LOAD_ADMITTED_STDS_SUMMARY = gql`
  query getAdmittedStdsSummary(
    $accYrId: String!
    $schemeId: String!
    $intakeId: String!
    $schoolId: String!
  ) {
    admitted_students_summary(
      acc_yr_id: $accYrId
      scheme_id: $schemeId
      intake_id: $intakeId
      school_id: $schoolId
    ) {
      admissions_id
      campus_id
      campus_title
      course_code
      course_title
      student_count
      course_id
    }
  }
`;

const LOAD_ADMITTED_STUDENTS = gql`
  query loadAdmittedStudents(
    $admissionsId: String
    $courseId: String
    $campusId: String
  ) {
    admitted_students(
      admissions_id: $admissionsId
      course_id: $courseId
      campus_id: $campusId
    ) {
      std_id
      student_no
      registration_no
      form_no
      campus_id
      campus_title
      study_time_id
      study_time_title
      intake_id
      intake_title
      biodata {
        id
        surname
        other_names
        email
        nationality {
          id
          nationality_title
          nationality_category
        }
        gender
      }
      course {
        id
        course_code
      }
      entry_study_yr
      admitted_on
      admitted_by_user
      is_std_verified
      is_resident
    }
  }
`;

const LOAD_ADMISSION_LETTERS = gql`
  query loadAdmissionLetters {
    admission_letters {
      id
      intake_id
      intake_title
      name
      scheme_id
      scheme_title
      template_id
      layout_width
      layout_height
      reporting_dates
      registration_dates
      lecture_dates
      file_name
      content
      created_on
      last_modified_by
      last_modified_on
      last_modified_by_user
    }
  }
`;

const PRINT_ADMISSION_LETTERS = gql`
  query printAdmissionLetters($students: [LetterPreviewInput]) {
    print_admission_letters(students: $students) {
      admission_letter
      background_image
    }
  }
`;

const GLOBAL_SEARCH_APPLICATIONS = gql`
  query global_search_applications(
    $searchCriteria: String!
    $searchValue: String!
    $admissionsId: String
    $admitted: String
  ) {
    global_search_applications(
      search_criteria: $searchCriteria
      search_value: $searchValue
      admissions_id: $admissionsId
      admitted: $admitted
    ) {
      std_id
      student_no
      registration_no
      form_no
      campus_id
      campus_title
      study_time_id
      study_time_title
      intake_id
      intake_title
      biodata {
        id
        surname
        other_names
        email
        nationality {
          id
          nationality_title
          nationality_category
        }
        gender
      }
      course {
        id
        course_code
      }
      entry_study_yr
      admitted_on
      admitted_by_user
      is_std_verified
      is_resident
    }
  }
`;

export {
  GET_SCHEMES,
  GET_ADMISSION_LEVELS,
  LOAD_ADMISSION_SETUP_REQUIREMENTS,
  GET_RUNNING_ADMISSIONS,
  GET_COURSES_BASED_ON_LEVEL,
  GET_ADVERTISED_COURSES,
  LOAD_APPLICANT_REQS,
  LOAD_APPLICANTS_SUMMARY,
  LOAD_APPLICATIONS,
  LOAD_APPLICATION_DETAILS,
  LOAD_ADMITTED_STDS_SUMMARY,
  LOAD_ADMITTED_STUDENTS,
  LOAD_ADMISSION_LETTERS,
  PRINT_ADMISSION_LETTERS,
  GLOBAL_SEARCH_APPLICATIONS,
};
