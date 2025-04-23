import { gql } from "@apollo/client";

const GET_COLLEGES = gql`
  query Colleges {
    colleges {
      id
      college_code
      college_title
    }
  }
`;

const GET_STAFF_MEMBERS = gql`
  query staff_members {
    staff_members {
      id
      staff_id
      staff_name
      role
      email
      title
    }
  }
`;

const GET_SCHOOLS = gql`
  query getSchools {
    schools {
      id
      school_code
      school_title
      school_dean_id
      college_id
      added_on
      modified_on
      college {
        college_title
        college_code
      }
      added_user {
        title
        staff_name
      }
      modified_user {
        title
        staff_name
      }
      school_dean {
        title
        staff_name
      }
    }
  }
`;

const GET_DEPARTMENTS = gql`
  query getDepartments {
    departments {
      id
      dpt_title
      dpt_head_id
      dpt_code
      school_id
      department_head {
        title
        staff_name
      }
      school {
        school_title
        school_code
      }
      added_on
      added_user {
        title
        staff_name
      }
      modified_user {
        title
        staff_name
      }
    }
  }
`;

const GET_GRADING_SYSTEMS = gql`
  query getGradingSystems {
    grading {
      id
      grading_title
      description
    }
  }
`;

const GET_GRADING_SYSTEM_DETAILS = gql`
  query Grading_details($gradingId: String!) {
    grading_details(grading_id: $gradingId) {
      id
      min_value
      max_value
      grade_point
      grade_letter
    }
  }
`;

const GET_ALL_PROGRAMMES = gql`
  query getAllProgrammesCategorisedBySchools {
    schools {
      id
      code: school_code
      label: school_title
      children: departments {
        id
        label: dpt_title
        code: dpt_code
        children: courses {
          id
          code: course_code
          label: course_title
          children: course_versions {
            id
            label: version_title
            # course {
            #   id
            #   course_code
            #   course_title
            # }
          }
        }
      }
    }
  }
`;

const GET_ALL_COURSES = gql`
  query getAllCourses {
    courses {
      id
      course_code
      course_title
      course_duration
      course_versions {
        id
        version_title
      }
      school {
        school_code
        school_title
      }
      department {
        dpt_code
        dpt_title
      }
    }
  }
`;

const GET_COURSE_UNITS = gql`
  query getCourseUnits($courseVersionId: String!) {
    course_units(course_version_id: $courseVersionId) {
      id
      course_unit_code
      course_unit_title
      credit_units
      course_unit_year
      course_unit_sem
      course_unit_level
      grading_id
      added_on
      last_modified_on
      added_user {
        title
        staff_name
      }
      last_modified_user {
        title
        staff_name
      }
    }
  }
`;

const LOAD_COURSE_VERSION_DETAILS = gql`
  query loadCourseVersionDetails($courseVersionId: String!) {
    course_version_details(course_version_id: $courseVersionId) {
      id
      version_title
      total_credit_units
      course {
        id
        course_code
        course_title
        course_duration
        duration_measure
        campuses
        entry_yrs
        course_head_id
        college_id
        school_id
        department_id
        level
        award
        grading_id
        study_times
        is_short_course
      }
    }
  }
`;

const LOAD_COURSE_ALIASES = gql`
  query loadCourseAliases($courseId: String!) {
    course_aliases(course_id: $courseId) {
      alias_code
      campus_id
      campus_title
      course_id
      id
      study_time_id
      study_time_title
    }
  }
`;

export {
  GET_COLLEGES,
  GET_STAFF_MEMBERS,
  GET_SCHOOLS,
  GET_DEPARTMENTS,
  GET_GRADING_SYSTEMS,
  GET_GRADING_SYSTEM_DETAILS,
  GET_ALL_PROGRAMMES,
  GET_ALL_COURSES,
  GET_COURSE_UNITS,
  LOAD_COURSE_VERSION_DETAILS,
  LOAD_COURSE_ALIASES,
};
