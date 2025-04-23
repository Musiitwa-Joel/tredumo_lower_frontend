import { gql } from "@apollo/client";

const LOAD_DESIGNATIONS = gql`
  query loadDesignations {
    designations {
      id
      designation_name
      created_on
    }
  }
`;

const LOAD_EMPLOYEES = gql`
  query loadEmployees {
    employees {
      id
      salutation
      surname
      other_names
      staff_id
      designation
      email
      telno
    }
  }
`;

const LOAD_ALL_EMPLOYEES = gql`
  query AllEmployees {
    employees {
      id
      salutation_id
      salutation
      surname
      other_names
      staff_id
      email
      joining_date
      telno
      school {
        departments {
          dpt_head_id
          dpt_code
          dpt_title
        }
      }
      religion
      gender
      status
      salary
      date_of_birth
      marital_status
      medical_condition
      emergency_contact
      disability
      illnesses
      mother_deceased
      mothers_email
      mothers_name
      mothers_nin
      mothers_telno
      father_deceased
      fathers_email
      nationality
      fathers_name
      fathers_nin
      fathers_telno
      next_of_kin {
        id
        name
        email
        relation
        telno
      }
      college {
        id
        college_code
        college_title
      }
      employees_education_info {
        id
        employee_id
        institution
        start_date
        end_date
        award_obtained
        award_duration
        grade
      }
    }
  }
`;

const LOAD_EMPLOYEE_DETAILS = gql`
  query Employee($employeeId: ID!) {
    employee(id: $employeeId) {
      id
      salutation_id
      salutation
      surname
      other_names
      staff_id
      email
      nin
      nssf_no
      gender
      status
      nationality
      address
      telno
      joining_date
      religion
      salary
      date_of_birth
      marital_status
      medical_condition
      emergency_contact
      illnesses
      disability
      father_deceased
      mother_deceased
      fathers_name
      fathers_email
      fathers_nin
      fathers_telno
      mothers_email
      mothers_name
      mothers_nin
      mothers_telno
      approvers {
        id
        name
        approver_type
        approver_id
      }
      college {
        id
        college_code
        college_title
      }
      school {
        departments {
          dpt_head_id
          dpt_code
          dpt_title
        }
      }
      employees_education_info {
        id
        employee_id
        institution
        start_date
        end_date
        award_obtained
        award_duration
        grade
      }
    }
  }
`;

const LOAD_EVALUATION_TEMPLATES = gql`
  query loadEvaluationTemplates {
    evaluation_templates {
      template_id
      template_name
      description
    }
  }
`;

const LOAD_EVALUATION_TEMPLATE_QNS = gql`
  query loadEvaluationTemplateQuestions($templateId: ID!) {
    evaluation_template_questions(template_id: $templateId) {
      section_id
      section_title
      section_order
      questions {
        question_id
        question_name
        description
      }
    }
  }
`;

const LOAD_PERFORMANCE_REVIEWS = gql`
  query loadPerformanceReview {
    performance_reviews {
      id
      employee_id
      employee_name
      template_id
      template_name
      review_period
      status
      added_by
      added_by_name
      added_on
    }
  }
`;

const LOAD_PERFORMANCE_REVIEW_DETAILS = gql`
  query performanceReview($performanceReviewId: ID!) {
    performance_review(id: $performanceReviewId) {
      id
      employee {
        email
        telno
        staff_id
      }
      template {
        template_id
        template_name
        sections {
          section_id
          section_title
          section_order
          questions {
            question_name
            description
            question_id
            question_order
          }
        }
      }
      employee_approvers {
        id
        name
        approver_type
        approver_id
      }
    }
  }
`;
export {
  LOAD_DESIGNATIONS,
  LOAD_EMPLOYEES,
  LOAD_EMPLOYEE_DETAILS,
  LOAD_ALL_EMPLOYEES,
  LOAD_EVALUATION_TEMPLATES,
  LOAD_EVALUATION_TEMPLATE_QNS,
  LOAD_PERFORMANCE_REVIEWS,
  LOAD_PERFORMANCE_REVIEW_DETAILS,
};
