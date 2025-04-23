import { useState } from "react";
import {
  Calendar,
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Select,
  Tooltip,
  Alert,
  Typography,
} from "antd";
import { Dayjs } from "dayjs";
import {
  CalendarIcon,
  Users,
  AlertCircle,
  Check,
  FileSpreadsheet,
  CalendarClock,
  Building2,
} from "lucide-react";
import isBetween from "dayjs/plugin/isBetween";
import dayjs from "dayjs";

dayjs.extend(isBetween);
const { Title, Text } = Typography;

// Mock data for demonstration
const teamMembers = [
  {
    id: 1,
    name: "Musiitwa Joel",
    department: "Engineering",
    staffNo: "EMP001",
    avatar:
      "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
  },
  {
    id: 2,
    name: "Mutebi Smith",
    department: "Design",
    staffNo: "EMP002",
    avatar:
      "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100125",
  },
  {
    id: 3,
    name: "Nansamba Mary",
    department: "Marketing",
    staffNo: "EMP003",
    avatar:
      "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100539",
  },
];

const publicHolidays = [
  { date: "2024-02-19", name: "Presidents Day" },
  { date: "2024-05-27", name: "Memorial Day" },
  { date: "2024-07-04", name: "Independence Day" },
];

const leaveRequests = [
  {
    id: 1,
    employeeId: 1,
    type: "Vacation",
    startDate: "2025-03-05",
    endDate: "2025-03-08",
    status: "Approved",
  },
  {
    id: 2,
    employeeId: 2,
    type: "Sick Leave",
    startDate: "2025-03-07",
    endDate: "2025-03-10",
    status: "Pending",
  },
  {
    id: 3,
    employeeId: 3,
    type: "Personal",
    startDate: "2024-03-22",
    endDate: "2024-03-23",
    status: "Approved",
  },
];

function App() {
  const [selectedDate, setSelectedDate] = (useState < Dayjs) | (null > null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [selectedView, setSelectedView] =
    (useState < "calendar") | ("table" > "calendar");

  const columns = [
    {
      title: "Employee",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={record.avatar || "/placeholder.svg"}
            alt={text}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.staffNo} • {record.department}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Leave Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={
            type === "Vacation"
              ? "blue"
              : type === "Sick Leave"
                ? "red"
                : "green"
          }
        >
          {type}
        </Tag>
      ),
    },
    {
      title: "Duration",
      key: "duration",
      render: (record) => (
        <span>{`${record.startDate} - ${record.endDate}`}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Approved"
              ? "success"
              : status === "Pending"
                ? "warning"
                : "error"
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "Vacation":
        return "#e6f4ff";
      case "Sick Leave":
        return "#fff1f0";
      case "Personal":
        return "#f6ffed";
      default:
        return "#f5f5f5";
    }
  };

  const dateCellRender = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    const holiday = publicHolidays.find((h) => h.date === dateStr);
    const leaves = leaveRequests.filter((leave) =>
      date.isBetween(leave.startDate, leave.endDate, null, "[]")
    );

    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {holiday && (
          <div
            style={{
              backgroundColor: "#fff1f0",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#cf1322",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <CalendarIcon size={12} />
            {holiday.name}
          </div>
        )}
        {leaves.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2px",
              padding: "2px",
            }}
          >
            {leaves.map((leave) => {
              const employee = teamMembers.find(
                (m) => m.id === leave.employeeId
              );

              return (
                <Tooltip
                  key={leave.id}
                  title={
                    <div>
                      <div style={{ fontWeight: 500 }}>{employee?.name}</div>
                      <div>{employee?.staffNo}</div>
                      <div>{leave.type}</div>
                      <div>
                        {leave.startDate} - {leave.endDate}
                      </div>
                      <div>Status: {leave.status}</div>
                    </div>
                  }
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={employee?.avatar || "/placeholder.svg"}
                      alt={employee?.name}
                      style={{
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        border: `2px solid ${
                          leave.status === "Approved" ? "#52c41a" : "#faad14"
                        }`,
                        backgroundColor: getLeaveTypeColor(leave.type),
                      }}
                    />
                    {dateStr === leave.startDate && (
                      <div
                        style={{
                          position: "absolute",
                          top: -2,
                          right: -2,
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor:
                            leave.type === "Vacation"
                              ? "#1677ff"
                              : leave.type === "Sick Leave"
                                ? "#ff4d4f"
                                : "#52c41a",
                        }}
                      />
                    )}
                  </div>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const dateStr = date.format("YYYY-MM-DD");
    const leavesOnDate = leaveRequests.filter((leave) =>
      date.isBetween(leave.startDate, leave.endDate, null, "[]")
    );
    if (leavesOnDate.length > 1) {
      setShowConflictModal(true);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "0px",
      }}
    >
      <Card style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <Title
              level={3}
              style={{
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <CalendarIcon style={{ width: "24px", height: "24px" }} />
              Leave Calendar
            </Title>
            <Text type="secondary">
              Team leave schedule and holiday planning
            </Text>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <Select
              size="small"
              value={selectedView}
              onChange={setSelectedView}
              options={[
                { label: "Calendar View", value: "calendar" },
                { label: "Table View", value: "table" },
              ]}
              style={{ width: "160px" }}
            />
            <Button
              size="small"
              type="primary"
              icon={
                <FileSpreadsheet style={{ width: "14px", height: "14px" }} />
              }
            >
              Export Calendar
            </Button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <Card size="small" style={{ backgroundColor: "#e6f4ff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Users
                style={{ width: "20px", height: "20px", color: "#1677ff" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>
                  Total Team Members
                </div>
                <div style={{ fontSize: "20px", fontWeight: 600 }}>
                  {teamMembers.length}
                </div>
              </div>
            </div>
          </Card>
          <Card size="small" style={{ backgroundColor: "#f6ffed" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Check
                style={{ width: "20px", height: "20px", color: "#52c41a" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>
                  Approved Leaves
                </div>
                <div style={{ fontSize: "20px", fontWeight: 600 }}>
                  {leaveRequests.filter((r) => r.status === "Approved").length}
                </div>
              </div>
            </div>
          </Card>
          <Card size="small" style={{ backgroundColor: "#fffbe6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CalendarClock
                style={{ width: "20px", height: "20px", color: "#faad14" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>
                  Pending Requests
                </div>
                <div style={{ fontSize: "20px", fontWeight: 600 }}>
                  {leaveRequests.filter((r) => r.status === "Pending").length}
                </div>
              </div>
            </div>
          </Card>
          <Card size="small" style={{ backgroundColor: "#fff1f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2
                style={{ width: "20px", height: "20px", color: "#ff4d4f" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>
                  Public Holidays
                </div>
                <div style={{ fontSize: "20px", fontWeight: 600 }}>
                  {publicHolidays.length}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {selectedView === "calendar" ? (
          <Calendar
            cellRender={dateCellRender}
            onSelect={handleDateSelect}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "16px",
            }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={leaveRequests.map((leave) => ({
              ...leave,
              ...teamMembers.find((m) => m.id === leave.employeeId),
            }))}
            size="small"
            style={{ backgroundColor: "white", borderRadius: "8px" }}
          />
        )}

        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle
                style={{ width: "20px", height: "20px", color: "#faad14" }}
              />
              Leave Conflict Detected
            </div>
          }
          open={showConflictModal}
          onCancel={() => setShowConflictModal(false)}
          footer={[
            <Button
              size="small"
              key="back"
              onClick={() => setShowConflictModal(false)}
            >
              Close
            </Button>,
          ]}
        >
          <Alert
            message="Multiple team members are on leave on the selected date"
            description="This might affect team productivity. Consider suggesting alternative dates."
            type="warning"
            showIcon
            style={{ marginBottom: "16px" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {selectedDate &&
              leaveRequests
                .filter((leave) =>
                  selectedDate.isBetween(
                    leave.startDate,
                    leave.endDate,
                    null,
                    "[]"
                  )
                )
                .map((leave) => {
                  const employee = teamMembers.find(
                    (m) => m.id === leave.employeeId
                  );
                  return (
                    <div
                      key={leave.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <img
                          src={employee?.avatar || "/placeholder.svg"}
                          alt={employee?.name}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            {employee?.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {employee?.staffNo} • {employee?.department}
                          </div>
                        </div>
                      </div>
                      <Tag color={leave.type === "Vacation" ? "blue" : "red"}>
                        {leave.type}
                      </Tag>
                    </div>
                  );
                })}
          </div>
        </Modal>
      </Card>
    </div>
  );
}

export default App;
