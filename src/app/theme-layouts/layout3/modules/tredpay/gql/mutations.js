import { gql } from "@apollo/client";

const SAVE_FEES_CATEGORY = gql`
  mutation saveFeesCategory(
    $category: String!
    $addedBy: String!
    $saveFeesCategoryId: ID
  ) {
    saveFeesCategory(
      category: $category
      added_by: $addedBy
      id: $saveFeesCategoryId
    ) {
      message
      success
    }
  }
`;

const DELETE_FEES_CATEGORY = gql`
  mutation deleteFeesCategory($categoryId: ID!) {
    deleteFeesCategory(category_id: $categoryId) {
      message
      success
    }
  }
`;

const SAVE_FEES_ITEM = gql`
  mutation saveFeesItem(
    $itemCode: String!
    $itemName: String!
    $category: String!
    $itemDescription: String
    $mandatory: Int
    $saveFeesItemId: ID
  ) {
    saveFeesItem(
      item_code: $itemCode
      item_name: $itemName
      category: $category
      item_description: $itemDescription
      mandatory: $mandatory
      id: $saveFeesItemId
    ) {
      message
      success
    }
  }
`;

const DELETE_FEES_ITEM = gql`
  mutation DeleteFeesItem($feesItemId: ID!) {
    deleteFeesItem(fees_item_id: $feesItemId) {
      message
      success
    }
  }
`;

const SAVE_FEES_VERSION = gql`
  mutation SaveFeesVersion(
    $versionTitle: String!
    $addedBy: String!
    $versionDescription: String
    $saveFeesVersionId: ID
  ) {
    saveFeesVersion(
      version_title: $versionTitle
      added_by: $addedBy
      version_description: $versionDescription
      id: $saveFeesVersionId
    ) {
      message
      success
    }
  }
`;

const DELETE_FEES_VERSION = gql`
  mutation deleteFeesVersion($versionId: ID!) {
    deleteFeesVersion(version_id: $versionId) {
      message
      success
    }
  }
`;

const SAVE_SCHOOL_LEVELS = gql`
  mutation saveSchoolLevels(
    $schoolId: String!
    $levels: [String]!
    $addedBy: String!
  ) {
    saveSchoolLevels(
      school_id: $schoolId
      levels: $levels
      added_by: $addedBy
    ) {
      success
      message
    }
  }
`;

const SAVE_TUITION_FEE = gql`
  mutation saveTuitionFee(
    $accYrId: String!
    $campusId: String!
    $intakeId: String!
    $schoolId: String!
    $courseId: String!
    $studyYr: String!
    $nationalityCategoryId: String!
    $studyTimeId: String!
    $itemId: String!
    $amount: String!
    $frequencyCode: String!
    $addedBy: String!
    $saveTuitionFeeId: ID
  ) {
    saveTuitionFee(
      acc_yr_id: $accYrId
      campus_id: $campusId
      intake_id: $intakeId
      school_id: $schoolId
      course_id: $courseId
      study_yr: $studyYr
      nationality_category_id: $nationalityCategoryId
      study_time_id: $studyTimeId
      item_id: $itemId
      amount: $amount
      frequency_code: $frequencyCode
      added_by: $addedBy
      id: $saveTuitionFeeId
    ) {
      message
      success
    }
  }
`;

const DELETE_TUITION_FESS = gql`
  mutation deleteTuitionFee($tuitionFeeId: String!) {
    deleteTuitionFee(tuition_fee_id: $tuitionFeeId) {
      message
      success
    }
  }
`;

const SAVE_FUNCTIONAL_FEE = gql`
  mutation saveFunctionalFee(
    $accYrId: String!
    $campusId: String!
    $intakeId: String!
    $levelId: String!
    $nationalityCategoryId: String!
    $studyTimeId: String!
    $itemId: String!
    $amount: String!
    $frequencyCode: String!
    $addedBy: String!
    $saveFunctionalFeeId: ID
  ) {
    saveFunctionalFee(
      acc_yr_id: $accYrId
      campus_id: $campusId
      intake_id: $intakeId
      level_id: $levelId
      nationality_category_id: $nationalityCategoryId
      study_time_id: $studyTimeId
      item_id: $itemId
      amount: $amount
      frequency_code: $frequencyCode
      added_by: $addedBy
      id: $saveFunctionalFeeId
    ) {
      message
      success
    }
  }
`;

const DELETE_FUNCTIONAL_FEE = gql`
  mutation DeleteFuntionalFee($functionalFeeId: String!) {
    deleteFuntionalFee(functional_fee_id: $functionalFeeId) {
      message
      success
    }
  }
`;

const SAVE_OTHER_FEE = gql`
  mutation saveOtherFee(
    $accYrId: String!
    $campusId: String!
    $intakeId: String!
    $nationalityCategoryId: String!
    $itemId: String!
    $amount: String!
    $addedBy: String!
    $saveOtherFeeId: ID
  ) {
    saveOtherFee(
      acc_yr_id: $accYrId
      campus_id: $campusId
      intake_id: $intakeId
      nationality_category_id: $nationalityCategoryId
      item_id: $itemId
      amount: $amount
      added_by: $addedBy
      id: $saveOtherFeeId
    ) {
      message
      success
    }
  }
`;

const DELETE_OTHER_FEE = gql`
  mutation DeleteOtherFee($otherFeeId: String!) {
    deleteOtherFee(other_fee_id: $otherFeeId) {
      message
      success
    }
  }
`;

const COPY_FEES_STRUCTURE = gql`
  mutation CopyFeesStructure(
    $fromAccYrId: String!
    $fromCampusId: String!
    $fromIntakeId: String!
    $toAccYrId: String!
    $toCampusId: String!
    $toIntakeId: String!
    $scope: [String]!
    $overwrite: Int!
    $addedBy: String!
  ) {
    copyFeesStructure(
      from_acc_yr_id: $fromAccYrId
      from_campus_id: $fromCampusId
      from_intake_id: $fromIntakeId
      to_acc_yr_id: $toAccYrId
      to_campus_id: $toCampusId
      to_intake_id: $toIntakeId
      scope: $scope
      overwrite: $overwrite
      added_by: $addedBy
    ) {
      message
      success
    }
  }
`;

export {
  SAVE_FEES_CATEGORY,
  DELETE_FEES_CATEGORY,
  SAVE_FEES_ITEM,
  DELETE_FEES_ITEM,
  SAVE_FEES_VERSION,
  DELETE_FEES_VERSION,
  SAVE_SCHOOL_LEVELS,
  SAVE_TUITION_FEE,
  DELETE_TUITION_FESS,
  SAVE_FUNCTIONAL_FEE,
  DELETE_FUNCTIONAL_FEE,
  SAVE_OTHER_FEE,
  DELETE_OTHER_FEE,
  COPY_FEES_STRUCTURE,
};
