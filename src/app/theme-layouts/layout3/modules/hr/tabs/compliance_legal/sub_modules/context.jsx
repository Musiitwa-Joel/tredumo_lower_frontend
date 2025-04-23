"use client";

import { createContext, useContext, useState } from "react";

// Create the context with default values
const ComplianceContext = createContext({
  complianceData: {
    policies: [],
    contracts: [],
    grievances: [],
    safetyIncidents: [],
    trainings: [],
    diversityStats: {
      genderDistribution: { male: 0, female: 0, other: 0 },
      ageDistribution: { under30: 0, between30And50: 0, over50: 0 },
      departmentDistribution: {},
      disabilityStats: { withDisability: 0, withoutDisability: 0 },
      ethnicityDistribution: {},
    },
    securityLogs: [],
  },
  addPolicy: () => {},
  updatePolicy: () => {},
  addContract: () => {},
  updateContract: () => {},
  addGrievance: () => {},
  updateGrievance: () => {},
  addSafetyIncident: () => {},
  updateSafetyIncident: () => {},
  addTraining: () => {},
  updateTraining: () => {},
  updateDiversityStats: () => {},
  addSecurityLog: () => {},
  getExpiringContracts: () => [],
  getPendingGrievances: () => [],
  getComplianceRate: () => 0,
  getPendingTrainings: () => [],
});

// Create mock data
const mockPolicies = [
  {
    id: "POL-001",
    title: "Academic Integrity Policy",
    description:
      "Guidelines for maintaining academic integrity at Nkumba University",
    category: "Academic",
    effectiveDate: "2023-01-15",
    lastReviewDate: "2023-01-15",
    nextReviewDate: "2024-01-15",
    status: "active",
    documentUrl: "/documents/policies/academic-integrity.pdf",
    acknowledgementRequired: true,
    acknowledgementStats: {
      total: 180,
      acknowledged: 165,
    },
  },
  {
    id: "POL-002",
    title: "Staff Code of Conduct",
    description: "Code of conduct for all staff members at Nkumba University",
    category: "HR",
    effectiveDate: "2022-09-01",
    lastReviewDate: "2022-09-01",
    nextReviewDate: "2023-09-01",
    status: "active",
    documentUrl: "/documents/policies/staff-code-of-conduct.pdf",
    acknowledgementRequired: true,
    acknowledgementStats: {
      total: 180,
      acknowledged: 178,
    },
  },
  {
    id: "POL-003",
    title: "Research Ethics Policy",
    description: "Guidelines for ethical research practices",
    category: "Research",
    effectiveDate: "2022-11-10",
    lastReviewDate: "2022-11-10",
    nextReviewDate: "2023-11-10",
    status: "active",
    documentUrl: "/documents/policies/research-ethics.pdf",
    acknowledgementRequired: true,
    acknowledgementStats: {
      total: 85,
      acknowledged: 82,
    },
  },
];

const mockContracts = [
  {
    id: "CON-001",
    employeeId: "EMP-001",
    employeeName: "Dr. John Mukasa",
    department: "Computer Science",
    position: "Senior Lecturer",
    contractType: "Permanent",
    startDate: "2020-09-01",
    endDate: "2025-08-31",
    status: "active",
    documentUrl: "/documents/contracts/emp-001.pdf",
    renewalReminder: true,
    renewalReminderDays: 90,
  },
  {
    id: "CON-002",
    employeeId: "EMP-002",
    employeeName: "Sarah Namukwaya",
    department: "Business Administration",
    position: "Lecturer",
    contractType: "Fixed Term",
    startDate: "2022-01-15",
    endDate: "2023-12-31",
    status: "active",
    documentUrl: "/documents/contracts/emp-002.pdf",
    renewalReminder: true,
    renewalReminderDays: 60,
  },
  {
    id: "CON-003",
    employeeId: "EMP-003",
    employeeName: "Robert Okello",
    department: "Finance",
    position: "Administrative Assistant",
    contractType: "Fixed Term",
    startDate: "2022-03-01",
    endDate: "2023-11-30",
    status: "active",
    documentUrl: "/documents/contracts/emp-003.pdf",
    renewalReminder: true,
    renewalReminderDays: 60,
  },
];

const mockGrievances = [
  {
    id: "GRV-001",
    employeeId: "EMP-005",
    employeeName: "Jane Akello",
    department: "Human Resources",
    category: "Workplace Harassment",
    description: "Complaint about inappropriate comments from a colleague",
    dateReported: "2023-10-05",
    status: "investigating",
    priority: "high",
    assignedTo: "EMP-010",
    confidential: true,
  },
  {
    id: "GRV-002",
    employeeId: "EMP-012",
    employeeName: "Michael Ochieng",
    department: "Library",
    category: "Working Conditions",
    description: "Inadequate ventilation in the library staff room",
    dateReported: "2023-09-28",
    status: "pending",
    priority: "medium",
    assignedTo: "EMP-010",
    confidential: false,
  },
  {
    id: "GRV-003",
    employeeId: "EMP-008",
    employeeName: "Patricia Nambi",
    department: "Computer Science",
    category: "Discrimination",
    description: "Concerns about being overlooked for promotion due to gender",
    dateReported: "2023-10-10",
    status: "pending",
    priority: "high",
    assignedTo: "EMP-001",
    confidential: true,
  },
];

const mockSafetyIncidents = [
  {
    id: "INC-001",
    incidentType: "Slip and Fall",
    location: "Main Building Staircase",
    dateReported: "2023-09-15",
    dateOccurred: "2023-09-15",
    reportedBy: "EMP-007",
    description: "Student slipped on wet floor near staircase",
    severity: "medium",
    status: "resolved",
    actionTaken: "Area was cordoned off, floor dried, and caution signs placed",
    preventiveMeasures:
      "Regular inspection of high-traffic areas during rainy season",
  },
  {
    id: "INC-002",
    incidentType: "Electrical Fault",
    location: "Science Laboratory",
    dateReported: "2023-10-02",
    dateOccurred: "2023-10-02",
    reportedBy: "EMP-015",
    description: "Short circuit in lab equipment caused small fire",
    severity: "high",
    status: "investigating",
    actionTaken: "Fire extinguished, equipment isolated, area secured",
    preventiveMeasures: "Pending investigation results",
  },
  {
    id: "INC-003",
    incidentType: "Chemical Spill",
    location: "Chemistry Lab",
    dateReported: "2023-10-12",
    dateOccurred: "2023-10-12",
    reportedBy: "EMP-022",
    description: "Minor chemical spill during experiment",
    severity: "low",
    status: "resolved",
    actionTaken: "Spill contained and cleaned according to safety protocols",
    preventiveMeasures: "Refresher training on handling chemicals scheduled",
  },
];

const mockTrainings = [
  {
    id: "TRN-001",
    title: "Fire Safety Training",
    description: "Basic fire safety and evacuation procedures",
    category: "Safety",
    mandatory: true,
    targetAudience: ["All Staff"],
    startDate: "2023-11-15",
    endDate: "2023-11-15",
    status: "scheduled",
    attendees: {
      total: 180,
      completed: 0,
    },
  },
  {
    id: "TRN-002",
    title: "Data Protection Awareness",
    description:
      "Training on Uganda's Data Protection and Privacy Act compliance",
    category: "Compliance",
    mandatory: true,
    targetAudience: ["Administrative Staff", "Faculty", "IT Staff"],
    startDate: "2023-11-20",
    endDate: "2023-11-22",
    status: "scheduled",
    attendees: {
      total: 120,
      completed: 0,
    },
  },
  {
    id: "TRN-003",
    title: "Anti-Harassment Workshop",
    description: "Workshop on preventing and addressing workplace harassment",
    category: "HR",
    mandatory: true,
    targetAudience: ["Department Heads", "Supervisors"],
    startDate: "2023-10-05",
    endDate: "2023-10-05",
    status: "completed",
    attendees: {
      total: 25,
      completed: 22,
    },
  },
];

const mockDiversityStats = {
  genderDistribution: {
    male: 95,
    female: 85,
    other: 0,
  },
  ageDistribution: {
    under30: 35,
    between30And50: 110,
    over50: 35,
  },
  departmentDistribution: {
    "Computer Science": 28,
    "Business Administration": 32,
    Education: 30,
    Engineering: 25,
    "Arts and Social Sciences": 35,
    Administration: 30,
  },
  disabilityStats: {
    withDisability: 8,
    withoutDisability: 172,
  },
  ethnicityDistribution: {
    Baganda: 65,
    Banyankole: 25,
    Basoga: 20,
    Iteso: 15,
    Acholi: 12,
    Langi: 10,
    Other: 33,
  },
};

const mockSecurityLogs = [
  {
    id: "LOG-001",
    action: "Login",
    performedBy: "EMP-001",
    timestamp: "2023-10-15T08:30:00",
    ipAddress: "192.168.1.100",
    module: "HR System",
    details: "Successful login",
    severity: "info",
  },
  {
    id: "LOG-002",
    action: "File Access",
    performedBy: "EMP-010",
    timestamp: "2023-10-15T09:45:00",
    ipAddress: "192.168.1.120",
    module: "Document Management",
    details: "Accessed confidential employee records",
    severity: "warning",
  },
  {
    id: "LOG-003",
    action: "Failed Login",
    performedBy: "Unknown",
    timestamp: "2023-10-15T14:22:00",
    ipAddress: "192.168.1.200",
    module: "HR System",
    details: "Multiple failed login attempts",
    severity: "critical",
  },
];

// Create a provider component
export const ComplianceProvider = ({ children }) => {
  const [complianceData, setComplianceData] = useState({
    policies: mockPolicies,
    contracts: mockContracts,
    grievances: mockGrievances,
    safetyIncidents: mockSafetyIncidents,
    trainings: mockTrainings,
    diversityStats: mockDiversityStats,
    securityLogs: mockSecurityLogs,
  });

  // Function to add a new policy
  const addPolicy = (policy) => {
    setComplianceData((prev) => ({
      ...prev,
      policies: [...prev.policies, policy],
    }));
  };

  // Function to update an existing policy
  const updatePolicy = (id, policy) => {
    setComplianceData((prev) => ({
      ...prev,
      policies: prev.policies.map((p) =>
        p.id === id ? { ...p, ...policy } : p
      ),
    }));
  };

  // Function to add a new contract
  const addContract = (contract) => {
    setComplianceData((prev) => ({
      ...prev,
      contracts: [...prev.contracts, contract],
    }));
  };

  // Function to update an existing contract
  const updateContract = (id, contract) => {
    setComplianceData((prev) => ({
      ...prev,
      contracts: prev.contracts.map((c) =>
        c.id === id ? { ...c, ...contract } : c
      ),
    }));
  };

  // Function to add a new grievance
  const addGrievance = (grievance) => {
    setComplianceData((prev) => ({
      ...prev,
      grievances: [...prev.grievances, grievance],
    }));
  };

  // Function to update an existing grievance
  const updateGrievance = (id, grievance) => {
    setComplianceData((prev) => ({
      ...prev,
      grievances: prev.grievances.map((g) =>
        g.id === id ? { ...g, ...grievance } : g
      ),
    }));
  };

  // Function to add a new safety incident
  const addSafetyIncident = (incident) => {
    setComplianceData((prev) => ({
      ...prev,
      safetyIncidents: [...prev.safetyIncidents, incident],
    }));
  };

  // Function to update an existing safety incident
  const updateSafetyIncident = (id, incident) => {
    setComplianceData((prev) => ({
      ...prev,
      safetyIncidents: prev.safetyIncidents.map((i) =>
        i.id === id ? { ...i, ...incident } : i
      ),
    }));
  };

  // Function to add a new training
  const addTraining = (training) => {
    setComplianceData((prev) => ({
      ...prev,
      trainings: [...prev.trainings, training],
    }));
  };

  // Function to update an existing training
  const updateTraining = (id, training) => {
    setComplianceData((prev) => ({
      ...prev,
      trainings: prev.trainings.map((t) =>
        t.id === id ? { ...t, ...training } : t
      ),
    }));
  };

  // Function to update diversity stats
  const updateDiversityStats = (stats) => {
    setComplianceData((prev) => ({
      ...prev,
      diversityStats: { ...prev.diversityStats, ...stats },
    }));
  };

  // Function to add a security log
  const addSecurityLog = (log) => {
    setComplianceData((prev) => ({
      ...prev,
      securityLogs: [...prev.securityLogs, log],
    }));
  };

  // Utility function to get expiring contracts
  const getExpiringContracts = (daysThreshold) => {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);

    return complianceData.contracts.filter((contract) => {
      const endDate = new Date(contract.endDate);
      return (
        endDate <= thresholdDate &&
        endDate >= today &&
        contract.status === "active"
      );
    });
  };

  // Utility function to get pending grievances
  const getPendingGrievances = () => {
    return complianceData.grievances.filter(
      (grievance) =>
        grievance.status === "pending" || grievance.status === "investigating"
    );
  };

  // Utility function to calculate compliance rate
  const getComplianceRate = () => {
    // Calculate based on policy acknowledgements, training completion, etc.
    let totalItems = 0;
    let compliantItems = 0;

    // Policy acknowledgements
    complianceData.policies.forEach((policy) => {
      if (policy.acknowledgementRequired) {
        totalItems += policy.acknowledgementStats.total;
        compliantItems += policy.acknowledgementStats.acknowledged;
      }
    });

    // Training completion
    complianceData.trainings.forEach((training) => {
      if (
        training.status === "completed" ||
        training.status === "in-progress"
      ) {
        totalItems += training.attendees.total;
        compliantItems += training.attendees.completed;
      }
    });

    return totalItems > 0
      ? Math.round((compliantItems / totalItems) * 100)
      : 100;
  };

  // Utility function to get pending trainings
  const getPendingTrainings = () => {
    return complianceData.trainings.filter(
      (training) =>
        training.status === "scheduled" || training.status === "in-progress"
    );
  };

  // Provide the context value
  const contextValue = {
    complianceData,
    addPolicy,
    updatePolicy,
    addContract,
    updateContract,
    addGrievance,
    updateGrievance,
    addSafetyIncident,
    updateSafetyIncident,
    addTraining,
    updateTraining,
    updateDiversityStats,
    addSecurityLog,
    getExpiringContracts,
    getPendingGrievances,
    getComplianceRate,
    getPendingTrainings,
  };

  return (
    <ComplianceContext.Provider value={contextValue}>
      {children}
    </ComplianceContext.Provider>
  );
};

// Custom hook to use the compliance context
export const useCompliance = () => useContext(ComplianceContext);
