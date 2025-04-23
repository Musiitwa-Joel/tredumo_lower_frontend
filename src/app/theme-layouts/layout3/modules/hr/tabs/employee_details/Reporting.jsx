import React, { useEffect } from "react";
import { Form, Select } from "antd";
import { gql, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectEmployeeDetails,
  selectSelectedEmployee,
} from "../../store/hrSlice";

const LOAD_REQS = gql`
  query employees($active: Boolean) {
    employees(active: $active) {
      id
      salutation
      surname
      other_names
    }
  }
`;

function Reporting({ form }) {
  const dispatch = useDispatch();
  const employeeDetails = useSelector(selectEmployeeDetails);

  const { error, loading, data } = useQuery(LOAD_REQS, {
    variables: {
      active: true,
    },
  });

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [error]);

  useEffect(() => {
    if (employeeDetails) {
      const manager = employeeDetails.approvers.find(
        (detail) => detail.approver_type == "manager"
      );

      const indirect_managers = employeeDetails.approvers.filter(
        (detail) => detail.approver_type == "indirect_manager"
      );

      //   console.log("indirect managers", employeeDetails.approvers);

      const first_level_approver = employeeDetails.approvers.find(
        (detail) => detail.approver_type == "first_level_approver"
      );

      const second_level_approver = employeeDetails.approvers.find(
        (detail) => detail.approver_type == "second_level_approver"
      );

      const third_level_approver = employeeDetails.approvers.find(
        (detail) => detail.approver_type == "third_level_approver"
      );

      form.resetFields();

      if (manager) {
        form.setFieldsValue({
          manager: manager.approver_id,
        });
      }

      if (first_level_approver) {
        form.setFieldsValue({
          manager: first_level_approver.approver_id,
        });
      }

      if (second_level_approver) {
        form.setFieldsValue({
          manager: second_level_approver.approver_id,
        });
      }

      if (third_level_approver) {
        form.setFieldsValue({
          manager: third_level_approver.approver_id,
        });
      }

      if (indirect_managers && indirect_managers.length > 0) {
        form.setFieldsValue({
          indirect_managers: indirect_managers.map((m) => m.approver_id),
        });
      }
    }
  }, [employeeDetails]);

  return (
    <div>
      <Form
        form={form}
        name="bioDataForm"
        initialValues={{
          remember: true,
        }}
        labelCol={{
          span: 6,
        }}
        // wrapperCol={{
        //   span: 16,
        // }}
        className="max-w-4xl mx-auto p-20"
      >
        <Form.Item label="Manager" name="manager">
          <Select
            style={{
              marginBottom: 10,
            }}
            showSearch
            loading={loading}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={
              data?.employees
                ? data?.employees.map((emp) => ({
                    value: emp.id,
                    label: `${emp.salutation} ${emp.surname} ${emp.other_names}`,
                  }))
                : []
            }
          />
        </Form.Item>
        <Form.Item label="Indirect Managers" name="indirect_managers">
          <Select
            mode="multiple"
            showSearch
            style={{
              marginBottom: 10,
            }}
            loading={loading}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={
              data?.employees
                ? data?.employees.map((emp) => ({
                    value: emp.id,
                    label: `${emp.salutation} ${emp.surname} ${emp.other_names}`,
                  }))
                : []
            }
          />
        </Form.Item>
        <Form.Item label="First Level Approver" name="first_level_approver">
          <Select
            showSearch
            style={{
              marginBottom: 10,
            }}
            loading={loading}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={
              data?.employees
                ? data?.employees.map((emp) => ({
                    value: emp.id,
                    label: `${emp.salutation} ${emp.surname} ${emp.other_names}`,
                  }))
                : []
            }
          />
        </Form.Item>
        <Form.Item label="Second Level Approver" name="second_level_approver">
          <Select
            showSearch
            style={{
              marginBottom: 10,
            }}
            loading={loading}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={
              data?.employees
                ? data?.employees.map((emp) => ({
                    value: emp.id,
                    label: `${emp.salutation} ${emp.surname} ${emp.other_names}`,
                  }))
                : []
            }
          />
        </Form.Item>
        <Form.Item label="Third Level Approver" name="third_level_approver">
          <Select
            showSearch
            style={{
              marginBottom: 10,
            }}
            loading={loading}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={
              data?.employees
                ? data?.employees.map((emp) => ({
                    value: emp.id,
                    label: `${emp.salutation} ${emp.surname} ${emp.other_names}`,
                  }))
                : []
            }
          />
        </Form.Item>
      </Form>
    </div>
  );
}

export default Reporting;
