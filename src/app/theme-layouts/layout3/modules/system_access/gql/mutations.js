import { gql } from "@apollo/client";

const SAVE_ROLE = gql`
  mutation saveRole($payload: RoleInput!) {
    saveRole(payload: $payload) {
      message
      success
    }
  }
`;

const DELETE_ROLE = gql`
  mutation deleteRole($roleId: ID!) {
    deleteRole(role_id: $roleId) {
      message
      success
    }
  }
`;

const UPDATE_ROLE_MODULES = gql`
  mutation updateRoleModules($payload: RoleModuleInput!) {
    updateRoleModules(payload: $payload) {
      success
      message
    }
  }
`;

const REMOVE_ROLE_MODULE = gql`
  mutation deleteRoleModule($roleId: String!, $moduleId: String!) {
    deleteRoleModule(role_id: $roleId, module_id: $moduleId) {
      message
      success
    }
  }
`;

const UPDATE_ROLE_PERMISSIONS = gql`
  mutation updateRolePermissions($payload: RolePermissionInput!) {
    updateRolePermissions(payload: $payload) {
      message
      success
    }
  }
`;

const ADD_NEW_USER = gql`
  mutation AddNewUser($payload: NewUserInput!) {
    addNewUser(payload: $payload) {
      message
      success
    }
  }
`;

export {
  SAVE_ROLE,
  DELETE_ROLE,
  UPDATE_ROLE_MODULES,
  REMOVE_ROLE_MODULE,
  UPDATE_ROLE_PERMISSIONS,
  ADD_NEW_USER,
};
