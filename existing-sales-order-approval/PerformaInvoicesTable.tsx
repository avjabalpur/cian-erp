import { Link } from "react-router-dom";
import usePageTitle from "../../Components/usePageTitle";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useFilterOptions from "../../Components/useFilterOptions";
import SearchComponent from "../../Components/TableSearch";
import MyPortal from "../../Components/MyPortal";
import InputWithLabel from "../../Components/InputWithLabel";
import { Button, DatePicker, Select, Table, Tag } from "antd";
import { PaginationProps } from "./OptionMasters";
import { I_SOApprovalPermissions } from "../../RoleInterfaces";

export interface IPerformaInvoicesTableProps {
  permissions: I_SOApprovalPermissions;
  userId: number;
}

export default function PerformaInvoicesTable({ permissions = {}, userId }: IPerformaInvoicesTableProps) {
  usePageTitle("Performa Invoices | Cian", ["Performa Invoices", "All"]);

  const columns = [
    { title: "PI ID", dataIndex: "performa_invoice_id", key: "performa_invoice_id", addSearch: true },
    { title: "PI Number", dataIndex: "performa_invoice_number", key: "performa_invoice_number", addSearch: true },
    { title: "Date", dataIndex: "performa_invoice_date", key: "performa_invoice_date", addSearch: true },
    { title: "Consignee", dataIndex: "consignee_name", key: "consignee_name", addSearch: true, addAutoFilter: true, filterOptionsGeneratorKey: "consignee_name" },
    { title: "Exporter", dataIndex: "exporter_name", key: "exporter_name", addSearch: true, addAutoFilter: true, filterOptionsGeneratorKey: "exporter_name" },
    { title: "Created By", dataIndex: "created_by_username", key: "created_by_username", addSearch: true, addAutoFilter: true, filterOptionsGeneratorKey: "created_by_username" },
    { title: "Total Amount", dataIndex: "total_amount", key: "total_amount" },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Link to={`/sales-order-approval/performa-invoices/${record.performa_invoice_id}`}>
            <Button type="primary" size="small">View</Button>
          </Link>
          <Link to={`/sales-order-approval/performa-invoices/create?copy_from_id=${record.performa_invoice_id}`}>
            <Button type="dashed" size="small" title="Create New from this">Create New</Button>
          </Link>
        </div>
      ),
    },
  ];

  // Default filters: created_by, consignee_name, exporter_name, date_range.
  interface I_BackendFilters {
    created_by?: number[];
    consignee_name?: string;
    exporter_name?: string;
    date_range?: [Dayjs, Dayjs];
  }
  interface ITableProps {
    tableSize?: "small" | "middle" | "large";
    columns: any[];
    defaultFilters?: I_BackendFilters;
    showFilters?: boolean;
  }
  const DefaultTable = ({ tableSize = "small", columns, defaultFilters, showFilters = true }: ITableProps) => {
    const [selected, setSelected] = useState<I_BackendFilters>({
      created_by: defaultFilters?.created_by === undefined ? [] : defaultFilters?.created_by,
      consignee_name: defaultFilters?.consignee_name === undefined ? "" : defaultFilters?.consignee_name,
      exporter_name: defaultFilters?.exporter_name === undefined ? "ANY" : defaultFilters?.exporter_name,
      date_range: defaultFilters?.date_range === undefined ? [dayjs().subtract(1, "week"), dayjs()] : defaultFilters?.date_range,
    });
    const [anythingChanged, setAnythingChanged] = useState(false);
    const setSelectedKey = <K extends keyof typeof selected>(key: K, value: (typeof selected)[K]) => {
      setSelected((prev) => ({ ...prev, [key]: value }));
      setAnythingChanged(true);
    };

    const [selectOptions, setSelectOptions] = useState({
      created_by: [] as any[],
      consignee_name: [] as any[],
      exporter_name: [
        { value: "ANY", label: "ANY" }
        // Additional options can be set after API call
      ],
      created_by_loading: false,
      consignee_name_loading: false,
      exporter_name_loading: false,
    });
    const setSelectOptionsKey = <K extends keyof typeof selectOptions>(key: K, value: (typeof selectOptions)[K]) => {
      setSelectOptions((prev) => ({ ...prev, [key]: value }));
    };

    const getUserOptions = async () => {
      setSelectOptionsKey("created_by_loading", true);
      await axios.get("/all-users")
        .then((res) => {
          setSelectOptionsKey("created_by", res.data.data);
        })
        .catch((err) => {
          err.handleGlobally?.("User Options");
          throw err;
        });
      setSelectOptionsKey("created_by_loading", false);
    };

    const getConsigneeOptions = async () => {
      setSelectOptionsKey("consignee_name_loading", true);
      await axios.get("/get-all-customer-options")
        .then((res) => {
          setSelectOptionsKey("consignee_name", res.data.data);
        })
        .catch((err) => {
          err.handleGlobally?.("Consignee Options");
          throw err;
        });
      setSelectOptionsKey("consignee_name_loading", false);
    };

    useEffect(() => { if (showFilters) { getUserOptions(); getConsigneeOptions(); } }, []);

    const { data: masterState, isLoading, refetch } = useQuery({
      queryKey: ["performa-invoices-list"],
      queryFn: async () => {
        const response = await axios.post("/get-all-performa-invoices", {
          created_by: selected.created_by,
          consignee_name: selected.consignee_name,
          exporter_name: selected.exporter_name,
          from_time: selected.date_range?.[0].startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          to_time: selected.date_range?.[1].endOf("day").format("YYYY-MM-DD HH:mm:ss")
        })
        .then((res) => res)
        .catch((err) => {
          err.handleGlobally?.("Performa Invoices List");
          throw err;
        });
        setAnythingChanged(false);
        return response.data.data;
      }
    });

    const filterableColumns = useMemo(() => {
      const f = columns.filter((column) => column.addAutoFilter);
      return f.map((column) => column.filterOptionsGeneratorKey);
    }, [columns]);
    const [filterOptions] = useFilterOptions(masterState, filterableColumns);
    const finalColumns = useMemo(() => {
      return columns.map((column) => {
        if (column.addAutoFilter) {
          return {
            ...column,
            filters: filterOptions[column.filterOptionsGeneratorKey],
            onFilter: (value: string, record: any) => record[column.dataIndex] === value,
          };
        }
        return column;
      });
    }, [columns, filterOptions]);
    const searchColumns = useMemo(() => {
      const f = columns.filter((column) => column.addSearch);
      return f.map((column) => ({ keyName: column.dataIndex, label: column.title }));
    }, [columns]);
    const [data, setData] = useState(masterState);
    return (
      <div className="my-form-flex column">
        <MyPortal id="navbar-portal">
          <div className="my-form-flex row" style={{ alignItems: "center", gap: "14px" }}>
            <SearchComponent masterState={masterState} setState={setData} searchOptions={searchColumns} isLabelInline={true} labelStyle={{ width: "60px", fontSize: "14px" }} />
            <Button type="primary">
              <Link to="/sales-order-approval/performa-invoices/create">Create New Performa Invoice</Link>
            </Button>
          </div>
        </MyPortal>
        {showFilters && (
          <div className="my-form-flex row" style={{ alignItems: "flex-end" }}>
            <div className="my-form-flex column" style={{ width: "100%" }}>
              <div className="my-form-flex row" style={{ flexWrap: "wrap" }}>
                <InputWithLabel label="Date Range">
                  <DatePicker.RangePicker
                    value={selected.date_range}
                    onChange={(value) => setSelectedKey("date_range", value as [Dayjs, Dayjs])}
                    allowClear={false}
                    style={{ width: "300px" }}
                    format={"D MMM, YYYY"}
                  />
                </InputWithLabel>
                <InputWithLabel label="Created By">
                  <Select
                    mode="multiple"
                    loading={selectOptions.created_by_loading}
                    value={selected.created_by}
                    onChange={(value: number[]) => setSelectedKey("created_by", value)}
                    style={{ width: "300px" }}
                    placeholder="Select Users"
                    allowClear
                    options={selectOptions.created_by}
                    showSearch
                    optionFilterProp="label"
                  />
                </InputWithLabel>
                <InputWithLabel label="Consignee">
                  <Select
                    loading={selectOptions.consignee_name_loading}
                    value={selected.consignee_name}
                    onChange={(value: string) => setSelectedKey("consignee_name", value)}
                    style={{ width: "300px" }}
                    placeholder="Select Consignee"
                    allowClear
                    options={selectOptions.consignee_name}
                    showSearch
                  />
                </InputWithLabel>
                <InputWithLabel label="Exporter">
                  <Select
                    value={selected.exporter_name}
                    onChange={(value: string) => setSelectedKey("exporter_name", value)}
                    style={{ width: "120px" }}
                    placeholder="Select Exporter"
                    options={selectOptions.exporter_name}
                  />
                </InputWithLabel>
              </div>
            </div>
            <Button type="primary" onClick={() => refetch()} disabled={!anythingChanged}>Search</Button>
          </div>
        )}
        <Table columns={finalColumns} dataSource={data} loading={isLoading} size={tableSize} pagination={PaginationProps} />
      </div>
    );
  };

  return <DefaultTable columns={columns} defaultFilters={{ created_by: permissions?.bd ? [userId] : undefined }} />;
}
