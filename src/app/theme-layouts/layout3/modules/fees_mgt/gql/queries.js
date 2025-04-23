import { gql } from "@apollo/client";

const GET_FEES_CATEGORIES = gql`
  query getFeesCategories {
    fees_categories {
      id
      category_name
      added_user {
        staff_name
        title
      }
      modified_user {
        title
        staff_name
      }
      modified_on
    }
  }
`;

const GET_ALL_PROGRAMMES_FOR_FEES = gql`
  query getAllProgrammesForFees($campusId: String) {
    schools {
      id
      school_code
      school_title
      courses(campus_id: $campusId) {
        id
        course_code
        course_title
        course_duration
        course_study_times {
          id
          study_time_title
        }
      }
    }
    nationality_categories {
      id
      category_title
    }
  }
`;

const GET_FEES_ITEMS = gql`
  query getFeesItems {
    fees_items {
      id
      item_code
      item_name
      item_description
      mandatory
      category {
        id
        category_name
      }
    }
  }
`;

const GET_FEES_VERSIONS = gql`
  query getFeesVersions {
    fees_versions {
      id
      version_title
      version_description
      added_user {
        id
        title
        staff_name
      }
      modified_user {
        id
        staff_name
        title
      }
      modified_on
    }
  }
`;

const GET_FREQUENCY_CODES = gql`
  query getFrequencyCodes {
    frequency_codes {
      id
      code_title
      code_id
    }
  }
`;

const LOAD_FEES_DATA = gql`
  query loadFeesData {
    colleges {
      id
      college_code
      college_title
      schools {
        id
        school_code
        school_title
        levels {
          id
          level_code
          level_title
          study_times {
            id
            study_time_title
          }
        }
      }
    }
    nationality_categories {
      id
      category_title
    }
  }
`;

const LOAD_TUITION_FEES = gql`
  query tuitionFees(
    $accYrId: String!
    $campusId: String!
    $intakeId: String!
    $schoolId: String!
    $courseId: String!
    $studyYr: String!
    $nationalityCategoryId: String!
    $studyTimeId: String!
  ) {
    tuition_fees(
      acc_yr_id: $accYrId
      campus_id: $campusId
      intake_id: $intakeId
      school_id: $schoolId
      course_id: $courseId
      study_yr: $studyYr
      nationality_category_id: $nationalityCategoryId
      study_time_id: $studyTimeId
    ) {
      id
      fee_item {
        id
        item_code
        item_name
      }
      amount
      frequency_code
      frequency {
        code_id
        code_title
      }
    }
  }
`;

const LOAD_LEVELS = gql`
  query loadLevels {
    levels {
      id
      level_code
      level_title
      study_times {
        id
        study_time_title
      }
    }
    nationality_categories {
      id
      category_title
    }
  }
`;

const LOAD_FUNCTIONAL_FEES = gql`
  query loadFunctionalFees(
    $accYrId: String!
    $campusId: String!
    $intakeId: String!
    $levelId: String!
    $nationalityCategoryId: String!
    $studyTimeId: String!
  ) {
    functional_fees(
      acc_yr_id: $accYrId
      campus_id: $campusId
      intake_id: $intakeId
      level_id: $levelId
      nationality_category_id: $nationalityCategoryId
      study_time_id: $studyTimeId
    ) {
      id
      fee_item {
        id
        item_code
        item_name
      }
      amount
      frequency_code
      frequency {
        code_id
        code_title
      }
    }
  }
`;

const LOAD_OTHER_FEES = gql`
  query loadOtherFees(
    $accYrId: String!
    $campusId: String!
    $intakeId: String!
    $nationalityCategoryId: String!
  ) {
    other_fees(
      acc_yr_id: $accYrId
      campus_id: $campusId
      intake_id: $intakeId
      nationality_category_id: $nationalityCategoryId
    ) {
      id
      fee_item {
        id
        item_code
        item_name
      }
      amount
    }
  }
`;

const CALCULATE_FEES_STRUCTURE = gql`
  query calculateFeesStructure(
    $accYrId: String!
    $campusId: String!
    $intakeId: String!
    $courseId: String!
    $nationalityCategoryId: String!
    $studyTimeId: String!
    $levelId: String!
    $studyYrs: [String]
    $otherFees: [String]
    $courseDuration: Int!
  ) {
    calculateFeesStructure(
      acc_yr_id: $accYrId
      campus_id: $campusId
      intake_id: $intakeId
      course_id: $courseId
      nationality_category_id: $nationalityCategoryId
      study_time_id: $studyTimeId
      level_id: $levelId
      study_yrs: $studyYrs
      other_fees: $otherFees
      course_duration: $courseDuration
    ) {
      item_code
      item_name
      mandatory
      amount
      category {
        id
        category_name
      }
      frequency_code

      study_yr
      semester
    }
  }
`;

export {
  GET_FEES_CATEGORIES,
  GET_FEES_ITEMS,
  GET_FEES_VERSIONS,
  LOAD_FEES_DATA,
  GET_ALL_PROGRAMMES_FOR_FEES,
  GET_FREQUENCY_CODES,
  LOAD_TUITION_FEES,
  LOAD_LEVELS,
  LOAD_FUNCTIONAL_FEES,
  LOAD_OTHER_FEES,
  CALCULATE_FEES_STRUCTURE,
};
