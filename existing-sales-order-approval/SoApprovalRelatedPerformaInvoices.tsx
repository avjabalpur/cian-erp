import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import axios from "axios";
import CreatePerformaInvoice from "./CreatePerformaInvoice";

interface SoApprovalRelatedPerformaInvoicesProps {
  id: number;
}

export interface SoApprovalRelatedPerformaInvoicesData {
  created_by_username: string;
  created_time: string;
  performa_invoice_id: number;
  performa_invoice_number: string;
  performa_invoice_date: string;
  consignee_name: string;
  total_amount: number;
}

const SoApprovalRelatedPerformaInvoices: React.FC<SoApprovalRelatedPerformaInvoicesProps> = ({ id }) => {
  const { data, isLoading } = useQuery<SoApprovalRelatedPerformaInvoicesData[]>({
    queryKey: ["so-approval-related-performa-invoices", id],
    queryFn: async () => {
      const response = await axios
        .get("/get-related-performa-invoices-by-so-approval-id", {
          params: {
            sales_order_approval_id: id,
          },
        })
        .then((res: any) => res)
        .catch((err) => {
          err.handleGlobally?.("Related Performa Invoices");
          throw err;
        });
      return response.data.data;
    },
  });

  const columns = [
    { title: "Performa Invoice ID", dataIndex: "performa_invoice_id", key: "performa_invoice_id" },
    { title: "Performa Invoice Number", dataIndex: "performa_invoice_number", key: "performa_invoice_number" },
    { title: "Performa Invoice Date", dataIndex: "performa_invoice_date", key: "performa_invoice_date" },
    { title: "Consignee Name", dataIndex: "consignee_name", key: "consignee_name" },
    { title: "Created By", dataIndex: "created_by_username", key: "created_by_username" },
    { title: "Total Amount", dataIndex: "total_amount", key: "total_amount" },
  ];

  return (
    <Table
      columns={columns}
      loading={isLoading}
      dataSource={data}
      rowKey="performa_invoice_id"
      size="small"
      expandable={{
        expandedRowRender: (record) => <CreatePerformaInvoice permissions={{ edit: false }} id={record.performa_invoice_id} />,
      }}

      pagination={false}
    />
  );
};

export default SoApprovalRelatedPerformaInvoices;
