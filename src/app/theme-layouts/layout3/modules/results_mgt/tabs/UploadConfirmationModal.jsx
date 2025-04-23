import { useState } from "react";
import { Modal, Input, Typography, Button, Alert } from "antd";
import { ExclamationCircleOutlined, LockOutlined } from "@ant-design/icons";
import { Close } from "@mui/icons-material";

const UploadConfirmationModal = ({
  visible,
  onCancel,
  onConfirm,
  loading,
  securityCode,
  setSecurityCode,
}) => {
  //   const [securityCode, setSecurityCode] = useState("");

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      centered
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ExclamationCircleOutlined style={{ color: "#fff", fontSize: 20 }} />
          <span
            style={{
              color: "#fff",
            }}
          >
            Security Code Required
          </span>
        </div>
      }
      closeIcon={
        <Close
          style={{
            color: "#fff",
          }}
        />
      }
      cancelButtonProps={{
        style: {
          display: "none",
        },
      }}
      styles={{
        body: {
          paddingLeft: 10,
          paddingRight: 10,
          height: "auto",
          paddingBottom: 10,

          // Ensure the content is not clipped
        },
        content: {
          padding: 0,
          height: "auto",
          // Ensure the content is not clipped
        },
        footer: {
          padding: 10,
        },
        header: {
          backgroundColor: "#2f405d",
          padding: "7px 10px",
        },
      }}
    >
      <Alert
        message="Sensitive Action"
        description="Due to the sensivity of this action, please provide the security code that has been sent to you via SMS/Email"
        type="warning"
        showIcon
      />

      <Typography.Text strong style={{ display: "block", marginTop: 15 }}>
        Enter Security Code
      </Typography.Text>
      <Input
        prefix={<LockOutlined />}
        placeholder="Enter security code"
        value={securityCode}
        onChange={(e) => setSecurityCode(e.target.value)}
      />

      <div style={{ textAlign: "right", marginTop: 20 }}>
        {/* <Button onClick={onCancel} style={{ marginRight: 10 }}>
          Cancel
        </Button> */}
        <Button
          type="primary"
          danger
          disabled={!securityCode || loading}
          onClick={() => onConfirm(securityCode)}
          loading={loading}
        >
          Verify Code
        </Button>
      </div>
    </Modal>
  );
};

export default UploadConfirmationModal;
