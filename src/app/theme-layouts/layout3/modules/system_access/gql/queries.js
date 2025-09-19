import { gql } from "@apollo/client";

const LOAD_ROLES = gql`
  query All_roles {
    all_roles {
      id
      name
      description
      _modules {
        id
        title
        description
        route
        logo
      }
      permissions
    }
  }
`;

const LOAD_ROLE_MODULES = gql`
  query Role_modules($roleId: String!) {
    role_modules(role_id: $roleId) {
      id
      title
      description
      route
      logo
    }
  }
`;

const LOAD_USERS = gql`
  query Users {
    users {
      id
      salutation
      surname
      other_names
      email
      role_id
      role {
        id
        name
        description
        _modules {
          id
          title
          description
          route
          logo
        }
        permissions
      }
      is_active
      last_modified_at
      last_modified_by
    }
  }
`;

const LOAD_USER_ACTION_LOGS = gql`
  query User_action_logs($userId: String!) {
    user_action_logs(user_id: $userId) {
      id
      user_id
      name
      action_type
      user_type
      module
      description
      ip_address
      timestamp
      user_agent
    }
  }
`;

const LOAD_SYSTEM_USERS = gql`
  query system_users {
    system_users {
      user_id
      staff_id
      name
      user_type
      last_activity
    }
  }
`;

export {
  LOAD_ROLES,
  LOAD_ROLE_MODULES,
  LOAD_USERS,
  LOAD_USER_ACTION_LOGS,
  LOAD_SYSTEM_USERS,
};
