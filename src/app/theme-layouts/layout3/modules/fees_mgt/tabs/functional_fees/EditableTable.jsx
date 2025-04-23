import React, { useEffect, useState } from "react";
import {
  Button,
  ConfigProvider,
  FloatButton,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import {
  Add,
  Close,
  Delete,
  Edit,
  HighlightOffSharp,
  Save,
} from "@mui/icons-material";
import { useMutation, useQuery } from "@apollo/client";
import { GET_FEES_ITEMS, GET_FREQUENCY_CODES } from "../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectFeesItems,
  selectFormState,
  selectFrequencyCodes,
  selectFunctionalFeesItems,
  selectFunctionalFormState,
  selectLoadingFunctionalFees,
  selectLoadingTuitionFees,
  selectSelectedFeeItemFunctional,
  selectSelectedFunctionalFeeItem,
  selectSelectedTreeItem,
  selectSelectedTuitionFeeItem,
  selectTuitionFeesItems,
  setFeesItems,
  setFrequencyCodes,
  setFunctionalFeesItems,
  setSelectedFrequencyCode,
  setSelectedFuntionalFeeItem,
  setSelectedTuitionFeeItem,
  setTuitionFeesItems,
} from "../../store/feesMgtSlice";
import {
  DELETE_FUNCTIONAL_FEE,
  DELETE_TUITION_FESS,
  SAVE_FUNCTIONAL_FEE,
  SAVE_TUITION_FEE,
} from "../../gql/mutations";
const originData = [
  // {
  //   key: "1",
  //   name: `Edward `,
  //   age: 32,
  //   address: `London Park no. 2`,
  // },
  // {
  //   key: "2",
  //   name: `Edward `,
  //   age: 32,
  //   address: `London Park no. 2`,
  // },
];

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const user = useSelector((state) => state.user.user);

  // console.log("user", user);
  const feesItems = useSelector(selectFeesItems);
  const frequencyCodes = useSelector(selectFrequencyCodes);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const selectedTreeItem = useSelector(selectSelectedFeeItemFunctional);
  const loadingFunctionalFees = useSelector(selectLoadingFunctionalFees);
  const functionalFeesItems = useSelector(selectFunctionalFeesItems);
  const selectedFeeItem = useSelector(selectSelectedFunctionalFeeItem);
  const formState = useSelector(selectFunctionalFormState);
  const {
    error,
    loading,
    data: itemsRes,
  } = useQuery(GET_FEES_ITEMS, {
    notifyOnNetworkStatusChange: true,
  });

  const [
    saveFunctionalFee,
    { error: saveErr, loading: savingTuitionFee, data: saveRes },
  ] = useMutation(SAVE_FUNCTIONAL_FEE, {
    refetchQueries: ["loadFunctionalFees"],
  });

  const [
    deleteFunctionalFee,
    { error: deleteErr, loading: deletingFunctionalFee, data: deleteRes },
  ] = useMutation(DELETE_FUNCTIONAL_FEE, {
    refetchQueries: ["loadFunctionalFees"],
  });

  const {
    error: codesErr,
    loading: codesloading,
    data: codeRes,
  } = useQuery(GET_FREQUENCY_CODES, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (codesErr) {
      dispatch(
        showMessage({
          message: codesErr.message,
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

    if (deleteErr) {
      dispatch(
        showMessage({
          message: deleteErr.message,
          variant: "error",
        })
      );
    }
  }, [error, codesErr, saveErr, deleteErr]);

  // console.log("tuition fees items", tuitionFeesItems);

  useEffect(() => {
    if (itemsRes) {
      // console.log("items res", itemsRes);
      dispatch(setFeesItems(itemsRes.fees_items));
    }

    if (codeRes) {
      // console.log("items res", itemsRes);
      dispatch(setFrequencyCodes(codeRes.frequency_codes));
    }
  }, [itemsRes, codeRes]);

  // useEffect(() => {
  //   if (selectedItem) {
  //     form.setFieldsValue({
  //       amount: selectedItem.is_variable ? null : selectedItem.fixed_amount,
  //     });
  //   }
  // }, [selectedItem]);

  const handleSearch = (value) => {
    const filtered = feesItems.filter((item) =>
      item.item_name.toLowerCase().includes(value.toLowerCase())
    );
    // console.log("filtered", filtered);
    dispatch(setFeesItems(filtered));
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    // console.log("record", record);
    const inputNode =
      inputType === "number" ? (
        <InputNumber
          style={{
            width: "100%",
          }}
          // readOnly={
          //   selectedItem ? (selectedItem.is_variable ? false : true) : false
          // }
        />
      ) : dataIndex == "item_name" ? (
        <Select
          showSearch
          placeholder="Select item"
          options={feesItems.map((item) => ({
            value: item.id,
            label: item.item_name,
          }))}
          // onChange={(value) => {
          //   const item = feesItems.filter((i) => i.id == value);
          //   // console.log("selected", item);
          //   setSelectedItem(item[0]);
          // }}
          filterOption={(input, option) =>
            option?.label.toLowerCase().includes(input.toLowerCase())
          }
        />
      ) : dataIndex == "frequency_code" ? (
        <Select
          showSearch
          placeholder="Select Frequency"
          options={frequencyCodes.map((code) => ({
            value: code.code_id,
            label: code.code_title,
          }))}
          onChange={(value) => {
            const item = frequencyCodes.filter((i) => i.id == value);
            // console.log("selected", item);
            dispatch(setSelectedFrequencyCode(item[0]));
          }}
          filterOption={(input, option) =>
            option?.label.toLowerCase().includes(input.toLowerCase())
          }
        />
      ) : (
        <Input />
      );

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    // console.log("record", record);
    dispatch(setSelectedFuntionalFeeItem(record));
    form.setFieldsValue({
      item_name: record.fee_item.id,
      amount: record.amount,
      frequency_code: record.frequency_code,
    });
    setEditingKey(record.id);
  };

  const cancel = (record) => {
    // console.log("record", record);
    if (record.frequency_code == "") {
      // we need to remove the last item
      const updatedItems = functionalFeesItems.slice(0, -1);
      dispatch(setFunctionalFeesItems(updatedItems));
    }

    form.resetFields();
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const payload = {
        accYrId: formState.acc_yr,
        campusId: formState.campus,
        intakeId: formState.intake,
        levelId: selectedTreeItem?.details.level_id,
        nationalityCategoryId: selectedTreeItem?.details.nationality_id,
        studyTimeId: selectedTreeItem?.details.study_time_id,
        itemId: row.item_name,
        amount: `${row.amount}`,
        frequencyCode: row.frequency_code,
        addedBy: user.user_id,
        saveFunctionalFeeId: selectedFeeItem ? selectedFeeItem.id : null,
      };
      // const newData = [...data];
      // const index = newData.findIndex((item) => key === item.key);
      // console.log("row", row);
      // console.log("new data", newData);
      // console.log("selected", selectedTreeItem);
      // console.log("row", row);
      // console.log("the payload", payload);

      const res = await saveFunctionalFee({
        variables: payload,
      });

      dispatch(
        showMessage({
          message: res.data.saveFunctionalFee.message,
          variant: "success",
        })
      );
      // console.log("index", index);
      // if (index > -1) {
      //   const item = newData[index];
      //   const original_row = feesItems.filter((i) => row.item_name == i.id);

      //   // i need the item name based on the selected id
      //   let newRow = {
      //     ...row,
      //     item_name: original_row[0].item_name,
      //     item_id: original_row[0].id,
      //     amount: row.amount.toLocaleString(),
      //   };

      //   newData.splice(index, 1, {
      //     ...item,
      //     ...newRow,
      //   });

      //   console.log("new data", newData);
      //   setData(newData);
      //   setEditingKey("");
      // } else {
      //   newData.push(row);
      //   setData(newData);
      //   setEditingKey("");
      // }
      setEditingKey("");
      form.resetFields();
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  // console.log(tuitionFeesItems);

  const handleAddItem = async () => {
    await form.validateFields();
    dispatch(setSelectedFuntionalFeeItem(null));
    // Increment count based on the length of tuitionFeesItems
    setCount((prevCount) => prevCount + functionalFeesItems.length + 1);
    const newCount = count + 1;

    // console.log("the count", newCount);

    let _d = {
      id: `temp-${newCount}`,
      fee_item: {
        id: "",
        item_code: "",
        item_name: "",
      },
      amount: 0,
      frequency_code: "",
      frequency: {
        code_id: "",
        code_title: "",
      },
    };

    // console.log("d", _d);
    setEditingKey(`temp-${newCount}`);

    // Instead of pushing to the original array, create a new array
    const updatedItems = [...functionalFeesItems, _d];

    // console.log("data", updatedItems);

    // Update the state with the new array
    dispatch(setFunctionalFeesItems(updatedItems));

    // Optionally, update the local data (if needed)
    // setData([...data, _d]);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "#",
      width: 50,
      render: (text, record, index) => index + 1,
      editable: false,
    },
    {
      title: "Item Name",
      dataIndex: "item_name",
      width: "30%",
      editable: true,
      render: (text, record, index) => record.fee_item.item_name,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: "20%",
      render: (text, record, index) => parseInt(record.amount).toLocaleString(),
      // editable: selectedItem ? (selectedItem.is_variable ? true : false) : true,
      editable: true,
    },
    {
      title: "Paid When",
      dataIndex: "frequency_code",
      width: "30%",
      render: (text, record, index) => record.frequency.code_title,
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">
            <Tooltip title="Save">
              <Button
                size="small"
                type="primary"
                onClick={() => save(record.key)}
                ghost
                // onClick={() => handleRowClick(record)}
                icon={<Save />}
              />
            </Tooltip>
            <Popconfirm
              title="Sure to cancel?"
              onConfirm={() => cancel(record)}
              okButtonProps={{
                style: {
                  backgroundColor: "dodgerblue",
                },
              }}
            >
              <Button
                size="small"
                danger
                // onClick={() => handleRowClick(record)}
                icon={<Close color="red" />}
              />
            </Popconfirm>
          </Space>
        ) : (
          <Space size="middle">
            <Button
              size="small"
              type="primary"
              ghost
              disabled={editingKey !== ""}
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

  const confirm = async (e, record) => {
    console.log("record to delete", record);

    const payload = {
      functionalFeeId: record.id,
    };

    const res = await deleteFunctionalFee({
      variables: payload,
    });

    dispatch(
      showMessage({
        message: res.data.deleteFuntionalFee.message,
        variant: "success",
      })
    );
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "amount" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
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
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          loading={
            loading ||
            codesloading ||
            savingTuitionFee ||
            loadingFunctionalFees ||
            deletingFunctionalFee
          }
          dataSource={functionalFeesItems}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          scroll={{
            y: "calc(100vh - 350px)",
          }}
        />
      </ConfigProvider>
      <ConfigProvider
        theme={{
          token: {
            backgroundColor: !loading ? "blue" : "grey",
            colorText: "white",

            // fontSizeIcon: 0,
          },
        }}
      >
        <FloatButton
          style={{
            bottom: 100,
            backgroundColor:
              editingKey == "" && !loading && selectedTreeItem
                ? "blue"
                : "lightgray",
            color: "#fff",
            width: 45,
            height: 45,
            borderRadius: 22.5,
            cursor:
              (editingKey != "" && loading) || !selectedTreeItem
                ? "not-allowed"
                : "pointer",
          }}
          type="submit"
          onClick={
            editingKey == "" && !loading && selectedTreeItem
              ? handleAddItem
              : null
          }
          tooltip={<div>Add Fee Item</div>}
          icon={
            <Add
              style={{
                // fontSize: 20,
                alignSelf: "center",
                fontWeight: "bold",
              }}
              fontSize="90px"
            />
          }
        />
      </ConfigProvider>
    </Form>
  );
};
export default EditableTable;
