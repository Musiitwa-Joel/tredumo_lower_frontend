import { gql } from "@apollo/client";

const SAVE_DESIGNATION = gql`
  mutation saveDesignation($payload: DesignationInput!) {
    saveDesignation(payload: $payload) {
      message
      success
    }
  }
`;

const DELETE_DESIGNATION = gql`
  mutation deleteDesignation($deleteDesignationId: String!) {
    deleteDesignation(id: $deleteDesignationId) {
      message
    }
  }
`;

const SAVE_EMPLOYEE = gql`
  mutation saveEmployee($payload: EmployeeInput!) {
    saveEmployee(payload: $payload) {
      message
      success
    }
  }
`;

const UPLOAD_EMPLOYEES = gql`
  mutation uploadEmployees($payload: [uploadEmployeeInput]!) {
    uploadEmployees(payload: $payload) {
      message
      success
    }
  }
`;

const SAVE_APPRAISAL_TEMPLATE = gql`
  mutation saveEvaluationTemplate($payload: EvaluationTemplateInput) {
    saveEvaluationTemplate(payload: $payload) {
      message
      success
    }
  }
`;

const DELETE_APPTRAISAL_TEMPLATE = gql`
  mutation deleteEvaluationTemplate($templateId: ID!) {
    deleteEvaluationTemplate(template_id: $templateId) {
      message
      success
    }
  }
`;

const SAVE_PERFORMANCE_REVIEW = gql`
  mutation savePerformanceReview($payload: PerformanceReviewInput) {
    savePerformanceReview(payload: $payload) {
      message
      success
    }
  }
`;

const SAVE_REPORTING = gql`
  mutation saveReporting($payload: ReportingInput) {
    saveReporting(payload: $payload) {
      message
      success
    }
  }
`;

export {
  SAVE_DESIGNATION,
  DELETE_DESIGNATION,
  SAVE_EMPLOYEE,
  UPLOAD_EMPLOYEES,
  SAVE_APPRAISAL_TEMPLATE,
  DELETE_APPTRAISAL_TEMPLATE,
  SAVE_PERFORMANCE_REVIEW,
  SAVE_REPORTING,
};
