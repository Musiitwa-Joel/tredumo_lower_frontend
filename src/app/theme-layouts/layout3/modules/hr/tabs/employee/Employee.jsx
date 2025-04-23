import { useState, useCallback, useEffect } from "react";
import {
  Input,
  Tabs,
  Typography,
  Tag,
  Space,
  List,
  Avatar,
  message,
  Select,
  Button,
  Modal,
  Form,
  Skeleton,
} from "antd";
import {
  Filter,
  Search,
  Trash2,
  Edit2,
  XCircle,
  Copy,
  Phone,
  Mail,
  BadgeIcon as IdCard,
  Globe,
  Clock,
  Shield,
  Plus,
  Share,
  CloudUpload,
  AlertCircle,
} from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AddEmployeeModal from "./add_new_employee/AddNewEmployee";
import InviteEmployeeModal from "./invite-employee-modal";
import Qualifications from "./qualifications";
import Education from "./education";
import FilterEmployeesModal from "./filter-employees-modal";
import Dependents from "./dependents";
import { Card } from "@mui/material";
import { useQuery, gql } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import hasPermission from "src/utils/hasPermission";
import { selectUserPermissions } from "app/store/userSlice";
import { LOAD_ALL_EMPLOYEES, LOAD_EMPLOYEE_DETAILS } from "../../gql/queries";

import {
  selectDesignationModalVisible,
  selectEmployeesViewLayout,
  selectViewEmployeeDetails,
  setAddNewEmpModalVisible,
  setEmployees,
  setEmployeesViewLayout,
  setUploadEmpModalVisible,
} from "../../store/hrSlice";

const { Text, Title } = Typography;

const EmployeeManagement = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [addEmployeeVisible, setAddEmployeeVisible] = useState(false);
  const [inviteEmployeeVisible, setInviteEmployeeVisible] = useState(false);
  const [filterEmployeesVisible, setFilterEmployeesVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [employeePhoto, setEmployeePhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [transformedEmployees, setTransformedEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const userPermissions = useSelector(selectUserPermissions);
  const can_add_employees = hasPermission(userPermissions, "can_add_employees");
  const can_upload_employees = hasPermission(
    userPermissions,
    "can_upload_employees"
  );
  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === "NOT PROVIDED") return "NOT PROVIDED";
    try {
      const date = new Date(parseInt(timestamp));
      if (isNaN(date.getTime())) return "NOT PROVIDED";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "NOT PROVIDED";
    }
  };
  // Fetch all employees for the list
  const {
    loading: allEmployeesLoading,
    error: allEmployeesError,
    data: allEmployeesData,
  } = useQuery(LOAD_ALL_EMPLOYEES);

  const {
    loading: selectedEmployeeLoading,
    error: selectedEmployeeError,
    data: selectedEmployeeData,
  } = useQuery(LOAD_EMPLOYEE_DETAILS, {
    variables: { employeeId: selectedEmployeeId || "" },
    skip: !selectedEmployeeId, // Skip this query if no employee is selected
  });

  // Transform GraphQL employee data to the format needed by the UI
  const transformEmployeeData = (employee) => {
    if (!employee) return null;

    const fullName =
      `${employee.salutation || ""} ${employee.surname || ""} ${employee.other_names || ""}`.trim();

    // Create image URL from staff_id
    const imageUrl = employee.staff_id
      ? `http://199.241.139.118:9000/api/lecturer/image/${employee.staff_id}`
      : "";

    return {
      id: employee.id,
      initials:
        imageUrl ||
        `${employee.surname?.[0] || ""}${employee.other_names?.[0] || ""}`,
      name: fullName || "NOT PROVIDED",
      title: "Lecturer",

      company: employee.college.college_title,
      phone: employee.telno || "NOT PROVIDED",
      religion: employee.religion || "NOT PROVIDED",
      email: employee.email || "NOT PROVIDED",
      employeeNumber: employee.staff_id || "NOT PROVIDED",
      dob: employee.date_of_birth || "NOT PROVIDED",
      gender: employee.gender || "NOT PROVIDED",
      nationality: employee.nationality || "NOT PROVIDED", // Default
      maritalStatus: employee.marital_status || "NOT PROVIDED",
      joinedDate: employee.joining_date || "NOT PROVIDED", // Add to your GraphQL query if available
      timezone: "Africa/Kampala", // Default timezone
      accessLevel: "Employee", // Default access level

      identification: {
        nationalId: employee.nin || "NOT PROVIDED",
        socialInsurance: employee.nssf_no || "NOT PROVIDED",
        religion: employee.religion || "NOT PROVIDED",
        healthInsurance: "NOT PROVIDED",
        additionalIds: "NOT PROVIDED",
        drivingLicense: "NOT PROVIDED",
      },
      contact: {
        address: employee.address || "NOT PROVIDED",
        city: "NOT PROVIDED",
        country: "Uganda",
        postalCode: "NOT PROVIDED",
        homePhone: employee.telno || "NOT PROVIDED",
        workPhone: "NOT PROVIDED",
        privateEmail: employee.email || "NOT PROVIDED",
      },
      jobDetails: {
        jobTitle: "Lecturer", // Default
        employmentStatus: employee.status || "NOT PROVIDED",

        department: employee.school?.departments?.length
          ? `${employee.school.departments[0].dpt_title} (${employee.school.departments[0].dpt_code})`
          : "NOT PROVIDED",
        manager: "NOT PROVIDED",
      },
      personalInfo: {
        dateOfBirth: employee.date_of_birth || "NOT PROVIDED",
        gender: employee.gender || "NOT PROVIDED",
        nationality: "UGANDAN",
        maritalStatus: employee.marital_status || "NOT PROVIDED",
        joinedDate: "NOT PROVIDED",
      },

      // Store all original data for debugging
      originalData: { ...employee },
    };
  };

  // Process all employees data
  useEffect(() => {
    if (allEmployeesData) {
      console.log("All employees data:", allEmployeesData);

      // Check if we have employee data and how it's structured
      if (allEmployeesData.employees) {
        const employeeList = allEmployeesData.employees;
        console.log("Employee list extracted:", employeeList);

        // Transform the employees
        const transformed = employeeList
          .filter((emp) => emp) // Filter out null/undefined
          .map(transformEmployeeData);

        console.log("Transformed employees:", transformed);
        setTransformedEmployees(transformed);
        setTotalEmployees(transformed.length); // Set total count for pagination

        // Set the first employee as selected if none is selected
        if (!selectedEmployee && transformed.length > 0) {
          setSelectedEmployee(transformed[0]);
          setSelectedEmployeeId(transformed[0].id);
        }
      } else {
        console.warn("No employee data found in the GraphQL response");
      }
    }
  }, [allEmployeesData, selectedEmployee]);

  // Process selected employee data
  useEffect(() => {
    if (selectedEmployeeId && selectedEmployeeData) {
      console.log("Selected employee data:", selectedEmployeeData);

      if (selectedEmployeeData.employee) {
        const transformed = transformEmployeeData(
          selectedEmployeeData.employee
        );
        console.log("Transformed selected employee:", transformed);
        setSelectedEmployee(transformed);
      }
    }
  }, [selectedEmployeeData, selectedEmployeeId]);

  const handleCopy = () => {
    message.success("Copied to clipboard");
  };

  const handleAddEmployee = useCallback(
    async (employeeData) => {
      try {
        // console.log("Received employeeData:", employeeData);
        if (!employeeData.firstName || !employeeData.lastName) {
          console.error("Missing required fields:", {
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
          });
          throw new Error("First name and last name are required");
        }

        // Implementation for adding employee would go here
        // This would typically involve a GraphQL mutation

        message.success(
          isEditing
            ? "Employee updated successfully"
            : "Employee added successfully"
        );
        setAddEmployeeVisible(false);
        setIsEditing(false);
      } catch (error) {
        console.error("Error in handleAddEmployee:", error);
        message.error(error.message || "Failed to add/update employee");
      }
    },
    [isEditing]
  );

  const handleInviteEmployee = async (inviteData) => {
    // Implementation for inviting employee would go here
    message.success("Invitation sent successfully");
    setInviteEmployeeVisible(false);
  };

  const handleUploadPhoto = (info) => {
    if (info.file.status === "done") {
      message.success("Photo uploaded successfully");
    }
  };

  const handleRemovePhoto = () => {
    setEmployeePhoto(null);
    message.success("Photo removed successfully");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setAddEmployeeVisible(true);
  };

  const handleDeactivate = () => {
    Modal.confirm({
      title: "Deactivate Employee",
      content: `Are you sure you want to deactivate ${selectedEmployee?.name}?`,
      onOk() {
        message.success(`${selectedEmployee?.name} has been deactivated`);
      },
    });
  };

  const CopyableField = ({ label, value }) => (
    <div>
      <Text type="secondary">{label}</Text>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {value}
        {value && value !== "NOT PROVIDED" && (
          <CopyToClipboard text={value} onCopy={() => handleCopy(value)}>
            <Copy size={14} style={{ cursor: "pointer", color: "#1890ff" }} />
          </CopyToClipboard>
        )}
      </div>
    </div>
  );

  const SectionHeader = ({ title, onEdit }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        {title}
      </Title>
      {onEdit && (
        <Tag
          color="blue"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "8px",
            padding: "2px 6px",
            height: "auto",
            lineHeight: "normal",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={onEdit}
        >
          <Edit2 size={10} />
          Edit
        </Tag>
      )}
    </div>
  );

  const currentTime = new Date();
  const formattedTime = `${currentTime.getFullYear()} ${currentTime.toLocaleString("default", { month: "short" })} ${currentTime.getDate()} : ${currentTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentTime.getMinutes().toString().padStart(2, "0")}`;

  // Filter employees based on search text
  const filteredEmployees = transformedEmployees.filter((employee) =>
    employee?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Apply pagination to the filtered employees
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ padding: "4px", backgroundColor: "#EFEFEF" }}>
      {/* Top Actions */}
      <Space style={{ marginBottom: "5px" }}>
        <Button
          size="small"
          icon={<Share size={12} />}
          type="dashed"
          onClick={() => setInviteEmployeeVisible(true)}
        >
          Invite an Employee
        </Button>
        {can_add_employees && (
          <Button
            size="small"
            icon={<Plus size={12} />}
            onClick={() => dispatch(setAddNewEmpModalVisible(true))}
          >
            Add a New Employee
          </Button>
        )}
        <Button
          size="small"
          icon={<Filter size={12} />}
          onClick={() => setFilterEmployeesVisible(true)}
        >
          Filter Employees
        </Button>
      </Space>

      <div
        style={{
          display: "flex",
          gap: "10px",
          height: "calc(100vh - 135px)",
        }}
      >
        {/* Left Side - Employee List */}
        <Card
          style={{
            backgroundColor: "white",
            borderRadius: 0,
            maxHeight: "calc(100vh - 135px)",
            overflowY: "scroll",
          }}
        >
          <div
            style={{
              width: "300px",
            }}
          >
            <div style={{ marginBottom: "8px", marginTop: "16px", padding: 5 }}>
              <Input
                size="small"
                prefix={<Search size={16} />}
                placeholder="Search by Name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {allEmployeesLoading ? (
              // Skeleton loading for employee list
              <div>
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} style={{ padding: "10px" }}>
                    <Skeleton.Avatar
                      active
                      size="small"
                      style={{ marginRight: 8 }}
                    />
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 200 }}
                    />
                  </div>
                ))}
              </div>
            ) : allEmployeesError ? (
              <div style={{ padding: 10, textAlign: "center" }}>
                <Text type="danger">Error: {allEmployeesError.message}</Text>
              </div>
            ) : (
              <List
                size="small"
                dataSource={paginatedEmployees}
                renderItem={(employee) => (
                  <List.Item
                    style={{
                      padding: "5px",
                      cursor: "pointer",
                      backgroundColor:
                        employee.id === selectedEmployee?.id
                          ? "#f0f0f0"
                          : "transparent",
                    }}
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setSelectedEmployeeId(employee.id);
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={
                            typeof employee.initials === "string" &&
                            employee.initials.startsWith("http")
                              ? employee.initials
                              : undefined
                          }
                          style={{
                            backgroundColor: "#e74c3c",
                            verticalAlign: "middle",
                          }}
                        >
                          {typeof employee.initials !== "string" ||
                          !employee.initials.startsWith("http")
                            ? employee.name.charAt(0)
                            : null}
                        </Avatar>
                      }
                      title={employee.name}
                      description={`${employee.company} | ${employee.title}`}
                    />
                  </List.Item>
                )}
              />
            )}

            {filteredEmployees.length === 0 && !allEmployeesLoading && (
              <div style={{ padding: 10, textAlign: "center" }}>
                <Text type="secondary">
                  No employees found. Check your GraphQL query.
                </Text>
              </div>
            )}

            {/* Pagination */}
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Button
                type="text"
                size="small"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                {"<"}
              </Button>
              <Tag color="blue">{currentPage}</Tag>
              <Button
                type="text"
                size="small"
                disabled={currentPage * pageSize >= totalEmployees}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                {">"}
              </Button>
              <Select
                size="small"
                value={pageSize}
                onChange={(value) => {
                  setPageSize(value);
                  setCurrentPage(1); // Reset to first page when changing page size
                }}
                style={{ width: "120px" }}
              >
                <Select.Option value={5}>5 / page</Select.Option>
                <Select.Option value={10}>10 / page</Select.Option>
                <Select.Option value={20}>20 / page</Select.Option>
                <Select.Option value={50}>50 / page</Select.Option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Right Side - Employee Details */}
        <div
          style={{
            flex: 1,
            maxHeight: "calc(100vh - 135px)",
            overflowY: "scroll",
          }}
        >
          {selectedEmployeeLoading ? (
            // Skeleton loading for employee details
            <div style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton.Button
                    active
                    key={i}
                    size="small"
                    style={{ width: 80 }}
                  />
                ))}
              </div>

              <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
                <Skeleton.Avatar active size={100} shape="circle" />
                <div style={{ flex: 1 }}>
                  <Skeleton.Input
                    active
                    size="large"
                    style={{ width: 300, marginBottom: 20 }}
                  />
                  <Skeleton active paragraph={{ rows: 4 }} />
                </div>
              </div>

              <Skeleton.Input
                active
                size="small"
                style={{ width: 400, marginBottom: 20 }}
              />

              <div style={{ marginTop: 20 }}>
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 200, marginBottom: 10 }}
                />
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>

              <div style={{ marginTop: 20 }}>
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 200, marginBottom: 10 }}
                />
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            </div>
          ) : selectedEmployeeError ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <AlertCircle size={48} color="red" />
              <Title level={3}>Error loading employee details</Title>
              <Text>{selectedEmployeeError.message}</Text>
            </div>
          ) : selectedEmployee ? (
            <>
              {/* Employee Profile Card */}
              <Card
                style={{
                  backgroundColor: "white",
                  borderRadius: 0,
                  padding: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                    marginBottom: "24px",
                  }}
                >
                  <Button
                    type="default"
                    size="small"
                    icon={<CloudUpload size={10} />}
                    style={{
                      fontSize: "10px",
                      padding: "1px 4px",
                      height: "20px",
                      lineHeight: "normal",
                      borderColor: "#13c2c2",
                      color: "#13c2c2",
                    }}
                  >
                    Upload Photo
                  </Button>

                  <Button
                    color="danger"
                    variant="outlined"
                    size="small"
                    icon={<Trash2 size={10} />}
                    style={{
                      fontSize: "10px",
                      padding: "1px 4px",
                      height: "20px",
                      lineHeight: "normal",
                      borderColor: "red",
                      color: "red",
                    }}
                    onClick={handleRemovePhoto}
                  >
                    Remove Photo
                  </Button>
                  <Button
                    color="green"
                    variant="outlined"
                    size="small"
                    icon={<Edit2 size={10} />}
                    style={{
                      fontSize: "10px",
                      padding: "1px 4px",
                      height: "20px",
                      lineHeight: "normal",
                      borderColor: "green",
                      color: "green",
                    }}
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    variant="dashed"
                    size="small"
                    icon={<XCircle size={10} />}
                    style={{
                      fontSize: "10px",
                      padding: "1px 4px",
                      height: "20px",
                      lineHeight: "normal",
                      borderColor: "red",
                      color: "red",
                    }}
                    onClick={handleDeactivate}
                  >
                    Deactivate
                  </Button>
                  <Button
                    color="purple"
                    variant="outlined"
                    size="small"
                    icon={<Copy size={10} />}
                    style={{
                      fontSize: "10px",
                      padding: "1px 4px",
                      height: "20px",
                      lineHeight: "normal",
                      borderColor: "purple",
                      color: "purple",
                    }}
                    onClick={() => {
                      setAddEmployeeVisible(true);
                      setIsEditing(false);
                      form.setFieldsValue(selectedEmployee);
                      message.success(
                        "Employee data copied. You can now edit and save as a new employee."
                      );
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    marginBottom: "24px",
                  }}
                >
                  <Avatar
                    size={100}
                    src={
                      typeof selectedEmployee.initials === "string" &&
                      selectedEmployee.initials.startsWith("http")
                        ? selectedEmployee.initials
                        : undefined
                    }
                    style={{
                      backgroundColor: "#e74c3c",
                      fontSize: "36px",
                      border: "1px solid #e74c3c",
                    }}
                  >
                    {typeof selectedEmployee.initials !== "string" ||
                    !selectedEmployee.initials.startsWith("http")
                      ? selectedEmployee.name.charAt(0)
                      : null}
                  </Avatar>
                  <div>
                    <Title level={3} style={{ marginBottom: "16px" }}>
                      {selectedEmployee.name}
                    </Title>

                    <Space
                      direction="vertical"
                      size="middle"
                      style={{ display: "flex" }}
                    >
                      <Space>
                        <Phone size={14} style={{ marginRight: "8px" }} />
                        <Text>{selectedEmployee.phone}</Text>
                        {selectedEmployee.phone !== "NOT PROVIDED" && (
                          <CopyToClipboard
                            text={selectedEmployee.phone}
                            onCopy={() => handleCopy(selectedEmployee.phone)}
                          >
                            <Copy
                              size={14}
                              style={{ cursor: "pointer", color: "#1890ff" }}
                            />
                          </CopyToClipboard>
                        )}
                      </Space>

                      <Space>
                        <Mail size={14} style={{ marginRight: "8px" }} />
                        <Text>{selectedEmployee.email}</Text>
                        {selectedEmployee.email !== "NOT PROVIDED" && (
                          <CopyToClipboard
                            text={selectedEmployee.email}
                            onCopy={() => handleCopy(selectedEmployee.email)}
                          >
                            <Copy
                              size={14}
                              style={{ cursor: "pointer", color: "#1890ff" }}
                            />
                          </CopyToClipboard>
                        )}
                      </Space>

                      <Space>
                        <IdCard size={14} style={{ marginRight: "8px" }} />
                        <Text>
                          Employee Number: {selectedEmployee.employeeNumber}
                        </Text>
                        {selectedEmployee.employeeNumber !== "NOT PROVIDED" && (
                          <CopyToClipboard
                            text={selectedEmployee.employeeNumber}
                            onCopy={() =>
                              handleCopy(selectedEmployee.employeeNumber)
                            }
                          >
                            <Copy
                              size={14}
                              style={{ cursor: "pointer", color: "#1890ff" }}
                            />
                          </CopyToClipboard>
                        )}
                      </Space>

                      <Space>
                        <Globe size={14} style={{ marginRight: "8px" }} />
                        <Text>Timezone: {selectedEmployee.timezone}</Text>
                        <Clock
                          size={14}
                          style={{ marginLeft: "12px", marginRight: "8px" }}
                        />
                        <Text>Time now: {formattedTime}</Text>
                      </Space>

                      <Space>
                        <Shield size={14} style={{ marginRight: "8px" }} />
                        <Text>Access Level:</Text>
                        <Tag
                          color="blue"
                          style={{
                            fontSize: "8px",
                            padding: "2px 4px",
                            height: "auto",
                            lineHeight: "normal",
                            borderRadius: "4px",
                          }}
                        >
                          {selectedEmployee.accessLevel}
                        </Tag>
                        <div
                          size={0}
                          style={{ marginLeft: "12px", marginRight: "8px" }}
                        />
                        <div style={{ fontSize: "20px" }}>✍️</div>

                        <Text>
                          Contract Health:{" "}
                          <span style={{ color: "red" }}>
                            Contract Expires in 10 months
                          </span>
                        </Text>
                      </Space>
                    </Space>
                  </div>
                </div>
              </Card>

              {/* Tabs */}
              <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
                <Tabs.TabPane tab="Basic Information" key="basic">
                  {/* Personal Information Section */}
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <SectionHeader
                      title="Personal Information"
                      onEdit={() => console.log("Edit Personal Information")}
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      <CopyableField
                        label="Date of Birth"
                        value={formatDate(selectedEmployee.dob)}
                      />
                      <CopyableField
                        label="Gender"
                        value={
                          selectedEmployee.gender === "M"
                            ? "Male"
                            : selectedEmployee.gender === "F"
                              ? "Female"
                              : selectedEmployee.gender || "NOT PROVIDED"
                        }
                      />

                      <CopyableField
                        label="Nationality"
                        value={selectedEmployee.nationality}
                      />
                      <CopyableField
                        label="Marital Status"
                        value={selectedEmployee.maritalStatus}
                      />
                      <CopyableField
                        label="Join Date"
                        value={formatDate(selectedEmployee.joinedDate)}
                      />
                    </div>
                  </div>

                  {/* Identification Section */}
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <SectionHeader
                      title="Identification"
                      onEdit={() => console.log("Edit Identification")}
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      <CopyableField
                        label="National ID"
                        value={selectedEmployee.identification.nationalId}
                      />
                      <CopyableField
                        label="Social Insurance"
                        value={selectedEmployee.identification.socialInsurance}
                      />
                      <CopyableField
                        label="Religion"
                        value={selectedEmployee.identification.religion}
                      />
                      <CopyableField
                        label="Health Insurance"
                        value={selectedEmployee.identification.healthInsurance}
                      />
                      <CopyableField
                        label="Additional IDs"
                        value={selectedEmployee.identification.additionalIds}
                      />
                      <CopyableField
                        label="Driving License"
                        value={selectedEmployee.identification.drivingLicense}
                      />
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <SectionHeader
                      title="Contact Information"
                      onEdit={() => console.log("Edit Contact")}
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      <CopyableField
                        label="Address"
                        value={selectedEmployee.contact.address}
                      />
                      <CopyableField
                        label="City"
                        value={selectedEmployee.contact.city}
                      />
                      <CopyableField
                        label="Country"
                        value={selectedEmployee.contact.country}
                      />
                      <CopyableField
                        label="Postal/Zip Code"
                        value={selectedEmployee.contact.postalCode}
                      />
                      <CopyableField
                        label="Home Phone"
                        value={selectedEmployee.contact.homePhone}
                      />
                      <CopyableField
                        label="Work Phone"
                        value={selectedEmployee.contact.workPhone}
                      />
                      <CopyableField
                        label="Private Email"
                        value={selectedEmployee.contact.privateEmail}
                      />
                    </div>
                  </div>

                  {/* Job Details Section */}
                  <div
                    style={{
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <SectionHeader
                      title="Job Details"
                      onEdit={() => console.log("Edit Job Details")}
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      <CopyableField
                        label="Job Title"
                        value={selectedEmployee.jobDetails.jobTitle}
                      />
                      <CopyableField
                        label="Employment Status"
                        value={selectedEmployee.jobDetails.employmentStatus}
                      />
                      <CopyableField
                        label="Department"
                        value={selectedEmployee.jobDetails.department}
                      />
                      <CopyableField
                        label="Manager"
                        value={selectedEmployee.jobDetails.manager}
                      />
                    </div>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Qualifications" key="qualifications">
                  <Qualifications employeeId={selectedEmployee.id} />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Education" key="education">
                  <Education employeeId={selectedEmployee.id} />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Dependents" key="dependents">
                  <Dependents employeeId={selectedEmployee.id} />
                </Tabs.TabPane>
              </Tabs>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Select an employee to view details</Text>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddEmployeeModal
        visible={addEmployeeVisible}
        onCancel={() => {
          setAddEmployeeVisible(false);
          setIsEditing(false);
        }}
        onSubmit={handleAddEmployee}
        initialValues={isEditing ? selectedEmployee : undefined}
        isEditing={isEditing}
        form={form}
      />

      <InviteEmployeeModal
        visible={inviteEmployeeVisible}
        onCancel={() => setInviteEmployeeVisible(false)}
        onSubmit={handleInviteEmployee}
      />

      <FilterEmployeesModal
        visible={filterEmployeesVisible}
        onCancel={() => setFilterEmployeesVisible(false)}
        onFilter={(filters) => {
          console.log("Applying filters:", filters);
          setFilterEmployeesVisible(false);
        }}
      />
    </div>
  );
};

export default EmployeeManagement;
