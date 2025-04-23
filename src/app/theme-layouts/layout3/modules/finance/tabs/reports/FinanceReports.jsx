import * as React from "react";
import { ConfigProvider, Tabs, Button, DatePicker, Space, Tooltip } from "antd";
import "./courseStyles.css";
const { RangePicker } = DatePicker;
import { SearchOutlined } from "@ant-design/icons";
import RevenueTableComponent from "./report_tabs/all_reports/revenue_report/RevenueTableComponent";
import Receivables from "./report_tabs/all_reports/receivables/Receivables";
import AgedReceivables from "./report_tabs/all_reports/aged_receivables/AgedReceivables";
import GrantsAndDonation from "./report_tabs/all_reports/grants_donations/GrantsAndDonations";
import SchoolRevenue from "./report_tabs/all_reports/school_revenue/SchoolRevenue";
import RevenueByAcademicYear from "./report_tabs/all_reports/revenue_by_academic_year/RevenueByAcademicYear";
import OperationalExpenses from "./report_tabs/all_reports/operational_expenses/OperationalExpenses";
import ChartOfAccounts from "./report_tabs/all_reports/chart_of_accounts/ChartOfAccounts";
import FinancialYear from "./report_tabs/all_reports/financial_yr_report/FinancialYear";
import TreypayTransaction from "./report_tabs/all_reports/treypay_transansactions/TreypayTransaction";
import TreypayGlobalReport from "./report_tabs/all_reports/trepay_global_transactions/TreyPayGlobalTransactions";

export default function FinanceReports() {
  const [activeKey, setActiveKey] = React.useState("revenue_report");

  const handleChange = (key) => {
    setActiveKey(key);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "blue",
        },
        components: {
          Tabs: {
            cardBg: "#f0f0f0",
            cardGutter: 5,
            cardPadding: 0,
            itemColor: "#000",
            itemSelectedColor: "dodgerblue",
            fontWeight: "bold",
            itemSelectedBorderColor: "blue",
          },
        },
      }}
    >
      <Tabs
        activeKey={activeKey}
        onChange={handleChange}
        tabPosition="left" // or 'bottom'
        tabBarStyle={{
          paddingTop: 10,
          paddingLeft: 5,
        }}
        type="card"
        style={{
          height: "100%",
        }}
        scrollable
        items={[
          {
            label: `Revenue Report`,
            key: "revenue_report",
            children: (
              <div
                style={{
                  marginTop: 15,
                  marginRight: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Space size={12}>
                      <RangePicker />
                      <Tooltip title="Retrieve report">
                        <Button
                          icon={<SearchOutlined />}
                          size=""
                          type="primary"
                          ghost
                        >
                          Retrieve report
                        </Button>
                      </Tooltip>
                    </Space>
                  </div>
                  <div>
                    <RevenueTableComponent />
                  </div>
                </div>
              </div>
            ),
          },
          {
            label: `Receivables`,
            key: "receivables",
            children: (
              <div
                style={{
                  marginTop: 10,
                  marginRight: 20,
                }}
              >
                <Receivables />
              </div>
            ),
          },
          {
            label: `Aged Receivables`,
            key: "aged_receivables",
            children: (
              <div
                style={{
                  marginTop: 10,
                  marginRight: 20,
                }}
              >
                <AgedReceivables />
              </div>
            ),
          },
          {
            label: `Grants and Donations`,
            key: "grants_and_donations",
            children: (
              <div
                style={{
                  marginTop: 10,
                  marginRight: 20,
                }}
              >
                <GrantsAndDonation />
              </div>
            ),
          },
          {
            label: `Revenue by School`,
            key: "revenue_by_school",
            children: (
              <div
                style={{
                  marginTop: 10,
                  marginRight: 20,
                }}
              >
                <SchoolRevenue />
              </div>
            ),
          },
          {
            label: `Revenue by Academic year`,
            key: "revenue_by_acad_yr",
            children: (
              <div
                style={{
                  marginTop: 10,
                  marginRight: 20,
                }}
              >
                <RevenueByAcademicYear />
              </div>
            ),
          },
          {
            label: `Operational Expenses`,
            key: "operational_expenses",
            children: (
              <div
                style={{
                  marginTop: 10,
                  marginRight: 20,
                }}
              >
                <OperationalExpenses />
              </div>
            ),
          },

          {
            label: `Chart of accounts`,
            key: "chart_of_accounts",
            children: (
              <div
                style={{
                  marginTop: 10,
                  marginRight: 20,
                }}
              >
                <ChartOfAccounts />
              </div>
            ),
          },
          {
            label: `Financial year report`,
            key: "financial_yr_report",
            children: (
              <div
                style={{
                  marginTop: 10,
                  marginRight: 20,
                }}
              >
                <FinancialYear />
              </div>
            ),
          },
          {
            label: `Trepay Transactions`,
            key: "trepay_transactions",
            children: (
              <div
                style={{
                  marginTop: 10,
                  marginRight: 20,
                }}
              >
                <TreypayTransaction />
              </div>
            ),
          },
          {
            label: `Trepay global transactions`,
            key: "trepay_global_transactions",
            children: (
              <div
                style={{
                  marginTop: 10,
                  marginRight: 20,
                }}
              >
                <TreypayGlobalReport />
              </div>
            ),
          },
        ]}
      />
    </ConfigProvider>
  );
}
