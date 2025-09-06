import { gql } from "@apollo/client";

const LOAD_SYSTEM_SETTINGS = gql`
  query System_settings {
    system_settings {
      id
      setting_title
      setting_value
    }
  }
`;

export { LOAD_SYSTEM_SETTINGS };
