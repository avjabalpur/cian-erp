import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
// import MDEditor, { commands } from "@uiw/react-md-editor";
import { Button, Divider, Dropdown, Image, Input, MenuProps, Popover, Spin, Tag } from "antd";
import { LuSendHorizonal } from "react-icons/lu";
import { IoDocument, IoPerson, IoSettings } from "react-icons/io5";
import { BiSolidCommentDetail } from "react-icons/bi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CreateDiffTable, approvalTypeToRoleName } from "./SalesOrderSaveDiff";
import { I_ColumnInfo } from "./EditSalesOrderApproval";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ViewFileModal } from "./DocumentsUpload";
import { FaRegFilePdf } from "react-icons/fa";
import { APP_BASE_URL } from "../../constants";
import { SOApprovalOptionsMaster } from "./OptionMasters";
import { toast } from "react-toastify";
dayjs.extend(relativeTime);

interface ChatComment {
  comment: string;
  created_time: string;
  created_by_username: string;
}

interface SoApprovalChatCommentsProps {
  id: number;
  layoutDetailsInfo: { [key: string]: I_ColumnInfo };
  lastReadTime?: string;
}

interface ChatCommentSettings {
  showChatComments: boolean;
  showApprovalComments: boolean;
  showSaveHistory: boolean;
  showQuotations: boolean;
  showDocuments: boolean;
  showPerformaInvoices: boolean; // added
  [key: string]: boolean;
}
const localStorageSettingsKey = "so-approval-chat-comment-settings";
const SoApprovalChatComments: React.FC<SoApprovalChatCommentsProps> = ({ id, layoutDetailsInfo, lastReadTime }) => {
  const localStorageSettings = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(localStorageSettingsKey) || "{}");
    } catch (error) {
      return {};
    }
  }, []);
  const [settings, setSettings] = useState<ChatCommentSettings>({
    showChatComments: localStorageSettings?.showChatComments ?? true,
    showApprovalComments: localStorageSettings?.showApprovalComments ?? true,
    showSaveHistory: localStorageSettings?.showSaveHistory ?? true,
    showQuotations: localStorageSettings?.showQuotations ?? true,
    showDocuments: localStorageSettings?.showDocuments ?? true,
    showPerformaInvoices: localStorageSettings?.showPerformaInvoices ?? true, // added
  });
  const setSettingsKey = (key: keyof ChatCommentSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    localStorage.setItem(localStorageSettingsKey, JSON.stringify({ ...settings, [key]: value }));
  };

  const [newChatComment, setNewChatComment] = useState("");
  const chatEndRef = useRef<null | HTMLDivElement>(null);
  const lastReadTimeDivRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: chatComments, isLoading: chatCommentsLoading, isRefetching: chatCommentsReFetching } = useQuery<ChatComment[]>({
    queryKey: ["CHAT-so-approval-chat-comments", id],
    queryFn: async () => {
      const response = await axios
        .get("/get-sales-order-approval-chat-comments", {
          params: {
            sales_order_approval_id: id,
          },
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          err.handleGlobally?.("Chat Comments");
          throw err;
        });
      return response?.data?.data.map((d: any) => ({ ...d, row_type: "chat" }));
    },
    enabled: settings.showChatComments,
  });

  const { data: approvalComments, isLoading: approvalCommentsLoading, isRefetching: approvalCommentsReFetching } = useQuery({
    queryKey: ["CHAT-so-approval-comments", id],
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
    enabled: settings.showApprovalComments,
  });

  const { data: saveComments, isLoading: saveCommentsLoading, isRefetching: saveCommentsReFetching } = useQuery({
    queryKey: ["CHAT-so-approval-save-history", id],
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
      var final_res: any = [];
      response?.data?.data?.forEach((d: any) => {
        // console.log("shlok d", d);
        let diff: any = {};
        try {
          diff = JSON.parse(d.diff?.replace(/\n/g, '\\n'));
        } catch (error) {
          console.log("ERROR IN PARSING JSON", error, d.diff);
          diff = {
            "ERROR IN PARSING JSON": { p: "ERROR IN PARSING JSON", n: "ERROR IN PARSING JSON"}
          };
        }
        // console.log("shlok d2", d);
        final_res.push({ ...d, row_type: "saveHistory", diff: diff });
        if (diff?.current_status) {
          final_res.push({
            row_type: "status-change",
            previous_status: diff?.current_status?.p,
            current_status: diff?.current_status?.n,
            created_by_username: d.created_by_username,
            created_time: dayjs(d.created_time).add(1, "second").format(),
          });
        }
      });
      // console.log("final_res", final_res);
      return final_res;
    },
    enabled: settings.showSaveHistory,
  });

  const { data: quotationsData, isLoading: quotationsLoading, isRefetching: quotationsReFetching } = useQuery({
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
      // return response?.data?.data.map((d: any) => ({ ...d, row_type: "quotation" }));

      // To only show latest quotation
      return response?.data?.data.length > 0
        ? [
            {
              ...response?.data?.data[0],
              row_type: "quotation",
            },
          ]
        : [];
    },
    enabled: settings.showQuotations,
  });

  const { data: documentsData, isLoading: documentsLoading, isRefetching: documentsReFetching } = useQuery({
    queryKey: ["CHAT-so-approval-documents", id],
    queryFn: async () => {
      const response = await axios
        .get("/get-sales-order-approval-documents-by-id", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          err.handleGlobally?.("Get Documents");
          throw err;
        });

      return response?.data?.data.map((d: any) => ({ ...d, row_type: "document" }));
    },
    enabled: settings.showDocuments,
  });

  // Add new query for Performa Invoices
  const { data: performaInvoiceData, isLoading: performaInvoiceLoading, isRefetching: performaInvoiceReFetching } = useQuery({
    queryKey: ["so-approval-related-performa-invoices", id],
    queryFn: async () => {
      const response = await axios
        .get("/get-related-performa-invoices-by-so-approval-id", {
          params: { sales_order_approval_id: id },
        })
        .then((res) => res)
        .catch((err) => {
          err.handleGlobally?.("Related Performa Invoices");
          throw err;
        });
      return response?.data?.data.length > 0
        ? [
            {
              ...response.data.data[0],
              row_type: "performaInvoice",
            },
          ]
        : [];
    },
    enabled: settings.showPerformaInvoices,
  });

  const finalData = useMemo(() => {
    let f = [
      ...(settings.showChatComments ? chatComments || [] : []), // chatComments
      ...(settings.showApprovalComments ? approvalComments || [] : []), // approvalComments
      ...(settings.showSaveHistory ? saveComments || [] : []), // saveComments
      ...(settings.showQuotations ? quotationsData || [] : []), // quotationsData
      ...(settings.showDocuments ? documentsData || [] : []), // documentsData
      ...(settings.showPerformaInvoices ? performaInvoiceData || [] : []), // added
      {
        row_type: "last-read-time",
        created_time: lastReadTime,
      }
    ];
    f.sort((a, b) => dayjs(a.created_time).unix() - dayjs(b.created_time).unix());
    return f;
  }, [chatComments, approvalComments, saveComments, quotationsData, documentsData, performaInvoiceData, settings, lastReadTime]);
  const fetching = chatCommentsLoading || approvalCommentsLoading || saveCommentsLoading || quotationsLoading || documentsLoading || performaInvoiceLoading;
  const refetching = chatCommentsReFetching || approvalCommentsReFetching || saveCommentsReFetching || quotationsReFetching || documentsReFetching || performaInvoiceReFetching;

  const addNewChatComment = async () => {
    if (newChatComment.trim() === "") {
      toast.info("Comment cannot be empty");
      return;
    }
    setLoading(true);
    await axios
      .post("/add-sales-order-approval-chat-comment", {
        sales_order_approval_id: id,
        comment: newChatComment,
      })
      .then((res) => {
        setNewChatComment("");
        queryClient.invalidateQueries({ queryKey: ["CHAT-so-approval-chat-comments"] });
      })
      .catch((err) => {
        err.handleGlobally?.("Adding Chat Comment");
      });
    setLoading(false);
  };

  // useEffect(() => {
  //   if (chatEndRef.current) {
  //     chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [finalData]);
  useEffect(() => {
    if (lastReadTimeDivRef?.current) {
      setTimeout(() => {
        lastReadTimeDivRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [finalData, lastReadTime, lastReadTimeDivRef]);

  const getTimeFormat = (timeString: string) => {
    return dayjs(timeString).format("Do MMM, hh:mm a");
  };

  const conditionalRender = (row: any) => {
    if (row.row_type === "chat") {
      return (
        <div key={row.created_time} className="chat-container">
          <div className="chat-person-time">
            <span className="chat-icon-text">
              <IoPerson />
              {row.created_by_username}
            </span>
            <span style={{ fontSize: "12px" }} title={dayjs(row.created_time).format("Do MMM, YY [at] hh:mm a")}>
              {getTimeFormat(row.created_time)}
            </span>
          </div>
          <div className="chat-comment">
            <BiSolidCommentDetail style={{ marginTop: "6px", flexShrink: 0 }} />
            {row.comment}
          </div>
        </div>
      );
    } else if (row.row_type === "comment") {
      return (
        <div
          key={row.created_time}
          className="chat-container"
          style={{
            background: row?.status === "APPROVE" ? "#B7EB8F" : "#D3ADF7",
          }}
        >
          <div className="chat-person-time" style={{ border: "none" }}>
            <span className="chat-icon-text">
              <Tag color={row?.status === "APPROVE" ? "green" : "purple"} title={row?.status}>
                {row?.status}
              </Tag>
            </span>
            <span>
              <Tag style={{ marginRight: "0" }} color="geekblue-inverse">
                {approvalTypeToRoleName?.[row.type] || row.type}
              </Tag>
            </span>
          </div>
          <div className="chat-person-time">
            <span className="chat-icon-text">
              <IoPerson />
              {row.created_by_username}
            </span>
            <span style={{ fontSize: "12px" }} title={dayjs(row.created_time).format("Do MMM, YY [at] hh:mm a")}>
            {getTimeFormat(row.created_time)}
            </span>
          </div>
          <div className="chat-comment">
            <BiSolidCommentDetail style={{ marginTop: "6px", flexShrink: 0 }} />
            {row.comments}
          </div>
        </div>
      );
    } else if (row.row_type === "saveHistory") {
      return (
        <Popover
          content={<CreateDiffTable diff={row.diff} layoutDetailsInfo={layoutDetailsInfo} />}
          title={
            <div style={{ display: "inline-flex", gap: "10px", alignItems: "center" }}>
              <Tag color="blue" style={{ marginRight: "0" }} icon={<BsFillPersonLinesFill />}>
                {row.created_by_username}
              </Tag>
              <>Saved at</>
              <Tag color="blue">{dayjs(row.created_time).format("Do MMM YY, HH:mm a")}</Tag>
            </div>
          }
          placement="left"
          trigger={["click"]}
        >
          <Divider
            style={{ margin: "0" }}
            key={row.created_time}
            orientation="left"
            // title="Click to See changes"
          >
            <div
              style={{ width: "100%", display: "inline-flex", alignItems: "center", cursor: "pointer" }}
              title="Click to See changes"
            >
              <Tag color="blue">
                <span className="chat-icon-text">
                  <IoPerson />
                  {row.created_by_username}
                </span>
              </Tag>
              <span style={{ fontSize: "12px" }}>Saved</span>
              <Tag style={{ marginLeft: "12px" }}>
                <span style={{ fontSize: "12px" }} title={dayjs(row.created_time).format("Do MMM, YY [at] hh:mm a")}>
                  {getTimeFormat(row.created_time)}
                </span>
              </Tag>
            </div>
          </Divider>
        </Popover>
      );
    } else if (row.row_type === "status-change") {
      return (
        <Divider
          style={{ margin: "0" }}
          key={row.created_time}
          orientation="center"
          // title="Click to See changes"
        >
          <Tag
            style={{ marginLeft: "12px", fontSize: "18px", height: "23px" }}
            color={SOApprovalOptionsMaster.current_status?.find((d: any) => d.value === row.current_status)?.color}
          >
            {row.current_status}
          </Tag>
        </Divider>
      );
    } else if (row.row_type === "quotation") {
      return (
        <div key={row.created_time} className="chat-container" style={{ flexDirection: "row", background: "#F29B9B" }}>
          <IoDocument style={{ fontSize: "20px" }} />
          <Link to={`/sales-order-approval/quotations/${row.quotation_id}`} target="_blank" style={{ marginLeft: "5px" }}>
            <Tag color="blue">Quotation #{row.quotation_id}</Tag>
          </Link>
          |
          <Tag color="blue" style={{ marginLeft: "5px" }}>
            <span className="chat-icon-text">
              <IoPerson />
              {row.created_by_username}
            </span>
          </Tag>
          <Tag color="yellow">
            <span style={{ fontSize: "12px" }} title={dayjs(row.created_time).format("Do MMM, YY [at] hh:mm a")}>
              {getTimeFormat(row.created_time)}
            </span>
          </Tag>
        </div>
      );
    } else if (row.row_type === "document") {
      return (
        <div key={row.created_time} className="chat-container">
          <div className="chat-person-time">
            <span className="chat-icon-text">
              <IoPerson />
              {row.created_by_username}
            </span>
            <span style={{ fontSize: "12px" }} title={dayjs(row.created_time).format("Do MMM, YY [at] hh:mm a")}>
              <Tag color={"green"}>{row.tag}</Tag>
              {getTimeFormat(row.created_time)}
            </span>
          </div>
          <div className="chat-comment">
            {row?.file_type === "application/pdf" ? (
              <ViewFileModal
                document_id={row?.document_id}
                file_type={row?.file_type}
                tag={row?.tag}
                file_name={row?.file_name}
                chip_content={
                  <>
                    <FaRegFilePdf />
                    {row?.file_name}
                  </>
                }
                chip_style={{ background: "#fff", color: "var(--primary-text-color)", boxShadow: "none", width: "100%" }}
              />
            ) : (
              <Image
                src={`${APP_BASE_URL}/get-sales-order-approval-document-file?document_id=${row.document_id}`}
                alt={row.file_name}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </div>
        </div>
      );
    } else if (row.row_type === "performaInvoice") { // added block
      return (
        <div key={row.created_time} className="chat-container" style={{ flexDirection: "row", background: "#F29B9B" }}>
          <IoDocument style={{ fontSize: "20px" }} />
          <Link to={`/sales-order-approval/performa-invoices/${row.performa_invoice_id}`} target="_blank" style={{ marginLeft: "5px" }}>
            <Tag color="blue">Performa Invoice #{row.performa_invoice_id}</Tag>
          </Link>
          |
          <Tag color="blue" style={{ marginLeft: "5px" }}>
            <span className="chat-icon-text">
              <IoPerson /> {row.created_by_username}
            </span>
          </Tag>
          <Tag color="yellow">
            <span style={{ fontSize: "12px" }} title={dayjs(row.created_time).format("Do MMM, YY [at] hh:mm a")}>
              {getTimeFormat(row.created_time)}
            </span>
          </Tag>
        </div>
      );
    } else if (row.row_type === "last-read-time") {
      return (
        <div key={row.created_time} className="last-read-box" ref={lastReadTimeDivRef}>
          Last Read
        </div>
      );
    }
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "",
        position: "relative",
        borderLeft: "0px solid var(--primary-text-color)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "20px",
          borderBottom: "2px solid var(--primary-text-color)",
          padding: "0 10px",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Chat Comments</span>
        <Spin spinning={fetching || refetching} size="small" style={{ marginLeft: "10px" }} />
        {/* Dropdown for Settings */}
        <Dropdown
          menu={{
            items: [
              {
                key: "showChatComments",
                label: "Chat Comments",
                icon: <BiSolidCommentDetail />,
              },
              {
                key: "showApprovalComments",
                label: "Approval Comments",
                icon: <BiSolidCommentDetail />,
              },
              {
                key: "showSaveHistory",
                label: "Save History",
                icon: <BiSolidCommentDetail />,
              },
              {
                key: "showQuotations",
                label: "Quotations",
                icon: <IoDocument />,
              },
              {
                key: "showPerformaInvoices", // added
                label: "Performa Invoices",
                icon: <IoDocument />,
              },
              {
                key: "showDocuments",
                label: "Documents",
                icon: <IoDocument />,
              },
            ],
            selectable: true,
            multiple: true,
            selectedKeys: Object.keys(settings).filter((key: any) => settings[key]),
            onSelect: (info) => {
              console.log(info);
              setSettingsKey(info.key as keyof ChatCommentSettings, true);
            },
            onDeselect: (info) => {
              console.log(info);
              setSettingsKey(info.key as keyof ChatCommentSettings, false);
            },
          }}
        >
          <IoSettings style={{ fontSize: "20px", cursor: "pointer" }} />
        </Dropdown>
      </div>
      <div
        style={{
          width: "100%",
          height: "calc(100% - 100px)",
          display: "inline-flex",
          flexDirection: "column",
          overflow: "auto",
          gap: "10px",
          boxSizing: "border-box",
          padding: "20px 0px",
        }}
      >
        {
          !fetching &&
          finalData?.map((row) => conditionalRender(row))
        }
        <div ref={chatEndRef} />
      </div>
      <div
        style={{
          zIndex: 100,
          background: "#fff",
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          display: "inline-flex",
          justifyContent: "space-between",
          borderTop: "2px solid var(--primary-text-color)",
        }}
      >
        <Input.TextArea
          value={newChatComment}
          onChange={(e) => setNewChatComment(e.target.value)}
          style={{ width: "100%", height: "100px", fontWeight: "bold" }}
          autoSize={{ minRows: 3, maxRows: 3 }}
          placeholder="Type your comment here..."
          // It should have no border, no padding, no margin, no resize, no outline, no box-shadow
          bordered={false}
          disabled={loading}
        />
        <Button
          icon={<LuSendHorizonal />}
          type="text"
          onClick={addNewChatComment}
          disabled={loading}
          loading={loading}
          style={{ color: "var(--primary-text-color)", fontWeight: "bold", fontSize: "20px", padding: "0 10px", width: "auto" }}
        />
        {/* <MDEditor
          value={newChatComment}
          onChange={setNewChatComment}
          style={{ width: "100%", height: '100px' }}
          // loading={loading || dataLoading}
          // disabled={loading || dataLoading}
          commands={[commands.codeEdit, commands.codePreview]}
          extraCommands={[
            commands.bold,
            commands.italic,
            commands.strikethrough,
            commands.hr,
            // commands.divider,
            // commands.group([commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6], {
            //     name: 'title',
            //     groupName: 'title',
            //     buttonProps: { 'aria-label': 'Insert title' },
            // }),
            commands.divider,
            commands.link,
            commands.quote,
            commands.divider,
            commands.code,
            commands.divider,
            commands.unorderedListCommand,
            commands.orderedListCommand,
            commands.checkedListCommand,
          ]}
          data-color-mode="light"
          preview="edit"
          previewOptions={{
            disallowedElements: ["h1", "h2", "h3", "h4", "h5", "h6", "a"],
            rawSourcePos: true,
          }}
        /> */}
      </div>
    </div>
  );
};

export default SoApprovalChatComments;

// This will be a modal which will contain 5 Checkboxe
