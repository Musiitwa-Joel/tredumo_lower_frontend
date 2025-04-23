import React, { useEffect, useRef, memo } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css"; // Import the CSS for PerfectScrollbar
import { Col, Row, Card, ConfigProvider, Table, Button } from "antd";
import ApplicantsFillForm from "../../applicants/ApplicantsFillForm";

const containerStyle = {
  height: "calc(100vh - 175px)", // Container height to trigger scroll
  position: "relative",
  overflow: "hidden", // Hide default scrollbars
  //   maxWidth: 500,
};

const style = {
  background: "#0092ff",
  padding: "8px 0",
};

const columns = [
  {
    title: "#",
    dataIndex: "no",
    key: "index",
    width: 40,
    render: (text, record, index) => renderRow(record, index + 1),
  },
  {
    title: "Date",
    dataIndex: "admitted_on",
    ellipsis: true,
    // render: (text, record, index) => (
    //   <span>{formatDateString(parseInt(text))}</span>
    // ),
    render: (text, record, index) =>
      renderRow(record, formatDateString(parseInt(text))),
    width: 150,
  },
  {
    title: "Ref No",
    ellipsis: true,
    dataIndex: "refNo",
    render: (text, record, index) => renderRow(record, text),
    width: 140,
  },
  {
    title: "Form No",
    ellipsis: true,
    dataIndex: "form_no",
    render: (text, record, index) => renderRow(record, text),
    width: 110,
  },
  {
    title: "Name",
    // dataIndex: "name",
    width: 210,
    ellipsis: true,
    sorter: (a, b) => {
      const nameA = `${a.biodata.surname} ${a.biodata.other_names}`;
      const nameB = `${b.biodata.surname} ${b.biodata.other_names}`;
      return nameA.localeCompare(nameB); // Sort names alphabetically
    },
    // render: (text, record, index) => {
    //   const name = `${record.applicant.surname} ${record.applicant.other_names}`;
    //   const color = record ? "blue" : "red"; // Conditional color based on `paid` field

    //   return <span style={{ color }}>{name}</span>;
    // },
    render: (text, record, index) =>
      renderRow(
        record,
        `${record.biodata.surname} ${record.biodata.other_names}`
      ),
  },
  {
    title: "Bank",
    dataIndex: "banl",
    width: 50,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => renderRow(record, record.biodata.gender),
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Branch",
    dataIndex: "branch",
    width: 100,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) =>
      renderRow(record, record.course.course_code),
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: 80,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => renderRow(record, text),
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Gender",
    dataIndex: "Gender",
    width: 100,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => renderRow(record, text),
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Phone No",
    dataIndex: "phone_no",
    width: 80,
    // rener: (text, record, index) => <>{`${record.applicant.gender}`}</>,
    render: (text, record, index) => renderRow(record, text),
    // sorter: (a, b) => a.age - b.age,
  },
];

const CampusColumns = [
  {
    title: "Campus",
    dataIndex: "campus",
    ellipsis: true,
    // render: (text, record, index) => (
    //   <span>{formatDateString(parseInt(text))}</span>
    // ),
    render: (text, record, index) =>
      renderRow(record, formatDateString(parseInt(text))),
    width: 80,
  },
  {
    title: "Total Forms",
    ellipsis: true,
    dataIndex: "total_forms",
    render: (text, record, index) => renderRow(record, text),
    width: 100,
  },
  {
    title: "Total Paid",
    ellipsis: true,
    dataIndex: "total_paid",
    render: (text, record, index) => renderRow(record, text),
    width: 110,
  },
  {
    title: "Total Fees",
    ellipsis: true,
    dataIndex: "total_paid",
    render: (text, record, index) => renderRow(record, text),
    width: 110,
  },
];

const NationalityColumns = [
  {
    title: "Nationality",
    dataIndex: "nationality",
    ellipsis: true,
    // render: (text, record, index) => (
    //   <span>{formatDateString(parseInt(text))}</span>
    // ),
    render: (text, record, index) =>
      renderRow(record, formatDateString(parseInt(text))),
    width: 100,
  },
  {
    title: "Total Forms",
    ellipsis: true,
    dataIndex: "total_forms",
    render: (text, record, index) => renderRow(record, text),
    width: 100,
  },
  {
    title: "Total Paid",
    ellipsis: true,
    dataIndex: "total_paid",
    render: (text, record, index) => renderRow(record, text),
    width: 110,
  },
  {
    title: "Total Fees",
    ellipsis: true,
    dataIndex: "total_paid",
    render: (text, record, index) => renderRow(record, text),
    width: 110,
  },
];

const BankColumns = [
  {
    title: "Bank",
    dataIndex: "bank",
    ellipsis: true,
    // render: (text, record, index) => (
    //   <span>{formatDateString(parseInt(text))}</span>
    // ),
    render: (text, record, index) =>
      renderRow(record, formatDateString(parseInt(text))),
    width: 100,
  },
  {
    title: "Branch",
    ellipsis: true,
    dataIndex: "branch",
    render: (text, record, index) => renderRow(record, text),
    width: 100,
  },
  {
    title: "Total Amount",
    ellipsis: true,
    dataIndex: "total_amount",
    render: (text, record, index) => renderRow(record, text),
    width: 110,
  },
];

const tableConfig = {
  components: {
    Table: {
      borderColor: "lightgray",
      borderRadius: 0,
      headerBorderRadius: 0,
      cellFontSize: 10,
      fontSize: 13,
      lineHeight: 0.8,
    },
    Card: {
      padding: 0,
    },
  },
};

const MemoizedTable = memo(({ columns, dataSource, scrollY }) => (
  <Table
    columns={columns}
    dataSource={dataSource}
    rowKey="id"
    bordered
    sticky
    size="small"
    pagination={{
      position: ["bottomRight"],
    }}
    scroll={{
      y: scrollY, // Fixed scroll height
    }}
  />
));

const ApplicationsReport = () => {
  const scrollContainerRef = useRef(null);
  const psInstanceRef = useRef(null);

  useEffect(() => {
    // Initialize PerfectScrollbar on the container
    if (scrollContainerRef.current) {
      psInstanceRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelPropagation: false, // Option to prevent wheel event propagation
        suppressScrollX: true,
      });
    }

    // Cleanup PerfectScrollbar when the component is unmounted
    return () => {
      if (psInstanceRef.current) {
        psInstanceRef.current.destroy();
        psInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          //   backgroundColor: "lightblue",
          //   borderBottomColor: "lightgray",
          //   borderBottomWidth: 1,
          marginTop: -5,
          marginBottom: 24,
          marginLeft: -10,
          marginRight: 10,
        }}
      >
        <ApplicantsFillForm />
      </div>
      <div
        ref={scrollContainerRef}
        style={{
          height: "calc(100vh - 240px)", // Container height to trigger scroll
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Card type="inner" title="Total Application Forms" size="small">
              <Row gutter={16}>
                <Col className="gutter-row" span={8}>
                  Total Forms
                  <div>
                    <span
                      style={{
                        fontSize: "3.5rem",
                        color: "green",
                      }}
                    >
                      6726
                    </span>
                  </div>
                </Col>
                <Col className="gutter-row" span={8}>
                  Paid Forms
                  <div>
                    <span
                      style={{
                        fontSize: "3.5rem",
                        color: "blue",
                      }}
                    >
                      745
                    </span>
                  </div>
                </Col>
                <Col className="gutter-row" span={8}>
                  Unpaid Forms
                  <div>
                    <span
                      style={{
                        fontSize: "3.5rem",
                        color: "red",
                      }}
                    >
                      5433
                    </span>
                  </div>
                </Col>
              </Row>
            </Card>
            <Card
              type="inner"
              title="Total Application Fees"
              size="small"
              style={{
                marginTop: 24,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "3.5rem",
                    color: "blue",
                  }}
                >
                  UGX 973,933,000
                </span>
              </div>
            </Card>

            <Card
              type="inner"
              title="Totals By Campus"
              size="small"
              style={{
                marginTop: 24,
                height: 350,
              }}
              extra={<Button size="small">Download</Button>}
            >
              <ConfigProvider theme={tableConfig}>
                <MemoizedTable
                  columns={CampusColumns}
                  dataSource={[]}
                  scrollY={250}
                />
              </ConfigProvider>
            </Card>
          </Col>
          <Col span={16}>
            <Card
              type="inner"
              title="Application Payments"
              size="small"
              style={{
                height: 350,
                padding: 0,
                margin: 0,
                //   backgroundColor: "red",
              }}
              extra={<Button size="small">Download</Button>}
            >
              <ConfigProvider theme={tableConfig}>
                <MemoizedTable
                  columns={columns}
                  dataSource={[]}
                  scrollY={300}
                />
              </ConfigProvider>
            </Card>
            <Row gutter={24}>
              <Col span={12}>
                <Card
                  type="inner"
                  title="Totals By Nationality"
                  size="small"
                  style={{
                    marginTop: 24,
                    height: 350,
                  }}
                  extra={<Button size="small">Download</Button>}
                >
                  <ConfigProvider theme={tableConfig}>
                    <MemoizedTable
                      columns={NationalityColumns}
                      dataSource={[]}
                      scrollY={250}
                    />
                  </ConfigProvider>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  type="inner"
                  title="Bank Collections Summary"
                  size="small"
                  style={{
                    marginTop: 24,
                    height: 350,
                  }}
                  extra={<Button size="small">Download</Button>}
                >
                  <ConfigProvider theme={tableConfig}>
                    <MemoizedTable
                      columns={BankColumns}
                      dataSource={[]}
                      scrollY={250}
                    />
                  </ConfigProvider>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ApplicationsReport;
