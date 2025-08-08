import { Link } from "react-router-dom";
import usePageTitle from "../../Components/usePageTitle";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import useFilterOptions from "../../Components/useFilterOptions";
import { SoApprovalRelatedQuotationsData } from "./SoApprovalRelatedQuotations";
import SearchComponent from "../../Components/TableSearch";
import MyPortal from "../../Components/MyPortal";
import InputWithLabel from "../../Components/InputWithLabel";
import { Button, DatePicker, Select, Table } from "antd";
import { PaginationProps } from "./OptionMasters";
import { I_SOApprovalPermissions } from "../../RoleInterfaces";

export interface ISalesOrderApprovalTableProps {
  permissions: I_SOApprovalPermissions;
  userId: number;
}

export default function QuotationsTable({ permissions = {}, userId }: ISalesOrderApprovalTableProps) {
  usePageTitle("Quotations | Cian", ["Quotations", "All"]);

  const columns = [
    { title: "QT ID", dataIndex: "quotation_id", key: "quotation_id", addSearch: true },
    { title: "QO Number", dataIndex: "quotation_number", key: "quotation_number", addSearch: true },
    { title: "Date", dataIndex: "quotation_date", key: "quotation_date", addSearch: true },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
      addAutoFilter: true,
      filterOptionsGeneratorKey: "customer_name",
      addSearch: true,
    },
    {
      title: "Company",
      dataIndex: "company_name",
      key: "company_name",
      addAutoFilter: true,
      filterOptionsGeneratorKey: "company_name",
    },
    {
      title: "Created By",
      dataIndex: "created_by_username",
      key: "created_by_username",
      addAutoFilter: true,
      filterOptionsGeneratorKey: "created_by_username",
      addSearch: true,
    },
    { title: "Total Amount", dataIndex: "total_amount", key: "total_amount" },
    { title: "Advance Amount", dataIndex: "advance_amount", key: "advance_amount" },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => (
        <div className="my-form-flex row" style={{ gap: "8px" }}>
          <Link to={`/sales-order-approval/quotations/${record.quotation_id}`}>
            <Button type="primary" size="small">
              View
            </Button>
          </Link>
          <Link to={`/sales-order-approval/quotations/create?copy_from_id=${record.quotation_id}`}>
            <Button type="dashed" size="small" title="Create New Quotation from this">
              Create New
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DefaultTable
        columns={columns}
        defaultFilters={{
          created_by: permissions?.bd ? [userId] : undefined,
        }}
      />
    </div>
  );
}

interface I_BackendFilters {
  created_by?: number[];
  customer_name?: string;
  company_name?: "CIAN" | "DR SMITH" | "ANY";
  date_range?: [Dayjs, Dayjs];
}

interface ITableProps {
  tableSize?: "small" | "middle" | "large" | undefined;
  columns: any[];
  defaultFilters?: I_BackendFilters;
  showFilters?: boolean;
}

const DefaultTable = ({ tableSize = "small", columns, defaultFilters, showFilters = true }: ITableProps) => {
  const [selected, setSelected] = useState<I_BackendFilters>({
    created_by: defaultFilters?.created_by === undefined ? [] : defaultFilters?.created_by,
    customer_name: defaultFilters?.customer_name === undefined ? "" : defaultFilters?.customer_name,
    company_name: defaultFilters?.company_name === undefined ? "ANY" : defaultFilters?.company_name,
    date_range: defaultFilters?.date_range === undefined ? [dayjs().subtract(1, "week"), dayjs()] : defaultFilters?.date_range,
  });
  const [anythingChanged, setAnythingChanged] = useState(false);
  const setSelectedKey = <K extends keyof typeof selected>(key: K, value: (typeof selected)[K]) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
    setAnythingChanged(true);
  };

  const [selectOptions, setSelectOptions] = useState({
    created_by: [],
    customer_name: [],
    company_name: [
      { value: "ANY", label: "ANY" },
      { value: "CIAN", label: "CIAN" },
      { value: "DR SMITH", label: "DR SMITH" },
    ],

    created_by_loading: false,
    customer_name_loading: false,
  });
  const setSelectOptionsKey = <K extends keyof typeof selectOptions>(key: K, value: (typeof selectOptions)[K]) => {
    setSelectOptions((prev) => ({ ...prev, [key]: value }));
  };

  const getUserOptions = async () => {
    setSelectOptionsKey("created_by_loading", true);
    await axios
      .get("/all-users")
      .then((res) => {
        const data = res.data.data;
        setSelectOptionsKey("created_by", data);
      })
      .catch((err) => {
        err.handleGlobally?.("User Options");
        throw err;
      });
    setSelectOptionsKey("created_by_loading", false);
  };

  const getCustomerOptions = async () => {
    setSelectOptionsKey("customer_name_loading", true);
    await axios
      .get("/get-all-customer-options")
      .then((res) => {
        const data = res.data.data;
        setSelectOptionsKey("customer_name", data);
      })
      .catch((err) => {
        err.handleGlobally?.("Customer Options");
        throw err;
      });
    setSelectOptionsKey("customer_name_loading", false);
  };

  useEffect(() => {
    if (showFilters) {
      getUserOptions();
      getCustomerOptions();
    }
  }, []);

  const {
    data: masterState,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["quotations-list"],
    queryFn: async () => {
      // console.log("selected", selected);
      const response = await axios
        .post("/get-all-quotations", {
          created_by: selected.created_by,
          customer_name: selected.customer_name,
          company_name: selected.company_name,
          from_time: selected.date_range?.[0].startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          to_time: selected.date_range?.[1].endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          err.handleGlobally?.("Quotations List");
          throw err;
        });

      const items = response?.data?.data;
      setAnythingChanged(false);
      return items;
    },
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
          onFilter: (value: string, record: SoApprovalRelatedQuotationsData) => {
            return record[column.dataIndex as keyof SoApprovalRelatedQuotationsData] === value;
          },
        };
      } else {
        return column;
      }
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
          <SearchComponent
            masterState={masterState}
            // state={data}
            setState={setData}
            searchOptions={searchColumns}
            // defaultSearchKeys={searchColumns.map((option) => option.keyName)}
            isLabelInline={true}
            labelStyle={{ width: "60px", fontSize: "14px" }}
          />
          <Button type="primary">
            <Link to="/sales-order-approval/quotations/create">Create New Quotation</Link>
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
                  showSearch={true}
                  optionFilterProp="label"
                />
              </InputWithLabel>
              <InputWithLabel label="Customer Name">
                <Select
                  loading={selectOptions.customer_name_loading}
                  value={selected.customer_name}
                  onChange={(value: string) => setSelectedKey("customer_name", value)}
                  style={{ width: "300px" }}
                  placeholder="Select Customer"
                  allowClear
                  options={selectOptions.customer_name}
                  showSearch={true}
                />
                {/* <AutoComplete
                  // loading={selectOptions.customer_name_loading}
                  value={selected.customer_name}
                  onChange={(value: string) => setSelectedKey("customer_name", value)}
                  style={{ width: "300px" }}
                  placeholder="Select Customer"
                  allowClear
                  options={selectOptions.customer_name}
                  filterOption={(inputValue: any, option: any) =>
                    option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                /> */}
              </InputWithLabel>
              <InputWithLabel label="Company Name">
                <Select
                  value={selected.company_name}
                  onChange={(value: string) => setSelectedKey("company_name", value as any)}
                  style={{ width: "120px" }}
                  placeholder="Select Company"
                  options={selectOptions.company_name}
                />
              </InputWithLabel>
            </div>
          </div>
          <Button type="primary" onClick={() => refetch()} disabled={!anythingChanged}>
            Search
          </Button>
        </div>
      )}
      <Table columns={finalColumns} dataSource={data} loading={isLoading} size={tableSize} pagination={PaginationProps} />
    </div>
  );
};
