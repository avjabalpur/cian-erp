import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import axios from "axios";
import CreateQuotation from "./CreateQuotation";

interface SoApprovalRelatedQuotationsProps {
  id: number;
}
// u.username as created_by_username,
// soaq.created_time,
// soaq.quotation_id,
// soaq.quotation_number,
// soaq.quotation_date,
// soaq.customer_name,
// soaq.total_amount,
// soaq.advance_amount

export interface SoApprovalRelatedQuotationsData {
  created_by_username: string;
  created_time: string;
  quotation_id: number;
  quotation_number: string;
  quotation_date: string;
  customer_name: string;
  total_amount: number;
  advance_amount: number;
}

const SoApprovalRelatedQuotations: React.FC<SoApprovalRelatedQuotationsProps> = ({ id }) => {
  const { data, isLoading } = useQuery<SoApprovalRelatedQuotationsData[]>({
    queryKey: ["so-approval-related-quotations", id],
    queryFn: async () => {
      const response = await axios
        .get("/get-related-quotations-by-so-approval-id", {
          params: {
            sales_order_approval_id: id,
          },
        })
        .then((res: any) => {
          return res;
        })
        .catch((err) => {
          err.handleGlobally?.("Related Quotations");
          throw err;
        });
      return response.data.data;
    },
  });

  // if (loading) return <Loading />;
  // if (error) return <p>Error :(</p>;
  const columns = [
    { title: "Quotation ID", dataIndex: "quotation_id", key: "quotation_id" },
    { title: "Quotation Number", dataIndex: "quotation_number", key: "quotation_number" },
    { title: "Quotation Date", dataIndex: "quotation_date", key: "quotation_date" },
    { title: "Customer Name", dataIndex: "customer_name", key: "customer_name" },
    { title: "Created By", dataIndex: "created_by_username", key: "created_by_username" },
    { title: "Total Amount", dataIndex: "total_amount", key: "total_amount" },
    { title: "Advance Amount", dataIndex: "advance_amount", key: "advance_amount" },
  ];

  return (
    <Table
      columns={columns}
      loading={isLoading}
      dataSource={data}
      rowKey="quotation_id"
      size="small"
      expandable={{
        expandedRowRender: (record) => <CreateQuotation permissions={{ edit: false }} id={record.quotation_id} />,
        // rowExpandable: (record) => record.name !== "Not Expandable",
      }}
      pagination={false}
    />
  );
};

export default SoApprovalRelatedQuotations;
