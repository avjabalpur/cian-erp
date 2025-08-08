import axios from "axios";
import { useMemo, useState } from "react";
import InputWithLabel from "../../Components/InputWithLabel";
import { Button, Input, Modal, Popconfirm, Select, Table, Tag } from "antd";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { I_SalesOrderApproval, PermissionKey } from "./EditSalesOrderApproval";
import { I_AuthUser } from "../../Reducers/authReducer";
import { I_SOApprovalPermissions } from "../../RoleInterfaces";

export interface I_ApprovalCardProps {
  id?: number;
  title: string;
  approval_type: "costing_approval" | "qa_approval" | "final_authorization" | "designer_approval" | "final_qa_approval" | "pm_approval";
  approved?: number | boolean;
  approval_key?: keyof I_SalesOrderApproval;
  keyName: keyof I_SalesOrderApproval;
  permissions?: I_SOApprovalPermissions;
  requiredRoles?: PermissionKey[];
  details?: I_SalesOrderApproval;
  modifiedDetails?: I_SalesOrderApproval;
  getDetails?: any;
  visible?: boolean;
  user?: I_AuthUser;
  saveDetails?: (details: I_SalesOrderApproval) => void;
}
export const ApprovalCard = ({
  id,
  title,
  approved,
  approval_key,
  permissions,
  requiredRoles,
  details,
  modifiedDetails,
  getDetails,
  visible,
  approval_type,
  user,
  saveDetails,
}: I_ApprovalCardProps) => {
  const queryClient = useQueryClient();
  const previousCommentsProps = useQuery({
    queryKey: ["CARDS-so-approval-comments", id],
    queryFn: async () => {
      const response = await axios
        .get("/get-sales-order-approval-comments-by-id", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          err.handleGlobally?.("Approval Card comments");
          throw err;
        });

      const items = response?.data?.data;
      return items;
    },
  });
  const previousComments = useMemo(() => {
    return previousCommentsProps.data?.filter((item: any) => item.type === approval_type);
  }, [previousCommentsProps.data]);

  // TODO:
  // 1) On Submit, check if all the required fields are filled
  // Send the data to the backend and
  // 2) Save in comments table + set approved status to true
  // 3) Call Get Details
  // To show old comments
  // We can use use query to get the comments, so all cards can use the same query
  // Then show if there is any latest comment for the card
  const [loading, setLoading] = useState(false);
  const [approvalDetails, setApprovalDetails] = useState({
    status: "APPROVE",
    comments: "",
    modalVisible: false,
  });
  const setApprovalDetailsKey = <K extends keyof typeof approvalDetails>(key: K, value: (typeof approvalDetails)[K]) => {
    setApprovalDetails((prev) => ({ ...prev, [key]: value }));
  };

  const statusOptions = [
    { value: "APPROVE", label: "APPROVE", color: "green" },
    { value: "REQUEST CHANGES", label: "REQUEST CHANGES", color: "purple" },
  ];

  const hasPermission = requiredRoles?.some((role) => permissions?.[role]);

  const saveApprovalComment = async () => {
    setLoading(true);
    await axios
      .post("/save-sales-order-approval-comments", {
        id: id,
        type: approval_type,
        status: approvalDetails.status,
        comments: approvalDetails.comments,
      })
      .then(async () => {
        getDetails && (await getDetails());
        queryClient.invalidateQueries({ queryKey: ["CARDS-so-approval-comments", id] });
        queryClient.invalidateQueries({ queryKey: ["SAVEDIFF-so-approval-comments", id] });
        queryClient.invalidateQueries({ queryKey: ["CHAT-so-approval-comments", id] });
        setApprovalDetailsKey("modalVisible", false);
        toast.success("Details saved successfully");
      })
      .catch((error) => {
        error.handleGlobally("Save Approval Comments");
      });
    setLoading(false);
  };

  // console.log("approvalDetails", approval_type, previousComments);
  // const columns = [
  //   {
  //     title: "Status",
  //     dataIndex: "status",
  //     key: "status",
  //     render: (status: string) => {
  //       return (
  //         <Tag color={status === "APPROVE" ? "green" : "purple"} title={dayjs().format("Do MMM YYYY, h:mm:ss a")}>
  //           {status}
  //         </Tag>
  //       );
  //     },
  //   },
  //   {
  //     title: "Comments",
  //     dataIndex: "comments",
  //     key: "comments",
  //   },
  // ];

  const showRequestReApproval = useMemo(() => {
    if (permissions?.bd && details?.created_by === user?.userId && approved) {
      return true;
    }
    if(permissions?.design_admin && approval_type === "final_authorization" && approved && details?.designer_approved === 0){
      return true;
    }
    return false;
  }, [permissions, details, user, approved]);

  return (
    <div
      style={{
        background: approved ? "var(--success-background)" : "var(--error-background)",
        borderRadius: "10px",
        padding: "4px 10px",
        minWidth: "250px",
      }}
    >
      <div
        style={{
          color: "white",
          fontWeight: "bold",
          margin: "5px 0px",
          fontSize: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {title}
        {hasPermission && visible && !approved && (
          <Button
            onClick={() => {
              setApprovalDetailsKey("modalVisible", true);
            }}
            style={{ color: "white", background: "var(--success-background)", fontWeight: "bold", marginLeft: "10px" }}
          >
            Approve
          </Button>
        )}
        {
          showRequestReApproval ? (
            <Popconfirm
              title={`Are you sure you want to change request for re-approval for '${title}' ?`}
              onConfirm={() => {
                saveDetails?.({ ...modifiedDetails, [approval_key || ""]: 0 });
              }}
              okText="Yes"
              cancelText="No"
            >

                <Button
                  type="primary"
                  danger
                  style={{ fontWeight: "bold", marginLeft: "20px" }}
                  >
                  Request Re Approval
                </Button>
              </Popconfirm>
          ) : null
        }
      </div>
      {previousComments?.length ? (
        <div style={{ color: "white", fontSize: "14px" }}>
          <div style={{ fontWeight: "bold" }}>
            <u>Previous Comments</u>
          </div>
          {previousComments?.map((item: any) => {
            return (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                <div>{item?.comments}</div>
                <div style={{ display: "flex", gap: "10px", flexDirection: "column", alignItems: "flex-end" }}>
                  <Tag
                    color={item?.status === "APPROVE" ? "green" : "purple"}
                    title={dayjs(item?.created_at).format("Do MMM YYYY, h:mm:ss a")}
                  >
                    {item?.status}
                  </Tag>
                </div>
              </div>
            );
          })}
          {/* <Table
            columns={columns}
            dataSource={previousComments}
            pagination={false}
            size="small"
            rowKey={(record) => record.id}
            showHeader={false}
            // style={{ color: "black" }}
            // Make the background transparent
            // tableLayout="fixed"
            style={{ minWidth: "250px", background: "transparent"}}
            rowClassName={() => approved ? "table-row-success" : "table-row-error"}
          /> */}
        </div>
      ) : null}
      <Modal
        open={approvalDetails.modalVisible}
        onCancel={() => {
          setApprovalDetailsKey("modalVisible", false);
        }}
        onOk={() => {
          saveApprovalComment();
        }}
        confirmLoading={loading}
      >
        <InputWithLabel label="Status" divStyle={{ width: "100%" }}>
          <Select
            value={approvalDetails.status}
            onChange={(value) => {
              setApprovalDetailsKey("status", value);
            }}
            style={{ width: "100%" }}
          >
            {statusOptions.map((option) => {
              return (
                <Select.Option value={option.value} key={option.value} style={{ color: option.color }}>
                  <Tag color={option.color}>{option.value}</Tag>
                </Select.Option>
              );
            })}
          </Select>
        </InputWithLabel>
        <InputWithLabel label="Comments" divStyle={{ width: "100%" }}>
          <Input.TextArea
            value={approvalDetails.comments}
            onChange={(e) => {
              setApprovalDetailsKey("comments", e.target.value);
            }}
            autoSize={{ minRows: 2, maxRows: 5 }}
            style={{ width: "100%" }}
          />
        </InputWithLabel>
      </Modal>
    </div>
  );
};
