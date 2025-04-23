import { gql, useMutation, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import {
  Space,
  Input,
  Button,
  ConfigProvider,
  Table,
  Modal,
  Form,
  Row,
  Col,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAddFeeItemModal,
  selectOtherFeesFormState,
  selectSelectedFeeItem,
  setAddFeeItemModal,
  setSelectedFeeItem,
} from "../../store/feesMgtSlice";
import { SAVE_OTHER_FEE } from "../../gql/mutations";
import { selectUser } from "app/store/userSlice";
import { LOAD_OTHER_FEES } from "../../gql/queries";

const { Search } = Input;

const GET_FEE_ITEMS = gql`
  query Fees_items {
    fees_items {
      id
      item_name
      item_code
      item_description
    }
  }
`;

const columns = [
  {
    title: "#",
    dataIndex: "#",
    width: "8%",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Item Code",
    dataIndex: "item_code",
    width: "15%",
    ellipsis: true,
    // render: (text, record, index) => record.fee_item.item_name,
  },
  {
    title: "Item Name",
    dataIndex: "item_name",
    width: "30%",
    ellipsis: true,
    // render: (text, record, index) => record.fee_item.item_name,
  },
  {
    title: "Description",
    dataIndex: "item_description",
    width: "30%",
    // render: (text, record, index) => parseInt(record.amount).toLocaleString(),
    // editable: selectedItem ? (selectedItem.is_variable ? true : false) : true,
    ellipsis: true,
  },
];

function AllFeesItems() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  //   const [selectedRow, setSelectedRow] = useState(null);
  const [form] = Form.useForm();
  const selectedRow = useSelector(selectSelectedFeeItem);
  const dispatch = useDispatch();
  const otherFeesFormState = useSelector(selectOtherFeesFormState);
  const addFeeItemModalVisible = useSelector(selectAddFeeItemModal);
  const user = useSelector((state) => state.user.user);

  const { error, loading, data } = useQuery(GET_FEE_ITEMS, {
    notifyOnNetworkStatusChange: true,
  });

  const [
    saveOtherFee,
    { error: saveErr, loading: savingFeeItem, data: saveRes },
  ] = useMutation(SAVE_OTHER_FEE, {
    refetchQueries: [
      "loadOtherFees",
      //   {
      //     query: LOAD_OTHER_FEES,
      //     variables: {
      //       accYrId: otherFeesFormState?.acc_yr,
      //       campusId: otherFeesFormState?.campus,
      //       intakeId: otherFeesFormState?.intake,
      //       nationalityCategoryId: otherFeesFormState?.nationality,
      //     },
      //   },
    ],
    onCompleted: (response) => {
      console.log("response", response);
    },
  });

  //   console.log(saveRes);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (saveErr) {
      dispatch(
        showMessage({
          message: saveErr.message,
          variant: "error",
        })
      );
    }
  }, [error, saveErr]);

  const onSelectChange = (newSelectedRowKeys, row) => {
    console.log("row: ", row);
    dispatch(setSelectedFeeItem(row[0]));
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleOk = () => {
    form.validateFields();
    form.submit();
  };

  const handleCancel = () => {
    dispatch(setAddFeeItemModal(false));
  };

  const handleAddFeeItem = () => {
    form.setFieldsValue({
      amount: "",
    });
    dispatch(setAddFeeItemModal(true));
  };

  useEffect(() => {
    if (selectedRow && selectedRow.amount) {
      form.setFieldsValue({
        amount: selectedRow.amount,
      });
    } else {
      form.setFieldsValue({
        amount: "",
      });
    }
  }, [selectedRow]);

  const onFinish = async (values) => {
    // console.log("values from form", values);

    const payload = {
      accYrId: otherFeesFormState.acc_yr,
      campusId: otherFeesFormState.campus,
      intakeId: otherFeesFormState.intake,
      nationalityCategoryId: otherFeesFormState.nationality,
      itemId: selectedRow.id,
      amount: values.amount,
      addedBy: user.user_id,
      saveOtherFeeId: selectedRow.other_item_id
        ? selectedRow.other_item_id
        : null,
    };
    const res = await saveOtherFee({
      variables: payload,
    });

    dispatch(
      showMessage({
        message: res.data.saveOtherFee.message,
        variant: "success",
      })
    );

    dispatch(setAddFeeItemModal(false));
  };

  return (
    <div>
      <Box
        sx={{
          backgroundColor: "#1e293b",
        }}
        className="p-10"
        style={{
          paddingLeft: 15,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          color="inherit"
          component="div"
          style={{
            //   opacity: 0.7,
            color: "white",
          }}
        >
          All Fees Items
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: "#fff",
          borderColor: "lightgray",
          borderWidth: 1,
          // marginBottom: 1,
        }}
        className="p-5"
        style={{
          paddingLeft: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 10,
          marginBottom: 8,
          // backgroundColor: "red",

          // height: 40,
        }}
      >
        <div>
          <span
            variant="h6"
            color="inherit"
            component="div"
            style={{
              fontSize: "2rem",

              fontWeight: "500",
              // visibility: selectedTreeItem ? "visible" : "hidden",
            }}
          >
            <Button
              icon={<KeyboardDoubleArrowLeft />}
              color="danger"
              danger
              disabled={!otherFeesFormState || !selectedRow}
              onClick={handleAddFeeItem}
            >
              Add Fees Item
            </Button>
          </span>
        </div>

        <div>
          <Space>
            <Search
              placeholder="Search Fees item..."
              // onSearch={onSearch}
              // onChange={(e) => onSearch(e.target.value)}
              size="middle"
              width={500}
              style={{
                width: 250,
              }}
            />
          </Space>
        </div>
      </Box>

      <div
        style={{
          marginTop: 8,
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Table: {
                borderColor: "lightgray",
                borderRadius: 0,
                headerBorderRadius: 0,
              },
            },
          }}
        >
          <Table
            size="small"
            rowKey={"id"}
            bordered
            loading={loading || savingFeeItem}
            dataSource={data ? data.fees_items : []}
            rowSelection={{
              onChange: onSelectChange,
              columnWidth: "5%",
              type: "radio",
            }}
            columns={columns}
            pagination
            scroll={{
              y: "calc(100vh - 340px)",
            }}
          />
        </ConfigProvider>
      </div>

      <Modal
        title={`${selectedRow?.item_name}`}
        open={addFeeItemModalVisible}
        onOk={handleOk}
        maskClosable={false}
        // onClose={null}
        okText="Add Item"
        okButtonProps={{
          htmlType: "submit",
          loading: savingFeeItem,
          style: {
            backgroundColor: !savingFeeItem ? "dodgerblue" : "",
          },
          disabled: savingFeeItem,
        }}
        onCancel={handleCancel}
      >
        <Form
          // initialValues={_applicantFillForm}
          form={form}
          name="fee_item_form"
          layout="vertical"
          //   style={formStyle}
          onFinish={onFinish}
        >
          <Row gutter={24} align="middle">
            <Col
              span={24}
              style={{
                paddingBottom: 0,
              }}
            >
              <Form.Item
                name={`amount`}
                label={`Enter Amount`}
                rules={[
                  {
                    required: true,
                    message: "Field is Required",
                  },
                ]}
                style={{
                  paddingBottom: 0,
                  marginBottom: 0,
                  //   width: 200,
                }}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default AllFeesItems;
