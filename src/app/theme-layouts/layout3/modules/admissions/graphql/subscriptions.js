import { gql } from "@apollo/client";

const UPLOAD_PROGRESS_SUBSCRIPTION = gql`
  subscription UploadProgress {
    uploadProgress {
      progress
    }
  }
`;

const UPLOAD_APPLICANTS_PROGRESS = gql`
  subscription uploadApplicantsProgress {
    uploadApplicantsProgress {
      progress
    }
  }
`;

export { UPLOAD_PROGRESS_SUBSCRIPTION, UPLOAD_APPLICANTS_PROGRESS };
