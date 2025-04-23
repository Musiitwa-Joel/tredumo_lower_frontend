import { gql } from "@apollo/client";

const SAVE_COLLEGE = gql`
  mutation SaveCollege(
    $collegeCode: String!
    $collegeTitle: String!
    $saveCollegeId: ID
  ) {
    saveCollege(
      college_code: $collegeCode
      college_title: $collegeTitle
      id: $saveCollegeId
    ) {
      id
      college_code
      college_title
    }
  }
`;

const SAVE_SCHOOL = gql`
  mutation saveSchool(
    $schoolCode: String!
    $schoolTitle: String!
    $collegeId: String!
    $addedBy: String
    $saveSchoolId: ID
    $schoolDeanId: String!
  ) {
    saveSchool(
      school_code: $schoolCode
      school_title: $schoolTitle
      college_id: $collegeId
      added_by: $addedBy
      id: $saveSchoolId
      school_dean_id: $schoolDeanId
    ) {
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

const DELETE_SCHOOL = gql`
  mutation deleteSchool($schoolId: String!) {
    deleteSchool(school_id: $schoolId) {
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

const SAVE_DEPARTMENT = gql`
  mutation saveDepartment(
    $dptCode: String!
    $dptTitle: String!
    $schoolId: String!
    $addedBy: String
    $saveDepartmentId: ID
    $dptHeadId: String!
  ) {
    saveDepartment(
      dpt_code: $dptCode
      dpt_title: $dptTitle
      school_id: $schoolId
      added_by: $addedBy
      id: $saveDepartmentId
      dpt_head_id: $dptHeadId
    ) {
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

const DELETE_DEPARTMENT = gql`
  mutation deleteDepartment($dptId: String!) {
    deleteDepartment(dpt_id: $dptId) {
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

const SAVE_GRADING = gql`
  mutation saveGrading(
    $gradingTitle: String!
    $description: String!
    $addedBy: String
    $saveGradingId: ID
  ) {
    saveGrading(
      grading_title: $gradingTitle
      description: $description
      added_by: $addedBy
      id: $saveGradingId
    ) {
      id
      grading_title
      description
    }
  }
`;

const SAVE_GRADING_DETAILS = gql`
  mutation SaveGradingDetails(
    $gradingId: String!
    $minValue: Float!
    $maxValue: Float!
    $gradePoint: Float!
    $gradeLetter: String!
    $addedBy: String
    $saveGradingDetailsId: ID
  ) {
    saveGradingDetails(
      grading_id: $gradingId
      min_value: $minValue
      max_value: $maxValue
      grade_point: $gradePoint
      grade_letter: $gradeLetter
      added_by: $addedBy
      id: $saveGradingDetailsId
    ) {
      id
      min_value
      max_value
      grade_point
      grade_letter
    }
  }
`;

const DELETE_GRADING_DETAIL = gql`
  mutation DeleteGradingDetail($gradingDetailId: String!, $gradingId: String!) {
    deleteGradingDetail(
      grading_detail_id: $gradingDetailId
      grading_id: $gradingId
    ) {
      id
      min_value
      max_value
      grade_point
      grade_letter
    }
  }
`;

const SAVE_COURSE = gql`
  mutation SaveCourse(
    $courseCode: String!
    $courseTitle: String!
    $courseDuration: Int!
    $durationMeasure: String!
    $campuses: String!
    $entryYrs: String!
    $collegeId: String!
    $schoolId: String!
    $departmentId: String!
    $level: String!
    $award: String!
    $gradingId: String!
    $isShortCourse: Boolean!
    $courseVersion: String!
    $courseHeadId: String
    $saveCourseId: ID
    $courseVersionId: String
    $studyTimes: String!
    $totalCreditUnits: Int!
  ) {
    saveCourse(
      course_code: $courseCode
      course_title: $courseTitle
      course_duration: $courseDuration
      duration_measure: $durationMeasure
      campuses: $campuses
      entry_yrs: $entryYrs
      college_id: $collegeId
      school_id: $schoolId
      department_id: $departmentId
      level: $level
      award: $award
      grading_id: $gradingId
      is_short_course: $isShortCourse
      course_version: $courseVersion
      course_head_id: $courseHeadId
      id: $saveCourseId
      course_version_id: $courseVersionId
      study_times: $studyTimes
      total_credit_units: $totalCreditUnits
    ) {
      id
      version_title
      total_credit_units
      course_id
      course {
        id
        course_code
        course_title
        course_duration
        campuses
        award
        course_head_id
        department_id
        duration_measure
        entry_yrs
        grading_id
        is_short_course
        level
        school_id
        study_times
        college_id
      }
    }
  }
`;

const UPLOAD_COURSES = gql`
  mutation UploadCourses($courses: [CourseFields]!, $uploadedBy: String!) {
    uploadCourses(courses: $courses, uploaded_by: $uploadedBy) {
      success
      message
    }
  }
`;

const DELETE_COURSE = gql`
  mutation deleteCourse($courseId: ID!) {
    deleteCourse(course_id: $courseId) {
      message
      success
    }
  }
`;

const SAVE_COURSE_VERSION = gql`
  mutation saveCourseVersion(
    $courseId: String!
    $versionTitle: String!
    $addedBy: String!
    $saveCourseVersionId: ID
  ) {
    saveCourseVersion(
      course_id: $courseId
      version_title: $versionTitle
      added_by: $addedBy
      id: $saveCourseVersionId
    ) {
      id
      version_title
      course_id
      course {
        id
        course_code
        course_title
        course_duration
        campuses
        award
        course_head_id
        department_id
        duration_measure
        entry_yrs
        grading_id
        is_short_course
        level
        school_id
        study_times
        college_id
      }
    }
  }
`;

const GENERATE_MODULE_CODE = gql`
  mutation GenerateModuleCode($courseCode: String!) {
    generateModuleCode(course_code: $courseCode)
  }
`;

const SAVE_COURSE_UNIT = gql`
  mutation SaveCourseUnit($courseUnit: CourseUnitInput!, $savedBy: String!) {
    saveCourseUnit(course_unit: $courseUnit, saved_by: $savedBy) {
      message
      success
    }
  }
`;

const SAVE_COURSE_ALIAS = gql`
  mutation saveCourseAlias($addedBy: String!, $alias: aliasInput!) {
    saveCourseAlias(added_by: $addedBy, alias: $alias) {
      message
      success
    }
  }
`;

const DELETE_COURSE_ALIAS = gql`
  mutation deleteCourseAlias($aliasId: ID!) {
    deleteCourseAlias(alias_id: $aliasId) {
      success
      message
    }
  }
`;

const UPLOAD_COURSE_UNITS = gql`
  mutation uploadCourseUnits($courseUnits: [CourseUnitUploadInput]!) {
    uploadCourseUnits(course_units: $courseUnits) {
      message
      success
    }
  }
`;

const DELETE_COURSE_UNIT = gql`
  mutation deleteCourseUnit($unitId: String!) {
    deleteCourseUnit(unit_id: $unitId) {
      message
      success
    }
  }
`;

const DELETE_COURSE_VERSION = gql`
  mutation deleteCourseVersion($courseVersionId: ID!) {
    deleteCourseVersion(course_version_id: $courseVersionId) {
      message
      success
    }
  }
`;

export {
  SAVE_COLLEGE,
  SAVE_SCHOOL,
  DELETE_SCHOOL,
  SAVE_DEPARTMENT,
  DELETE_DEPARTMENT,
  SAVE_GRADING,
  SAVE_GRADING_DETAILS,
  DELETE_GRADING_DETAIL,
  SAVE_COURSE,
  UPLOAD_COURSES,
  SAVE_COURSE_VERSION,
  GENERATE_MODULE_CODE,
  SAVE_COURSE_UNIT,
  SAVE_COURSE_ALIAS,
  DELETE_COURSE_ALIAS,
  UPLOAD_COURSE_UNITS,
  DELETE_COURSE_UNIT,
  DELETE_COURSE,
  DELETE_COURSE_VERSION,
};
