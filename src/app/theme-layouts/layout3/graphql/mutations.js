import { gql } from "@apollo/client";

const LOGIN_USER = gql`
  mutation Login($email: String!, $pwd: String!) {
    login(email: $email, pwd: $pwd) {
      token
    }
  }
`;

const UNLOCK_SESSION = gql`
  mutation UnlockSession($pwd: String!) {
    unlockSession(pwd: $pwd) {
      token
    }
  }
`;

const CHANGE_PWD = gql`
  mutation ($password: String!, $Id: ID!) {
    change_password(password: $password, id: $Id) {
      id
      user_id
      email
      has_set_sec_qns
      sys_gen_pwd
      biodata {
        id
        staff_name
        role
        title
        email
      }
      last_logged_in {
        id
        machine_ipaddress
        logged_in
      }
    }
  }
`;

const SAVE_SEC_QNS = gql`
  mutation Save_user_sec_qns($id: Int!, $qns: String!) {
    save_user_sec_qns(id: $id, qns: $qns) {
      id
      user_id
      email
      has_set_sec_qns
      sys_gen_pwd
      biodata {
        id
        staff_name
        role
        title
        email
      }
      last_logged_in {
        id
        machine_ipaddress
        logged_in
      }
      role {
        id
        role_name
        permissions
        _modules {
          id
          title
          route
          logo
        }
      }
    }
  }
`;

const ADD_USER = gql`
  mutation (
    $userId: String!
    $roleId: String!
    $email: String!
    $createdBy: String!
  ) {
    addUser(
      user_id: $userId
      role_id: $roleId
      email: $email
      created_by: $createdBy
    ) {
      id
      email
      pwd
    }
  }
`;

const ADMIT_STUDENTS = gql`
  mutation admitStudents($applicants: [AdmissionInput]!) {
    admit_students(applicants: $applicants) {
      message
      success
    }
  }
`;

const SEND_PHD_STDS = gql`
  mutation sendPhdStds($stds: [PostGradInput]!, $sentBy: String!) {
    save_sent_phd_stds(stds: $stds, sent_by: $sentBy) {
      message
    }
  }
`;

const ADMIT_PHD_STDS = gql`
  mutation Admit_students($stds: [PostGradInput]!, $admittedBy: String!) {
    admit_students(stds: $stds, admitted_by: $admittedBy) {
      success
      message
    }
  }
`;

const SAVE_ROLE_PERMISSIONS = gql`
  mutation SaveRolePermissions($roleId: ID!, $modules: String!) {
    saveRolePermissions(role_id: $roleId, modules: $modules) {
      id
      role_name
      modules
      permissions
    }
  }
`;

export {
  LOGIN_USER,
  CHANGE_PWD,
  ADD_USER,
  SEND_PHD_STDS,
  ADMIT_PHD_STDS,
  SAVE_SEC_QNS,
  SAVE_ROLE_PERMISSIONS,
  UNLOCK_SESSION,
  ADMIT_STUDENTS,
};
