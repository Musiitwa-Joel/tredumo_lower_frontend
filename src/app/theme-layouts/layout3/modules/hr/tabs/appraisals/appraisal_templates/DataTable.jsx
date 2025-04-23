import React, { useEffect } from "react";

import {
  Button,
  ConfigProvider,
  Popconfirm,
  Space,
  Table,
  Input,
  Tooltip,
} from "antd";
import {
  ChangeCircle,
  ChangeCircleSharp,
  ChangeHistory,
  Delete,
  Download,
  Edit,
  ManageAccounts,
  Preview,
  Refresh,
} from "@mui/icons-material";
import { useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { Box } from "@mui/material";
import {
  setSelectedTemplate,
  setSelectedTemplatePreview,
  setTemplatePreviewVisible,
} from "../../../store/hrSlice";
import { LOAD_EVALUATION_TEMPLATES } from "../../../gql/queries";
import { DELETE_APPTRAISAL_TEMPLATE } from "../../../gql/mutations";

const { Search } = Input;

function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function searchFeesItemsByTerm(data, term) {
  const lowerTerm = term.toLowerCase();

  return data.filter((item) => {
    // Check top-level properties
    const topLevelMatch = Object.keys(item).some((key) => {
      if (typeof item[key] === "string" || typeof item[key] === "number") {
        return String(item[key]).toLowerCase().includes(lowerTerm);
      }
      return false;
    });

    // Check nested category properties
    const categoryMatch =
      item.category &&
      Object.keys(item.category).some((key) => {
        if (
          typeof item.category[key] === "string" ||
          typeof item.category[key] === "number"
        ) {
          return String(item.category[key]).toLowerCase().includes(lowerTerm);
        }
        return false;
      });

    return topLevelMatch || categoryMatch;
  });
}

const DataTable = React.memo(() => {
  const dispatch = useDispatch();

  const {
    loading,
    error,
    data: loadRes,
    refetch,
  } = useQuery(LOAD_EVALUATION_TEMPLATES, {
    notifyOnNetworkStatusChange: true,
  });

  const [
    deleteAppraisalTemplate,
    { loading: deletingTemplate, error: deleteErr, data: deleteRes },
  ] = useMutation(DELETE_APPTRAISAL_TEMPLATE, {
    refetchQueries: ["loadEvaluationTemplates"],
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

    if (deleteErr) {
      dispatch(
        showMessage({
          message: deleteErr.message,
          variant: "error",
        })
      );
    }
  }, [error, deleteErr]);

  const onSearch = (value) => {
    console.log("search:", value);
    // if (value == "") dispatch(setFilteredFeesItems(feesItems));

    // const filtered = searchFeesItemsByTerm(feesItems, value);

    // console.log(filtered);

    // dispatch(setFilteredFeesItems(filtered));
  };

  const columns2 = [
    {
      title: "#",
      dataIndex: "index",
      key: "date",
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: "Name",
      dataIndex: "template_name",
      // render: (text, record, index) =>
      //   `${record.biodata.salutation} ${record.biodata.surname} ${record.biodata.other_names}`,
      width: "22%",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      // render: (text, record, index) => record.role.role_name,
      width: "55%",
      key: "name",
      ellipsis: true,
    },

    {
      title: "Action",
      key: "operation",
      render: (text, record, index) => (
        <Space size="middle">
          <Button
            size="small"
            type="primary"
            ghost
            onClick={() => handleRowClick(record)}
            icon={<Edit />}
          />

          <Popconfirm
            title="Delete Template"
            description=<>Are you sure to delete this template?</>
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
          <Tooltip title={"View"} placement="bottom">
            <Button
              size="small"
              type="primary"
              ghost
              onClick={() => {
                dispatch(setSelectedTemplatePreview(record));
                dispatch(setTemplatePreviewVisible(true));
              }}
              icon={<Preview />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const confirm = (e, row) => {
    // console.log("the row", row);
    handleRowDelete(row);
  };

  const handleRowDelete = async (row) => {
    const payload = {
      templateId: row.template_id,
    };

    const res = await deleteAppraisalTemplate({
      variables: payload,
    });

    dispatch(
      showMessage({
        message: res.data.deleteEvaluationTemplate.message,
        variant: "success",
      })
    );
  };

  const handleRowClick = (row) => {
    // console.log(row);
    dispatch(setSelectedTemplate(row));
  };

  const data = [
    {
      key: "1",
      name: "SELF FEEDBACK",
      description:
        "This is a sample employee self-feedback. Based on your organization you can update this template or create a new template.",
    },
    {
      key: "2",
      name: "SELF FEEDBACK",
      description:
        "This is a sample employee self-feedback. Based on your organization you can update this template or create a new template.",
    },
  ];

  return (
    <>
      <div
        style={{
          padding: 10,
        }}
      >
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
            marginBottom: 0,
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
              Appraisal Templates
            </span>
          </div>

          <div>
            <Space>
              <Button icon={<Refresh />} onClick={() => refetch()}>
                Reload
              </Button>
              <Search
                placeholder="Search Template..."
                // onSearch={onSearch}
                onChange={(e) => onSearch(e.target.value)}
                size="middle"
                width={500}
                style={{
                  width: 250,
                }}
              />
            </Space>
          </div>
        </Box>

        <ConfigProvider
          theme={{
            components: {
              Table: {
                // headerBg: "rgba(0, 0, 0, 0.04)",
                borderColor: "lightgray",
                borderRadius: 0,
                headerBorderRadius: 0,
                // cellFontSize: 10,
                // fontSize: 13,
                // lineHeight: 0.8,
              },
            },
          }}
        >
          <Table
            bordered
            size="small"
            columns={columns2}
            dataSource={loadRes?.evaluation_templates || []}
            loading={loading || deletingTemplate}
            pagination={false}
            scroll={{
              y: "calc(100vh - 190px)",
            }}
          />
        </ConfigProvider>
      </div>
    </>
  );
});
export default DataTable;
