import React, { useState } from "react";
import {
  Button,
  Modal,
  Typography,
  Select,
  Space,
  Row,
  Col,
  Divider,
} from "antd";
import { CloseSharp, Thunderstorm } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPublishResultsModalVisible,
  setPublishResultsModalVisible,
} from "../store/resultsSlice";
const PublishResultsModal = () => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const isModalOpen = useSelector(selectPublishResultsModalVisible);
  const dispatch = useDispatch();

  const handleOk = () => {
    dispatch(setPublishResultsModalVisible(false));
  };
  const handleCancel = () => {
    dispatch(setPublishResultsModalVisible(false));
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <>
      <Modal
        title={
          <div
            style={{
              //   backgroundColor: "red",
              paddingTop: 30,
              paddingBottom: 10,
            }}
          >
            <Typography.Title
              type="warning"
              level={4}
              style={{
                textAlign: "center",
                padding: 0,
                margin: 0,
              }}
            >
              Publish Results
            </Typography.Title>
          </div>
        }
        styles={{
          body: {
            padding: 0,
            // backgroundColor: "red",
          },
          content: {
            padding: 0,
          },
        }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        maskClosable={false}
        centered
        width={600}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Typography.Text
            style={{
              textAlign: "center",
            }}
          >
            Please provide the context for Results Publishing. When results are
            published, affected students gain access to view their marks through
            their portals. Note that results marked as "Final" are locked and
            cannot be edited.
          </Typography.Text>
        </div>

        <div
          style={{
            // display: "flex",
            // flexDirection: "column",
            // alignItems: "center",
            marginTop: 0,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              marginBottom: 10,
            }}
          >
            <Typography.Text mark>
              Please select the type of results to publish:
            </Typography.Text>
          </div>
          <Row gutter={16}>
            <Col md={8}>
              <Select
                placeholder="Campus"
                style={{
                  width: "100%",
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "Yiminghe",
                    label: "yiminghe",
                  },
                  {
                    value: "disabled",
                    label: "Disabled",
                    disabled: true,
                  },
                ]}
              />
            </Col>
            <Col md={8}>
              <Select
                placeholder="Acc Yr"
                style={{
                  width: "100%",
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "Yiminghe",
                    label: "yiminghe",
                  },
                  {
                    value: "disabled",
                    label: "Disabled",
                    disabled: true,
                  },
                ]}
              />
            </Col>
            <Col md={8}>
              <Select
                placeholder="Intake"
                style={{
                  width: "100%",
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "Yiminghe",
                    label: "yiminghe",
                  },
                  {
                    value: "disabled",
                    label: "Disabled",
                    disabled: true,
                  },
                ]}
              />
            </Col>
          </Row>

          <div
            style={{
              marginTop: 15,
              marginBottom: 10,
            }}
          >
            <Typography.Text mark>
              Select the semester and the publishing context:
            </Typography.Text>
          </div>
          <Row gutter={16}>
            <Col md={12}>
              <Select
                placeholder="Select Semester"
                style={{
                  width: "100%",
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "Yiminghe",
                    label: "yiminghe",
                  },
                  {
                    value: "disabled",
                    label: "Disabled",
                    disabled: true,
                  },
                ]}
              />
            </Col>
            <Col md={12}>
              <Select
                placeholder="Select Publishing Context"
                style={{
                  width: "100%",
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "Yiminghe",
                    label: "yiminghe",
                  },
                  {
                    value: "disabled",
                    label: "Disabled",
                    disabled: true,
                  },
                ]}
              />
            </Col>
          </Row>
        </div>

        <Divider
          style={{
            padding: 0,
            marginTop: 0,
            marginBottom: 0,
            backgroundColor: "orange",
          }}
          dashed
        />
        <div
          style={{
            // marginTop: 10,
            display: "flex",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <Space>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="solid" color="orange" icon={<Thunderstorm />}>
              Publish Results
            </Button>
          </Space>
        </div>
      </Modal>
    </>
  );
};
export default PublishResultsModal;
