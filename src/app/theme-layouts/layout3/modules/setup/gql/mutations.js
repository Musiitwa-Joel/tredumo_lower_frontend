import { gql } from "@apollo/client";

const SAVE_UNIVERSITY_DETAILS = gql`
  mutation SaveUniversityDetails(
    $universityCode: String
    $universityTitle: String
    $entryYrs: Int
    $semetersPerAccYr: Int
    $universityXAccount: String
    $universityFacebookAccount: String
    $universityInstagramAccount: String
    $universityLogo: String
    $favicon: String
    $primaryColor: String
    $secondaryColor: String
    $contact: String
    $saveUniversityDetailsId: ID
  ) {
    saveUniversityDetails(
      university_code: $universityCode
      university_title: $universityTitle
      entry_yrs: $entryYrs
      semeters_per_acc_yr: $semetersPerAccYr
      university_x_account: $universityXAccount
      university_facebook_account: $universityFacebookAccount
      university_instagram_account: $universityInstagramAccount
      university_logo: $universityLogo
      favicon: $favicon
      primary_color: $primaryColor
      secondary_color: $secondaryColor
      contact: $contact
      id: $saveUniversityDetailsId
    ) {
      id
      university_code
      university_title
      university_logo
      entry_yrs
      semeters_per_acc_yr
      university_x_account
      university_facebook_account
      university_instagram_account
      favicon
      primary_color
      secondary_color
      contact
    }
  }
`;

const SAVE_CAMPUS = gql`
  mutation saveCampus(
    $campusTitle: String!
    $addedBy: String!
    $saveCampusId: ID
  ) {
    saveCampus(
      campus_title: $campusTitle
      added_by: $addedBy
      id: $saveCampusId
    ) {
      id
      campus_title
      added_on
      modified_by
      modified_on
      added_user {
        id
        title
        staff_name
      }
      modified_user {
        id
        title
        staff_name
      }
    }
  }
`;

const SAVE_INTAKE = gql`
  mutation saveIntake(
    $intakeTitle: String!
    $addedBy: String!
    $saveIntakeId: ID
  ) {
    saveIntake(
      intake_title: $intakeTitle
      added_by: $addedBy
      id: $saveIntakeId
    ) {
      id
      intake_title
      added_on

      added_user {
        id
        title
        staff_name
      }
      modified_on
      modified_user {
        id
        title
        staff_name
      }
    }
  }
`;

const SAVE_LEVEL = gql`
  mutation saveLevel(
    $levelCode: String!
    $saveLevelId: ID
    $levelTitle: String!
    $levelStudyTimes: [String]!
    $addedBy: String!
  ) {
    saveLevel(
      level_code: $levelCode
      id: $saveLevelId
      level_title: $levelTitle
      level_study_times: $levelStudyTimes
      added_by: $addedBy
    ) {
      id
      level_code
      level_title
      added_user {
        id
        title
        staff_name
      }
      modified_user {
        id
        title
        staff_name
      }
      modified_on
    }
  }
`;

const SAVE_AWARD = gql`
  mutation saveAward(
    $levelId: String!
    $awardTitle: String!
    $addedBy: String!
    $saveAwardId: ID
  ) {
    saveAward(
      level_id: $levelId
      award_title: $awardTitle
      added_by: $addedBy
      id: $saveAwardId
    ) {
      id
      award_title
      modified_on
      added_user {
        id
        title
        staff_name
      }
      modified_user {
        title
        staff_name
        id
      }
      level {
        id
        level_code
        level_title
      }
      level_id
    }
  }
`;

const SAVE_STUDY_TIME = gql`
  mutation SaveStudyTime(
    $studyTimeTitle: String!
    $addedBy: String!
    $saveStudyTimeId: ID
  ) {
    saveStudyTime(
      study_time_title: $studyTimeTitle
      added_by: $addedBy
      id: $saveStudyTimeId
    ) {
      id
      study_time_title
      added_user {
        id
        title
        staff_name
      }
      modified_on
      modified_user {
        id
        title
        staff_name
      }
    }
  }
`;

const SAVE_ACC_YR = gql`
  mutation SaveAccYr(
    $accYrTitle: String!
    $addedBy: String!
    $saveAccYrId: ID
  ) {
    saveAccYr(acc_yr_title: $accYrTitle, added_by: $addedBy, id: $saveAccYrId) {
      id
      acc_yr_title
      added_user {
        id
        title
        staff_name
      }
      modified_user {
        id
        title
        staff_name
      }
      modified_on
    }
  }
`;

const SAVE_ACADEMIC_SCHEDULE = gql`
  mutation saveAcademicSchedule(
    $accYrId: String!
    $intakeId: String!
    $semester: String!
    $startDate: String!
    $endDate: String!
    $addedBy: String!
    $saveAcademicScheduleId: ID
  ) {
    saveAcademicSchedule(
      acc_yr_id: $accYrId
      intake_id: $intakeId
      semester: $semester
      start_date: $startDate
      end_date: $endDate
      added_by: $addedBy
      id: $saveAcademicScheduleId
    ) {
      message
      success
    }
  }
`;

const DELETE_ACADEMIC_SCHEDULE = gql`
  mutation deleteAdcademicSchedule($scheduleId: String!) {
    deleteAdcademicSchedule(schedule_id: $scheduleId) {
      message
      success
    }
  }
`;

export {
  SAVE_UNIVERSITY_DETAILS,
  SAVE_CAMPUS,
  SAVE_INTAKE,
  SAVE_LEVEL,
  SAVE_AWARD,
  SAVE_STUDY_TIME,
  SAVE_ACC_YR,
  SAVE_ACADEMIC_SCHEDULE,
  DELETE_ACADEMIC_SCHEDULE,
};
