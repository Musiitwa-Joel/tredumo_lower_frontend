import {
  Users,
  Building2,
  User,
  FolderGit2,
  Search,
  Bell,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  Settings,
  FileSearch,
  Radar,
  Car,
  File,
  Lock,
  Zap,
  FormInput,
  PieChartIcon,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Avatar,
  Timeline,
  Space,
} from "antd";
import { motion } from "framer-motion";
import Tooltip from "@mui/material/Tooltip";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
import { useQuery } from "@apollo/client";
import { LOAD_EMPLOYEES } from "../../gql/queries";
import Employees from "../employee/Employee";

const { Title } = Typography;

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

// Components
const MotionCard = motion(Card);

const StatisticCard = ({ title, value, color, Icon, actionText }) => (
  <Card
    bodyStyle={{ padding: 0 }}
    style={{ overflow: "hidden" }}
    className="management-card"
    hoverable
  >
    <div style={{ background: color, padding: "20px", color: "white" }}>
      <Title level={2} style={{ margin: 0, color: "white" }}>
        {title}
      </Title>
      <div style={{ fontSize: "16px" }}>{value}</div>
      <div className="card-icon">
        <Icon size={80} style={{ opacity: 1 }} />
      </div>
    </div>
    <div style={{ padding: "10px 20px", textAlign: "center" }}>
      <Button type="link" style={{ padding: 0 }}>
        {actionText} <ArrowRight size={16} />
      </Button>
    </div>
  </Card>
);

const ColleaguesSection = () => {
  const { error, loading, data } = useQuery(LOAD_EMPLOYEES);

  const [searchMode, setSearchMode] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchClick = () => {
    setSearchMode(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (searchMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchMode]);

  const handleBlur = () => {
    setSearchMode(false);
    setSearchQuery("");
  };

  if (loading) {
    return (
      <Col xs={24}>
        <Card
          style={{
            height: "100px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Your Colleagues
          </Title>
          <Space>
            {[...Array(27)].map((_, index) => (
              <Avatar
                key={index}
                style={{
                  backgroundColor: "#f0f0f0",
                  width: "40px",
                  height: "40px",
                }}
              />
            ))}
          </Space>
        </Card>
      </Col>
    );
  }

  if (error) return <p>Error loading employees</p>;

  const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase();
  };

  const maxVisibleAvatars = 25;
  const visibleEmployees = data.employees.slice(0, maxVisibleAvatars);
  const remainingEmployees = data.employees.length - maxVisibleAvatars;

  const filteredEmployees = data.employees.filter((employee) =>
    `${employee.surname} ${employee.other_names}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <Col xs={24}>
      <Card
        style={{
          height: "100px",
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Your Colleagues
        </Title>
        <Space>
          {filteredEmployees
            .slice(0, searchMode ? maxVisibleAvatars - 1 : maxVisibleAvatars)
            .map((employee, index) => (
              <Tooltip
                key={employee.id}
                title={
                  <span>{`${employee.salutation} ${employee.surname} ${employee.other_names}`}</span>
                }
                arrow
                placement="top"
                followCursor
              >
                <Avatar
                  src={`http://199.241.139.118:9000/api/lecturer/image/${employee.staff_id}`}
                  style={{
                    backgroundColor: "#E74A3B",
                    fontSize: "18px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border:
                      index === 0 && searchQuery ? "2px solid green" : "none",
                  }}
                >
                  {!employee.image &&
                    getInitials(`${employee.surname} ${employee.other_names}`)}
                </Avatar>
              </Tooltip>
            ))}
          {remainingEmployees > 0 && !searchMode && (
            <Avatar
              style={{
                backgroundColor: "#f0f0f0",
                color: "#000",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              +{remainingEmployees}
            </Avatar>
          )}
          {searchMode && (
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onBlur={handleBlur}
              placeholder="Search staff..."
              style={{
                width: "100px",
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #d9d9d9",
              }}
            />
          )}
          {!searchMode && (
            <Tooltip
              title="Search staff directory"
              arrow
              placement="top"
              followCursor
            >
              <Avatar
                style={{
                  backgroundColor: "#f0f0f0",
                  color: "#000",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={handleSearchClick}
              >
                <Search size={20} />
              </Avatar>
            </Tooltip>
          )}
        </Space>
      </Card>
    </Col>
  );
};

const TaskTimeline = () => (
  <Timeline
    style={{ marginTop: 0 }}
    items={[
      {
        dot: (
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Bell size={16} color="#E74A3B" />
          </motion.div>
        ),
        color: "red",
        children: "You haven't set your status for the day.",
      },
      {
        dot: (
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Clock size={16} color="#E74A3B" />
          </motion.div>
        ),
        color: "red",
        children: "You are currently not checked-in",
      },
      {
        dot: (
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Calendar size={16} color="#1890ff" />
          </motion.div>
        ),
        color: "blue",
        children: (
          <Button type="link" style={{ padding: 0 }}>
            Visit Attendance
          </Button>
        ),
      },
      {
        dot: (
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Clock size={16} color="#E74A3B" />
          </motion.div>
        ),
        color: "red",
        children: "No holidays defined for the current year",
      },
      {
        dot: (
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <AlertTriangle size={16} color="#F6C23E" />
          </motion.div>
        ),
        color: "orange",
        children: (
          <div>
            Your company name and descrip...
            <Button type="link" style={{ padding: 0, marginLeft: 8 }}>
              Expand
            </Button>
          </div>
        ),
      },
    ]}
  />
);

const ManagementCard = ({ title, subtitle, color, Icon, actionText }) => (
  <motion.div variants={item}>
    <Card
      bodyStyle={{ padding: 0 }}
      style={{ overflow: "hidden" }}
      className="management-card"
      hoverable
    >
      <div
        style={{
          background: color,
          padding: "20px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Title
          level={2}
          style={{
            margin: 0,
            color: "white",
            position: "relative",
            zIndex: 2,
          }}
        >
          {title}
        </Title>
        <div style={{ fontSize: "16px", position: "relative", zIndex: 2 }}>
          {subtitle}
        </div>
        <div className="card-icon">
          <Icon size={80} />
        </div>
      </div>
      <div style={{ padding: "10px 20px", textAlign: "center" }}>
        <Button type="link" style={{ padding: 0 }}>
          {actionText} <ArrowRight size={16} />
        </Button>
      </div>
    </Card>
  </motion.div>
);

const ManagementCards = () => {
  const cards = [
    {
      title: "Attendance",
      subtitle: "0 Entries Last Week",
      color: "#F6C23E",
      Icon: Clock,
      actionText: "Monitor Attendance",
    },
    {
      title: "Leave",
      subtitle: "0 Upcoming",
      color: "#E74A3B",
      Icon: Calendar,
      actionText: "Leave Management",
    },
    {
      title: "Reports",
      subtitle: "View / Download Reports",
      color: "#36B9CC",
      Icon: FileText,
      actionText: "Generate a Report",
    },
    {
      title: "Settings",
      subtitle: "Configure IceHrm",
      color: "#1CC88A",
      Icon: Settings,
      actionText: "Update Settings",
    },
    {
      title: "Active Jobs",
      subtitle: "0 Jobs Posted",
      color: "#17A2B8",
      Icon: FileSearch,
      actionText: "Manage Jobs",
    },
    {
      title: "Training",
      subtitle: "2 Courses",
      color: "#F6C23E",
      Icon: Radar,
      actionText: "Manage Training",
    },
    {
      title: "Travel",
      subtitle: "Requests",
      color: "#E74A3B",
      Icon: Car,
      actionText: "Manage Travel",
    },
    {
      title: "Document",
      subtitle: "Management",
      color: "#1CC88A",
      Icon: File,
      actionText: "Manage Documents",
    },
    {
      title: "Permission",
      subtitle: "Management",
      color: "#17A2B8",
      Icon: Lock,
      actionText: "Manage Permissions",
    },
    {
      title: "Billing",
      subtitle: "and Invoices",
      color: "#1CC88A",
      Icon: Zap,
      actionText: "Make a Payment",
    },
    {
      title: "HR Form",
      subtitle: "Management",
      color: "#36B9CC",
      Icon: FormInput,
      actionText: "Manage Forms",
    },
    {
      title: "Performance",
      subtitle: "Reviews",
      color: "#F6C23E",
      Icon: PieChartIcon,
      actionText: "Manage Reviews",
    },
    {
      title: "Expense",
      subtitle: "Management",
      color: "#36B9CC",
      Icon: CreditCard,
      actionText: "Manage Expenses",
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        {cards.map((card, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <ManagementCard {...card} />
          </Col>
        ))}
      </Row>
    </motion.div>
  );
};

const Dashboard = () => {
  const { error, loading, data } = useQuery(LOAD_EMPLOYEES, {
    notifyOnNetworkStatusChange: true,
  });
  console.log("data", data);
  // Chart data
  const checkInData = [
    { name: "Not Started", value: 3, color: "#8C9AAE" },
    { name: "Checked In", value: 1, color: "#6495ED" },
    { name: "Checked Out", value: 1, color: "#229954" },
  ];

  const distributionData = [
    { name: "Not Assigned", value: 1, color: "#6495ED" },
    { name: "Your Company", value: 1, color: "#5DADE2" },
  ];

  // Chart components
  const CustomLegend = ({ payload }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        fontSize: "12px",
      }}
    >
      {payload.map((entry, index) => (
        <div
          key={`legend-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: entry.color,
              borderRadius: "2px",
            }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <p>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: "10px", background: "#f0f2f5", minHeight: "100vh" }}>
      <AppStyles />
      <Row gutter={[4, 4]}>
        {/* Statistic Cards */}
        <Col xs={24} sm={12} md={6}>
          <StatisticCard
            title="People"
            value={`${data?.employees?.length || 0} Employees`}
            color="#36B9CC"
            Icon={Users}
            actionText={
              <span
                onClick={() => (window.location.href = "/apps/hr/employee")}
              >
                Manage Employees
              </span>
            }
            // actionText="Manage Employees"
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <StatisticCard
            title="Company"
            value="3 Departments"
            color="#1CC88A"
            Icon={Building2}
            actionText="Manage Company"
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <StatisticCard
            title="Users"
            value="2 Users"
            color="#F6C23E"
            Icon={User}
            actionText="Manage Users"
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <StatisticCard
            title="Projects"
            value="4 Active Projects"
            color="#E74A3B"
            Icon={FolderGit2}
            actionText="Update Clients/Projects"
          />
        </Col>

        {/* Colleagues Section */}
        <ColleaguesSection />

        {/* Charts and Task List */}
        <Col xs={24} md={8}>
          <MotionCard
            title="Employee Check-Ins"
            style={{ height: "280px" }}
            bodyStyle={{
              padding: "0px",
              height: "calc(100% - 57px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={checkInData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {checkInData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  content={<CustomLegend />}
                  verticalAlign="bottom"
                  height={36}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                {/* Center text */}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: "24px", fontWeight: "bold" }}
                >
                  {checkInData.reduce((acc, curr) => acc + curr.value, 0)}
                </text>
                <text
                  x="50%"
                  y="60%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: "14px" }}
                >
                  Total
                </text>
              </PieChart>
            </ResponsiveContainer>
          </MotionCard>
        </Col>

        <Col xs={24} md={8}>
          <MotionCard
            title="Employee Distribution"
            style={{ height: "280px" }}
            bodyStyle={{
              padding: "0px",
              height: "calc(100% - 57px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  content={<CustomLegend />}
                  verticalAlign="bottom"
                  height={36}
                />
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </MotionCard>
        </Col>

        <Col xs={24} md={8}>
          <MotionCard
            title="Task List"
            style={{ height: "280px" }}
            bodyStyle={{
              padding: "12px",
              height: "calc(100% - 57px)",
              overflowY: "auto",
            }}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <TaskTimeline />
          </MotionCard>
        </Col>
      </Row>

      {/* Management Cards */}
      <ManagementCards />
    </div>
  );
};

const AppStyles = () => (
  <style>{`
    .management-card .card-icon {
      position: absolute;
      right: 20px;
      top: 20px;
      opacity: 0.2;
      transition: transform 0.3s ease;
    }

    .management-card:hover .card-icon {
      transform: scale(1.2);
    }

    /* Add smooth transitions for all animations */
    * {
      transition: all 0.3s ease;
    }
  `}</style>
);

export default Dashboard;
