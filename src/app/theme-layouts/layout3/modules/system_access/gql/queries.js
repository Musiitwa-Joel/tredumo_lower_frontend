import { gql } from "@apollo/client";

const LOAD_ROLES = gql`
  query loadRoles {
    all_roles {
      role_id
      role_name
      description
      permissions
    }
  }
`;

const LOAD_ROLE_MODULES = gql`
  query loadRoleModules($roleId: String!) {
    role_modules(role_id: $roleId) {
      id
      title
      route
      description
      permissions
    }
  }
`;

const LOAD_USERS = gql`
  query loadUsers {
    users {
      id
      biodata {
        id
        salutation
        surname
        other_names
      }
      role {
        role_id
        role_name
      }
      last_logged_in {
        logged_in
        logged_out
      }
      email
    }
  }
`;

export { LOAD_ROLES, LOAD_ROLE_MODULES, LOAD_USERS };
