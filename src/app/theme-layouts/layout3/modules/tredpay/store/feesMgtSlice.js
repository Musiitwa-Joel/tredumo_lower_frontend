import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialFormState = null;
const _feesStructureForm = {
  acc_yr: null,
  campus: null,
  intake: null,
  nationality: null,
};

const initialState = {
  activeTab: 0,
  feesCategories: [],
  selectedCategoryRow: null,
  feesItems: [],
  selectedFeeItemRow: null,
  feesVersions: [],
  selectedFeesVersionRow: null,
  feesData: [],
  expandedItems: [],
  filteredFeesData: [],
  selectedFeesVersion: null,
  selectedSchool: null,
  selectedTreeItem: null,
  allCourses: [],
  nationality_categories: [],
  filteredFeesItems: [],
  frequency_codes: [],
  selectedFrequencyCode: null,
  formState: initialFormState,
  loadingTuitionFees: false,
  tuitionFeesItems: [],
  selectedTuitionFeeItem: null,
  allLevels: [],
  functionalFormState: null,
  expandedKeysFunctional: [],
  expandedKeysTuition: [],
  selectedFeeItemFunctional: null,
  selectedFunctionalFeeItem: null,
  loadingFunctionalFees: false,
  functionalFeesItems: [],
  otherFeesFormState: null,
  otherFees: [],
  selectedFeeItem: null,
  addFeeItemModal: false,
  copyFeesStructureModal: false,
  selectedFeesStructureCourse: null,
  feesStructureForm: _feesStructureForm,
  otherFeesInStructure: [],
  feesStructure: [],
  loadingFeesStructure: false,
};
/**
 * The File Manager App slice.
 */
export const feesMgtSlice = createSlice({
  name: "tredpay",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setFeesCategories: (state, action) => {
      state.feesCategories = action.payload;
    },
    setSelectedCategoryRow: (state, action) => {
      state.selectedCategoryRow = action.payload;
    },
    setFeesItems: (state, action) => {
      state.feesItems = action.payload;
    },
    setSelectedFeeItemRow: (state, action) => {
      state.selectedFeeItemRow = action.payload;
    },
    setFeesVersions: (state, action) => {
      state.feesVersions = action.payload;
    },
    setSelectedFeesVersionRow: (state, action) => {
      state.selectedFeesVersionRow = action.payload;
    },
    setFeesData: (state, action) => {
      state.feesData = action.payload;
    },
    setExpandedItems: (state, action) => {
      state.expandedItems = action.payload;
    },
    setFilteredFeesData: (state, action) => {
      state.filteredFeesData = action.payload;
    },
    setSelectedFeesVersion: (state, action) => {
      state.selectedFeesVersion = action.payload;
    },
    setSelectedSchool: (state, action) => {
      state.selectedSchool = action.payload;
    },
    setSelectedTreeItem: (state, action) => {
      state.selectedTreeItem = action.payload;
    },
    setAllCourses: (state, action) => {
      state.allCourses = action.payload;
    },
    setNationalityCategories: (state, action) => {
      state.nationality_categories = action.payload;
    },
    setFilteredFeesItems: (state, action) => {
      state.filteredFeesItems = action.payload;
    },
    setFrequencyCodes: (state, action) => {
      state.frequency_codes = action.payload;
    },
    setSelectedFrequencyCode: (state, action) => {
      state.selectedFrequencyCode = action.payload;
    },
    setFormState: (state, action) => {
      state.formState = action.payload;
    },
    setLoadingTuitionFees: (state, action) => {
      state.loadingTuitionFees = action.payload;
    },
    setTuitionFeesItems: (state, action) => {
      state.tuitionFeesItems = action.payload;
    },
    setSelectedTuitionFeeItem: (state, action) => {
      state.selectedTuitionFeeItem = action.payload;
    },
    setAllLevels: (state, action) => {
      state.allLevels = action.payload;
    },
    setFunctionalFormState: (state, action) => {
      state.functionalFormState = action.payload;
    },
    setExpandedKeysFunctional: (state, action) => {
      state.expandedKeysFunctional = action.payload;
    },
    setExpandedKeysTuition: (state, action) => {
      state.expandedKeysTuition = action.payload;
    },
    setSelectedFeeItemFunctional: (state, action) => {
      state.selectedFeeItemFunctional = action.payload;
    },
    setSelectedFuntionalFeeItem: (state, action) => {
      state.selectedFunctionalFeeItem = action.payload;
    },
    setLoadingFunctionalFees: (state, action) => {
      state.loadingFunctionalFees = action.payload;
    },
    setFunctionalFeesItems: (state, action) => {
      state.functionalFeesItems = action.payload;
    },
    setOtherFeesFormState: (state, action) => {
      state.otherFeesFormState = action.payload;
    },
    setOtherFees: (state, action) => {
      state.otherFees = action.payload;
    },
    setSelectedFeeItem: (state, action) => {
      state.selectedFeeItem = action.payload;
    },
    setAddFeeItemModal: (state, action) => {
      state.addFeeItemModal = action.payload;
    },
    setCopyFeesStructureModal: (state, action) => {
      state.copyFeesStructureModal = action.payload;
    },
    setSelectedFeesStructureCourse: (state, action) => {
      state.selectedFeesStructureCourse = action.payload;
    },
    setFeesStructureForm: (state, action) => {
      if (action.payload.acc_yr) {
        state.feesStructureForm = {
          ...state.feesStructureForm,
          acc_yr: action.payload.acc_yr,
        };
      } else if (action.payload.campus) {
        state.feesStructureForm = {
          ...state.feesStructureForm,
          campus: action.payload.campus,
        };
      } else if (action.payload.intake) {
        state.feesStructureForm = {
          ...state.feesStructureForm,
          intake: action.payload.intake,
        };
      } else if (action.payload.nationality) {
        state.feesStructureForm = {
          ...state.feesStructureForm,
          nationality: action.payload.nationality,
        };
      } else {
        state.feesStructureForm = action.payload;
      }
    },
    setOtherFeesInStructure: (state, action) => {
      state.otherFeesInStructure = action.payload;
    },
    setFeesStructure: (state, action) => {
      state.feesStructure = action.payload;
    },
    setLoadingFeesStructure: (state, action) => {
      state.loadingFeesStructure = action.payload;
    },
  },

  selectors: {
    selectActiveTab: (state) => state.activeTab,
    selectFeesCategories: (state) => state.feesCategories,
    selectSelectedCategoryRow: (state) => state.selectedCategoryRow,
    selectFeesItems: (state) => state.feesItems,
    selectSelectedFeeItemRow: (state) => state.selectedFeeItemRow,
    selectFeesVersions: (state) => state.feesVersions,
    selectSelectedFeesVersionRow: (state) => state.selectedFeesVersionRow,
    selectFeesData: (state) => state.feesData,
    selectExpandedItems: (state) => state.expandedItems,
    selectFilteredFeesData: (state) => state.filteredFeesData,
    selectSelectedFeesVersion: (state) => state.selectedFeesVersion,
    selectSelectedSchool: (state) => state.selectedSchool,
    selectSelectedTreeItem: (state) => state.selectedTreeItem,
    selectAllCourses: (state) => state.allCourses,
    selectNationalityCategories: (state) => state.nationality_categories,
    selectFilteredFeesItems: (state) => state.filteredFeesItems,
    selectFrequencyCodes: (state) => state.frequency_codes,
    selectSelectedFrequencyCode: (state) => state.selectedFrequencyCode,
    selectFormState: (state) => state.formState,
    selectLoadingTuitionFees: (state) => state.loadingTuitionFees,
    selectTuitionFeesItems: (state) => state.tuitionFeesItems,
    selectSelectedTuitionFeeItem: (state) => state.selectedTuitionFeeItem,
    selectAllLevels: (state) => state.allLevels,
    selectFunctionalFormState: (state) => state.functionalFormState,
    selectExpandedKeysFunctional: (state) => state.expandedKeysFunctional,
    selectExpandedKeysTuition: (state) => state.expandedKeysTuition,
    selectSelectedFeeItemFunctional: (state) => state.selectedFeeItemFunctional,
    selectSelectedFunctionalFeeItem: (state) => state.selectedFunctionalFeeItem,
    selectLoadingFunctionalFees: (state) => state.loadingFunctionalFees,
    selectFunctionalFeesItems: (state) => state.functionalFeesItems,
    selectOtherFeesFormState: (state) => state.otherFeesFormState,
    selectOtherFees: (state) => state.otherFees,
    selectSelectedFeeItem: (state) => state.selectedFeeItem,
    selectAddFeeItemModal: (state) => state.addFeeItemModal,
    selectCopyFeesStructureModal: (state) => state.copyFeesStructureModal,
    selectSelectedFeesStructureCourse: (state) =>
      state.selectedFeesStructureCourse,
    selectFeesStructureForm: (state) => state.feesStructureForm,
    selectOtherFeesInStructure: (state) => state.otherFeesInStructure,
    selectFeesStructure: (state) => state.feesStructure,
    selectLoadingFeesStructure: (state) => state.loadingFeesStructure,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(feesMgtSlice);
const injectedSlice = feesMgtSlice.injectInto(rootReducer);
export const {
  setActiveTab,
  setFeesCategories,
  setSelectedCategoryRow,
  setFeesItems,
  setSelectedFeeItemRow,
  setFeesVersions,
  setSelectedFeesVersionRow,
  setFeesData,
  setExpandedItems,
  setFilteredFeesData,
  setSelectedFeesVersion,
  setSelectedSchool,
  setSelectedTreeItem,
  setAllCourses,
  setNationalityCategories,
  setFilteredFeesItems,
  setFrequencyCodes,
  setSelectedFrequencyCode,
  setFormState,
  setLoadingTuitionFees,
  setTuitionFeesItems,
  setSelectedTuitionFeeItem,
  setAllLevels,
  setFunctionalFormState,
  setExpandedKeysFunctional,
  setExpandedKeysTuition,
  setSelectedFeeItemFunctional,
  setSelectedFuntionalFeeItem,
  setLoadingFunctionalFees,
  setFunctionalFeesItems,
  setOtherFeesFormState,
  setOtherFees,
  setSelectedFeeItem,
  setAddFeeItemModal,
  setCopyFeesStructureModal,
  setSelectedFeesStructureCourse,
  setFeesStructureForm,
  setOtherFeesInStructure,
  setFeesStructure,
  setLoadingFeesStructure,
} = feesMgtSlice.actions;
export const {
  selectActiveTab,
  selectFeesCategories,
  selectSelectedCategoryRow,
  selectFeesItems,
  selectSelectedFeeItemRow,
  selectFeesVersions,
  selectSelectedFeesVersionRow,
  selectFeesData,
  selectExpandedItems,
  selectFilteredFeesData,
  selectSelectedFeesVersion,
  selectSelectedSchool,
  selectSelectedTreeItem,
  selectAllCourses,
  selectNationalityCategories,
  selectFilteredFeesItems,
  selectFrequencyCodes,
  selectSelectedFrequencyCode,
  selectFormState,
  selectLoadingTuitionFees,
  selectTuitionFeesItems,
  selectSelectedTuitionFeeItem,
  selectAllLevels,
  selectFunctionalFormState,
  selectExpandedKeysFunctional,
  selectExpandedKeysTuition,
  selectSelectedFeeItemFunctional,
  selectSelectedFunctionalFeeItem,
  selectLoadingFunctionalFees,
  selectFunctionalFeesItems,
  selectOtherFeesFormState,
  selectOtherFees,
  selectSelectedFeeItem,
  selectAddFeeItemModal,
  selectCopyFeesStructureModal,
  selectSelectedFeesStructureCourse,
  selectFeesStructureForm,
  selectOtherFeesInStructure,
  selectFeesStructure,
  selectLoadingFeesStructure,
} = injectedSlice.selectors;
export default feesMgtSlice.reducer;
