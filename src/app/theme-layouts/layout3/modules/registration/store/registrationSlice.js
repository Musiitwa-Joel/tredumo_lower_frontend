import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

const regReportInputInitialState = {
  acc_yr_id: null,
  campus_id: null,
  college_id: null,
  intake_id: null,
  sem: null,
  study_time_id: null,
  school_id: null,
  ccourse_id: null,
};

const initialState = {
  activeTab: 0,
  activeRegisterTab: "biodata",
  studentNo: "",
  studentData: null,
  loadingStudentData: false,
  enrollModalVisible: false,
  enrollmentStatuses: [],
  specificEnrollmentStatuses: [],
  hideInconsistences: false,
  addEnrollmentModelVisible: false,
  selectedEnrollment: null,
  deletingEnrollment: false,
  editEnrollmentModalVisible: false,
  paymentModalVisible: false,
  paymentSlipVisible: false,
  tokenRes: null,
  invoiceDetailsModalVisible: false,
  selectedInvoice: null,
  modulesEnrollmentModalOpen: false,
  registrationmodalVisible: false,
  regPermitModalVisible: false,
  provisionalRegModalVisible: false,
  activeRegReportsTab: "1",
  registrationReport: null,
  registrationReportLoading: false,
  studentsModalVisible: false,
  regReportInput: regReportInputInitialState,
  selection: null,
};
/**
 * The File Manager App slice.
 */
export const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setActiveRegisterTab: (state, action) => {
      state.activeRegisterTab = action.payload;
    },
    setStudentNo: (state, action) => {
      state.studentNo = action.payload;
    },
    setStudentData: (state, action) => {
      state.studentData = action.payload;
    },
    setLoadingStudentData: (state, action) => {
      state.loadingStudentData = action.payload;
    },
    setEnrollModalVisible: (state, action) => {
      state.enrollModalVisible = action.payload;
    },
    setEnrollmentStatuses: (state, action) => {
      state.enrollmentStatuses = action.payload;
    },
    setSpecificEnrollmentStatuses: (state, action) => {
      state.specificEnrollmentStatuses = action.payload;
    },
    setHideInconsistences: (state, action) => {
      state.hideInconsistences = action.payload;
    },
    setAddEnrollmentModelVisible: (state, action) => {
      state.addEnrollmentModelVisible = action.payload;
    },
    setSelectedEnrollment: (state, action) => {
      state.selectedEnrollment = action.payload;
    },
    setDeletingEnrollment: (state, action) => {
      state.deletingEnrollment = action.payload;
    },
    setEditEnrollmentVisible: (state, action) => {
      state.editEnrollmentModalVisible = action.payload;
    },
    setPaymentModalVisible: (state, action) => {
      state.paymentModalVisible = action.payload;
    },
    setPaymentSlipVisible: (state, action) => {
      state.paymentSlipVisible = action.payload;
    },
    setTokenRes: (state, action) => {
      state.tokenRes = action.payload;
    },
    setInvoiceDetailsModalVisible: (state, action) => {
      state.invoiceDetailsModalVisible = action.payload;
    },
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
    },
    setModulesEnrollmentModalOpen: (state, action) => {
      state.modulesEnrollmentModalOpen = action.payload;
    },
    setRegistrationModalVisible: (state, action) => {
      state.registrationmodalVisible = action.payload;
    },
    setRegistrationPermitModalVisible: (state, action) => {
      state.regPermitModalVisible = action.payload;
    },
    setProvisionalRegModalVisible: (state, action) => {
      state.provisionalRegModalVisible = action.payload;
    },
    setActiveRegReportsTab: (state, action) => {
      state.activeRegReportsTab = action.payload;
    },
    setRegistrationReport: (state, action) => {
      state.registrationReport = action.payload;
    },
    setRegistrationReportLoading: (state, action) => {
      state.registrationReportLoading = action.payload;
    },
    setStudentsModalVisible: (state, action) => {
      state.studentsModalVisible = action.payload;
    },
    setRegReportInput: (state, action) => {
      state.regReportInput = action.payload;
    },
    setSelecttion: (state, action) => {
      state.selection = action.payload;
    },
  },

  selectors: {
    selectActiveTab: (state) => state.activeTab,
    selectActiveRegisterTab: (state) => state.activeRegisterTab,
    selectStudentNo: (state) => state.studentNo,
    selectStudentData: (state) => state.studentData,
    selectLoadingStudentData: (state) => state.loadingStudentData,
    selectEnrollModalVisible: (state) => state.enrollModalVisible,
    selectEnrollmentStatuses: (state) => state.enrollmentStatuses,
    selectSpecificEnrollmentStatuses: (state) =>
      state.specificEnrollmentStatuses,
    selectHideIncinsistences: (state) => state.hideInconsistences,
    selectAddEnrollmentModalVisible: (state) => state.addEnrollmentModelVisible,
    selectSelectedEnrollment: (state) => state.selectedEnrollment,
    selectDeletingEnrollment: (state) => state.deletingEnrollment,
    selectEditEnrollmentModelVisible: (state) =>
      state.editEnrollmentModalVisible,
    selectPaymentModalVisible: (state) => state.paymentModalVisible,
    selectPaymentSlipVisible: (state) => state.paymentSlipVisible,
    selectTokenRes: (state) => state.tokenRes,
    selectInvoiceDetailsModalVisible: (state) =>
      state.invoiceDetailsModalVisible,
    selectSelectedInvoice: (state) => state.selectedInvoice,
    selectModulesEnrollmentModalOpen: (state) =>
      state.modulesEnrollmentModalOpen,
    selectRegistrationModalVisible: (state) => state.registrationmodalVisible,
    selectRegistrationPermitModalVisible: (state) =>
      state.regPermitModalVisible,
    selectProvisionalRegModalVisible: (state) =>
      state.provisionalRegModalVisible,
    selectActiveRegReportsTab: (state) => state.activeRegReportsTab,
    selectRegistrationReport: (state) => state.registrationReport,
    selectRegistrationReportLoading: (state) => state.registrationReportLoading,
    selectStudentsModalVisible: (state) => state.studentsModalVisible,
    selectRegReportInput: (state) => state.regReportInput,
    selectSelection: (state) => state.selection,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(registrationSlice);
const injectedSlice = registrationSlice.injectInto(rootReducer);
export const {
  setActiveTab,
  setActiveRegisterTab,
  setStudentNo,
  setStudentData,
  setLoadingStudentData,
  setEnrollModalVisible,
  setEnrollmentStatuses,
  setSpecificEnrollmentStatuses,
  setHideInconsistences,
  setAddEnrollmentModelVisible,
  setSelectedEnrollment,
  setDeletingEnrollment,
  setEditEnrollmentVisible,
  setPaymentModalVisible,
  setPaymentSlipVisible,
  setTokenRes,
  setInvoiceDetailsModalVisible,
  setSelectedInvoice,
  setModulesEnrollmentModalOpen,
  setRegistrationModalVisible,
  setRegistrationPermitModalVisible,
  setProvisionalRegModalVisible,
  setActiveRegReportsTab,
  setRegistrationReport,
  setRegistrationReportLoading,
  setStudentsModalVisible,
  setRegReportInput,
  setSelecttion,
} = registrationSlice.actions;

export const {
  selectActiveTab,
  selectActiveRegisterTab,
  selectStudentNo,
  selectStudentData,
  selectLoadingStudentData,
  selectEnrollModalVisible,
  selectEnrollmentStatuses,
  selectSpecificEnrollmentStatuses,
  selectHideIncinsistences,
  selectAddEnrollmentModalVisible,
  selectSelectedEnrollment,
  selectDeletingEnrollment,
  selectEditEnrollmentModelVisible,
  selectPaymentModalVisible,
  selectPaymentSlipVisible,
  selectTokenRes,
  selectInvoiceDetailsModalVisible,
  selectSelectedInvoice,
  selectModulesEnrollmentModalOpen,
  selectRegistrationModalVisible,
  selectRegistrationPermitModalVisible,
  selectProvisionalRegModalVisible,
  selectActiveRegReportsTab,
  selectRegistrationReport,
  selectRegistrationReportLoading,
  selectStudentsModalVisible,
  selectRegReportInput,
  selectSelection,
} = injectedSlice.selectors;
export default registrationSlice.reducer;
