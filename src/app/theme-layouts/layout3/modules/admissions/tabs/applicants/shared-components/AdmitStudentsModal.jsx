import { ConfigProvider, Flex, Table } from "antd";
import { useSelector } from "react-redux";
import { selectSelectedApplications } from "../../../admissionsSlice";

const renderRow = (record, text) => {
  const color = parseInt(record.is_admitted)
    ? "blue"
    : parseInt(record.is_paid)
      ? "green"
      : "red"; // Conditional color based on `paid` field

  return <span style={{ color }}>{text}</span>;
};
const columns = [
  {
    title: "No",
    dataIndex: "no",
    key: "index",
    // render: (text, record, index) => index + 1,
    render: (text, record, index) => renderRow(record, index + 1),
    width: 60,
  },
  {
    title: "Form No",
    dataIndex: "form_no",
    render: (text, record, index) => renderRow(record, text),
    width: 200,
  },
  {
    title: "Name",
    dataIndex: "name",
    render: (text, record, index) =>
      renderRow(
        record,
        `${record.applicant.surname} ${record.applicant.other_names}`
      ),
  },
  {
    title: "Admitted",
    dataIndex: "is_admitted",
    render: (text, record, index) => renderRow(record, `${Boolean(text)}`),
    width: 100,
  },
  {
    title: "Course code",
    dataIndex: "Prog Code",
    render: (text, record, index) =>
      renderRow(record, record.program_choices[0].course.course_code),
    width: 150,
  },
];

const App = () => {
  const selectedApplications = useSelector(selectSelectedApplications);

  // console.log("selected apps", selectedApplications);

  return (
    <Flex gap="middle" vertical>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "rgba(0, 0, 0, 0.04)",
            },
          },
        }}
      >
        <Table
          //   rowSelection={rowSelection}
          columns={columns}
          dataSource={selectedApplications}
          // loading={true}
          rowKey="id"
          size="small"
          scroll={{
            y: 300,
          }}
        />
      </ConfigProvider>
    </Flex>
  );
};
export default App;
