import { Button, DatePicker, Select, Table, Tabs, Tag, Tooltip } from "antd";
import usePageTitle from "../../Components/usePageTitle";
import { IoMdCloseCircle } from "react-icons/io";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PaginationProps, SOApprovalOptionsMaster } from "./OptionMasters";
import { useEffect, useMemo, useState } from "react";
import InputWithLabel from "../../Components/InputWithLabel";
import dayjs, { Dayjs } from "dayjs";
import { getLastVisitedTimeForSOApprovalFromLocalStorage } from "./EditSalesOrderApproval";
import useFilterOptions from "../../Components/useFilterOptions";
import MyPortal from "../../Components/MyPortal";
import SearchComponent from "../../Components/TableSearch";
import CreateSalesOrderApproval from "./CreateSalesOrderApproval";
import { copyDataToClipboard } from "../../Components/Functions";
import { FaEdit, FaRegCopy } from "react-icons/fa";
import { I_SOApprovalPermissions } from "../../RoleInterfaces";

export interface ISalesOrderApprovalTableItem {
  id: number;
  sono?: string;
  so_status: string;
  customer_name: string;
  product_name: string;
  comments: string;
  assigned_designer: number;
  created_by_username: string;
  assigned_designer_username: string;
  costing_approved: number;
  qa_approved: number;
  is_final_authorized: number;
  designer_approved: number;
  final_qa_approved: number;
  pm_approved: number;
  plant_email_sent: number;
  current_status: string;
}

export interface ISalesOrderApprovalTableProps {
  permissions?: I_SOApprovalPermissions;
  userId: number;
}

type I_CurrentStatusOptionsString = (typeof SOApprovalOptionsMaster.current_status)[number]["value"];

export default function SalesOrderApprovalTable({ permissions = {}, userId }: ISalesOrderApprovalTableProps) {
  usePageTitle("Sales Order Approval | Cian", ["Sales Order Approval", "All"]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const AprrovalIconMap = {
    1: <IoMdCheckmarkCircle style={{ color: "green" }} />,
    0: <IoMdCloseCircle style={{ color: "red" }} />,
    undefined: <IoMdCloseCircle style={{ color: "red" }} />,
    null: <IoMdCloseCircle style={{ color: "red" }} />,
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 50, align: "left" },
    {
      title: "SO Number",
      dataIndex: "sono",
      ellipsis: true,
      width: 47,
      render: (text: string | undefined) => text?.split("/").reverse().join("/"),
      onCell: (record: ISalesOrderApprovalTableItem) => {
        return {
          style: { color: record.sono?.length ? "green" : "#FF9E9E", fontWeight: "500", padding: "3px", textOverflow: "clip" },
        };
      },
      filters: [
        { text: "Cian", value: "MRK" },
        { text: "Dr Smith", value: "DRK" },
      ],
      onFilter: (value: string, record: ISalesOrderApprovalTableItem) => record.sono?.includes(value),
    },
    {
      title: "Date",
      dataIndex: "created_time",
      width: 80,
      render: (date: string) => <span title={dayjs(date).format("Do MMM, YYYY hh:mm:ss a")}>{dayjs(date).format("Do MMM")}</span>,
    },
    {
      title: "SO Status",
      dataIndex: "so_status",
      ellipsis: true,
      width: 70,
      filters: SOApprovalOptionsMaster.so_status.map((status) => ({ text: status.label, value: status.value })),
      onFilter: (value: string, record: ISalesOrderApprovalTableItem) => record.so_status === value,
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      addAutoFilter: true,
      ellipsis: true,
      filterOptionsGeneratorKey: "customer_name",
      addSearch: true,
      width: 150,
      onCell: () => {
        return {
          style: { textOverflow: "clip", color: '#fc6b03', fontWeight: "500"},
        };
      },
    },
    {
      title: "Company",
      dataIndex: "company_name",
      key: "company_name",
      addAutoFilter: true,
      filterOptionsGeneratorKey: "company_name",
      width: 100,
      ellipsis: true,
      addSearch: true,
    },
    {
      title: "Product",
      dataIndex: "product_name",
      addAutoFilter: true,
      ellipsis: true,
      filterOptionsGeneratorKey: "product_name",
      addSearch: true,
      width: 150,
      onCell: (record: ISalesOrderApprovalTableItem) => {
        return {
          style: { textOverflow: "clip", color: 'purple', fontWeight: "500", cursor: "pointer"},
          onClick: () => {
            navigate("/sales-order-approval/edit/" + record.id);
          },
          title: "Click to Edit",
        };
      },
    },
    { title: "Comments", dataIndex: "comments", ellipsis: true, addSearch: true, width: 100 },
    {
      title: "Created By",
      dataIndex: "created_by_username",
      ellipsis: true,
      addAutoFilter: true,
      filterOptionsGeneratorKey: "created_by_username",
      addSearch: true,
      width: 70,
    },
    {
      title: "Designer",
      dataIndex: "assigned_designer_username",
      ellipsis: true,
      filters: SOApprovalOptionsMaster.assigned_designer.map((designer) => ({ text: designer.label, value: designer.value })),
      onFilter: (value: number, record: ISalesOrderApprovalTableItem) => record.assigned_designer === value,
      addSearch: true,
      width: 70,
      hidden: !(permissions?.admin || permissions?.design_admin),
    },
    {
      title: "Costing Approved",
      dataIndex: "costing_approved",
      ellipsis: true,
      width: 80,
      render: (value: 0 | 1) => AprrovalIconMap[value],
      align: "center",
      filters: approveClauseStatuses.map((status) => ({ text: status.label, value: status.value })),
      onFilter: (value: number, record: ISalesOrderApprovalTableItem) => {
        return value === -1 ? true : record.costing_approved === value;
      },
      filterMultiple: false,
    },
    {
      title: "QA Approved",
      dataIndex: "qa_approved",
      ellipsis: true,
      width: 80,
      render: (value: 0 | 1) => AprrovalIconMap[value],
      align: "center",
      filters: approveClauseStatuses.map((status) => ({ text: status.label, value: status.value })),
      onFilter: (value: number, record: ISalesOrderApprovalTableItem) => {
        return value === -1 ? true : record.qa_approved === value;
      },
      filterMultiple: false,
    },
    {
      title: "Final Authorized",
      dataIndex: "is_final_authorized",
      ellipsis: true,
      width: 80,
      render: (value: 0 | 1) => AprrovalIconMap[value],
      align: "center",
      filters: approveClauseStatuses.map((status) => ({ text: status.label, value: status.value })),
      onFilter: (value: number, record: ISalesOrderApprovalTableItem) => {
        return value === -1 ? true : record.is_final_authorized === value;
      },
      filterMultiple: false,
    },
    {
      title: "Designer Approved",
      dataIndex: "designer_approved",
      ellipsis: true,
      width: 80,
      render: (value: 0 | 1) => AprrovalIconMap[value],
      align: "center",
      filters: approveClauseStatuses.map((status) => ({ text: status.label, value: status.value })),
      onFilter: (value: number, record: ISalesOrderApprovalTableItem) => {
        return value === -1 ? true : record.designer_approved === value;
      },
      filterMultiple: false,
    },
    {
      title: "QA Final Approved",
      dataIndex: "final_qa_approved",
      ellipsis: true,
      width: 80,
      render: (value: 0 | 1) => AprrovalIconMap[value],
      align: "center",
      filters: approveClauseStatuses.map((status) => ({ text: status.label, value: status.value })),
      onFilter: (value: number, record: ISalesOrderApprovalTableItem) => {
        return value === -1 ? true : record.final_qa_approved === value;
      },
      filterMultiple: false,
    },
    {
      title: "PM Approved",
      dataIndex: "pm_approved",
      ellipsis: true,
      width: 80,
      render: (value: 0 | 1) => AprrovalIconMap[value],
      align: "center",
      filters: approveClauseStatuses.map((status) => ({ text: status.label, value: status.value })),
      onFilter: (value: number, record: ISalesOrderApprovalTableItem) => {
        return value === -1 ? true : record.pm_approved === value;
      },
      filterMultiple: false,
    },
    {
      title: "Status Current",
      dataIndex: "current_status",
      ellipsis: true,
      render: (status: string) => {
        const data: any = SOApprovalOptionsMaster.current_status.find((option) => option.value === status) || {};
        const color = data?.color || "default";
        const shortName = data?.shortName || "-";
        return (
          <Tooltip title={status}>
            <Tag color={color}>{shortName}</Tag>
          </Tooltip>
        );
      },
      filters: SOApprovalOptionsMaster.current_status.map((status) => ({ text: status.label, value: status.value })),
      onFilter: (value: string, record: ISalesOrderApprovalTableItem) => record.current_status === value,
      width: 80,
      onCell: (_record: ISalesOrderApprovalTableItem) => {
        return {
          style: { textOverflow: "clip" },
        };
      },
    },
    {
      title: "Email Sent",
      dataIndex: "plant_email_sent",
      ellipsis: true,
      width: 80,
      render: (value: 0 | 1) => AprrovalIconMap[value || 0],
      align: "center",
      filters: [
        { text: "Sent", value: 1 },
        { text: "Not Sent", value: 0 },
      ],
      onFilter: (value: 0 | 1, record: ISalesOrderApprovalTableItem) => {
        if (value === 1) {
          return record.plant_email_sent === 1;
        } else if (value === 0) {
          return !record.plant_email_sent;
        }
      },
      filterMultiple: false,
      hidden: !(permissions?.progen_data_entry || permissions?.admin || permissions?.design_admin || permissions?.qa_admin || permissions?.final_qa_admin),
    },
    {
      title: "Action",
      dataIndex: "id",
      render: (id: number) => (
        <div className="my-form-flex row" style={{ gap: "8px" }}>
          <Tooltip title="Edit">
            <Link to={`/sales-order-approval/edit/${id}`} style={{ width: "100%" }}>
              <Button type="primary" size="small" icon={<FaEdit style={{ marginLeft: "2px" }} />} style={{ width: "100%" }}>
                {/* Edit */}
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title="Copy Form Link" placement="bottomLeft">
            <Button
              type="dashed"
              size="small"
              onClick={() => {
                copyDataToClipboard(`${window.location.origin}/sales-order-approval/edit/${id}`);
              }}
              icon={<FaRegCopy style={{ marginRight: "0px" }} />}
              style={{ width: "100%" }}
            >
              {/* Copy Link */}
            </Button>
          </Tooltip>
        </div>
      ),
      align: "center",
      width: 100,
    },
  ].filter((column) => !column.hidden);

  return (
    <div>
      {/* {JSON.stringify(permissions)} */}
      <MyPortal id="navbar-portal">
        <CreateSalesOrderApproval permissions={permissions} />
      </MyPortal>
      <Tabs
        activeKey={searchParams?.get("tab") || "for-me"}
        onChange={(key) => {
          searchParams.set("tab", key);
          setSearchParams(searchParams);
        }}
        type="line"
        destroyInactiveTabPane={true}
        items={[
          {
            key: "for-me",
            label: permissions?.bd
              ? "For Me (BD)"
              : permissions.progen_data_entry
              ? "For Me (Progen Data Entry)"
              : "For Me (Admin)",
            children: (
              <ForMeTable columns={columns} permissions={permissions} userId={userId} tableKey="FOR_ME" />
              // <DefaultTable columns={columns} defaultFilters={ForMeTableFilters} showFilters={false} key="for-me-table" />
            ),
          },
          {
            key: "all",
            label: "All",
            children: (
              <DefaultTable
                columns={columns}
                key="all-table"
                defaultFilters={{
                  date_range: [dayjs().subtract(1, "month"), dayjs()],
                  current_status: ["SO-CONFIRMED", "ADDED-TO-PROGEN", "REQUEST-CHANGES"],
                }}
                tableKey="ALL"
              />
            ),
          },
        ]}
        tabBarExtraContent={<div id="so-apprval-table-tab-bar-extra-content"></div>}
      />
    </div>
  );
}

const approveClauseStatuses = [
  { value: -1, label: "All", color: "purple" },
  { value: 0, label: "Pending", color: "red" },
  { value: 1, label: "Approved", color: "green" },
];

interface I_BackendFilters {
  created_by?: number[];
  current_status?: I_CurrentStatusOptionsString[];
  costing_approved?: number;
  qa_approved?: number;
  is_final_authorized?: number;
  designer_approved?: number;
  final_qa_approved?: number;
  pm_approved?: number;
  date_range?: [Dayjs, Dayjs] | null;
}

interface I_DefaultTableProps {
  tableSize?: "small" | "middle" | "large" | undefined;
  columns: any[];
  defaultFilters?: I_BackendFilters;
  showFilters?: boolean;
  tableKey?: string;
}

const DefaultTable = ({
  tableSize = "small",
  columns,
  defaultFilters,
  showFilters = true,
  // tableKey = "",
}: I_DefaultTableProps) => {
  const [selected, setSelected] = useState<I_BackendFilters>({
    created_by: defaultFilters?.created_by === undefined ? [] : defaultFilters?.created_by,
    current_status: defaultFilters?.current_status === undefined ? [] : defaultFilters?.current_status,
    costing_approved: defaultFilters?.costing_approved === undefined ? -1 : defaultFilters?.costing_approved,
    qa_approved: defaultFilters?.qa_approved === undefined ? -1 : defaultFilters?.qa_approved,
    is_final_authorized: defaultFilters?.is_final_authorized === undefined ? -1 : defaultFilters?.is_final_authorized,
    designer_approved: defaultFilters?.designer_approved === undefined ? -1 : defaultFilters?.designer_approved,
    final_qa_approved: defaultFilters?.final_qa_approved === undefined ? -1 : defaultFilters?.final_qa_approved,
    pm_approved: defaultFilters?.pm_approved === undefined ? -1 : defaultFilters?.pm_approved,
    date_range: defaultFilters?.date_range === undefined ? null : defaultFilters?.date_range,
  });
  const [anythingChanged, setAnythingChanged] = useState(false);
  const setSelectedKey = <K extends keyof typeof selected>(key: K, value: (typeof selected)[K]) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
    setAnythingChanged(true);
  };

  const [selectOptions, setSelectOptions] = useState({
    created_by: [],
    current_status: SOApprovalOptionsMaster.current_status,

    created_by_loading: true,
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

  useEffect(() => {
    if (showFilters) getUserOptions();
  }, []);

  const {
    data: masterState,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["sales-order-approval-list"],
    // queryKey: ["sales-order-approval-list", selected],
    queryFn: async () => {
      // console.log("selected", selected);
      const response = await axios
        .post("/sales-order-approval-table", {
          created_by: selected.created_by,
          current_status: selected.current_status,
          costing_approved: selected.costing_approved,
          qa_approved: selected.qa_approved,
          is_final_authorized: selected.is_final_authorized,
          designer_approved: selected.designer_approved,
          final_qa_approved: selected.final_qa_approved,
          pm_approved: selected.pm_approved,
          from_time: selected.date_range?.[0] ? selected.date_range?.[0].startOf("day").format("YYYY-MM-DD HH:mm:ss") : "",
          to_time: selected.date_range?.[1] ? selected.date_range?.[1].endOf("day").format("YYYY-MM-DD HH:mm:ss") : "",
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          err.handleGlobally?.("SO All Table");
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
          onFilter: (value: string, record: ISalesOrderApprovalTableItem) => {
            return record[column.dataIndex as keyof ISalesOrderApprovalTableItem] === value;
          },
          filterSearch: true,
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
      <MyPortal id="so-apprval-table-tab-bar-extra-content">
        <SearchComponent
          masterState={masterState}
          // state={data}
          setState={setData}
          searchOptions={searchColumns}
          // defaultSearchKeys={searchColumns.map((option) => option.keyName)}
          isLabelInline={true}
        />
      </MyPortal>
      {showFilters && (
        <div className="my-form-flex row" style={{ alignItems: "flex-end" }}>
          <div className="my-form-flex column" style={{ width: "100%" }}>
            <div className="my-form-flex row" style={{ flexWrap: "wrap" }}>
              <InputWithLabel label="Date Range">
                <DatePicker.RangePicker
                  value={selected.date_range}
                  onChange={(value) => setSelectedKey("date_range", value as [Dayjs, Dayjs] | null)}
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
                  style={{ width: "350px" }}
                  placeholder="Select Users"
                  allowClear
                  options={selectOptions.created_by}
                  optionFilterProp="label"
                  maxTagCount={3}
                />
              </InputWithLabel>
              <InputWithLabel label="Current Status">
                <Select
                  mode="multiple"
                  value={selected.current_status}
                  onChange={(value: string[]) => setSelectedKey("current_status", value)}
                  style={{ width: "450px" }}
                  placeholder="Select Status"
                  allowClear
                  maxTagCount={2}
                >
                  {selectOptions.current_status.map((status) => (
                    <Select.Option value={status.value} key={status.value} style={{ color: status.color }}>
                      <Tag color={status.color}>{status.value}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </InputWithLabel>
            </div>
            <div className="my-form-flex row" style={{ flexWrap: "wrap" }}>
              <InputWithLabel label="Costing Approved">
                <Select
                  value={selected.costing_approved}
                  onChange={(value: number) => setSelectedKey("costing_approved", value)}
                  style={{ width: "130px" }}
                  placeholder="Select Status"
                >
                  {approveClauseStatuses.map((status) => (
                    <Select.Option value={status.value} key={status.value} style={{ color: status.color }}>
                      <Tag color={status.color}>{status.label}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </InputWithLabel>
              <InputWithLabel label="QA Approved">
                <Select
                  value={selected.qa_approved}
                  onChange={(value: number) => setSelectedKey("qa_approved", value)}
                  style={{ width: "130px" }}
                  placeholder="Select Status"
                >
                  {approveClauseStatuses.map((status) => (
                    <Select.Option value={status.value} key={status.value} style={{ color: status.color }}>
                      <Tag color={status.color}>{status.label}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </InputWithLabel>
              <InputWithLabel label="Final Authorized">
                <Select
                  value={selected.is_final_authorized}
                  onChange={(value: number) => setSelectedKey("is_final_authorized", value)}
                  style={{ width: "130px" }}
                  placeholder="Select Status"
                >
                  {approveClauseStatuses.map((status) => (
                    <Select.Option value={status.value} key={status.value} style={{ color: status.color }}>
                      <Tag color={status.color}>{status.label}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </InputWithLabel>
              <InputWithLabel label="Designer Approved">
                <Select
                  value={selected.designer_approved}
                  onChange={(value: number) => setSelectedKey("designer_approved", value)}
                  style={{ width: "130px" }}
                  placeholder="Select Status"
                >
                  {approveClauseStatuses.map((status) => (
                    <Select.Option value={status.value} key={status.value} style={{ color: status.color }}>
                      <Tag color={status.color}>{status.label}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </InputWithLabel>
              <InputWithLabel label="Final QA Approved">
                <Select
                  value={selected.final_qa_approved}
                  onChange={(value: number) => setSelectedKey("final_qa_approved", value)}
                  style={{ width: "130px" }}
                  placeholder="Select Status"
                >
                  {approveClauseStatuses.map((status) => (
                    <Select.Option value={status.value} key={status.value} style={{ color: status.color }}>
                      <Tag color={status.color}>{status.label}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </InputWithLabel>
              <InputWithLabel label="PM Approved">
                <Select
                  value={selected.pm_approved}
                  onChange={(value: number) => setSelectedKey("pm_approved", value)}
                  style={{ width: "130px" }}
                  placeholder="Select Status"
                >
                  {approveClauseStatuses.map((status) => (
                    <Select.Option value={status.value} key={status.value} style={{ color: status.color }}>
                      <Tag color={status.color}>{status.label}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </InputWithLabel>
            </div>
          </div>
          <Button type="primary" onClick={() => refetch()} disabled={!anythingChanged}>
            Search
          </Button>
        </div>
      )}
      <Table
        columns={finalColumns}
        dataSource={data}
        loading={isLoading}
        size={tableSize}
        rowClassName={(record) => {
          const last_visited_time = getLastVisitedTimeForSOApprovalFromLocalStorage(record.id);
          if (!last_visited_time) return "table-row-unread";
          return dayjs(last_visited_time).isBefore(record.updated_time) ? "table-row-unread" : "";
        }}
        bordered={true}
        pagination={PaginationProps}
      />
    </div>
  );
};

interface I_ForMeTableProps {
  tableSize?: "small" | "middle" | "large" | undefined;
  columns: any[];
  permissions?: I_SOApprovalPermissions;
  userId: number;
  tableKey: string;
}

const ForMeTable = ({ tableSize = "small", columns = [], permissions = {}, userId, tableKey = "" }: I_ForMeTableProps) => {
  const [resetTableFiltersKey, setResetTableFiltersKey] = useState(1);
  const sessionStorageKey = `so-approval-table-props-${tableKey}`;

  const {
    data: masterState,
    isLoading,
    isRefetching,
    // dataUpdatedAt
  } = useQuery({
    queryKey: ["sales-order-approval-list-form-me"],
    queryFn: async () => {
      const response = await axios
        .get("/sales-order-approval-table-for-me")
        .then((res) => {
          return res;
        })
        .catch((err) => {
          err.handleGlobally?.("For Me table");
          throw err;
        });

      const items = response?.data?.data;
      return items;
    },
    refetchOnWindowFocus: true,
    // refetchInterval: 30000,
  });

  const filterableColumns = useMemo(() => {
    const f = columns.filter((column) => column.addAutoFilter);
    return f.map((column) => column.filterOptionsGeneratorKey);
  }, [columns]);
  const [filterOptions] = useFilterOptions(masterState, filterableColumns);
  const finalColumns = useMemo(() => {
    return columns.map((column) => {
      // if (column.addAutoFilter) {
      //   return {
      //     ...column,
      //     filters: filterOptions[column.filterOptionsGeneratorKey],
      //     onFilter: (value: string, record: ISalesOrderApprovalTableItem) => {
      //       return record[column.dataIndex as keyof ISalesOrderApprovalTableItem] === value;
      //     },
      //     defaultFilteredValue: JSON.parse(sessionStorage.getItem(sessionStorageKey) || "{}").filters?.[column.dataIndex],
      //     filterSearch: true,
      //   };
      // } else {
      //   return column;
      // }
      const toRet = {
        ...column,
      };
      if (column.addAutoFilter) {
        toRet.filters = filterOptions[column.filterOptionsGeneratorKey];
        toRet.onFilter = (value: string, record: ISalesOrderApprovalTableItem) => {
          return record[column.dataIndex as keyof ISalesOrderApprovalTableItem] === value;
        };
        toRet.filterSearch = true;
      }
      toRet.defaultFilteredValue = JSON.parse(sessionStorage.getItem(sessionStorageKey) || "{}").filters?.[column.dataIndex];
      return toRet;
    });
  }, [columns, filterOptions, resetTableFiltersKey]);

  const searchColumns = useMemo(() => {
    const f = columns.filter((column) => column.addSearch);
    return f.map((column) => ({ keyName: column.dataIndex, label: column.title }));
  }, [columns]);
  const [data, setData] = useState(masterState);

  const handleResetTableFilters = () => {
    sessionStorage.removeItem(sessionStorageKey);
    setResetTableFiltersKey((prev) => prev + 1);
  };

  // useEffect(() => {
  //   sessionStorage.removeItem(sessionStorageKey);
  // }, [tableKey]);

  return (
    <>
      <MyPortal id="so-apprval-table-tab-bar-extra-content">
        <div className="my-form-flex row" style={{ gap: "8px" }}>
          {/* last Updated: {dayjs(dataUpdatedAt).fromNow} */}
          <Button type="dashed" style={{ marginRight: "20px" }} onClick={() => handleResetTableFilters()}>
            Reset Filters
          </Button>
          <SearchComponent
            masterState={masterState}
            // state={data}
            setState={setData}
            searchOptions={searchColumns}
            // defaultSearchKeys={searchColumns.map((option) => option.keyName)}
            isLabelInline={true}
          />
        </div>
      </MyPortal>
      {/* {JSON.stringify(permissions)} */}
      <Table
        key={resetTableFiltersKey}
        columns={finalColumns}
        dataSource={data}
        loading={isLoading || isRefetching}
        size={tableSize}
        rowClassName={(record: any) => {
          const last_visited_time = getLastVisitedTimeForSOApprovalFromLocalStorage(record.id);
          if (!last_visited_time) return "table-row-unread";
          return dayjs(last_visited_time).isBefore(record.updated_time) ? "table-row-unread" : "";
        }}
        bordered={true}
        // we will save the filters, sorters and pagination in session storage
        onChange={(pagination, filters, sorter, extra) => {
          console.warn("ADDING TO SESSION STORAGE", { pagination, filters, sorter });
          sessionStorage.setItem(sessionStorageKey, JSON.stringify({ pagination, filters, sorter }));
        }}
        pagination={{
          ...PaginationProps,
          ...JSON.parse(sessionStorage.getItem(sessionStorageKey) || "{}").pagination,
        }}
        rowKey="id"
      />
    </>
  );
};

// const ForMeTableFilters = useMemo(() => {
//   const filters: I_BackendFilters = {
//     created_by: [],
//     current_status: [],
//     costing_approved: -1,
//     designer_approved: -1,
//     pm_approved: -1,
//     qa_approved: -1,
//     is_final_authorized: -1,
//     date_range: null,
//   };
//   console.log("permissions", permissions);
//   if (permissions?.bd) {
//     filters.created_by = [userId];
//     filters.current_status = ["IN-PROGRESS", "SO-CONFIRMED", "REQUEST-CHANGES"];
//   } else if (permissions?.progen_data_entry) {
//     filters.current_status = ["SO-CONFIRMED", "REQUEST-CHANGES"];
//     filters.costing_approved = 1;
//     filters.designer_approved = 1;
//     filters.pm_approved = 1;
//     filters.qa_approved = 1;
//     filters.is_final_authorized = 1;
//   } else if (
//     permissions?.costing_admin ||
//     permissions?.design_admin ||
//     permissions?.pm_admin ||
//     permissions?.qa_admin ||
//     permissions?.final_authorization_admin
//   ) {
//     console.log("permissions-2", permissions);
//     filters.current_status = ["SO-CONFIRMED", "REQUEST-CHANGES"];
//     filters.costing_approved = permissions?.costing_admin ? 0 : -1;
//     filters.designer_approved = permissions?.design_admin ? 0 : -1;
//     filters.pm_approved = permissions?.pm_admin ? 0 : -1;
//     filters.qa_approved = permissions?.qa_admin ? 0 : -1;
//     filters.is_final_authorized = permissions?.final_authorization_admin ? 0 : -1;
//     console.log("filters", filters);
//   } else if (permissions?.admin) {
//     filters.current_status = ["IN-PROGRESS", "SO-CONFIRMED", "REQUEST-CHANGES"];
//   }
//   console.log("filters-2", filters);

//   return filters;
// }, [permissions, userId]);
