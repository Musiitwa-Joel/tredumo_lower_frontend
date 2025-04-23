import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {
  Form,
  Row,
  Col,
  Select,
  Button,
  Space,
  Popconfirm,
  ConfigProvider,
  Table,
} from "antd";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectOtherFees,
  selectOtherFeesFormState,
  setAddFeeItemModal,
  setOtherFees,
  setOtherFeesFormState,
  setSelectedFeeItem,
} from "../../store/feesMgtSlice";
import { LOAD_OTHER_FEES } from "../../gql/queries";
import { Delete, Edit } from "@mui/icons-material";
import { DELETE_OTHER_FEE } from "../../gql/mutations";

const formStyle = {
  maxWidth: "none",
  padding: 5,
  // backgroundColor: "red",
};

const columns = [
  {
    title: "#",
    dataIndex: "#",
    width: 50,
    render: (text, record, index) => index + 1,
  },
  {
    title: "Item Code",
    dataIndex: "item_code",
    width: "15%",
    ellipsis: true,
    render: (text, record, index) => record.fee_item.item_code,
  },
  {
    title: "Item Name",
    dataIndex: "item_name",
    width: "40%",
    ellipsis: true,
    render: (text, record, index) => record.fee_item.item_name,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: "20%",
    render: (text, record, index) => parseInt(record.amount).toLocaleString(),
    // editable: selectedItem ? (selectedItem.is_variable ? true : false) : true,
    ellipsis: true,
  },
  {
    title: "Action",
    dataIndex: "operation",
    render: (_, record) => {
      return (
        <Space size="middle">
          <Button
            size="small"
            type="primary"
            ghost
            // disabled={editingKey !== ""}
            onClick={() => edit(record)}
            // onClick={() => handleRowClick(record)}
            icon={<Edit />}
          />
          <Popconfirm
            title="Delete Fee Item"
            description="Are you sure to delete this item?"
            onConfirm={(e) => confirm(e, record)}
            // onCancel={cancel}
            okText="Yes"
            okButtonProps={{
              style: {
                backgroundColor: "dodgerblue",
              },
            }}
            cancelText="No"
          >
            <Button
              size="small"
              danger
              // onClick={() => handleRowDelete(record)}
              icon={<Delete color="red" />}
            />
          </Popconfirm>
        </Space>
      );
    },
  },
];

const LOAD_REQS = gql`
  query Query {
    campuses {
      id
      campus_title
    }
    intakes {
      id
      intake_title
    }
    acc_yrs {
      id
      acc_yr_title
    }
    nationality_categories {
      id
      category_title
    }
  }
`;

function SelectedFeesItems() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const otherFeesFormState = useSelector(selectOtherFeesFormState);
  const otherFees = useSelector(selectOtherFees);

  const [loadOtherFees, { error, loading, data }] = useLazyQuery(
    LOAD_OTHER_FEES,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
    }
  );

  const [
    deleteOtherFee,
    { error: deleteErr, loading: deletingFee, data: deleteRes },
  ] = useMutation(DELETE_OTHER_FEE, {
    refetchQueries: ["loadOtherFees"],
  });

  const columns = [
    {
      title: "#",
      dataIndex: "#",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "Item Code",
      dataIndex: "item_code",
      width: "15%",
      ellipsis: true,
      render: (text, record, index) => record.fee_item.item_code,
    },
    {
      title: "Item Name",
      dataIndex: "item_name",
      width: "40%",
      ellipsis: true,
      render: (text, record, index) => record.fee_item.item_name,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: "20%",
      render: (text, record, index) => parseInt(record.amount).toLocaleString(),
      // editable: selectedItem ? (selectedItem.is_variable ? true : false) : true,
      ellipsis: true,
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              size="small"
              type="primary"
              ghost
              // disabled={editingKey !== ""}
              onClick={() => edit(record)}
              // onClick={() => handleRowClick(record)}
              icon={<Edit />}
            />
            <Popconfirm
              title="Delete Fee Item"
              description="Are you sure to delete this item?"
              onConfirm={(e) => confirm(e, record)}
              // onCancel={cancel}
              okText="Yes"
              okButtonProps={{
                style: {
                  backgroundColor: "dodgerblue",
                },
              }}
              cancelText="No"
            >
              <Button
                size="small"
                danger
                // onClick={() => handleRowDelete(record)}
                icon={<Delete color="red" />}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const edit = (record) => {
    const _d = {
      id: record.fee_item.id,
      item_name: record.fee_item.item_name,
      item_code: record.fee_item.item_code,
      other_item_id: record.id,
      amount: record.amount,
    };
    dispatch(setSelectedFeeItem(_d));
    dispatch(setAddFeeItemModal(true));
  };

  const confirm = async (e, record) => {
    const payload = {
      otherFeeId: record.id,
    };

    const res = await deleteOtherFee({
      variables: payload,
    });

    dispatch(
      showMessage({
        message: res.data.deleteOtherFee.message,
        variant: "success",
      })
    );
  };

  //   console.log("data", data);

  useEffect(() => {
    if (data) {
      dispatch(setOtherFees(data.other_fees));
    }
  }, [data]);

  const {
    error: reqsErr,
    loading: loadingReqs2,
    data: reqsRes,
  } = useQuery(LOAD_REQS);

  useEffect(() => {
    if (reqsErr) {
      // alert("error getting forms!");
      dispatch(
        showMessage({
          message: reqsErr.message,
          variant: "error",
        })
      );
    }

    if (deleteErr) {
      // alert("error getting forms!");
      dispatch(
        showMessage({
          message: deleteErr.message,
          variant: "error",
        })
      );
    }

    if (error) {
      // alert("error getting forms!");
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [reqsErr, deleteErr, error]);

  useEffect(() => {
    if (otherFeesFormState) {
      form.setFieldsValue({
        acc_yr: otherFeesFormState.acc_yr,
        campus: otherFeesFormState.campus,
        intake: otherFeesFormState.intake,
        nationality: otherFeesFormState.nationality,
      });
    }
  }, [otherFeesFormState]);

  const onFinish = async (values) => {
    // console.log("Received values of form: ", values);

    const payload = {
      accYrId: values.acc_yr,
      campusId: values.campus,
      intakeId: values.intake,
      nationalityCategoryId: values.nationality,
    };

    const res = await loadOtherFees({
      variables: payload,
      fetchPolicy: "network-only",
    });

    dispatch(setOtherFees(res.data.other_fees));
    dispatch(setOtherFeesFormState(values));
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
          Selected Fees Items
        </Typography>
      </Box>

      <div>
        <Form
          // initialValues={_applicantFillForm}
          form={form}
          name="advanced_search"
          style={formStyle}
          onFinish={onFinish}
        >
          <Row gutter={16} align="middle">
            <Col
              span={5}
              style={{
                //   backgroundColor: "green",
                paddingBottom: 0,
              }}
            >
              <Form.Item
                name={`acc_yr`}
                // label={`Academic Year`}
                rules={[
                  {
                    required: true,
                    message: "Field is Required",
                  },
                ]}
                style={{
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
              >
                <Select loading={loadingReqs2} placeholder="Acc Year">
                  {reqsRes?.acc_yrs.map((acc_yr) => (
                    <Option value={acc_yr.id}>{acc_yr.acc_yr_title}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={5}>
              <Form.Item
                name={`campus`}
                // label={`Academic Year`}
                rules={[
                  {
                    required: true,
                    message: "Field is Required",
                  },
                ]}
                style={{
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
              >
                <Select loading={loadingReqs2} placeholder="Campus">
                  {reqsRes?.campuses.map((campus) => (
                    <Option value={campus.id}>{campus.campus_title}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item
                name={`intake`}
                // label={`Intake`}
                rules={[
                  {
                    required: true,
                    message: "Select an intake",
                  },
                ]}
                style={{
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
              >
                <Select loading={loadingReqs2} placeholder="Intake">
                  {reqsRes?.intakes.map((intake) => (
                    <Option value={intake.id}>{intake.intake_title}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name={`nationality`}
                // label={`Intake`}
                rules={[
                  {
                    required: true,
                    message: "Select Nationality",
                  },
                ]}
                style={{
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
              >
                <Select loading={loadingReqs2} placeholder="Nationality">
                  {reqsRes?.nationality_categories.map((nationality) => (
                    <Option value={nationality.id}>
                      {nationality.category_title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={2}>
              <Button
                type="primary"
                danger
                htmlType="submit"
                disabled={loading}
                loading={loading}
              >
                Load
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

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
            loading={loading || deletingFee}
            dataSource={otherFees}
            columns={columns}
            pagination
            scroll={{
              y: "calc(100vh - 350px)",
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}

export default SelectedFeesItems;
