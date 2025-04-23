import { useState } from "react";
import { Form, Row, Col, Select, DatePicker, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const StudyTimeForm = ({ data, loadingRequirements }) => {
  const [form] = Form.useForm();
  const [studyTimes, setStudyTimes] = useState([{ id: Date.now() }]);

  // Add a new row
  const addRow = () => {
    setStudyTimes([...studyTimes, { id: Date.now() }]);
  };

  // Remove a row
  const removeRow = (id) => {
    setStudyTimes(studyTimes.filter((item) => item.id !== id));
  };

  return (
    <Form form={form} layout="vertical">
      {studyTimes.map((item, index) => (
        <Row gutter={16} key={item.id} align="middle">
          <Col span={10}>
            <Form.Item
              label="Study Time"
              name={`study_time_${item.id}`}
              rules={[{ required: true, message: "Please select study time!" }]}
            >
              <Select
                showSearch
                placeholder="Select Study Time"
                loading={loadingRequirements}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={
                  data?.study_times
                    ? data?.study_times.map((st) => ({
                        value: st.id,
                        label: st.study_time_title,
                      }))
                    : []
                }
              />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item
              label="Date"
              name={`date_${item.id}`}
              rules={[{ required: true, message: "Please select a date!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          {studyTimes.length > 1 && (
            <Col span={4}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeRow(item.id)}
              />
            </Col>
          )}
        </Row>
      ))}

      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={addRow}>
          Add
        </Button>
      </div>
    </Form>
  );
};

export default StudyTimeForm;
