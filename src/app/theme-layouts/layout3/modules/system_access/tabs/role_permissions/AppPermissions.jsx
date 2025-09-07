import { Form, Checkbox, Typography } from "antd";
import { useState } from "react";

// Component for individual permissions
const PermissionCheckbox = ({ name, label, onChange, checked }) => (
  <Form.Item
    name={name}
    valuePropName="checked"
    label={null}
    initialValue={null}
    style={{
      margin: 0,
      padding: 0,
    }}
  >
    <Checkbox onChange={onChange}>{label}</Checkbox>
  </Form.Item>
);

// Permissions configuration
const permissionsConfig = {
  admissions: [
    { name: "can_view_applicants", label: "Can View Applicants" },
    { name: "can_upload_applicants", label: "Can Upload Applicants" },
    { name: "can_manage_all_applicants", label: "Can Manage All Applicants" },
  ],
  hr: [
    { name: "can_view_employees", label: "Can View Employees" },
    { name: "can_add_employees", label: "Can Add Employees" },
    { name: "can_update_employees", label: "Can update Employees" },
    { name: "can_upload_employees", label: "Can Upload Employees" },
    { name: "can_delete_employees", label: "Can Delete Employees" },
  ],
  results_manager: [
    { name: "can_view_results", label: "Can View Results" },
    { name: "can_upload_results", label: "Can Upload Results" },
    {
      name: "can_upload_migrated_results",
      label: "Can Upload Migrated Results",
    },
    { name: "can_delete_results", label: "Can Delete Results" },
  ],
};

// Main Permissions Component
const AppPermissions = ({ module }) => {
  const [manageAllAppraisals, setManageAllAppraisals] = useState(false);
  const [editAppraisals, setEditAppraisals] = useState(false);

  if (!module || !module.route) {
    return (
      <Typography.Text style={{ textAlign: "center" }}>
        No Permissions added yet
      </Typography.Text>
    );
  }

  const permissions = permissionsConfig[module.route] || [];

  return (
    <>
      {permissions.map((permission) => (
        <PermissionCheckbox
          key={permission.name}
          name={permission.name}
          label={permission.label}
        />
      ))}

      {module.route === "hr" && (
        <>
          <PermissionCheckbox
            name="can_manage_all_appraisals"
            label="Can manage all appraisals"
            onChange={(e) => setManageAllAppraisals(e.target.checked)}
            checked={manageAllAppraisals}
          />
          {!manageAllAppraisals && (
            <>
              <PermissionCheckbox
                name="can_create_appraisals"
                label="Can create appraisals/reviews"
              />
              <PermissionCheckbox
                name="can_edit_appraisals"
                label="Can edit appraisals/reviews"
                onChange={(e) => setEditAppraisals(e.target.checked)}
                checked={editAppraisals}
              />
              {!editAppraisals && (
                <PermissionCheckbox
                  name="can_edit_only_own_created_appraisals"
                  label="Can edit only own created appraisals"
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default AppPermissions;
