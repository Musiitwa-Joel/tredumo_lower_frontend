import apiClient from "../client";

const loadApplicantsReqs = (user_id, scheme_id) =>
  apiClient.get(`/admissions/admission_reqs/`);

const apiCalls = {
  loadApplicantsReqs,
};

export default apiCalls;
