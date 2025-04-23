import { gql } from "@apollo/client";

const GET_UNIVERSITY_DETAILS = gql`
  query University_details {
    university_details {
      id
      university_code
      university_title
      university_logo
      contact
      entry_yrs
      semeters_per_acc_yr
      university_x_account
      university_facebook_account
      university_instagram_account
      favicon
      primary_color
      secondary_color
    }
  }
`;

const GET_CAMPUSES = gql`
  query getCampuses {
    campuses {
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

const GET_INTAKES = gql`
  query getIntakes {
    intakes {
      id
      intake_title
      added_on
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

const GET_LEVELS = gql`
  query getLevels {
    levels {
      id
      level_code
      level_title
      study_times {
        id
        study_time_title
      }
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

const GET_AWARDS = gql`
  query getAwards {
    awards {
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

const GET_STUDY_TIMES = gql`
  query getStudyTimes {
    study_times {
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

const GET_ACC_YRS = gql`
  query getAccYrs {
    acc_yrs {
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

const GET_ACADEMIC_SCHEDULES = gql`
  query getAcademicSchedules {
    academic_schedules {
      id
      intake {
        id
        intake_title
      }
      acc_yr {
        id
        acc_yr_title
      }
      semester
      start_date
      end_date
      status
    }
  }
`;

const LOAD_STUDENT_TRANSACTIONS = gql`
  query loadStudentTransactions($studentNo: String!) {
    student_transactions(student_no: $studentNo) {
      prt
      bank_name
      bank_branch
      payment_date
      amount
      unallocated
      is_dp
      is_pp
    }
  }
`;

export {
  GET_UNIVERSITY_DETAILS,
  GET_CAMPUSES,
  GET_INTAKES,
  GET_LEVELS,
  GET_AWARDS,
  GET_STUDY_TIMES,
  GET_ACC_YRS,
  GET_ACADEMIC_SCHEDULES,
  LOAD_STUDENT_TRANSACTIONS,
};
