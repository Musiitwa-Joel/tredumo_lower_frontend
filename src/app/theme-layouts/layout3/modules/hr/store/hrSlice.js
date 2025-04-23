import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialState = {
  activeTab: "dashboard",
  employeesViewLayout: "table",
  viewEmployeeDetails: false,
  addNewEmpModalVisible: false,
  designations: [],
  selectedDesignation: null,
  designationModalVisible: false,
  employees: [],
  loadingEmployees: false,
  detailsModalVisible: false,
  activeMenuItem: "1",
  selectedEmployee: null,
  activeEmployeeBioDataTab: "personal_info",
  employeeDetails: null,
  loadingEmployeeDetails: false,
  uploadEmpModalVisible: false,
  activeAppraisalTab: "1",
  templatePreviewVisible: false,
  selectedTemplate: null,
  templateSections: [],
  loadingSections: false,
  selectedTemplatePreview: null,
  addReviewModalVisible: false,
  reviews: [],
  selectedPerformanceReview: null,
  respondReviewVisible: false,
  reviewFormModalVisible: false,
  reviewDetails: null,
};

export const hrSlice = createSlice({
  name: "hr",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setEmployeesViewLayout: (state, action) => {
      state.employeesViewLayout = action.payload;
    },
    setViewEmployeeDetails: (state, action) => {
      state.viewEmployeeDetails = action.payload;
    },
    setAddNewEmpModalVisible: (state, action) => {
      state.addNewEmpModalVisible = action.payload;
    },
    setDesignations: (state, action) => {
      state.designations = action.payload;
    },
    setSelectedDesignation: (state, action) => {
      state.selectedDesignation = action.payload;
    },
    setDesignationModalVisible: (state, action) => {
      state.designationModalVisible = action.payload;
    },
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setLoadingEmployees: (state, action) => {
      state.loadingEmployees = action.payload;
    },
    setActiveMenuItem: (state, action) => {
      state.activeMenuItem = action.payload;
    },
    setDetailsModalVisible: (state, action) => {
      state.detailsModalVisible = action.payload;
    },
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    setActiveEmployeeBioDataTab: (state, action) => {
      state.activeEmployeeBioDataTab = action.payload;
    },
    setEmployeeDetails: (state, action) => {
      state.employeeDetails = action.payload;
    },
    setLoadingEmployeeDetails: (state, action) => {
      state.loadingEmployeeDetails = action.payload;
    },
    setUploadEmpModalVisible: (state, action) => {
      state.uploadEmpModalVisible = action.payload;
    },
    setActiveAppraisalTab: (state, action) => {
      state.activeAppraisalTab = action.payload;
    },
    setTemplatePreviewVisible: (state, action) => {
      state.templatePreviewVisible = action.payload;
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
    setTemplateSections: (state, action) => {
      state.templateSections = action.payload;
    },
    setLoadingSections: (state, action) => {
      state.loadingSections = action.payload;
    },
    setSelectedTemplatePreview: (state, action) => {
      state.selectedTemplatePreview = action.payload;
    },
    setAddReviewModalVisible: (state, action) => {
      state.addReviewModalVisible = action.payload;
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    setSelectedPerformanceReview: (state, action) => {
      state.selectedPerformanceReview = action.payload;
    },
    setRespondReviewVisible: (state, action) => {
      state.respondReviewVisible = action.payload;
    },
    setReviewFormModalVisible: (state, action) => {
      state.reviewFormModalVisible = action.payload;
    },
    setReviewDetails: (state, action) => {
      state.reviewDetails = action.payload;
    },
  },

  selectors: {
    selectActiveTab: (state) => state.activeTab,
    selectEmployeesViewLayout: (state) => state.employeesViewLayout,
    selectViewEmployeeDetails: (state) => state.viewEmployeeDetails,
    selectAddNewEmpModalVisible: (state) => state.addNewEmpModalVisible,
    selectDesignations: (state) => state.designations,
    selectSelectedDesignation: (state) => state.selectedDesignation,
    selectDesignationModalVisible: (state) => state.designationModalVisible,
    selectEmployees: (state) => state.employees,
    selectLoadingEmployees: (state) => state.loadingEmployees,
    selectActiveMenuItem: (state) => state.activeMenuItem,
    selectDetailsModalVisible: (state) => state.detailsModalVisible,
    selectSelectedEmployee: (state) => state.selectedEmployee,
    selectActiveEmployeeBioDataTab: (state) => state.activeEmployeeBioDataTab,
    selectEmployeeDetails: (state) => state.employeeDetails,
    selectLoadingEmployeeDetails: (state) => state.loadingEmployeeDetails,
    selectUploadEmpModalVisible: (state) => state.uploadEmpModalVisible,
    selectActiveAppraisalTab: (state) => state.activeAppraisalTab,
    selectTemplatePreviewVisible: (state) => state.templatePreviewVisible,
    selectSelectedTemplate: (state) => state.selectedTemplate,
    selectTemplateSections: (state) => state.templateSections,
    selectLoadingSections: (state) => state.loadingSections,
    selectSelectedTemplatePreview: (state) => state.selectedTemplatePreview,
    selectAddReviewModalVisible: (state) => state.addReviewModalVisible,
    selectReviews: (state) => state.reviews,
    selectSelectedPerformanceReview: (state) => state.selectedPerformanceReview,
    selectRespondReviewVisible: (state) => state.respondReviewVisible,
    selectReviewFormModal: (state) => state.reviewFormModalVisible,
    selectReviewDetails: (state) => state.reviewDetails,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(hrSlice);
const injectedSlice = hrSlice.injectInto(rootReducer);
export const {
  setActiveTab,
  setEmployeesViewLayout,
  setViewEmployeeDetails,
  setAddNewEmpModalVisible,
  setDesignations,
  setSelectedDesignation,
  setDesignationModalVisible,
  setEmployees,
  setLoadingEmployees,
  setActiveMenuItem,
  setDetailsModalVisible,
  setSelectedEmployee,
  setActiveEmployeeBioDataTab,
  setEmployeeDetails,
  setLoadingEmployeeDetails,
  setUploadEmpModalVisible,
  setActiveAppraisalTab,
  setTemplatePreviewVisible,
  setSelectedTemplate,
  setTemplateSections,
  setLoadingSections,
  setSelectedTemplatePreview,
  setAddReviewModalVisible,
  setReviews,
  setSelectedPerformanceReview,
  setRespondReviewVisible,
  setReviewFormModalVisible,
  setReviewDetails,
} = hrSlice.actions;

export const {
  selectActiveTab,
  selectEmployeesViewLayout,
  selectViewEmployeeDetails,
  selectAddNewEmpModalVisible,
  selectDesignations,
  selectSelectedDesignation,
  selectDesignationModalVisible,
  selectEmployees,
  selectLoadingEmployees,
  selectActiveMenuItem,
  selectDetailsModalVisible,
  selectSelectedEmployee,
  selectActiveEmployeeBioDataTab,
  selectEmployeeDetails,
  selectLoadingEmployeeDetails,
  selectUploadEmpModalVisible,
  selectActiveAppraisalTab,
  selectTemplatePreviewVisible,
  selectSelectedTemplate,
  selectTemplateSections,
  selectLoadingSections,
  selectSelectedTemplatePreview,
  selectAddReviewModalVisible,
  selectReviews,
  selectSelectedPerformanceReview,
  selectRespondReviewVisible,
  selectReviewFormModal,
  selectReviewDetails,
} = injectedSlice.selectors;
export default hrSlice.reducer;
