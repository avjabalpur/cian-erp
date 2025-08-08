import { useMemo } from "react";
import { Timeline, Table, Spin, Tag, Popover, Button } from "antd";
import axios from "axios";
import { ColumnsType } from "antd/es/table";
import { BsFillPersonLinesFill } from "react-icons/bs";
import dayjs from "dayjs";
import { I_ColumnInfo } from "./EditSalesOrderApproval";
import { useQuery } from "@tanstack/react-query";

interface SalesOrderSaveDiffProps {
  id: number;
  layoutDetailsInfo?: { [key: string]: I_ColumnInfo };
}

interface SaveHistory {
  created_by: number;
  created_by_username: string;
  created_time: string;
  diff: {
    [key: string]: {
      p: string;
      n: string;
    };
  };
}

// "costing_approval" | "qa_approval" | "final_authorization" | "designer_approval" | "final_qa_approval" | "pm_approval"
export const approvalTypeToRoleName: any = {
  costing_approval: "Costing",
  qa_approval: "QA",
  final_authorization: "Final Authorization",
  designer_approval: "Designer",
  final_qa_approval: "Final QA",
  pm_approval: "Packing Material",
};

const SalesOrderSaveDiff: React.FC<SalesOrderSaveDiffProps> = ({ id, layoutDetailsInfo = {} }) => {
  const { data: approvalComments, isLoading: approvalCommentsLoading } = useQuery({
    queryKey: ["SAVEDIFF-so-approval-comments", id],
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
          err.handleGlobally?.("Approval Comments");
          throw err;
        });
      return response?.data?.data.map((d: any) => ({ ...d, row_type: "comment" }));
    },
  });

  const { data: saveComments, isLoading: saveCommentsLoading } = useQuery({
    queryKey: ["SAVEDIFF-so-approval-save-history", id],
    queryFn: async () => {
      const response = await axios
        .get(`/get-sales-order-approval-save-transactions-by-id`, {
          params: { id },
        })
        .then((res) => {
          return res;
        })
        .catch((error) => {
          error.handleGlobally("Save History");
          throw error;
        });
      return response.data.data.map((d: any) => ({ ...d, row_type: "saveHistory", diff: JSON.parse(d.diff?.replace(/\n/g, '\\n')) }));
    },
  });

  const details = useMemo(() => {
    const data = [...(approvalComments || []), ...(saveComments || [])];
    // sort using created_time by dayjs
    return data.sort((a: any, b: any) => dayjs(b.created_time).unix() - dayjs(a.created_time).unix());
  }, [approvalComments, saveComments]);
  const loading = approvalCommentsLoading || saveCommentsLoading;

  return (
    <Spin spinning={loading}>
      <div style={{ width: "750px" }}>
        <Timeline
          mode="left"
          style={{ padding: "10px 0" }}
          items={details?.map((history, index) => ({
            label: (
              <div style={{ display: "inline-flex", gap: "10px", alignItems: "center" }}>
                <Tag
                  color="blue"
                  style={{ marginRight: "0", gap: "4px", display: "inline-flex", alignItems: "center" }}
                  icon={<BsFillPersonLinesFill />}
                >
                  {history.created_by_username}
                </Tag>
                {history.row_type === "comment" ? (
                  <Tag color={history?.status === "APPROVE" ? "green" : "purple"}>{history?.status}</Tag>
                ) : (
                  "Saved At"
                )}
                <Tag color="blue">{dayjs(history.created_time).format("Do MMM YY, HH:mm a")}</Tag>
              </div>
            ),
            position: "left",
            key: index,
            children:
              history.row_type === "comment" ? (
                <div style={{ padding: "10px 0" }}>
                  <Tag color="geekblue-inverse">{approvalTypeToRoleName?.[history.type] || history.type}</Tag>
                  {history.comments}
                </div>
              ) : (
                <Popover
                  content={<CreateDiffTable diff={history.diff} layoutDetailsInfo={layoutDetailsInfo} />}
                  title={
                    <div style={{ display: "inline-flex", gap: "10px", alignItems: "center" }}>
                      <Tag color="blue" style={{ marginRight: "0" }} icon={<BsFillPersonLinesFill />}>
                        {history.created_by_username}
                      </Tag>
                      <>Saved at</>
                      <Tag color="blue">{dayjs(history.created_time).format("Do MMM YY, HH:mm a")}</Tag>
                    </div>
                  }
                  trigger={["click"]}
                >
                  <Button type="primary">View Changes</Button>
                </Popover>
              ),
          }))}
        />
      </div>
    </Spin>
  );
};

export default SalesOrderSaveDiff;

export const CreateDiffTable = ({
  diff,
  layoutDetailsInfo,
}: {
  diff: SaveHistory["diff"];
  layoutDetailsInfo: { [key: string]: I_ColumnInfo };
}) => {
  const columns: ColumnsType<any> = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      width: 150,
    },
    {
      title: "Previous Value",
      dataIndex: "previousValue",
      key: "previousValue",
      onCell: () => {
        return {
          style: { color: "red", textDecoration: "line-through" },
        };
      },
      width: 200,
    },
    {
      title: "New Value",
      dataIndex: "newValue",
      key: "newValue",
      width: 200,
      onCell: () => {
        return {
          style: { color: "green", fontWeight: "bold" },
        };
      },
    },
  ];

  const data = useMemo(() => {
    const diffEntries = Object.entries(diff);

    return diffEntries.map(([key, value]) => ({
      key,
      field: layoutDetailsInfo?.[key]?.title || key,
      previousValue: value.p,
      newValue: value.n,
    }));
  }, [diff]);

  return (
    <Table
      bordered
      size="small"
      columns={columns}
      dataSource={data}
      pagination={false}
      style={{ width: "600px" }}
      tableLayout="auto"
      scroll={{ y: "400px" }}
    />
  );
};
