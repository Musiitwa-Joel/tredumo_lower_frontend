import { Delete, Edit, ListAlt } from "@mui/icons-material";
import {
  ConfigProvider,
  Table,
  Space,
  Button,
  Popconfirm,
  Typography,
  Tooltip,
} from "antd";
import { List, ListCheck } from "lucide-react";
import { Add } from "@mui/icons-material";
import { useMutation, useQuery } from "@apollo/client";
import { GET_RUNNING_ADMISSIONS } from "../../../graphql/queries";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectRunningAdmissions,
  setManageProgramsModalVisible,
  setRunningAdmissions,
  setSelectedRunningAdmission,
  setStartAdmissionsModalVisible,
} from "../../../admissionsSlice";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
import checkSchemeStatus from "app/theme-layouts/layout3/utils/checkSchemeStatus";
import { SyncOutlined } from "@ant-design/icons";
import StartAdmissionsModal from "./StartAdmissionsModal";
import { DELETE_RUNNING_ADMISSION } from "../../../graphql/mutations";
import ManageProgramsModal from "./ManageProgramsModal";

function RunningAdmissions() {
  const dispatch = useDispatch();
  const running_admissions = useSelector(selectRunningAdmissions);

  const [
    deleteRunningAdmission,
    { error: deleteErr, loading: deletingAdmission, data: deleteResponse },
  ] = useMutation(DELETE_RUNNING_ADMISSION, {
    refetchQueries: ["getRunningAdmissions"],
  });

  const {
    error,
    loading: loadingRunningAdmissions,
    data,
  } = useQuery(GET_RUNNING_ADMISSIONS, {
    notifyOnNetworkStatusChange: true,
  });

  const columns = [
    {
      title: "Intake",
      dataIndex: "intake",
      // width: "20%",
      key: "intake",
      render: (text, record, index) => record.intake.intake_title,
    },
    {
      title: "Scheme",
      dataIndex: "scheme",
      // width: "20%",
      render: (text, record, index) => record.scheme.scheme_title,
      key: "Scheme",
    },
    {
      title: "Academic Yr",
      dataIndex: "acc_yr",
      key: "acc_yr",
      // width: "10%",
      render: (text, record, index) => record.acc_yr.acc_yr_title,
      ellipsis: true,
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      // width: "20%",
      render: (text, record, index) => convertTimestampToDate(parseInt(text)),
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      // width: "20%",
      render: (text, record, index) => convertTimestampToDate(parseInt(text)),
      key: "end_date",
    },
    {
      title: "Number of Forms",
      dataIndex: "max_no_of_forms",
      // width: "20%",
      // render: (text, record, index) => convertTimestampToDate(parseInt(text)),
      key: "max_no_of_forms",
    },
    {
      title: "Status",
      dataIndex: "status",
      // width: "20%",
      render: (text, record, index) => {
        const status = checkSchemeStatus(
          parseInt(record.start_date),
          parseInt(record.end_date)
        );

        if (status === "running") {
          return (
            <span
              style={{
                color: "green",
                borderColor: "green",
                borderWidth: 1,
                padding: 2,
                borderRadius: 5,
                paddingRight: 5,
                paddingLeft: 5,
                borderStyle: "solid",
              }}
            >
              <SyncOutlined spin /> {"Running"}
            </span>
          );
        } else if (status === "not_started") {
          return (
            <span
              style={{
                color: "purple",
                borderColor: "purple",
                borderWidth: 1,
                padding: 2,
                borderRadius: 5,
                paddingRight: 5,
                paddingLeft: 5,
                borderStyle: "solid",
              }}
            >
              {"Not Started"}
            </span>
          );
        } else {
          return (
            <span
              style={{
                color: "red",
                borderColor: "red",
                borderWidth: 1,
                padding: 2,
                borderRadius: 5,
                paddingRight: 5,
                paddingLeft: 5,
                borderStyle: "solid",
              }}
            >
              {"Stopped"}
            </span>
          );
        }
      },
      key: "status",
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
            onClick={() => {
              dispatch(setSelectedRunningAdmission(record));
              dispatch(setStartAdmissionsModalVisible(true));
            }}
            icon={<Edit size={18} />}
          />

          <Tooltip title="Manage Programmes">
            <Button
              size="small"
              type="primary"
              ghost
              icon={<ListCheck size={15} />}
              onClick={() => {
                dispatch(setSelectedRunningAdmission(record));
                dispatch(setManageProgramsModalVisible(true));
              }}
            />
          </Tooltip>

          <Popconfirm
            title="Delete Admission"
            description="Are you sure to delete this admission?"
            onConfirm={(e) => confirmDelete(e, record)}
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
              icon={<Delete color="red" size={18} />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const confirmDelete = async (e, record) => {
    // console.log("delete", record);
    const res = await deleteRunningAdmission({
      variables: {
        runningAdmissionId: record.id,
      },
    });

    dispatch(
      showMessage({
        message: res.data.deleteRunningAdmission.message,
        variant: "info",
      })
    );
  };

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

  if (data) {
    dispatch(setRunningAdmissions(data.running_admissions));
  }

  return (
    <div
      style={{
        height: "calc(100vh - 185px)",
      }}
    >
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
          title={() => (
            <>
              <Button
                type="primary"
                icon={<Add />}
                onClick={() => {
                  dispatch(setSelectedRunningAdmission(null));
                  dispatch(setStartAdmissionsModalVisible(true));
                }}
              >
                Create New Admission
              </Button>
            </>
          )}
          bordered
          size="small"
          columns={columns}
          dataSource={running_admissions}
          loading={loadingRunningAdmissions}
          //   pagination={}
          //   footer={(data) => <Typography.Text>100 Records</Typography.Text>}
          scroll={{
            y: "calc(100vh - 250px)",
          }}
        />
      </ConfigProvider>

      <StartAdmissionsModal />
      <ManageProgramsModal />
    </div>
  );
}

export default RunningAdmissions;
