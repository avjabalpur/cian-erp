import axios from "axios";
import { useEffect, useRef, useState } from "react";
import InputWithLabel from "../../Components/InputWithLabel";
import { Button, Image, Modal, Popconfirm, Select, Tag, Upload } from "antd";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Document, Page } from "react-pdf";
import { APP_BASE_URL } from "../../constants";
import { FaImage, FaRegFilePdf } from "react-icons/fa";
import { I_SalesOrderApproval } from "./EditSalesOrderApproval";
import imageCompression from "browser-image-compression";
import { I_AuthUser } from "../../Reducers/authReducer";
import { I_SOApprovalPermissions } from "../../RoleInterfaces";

interface i_DocumentsUploadProps {
  id?: number;
  details?: I_SalesOrderApproval;
  permissions?: I_SOApprovalPermissions;
  user?: I_AuthUser;
}
export const DocumentsUpload: React.FC<i_DocumentsUploadProps> = ({ id, details, user }) => {
  const getUploadedDocumnetsProps = useQuery({
    queryKey: ["so-approval-documents", id],
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

      const items = response?.data?.data;
      return items;
    },
  });

  return (
    <div className="my-form-flex" style={{ gap: "30px" }}>
      <UploadFileModal id={id} details={details} />
      <div className="my-form-flex" style={{ gap: "10px", marginTop: "10px", flexWrap: 'wrap' }}>
        <span style={{ fontWeight: "bold" }}>Attcahed Documents</span>
        {getUploadedDocumnetsProps.data?.map((item: any) => {
          return (
            <ViewFileModal
              document_id={item?.document_id}
              file_type={item?.file_type}
              created_by={item?.created_by}
              tag={item?.tag}
              file_name={item?.file_name}
              user={user}
            />
          );
        })}
      </div>
    </div>
  );
};
const UploadFileModal: React.FC<i_DocumentsUploadProps> = ({ id }) => {
  const queryClient = useQueryClient();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [tag, setTag] = useState<string>("screenshot"); // screenshot, artwork, quotation, other
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file: any) => {
    setFileList([file]);
    return false; // prevent auto upload
  };

  const onSubmit = async () => {
    if (fileList.length === 0) {
      toast.warning("Please select a file");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    const file = fileList[0];

    if (file.type === "application/pdf") {
      // setLoading(false);
      // return;
      if (file.size > 1600000) {
        console.log(file.size);
        toast.warning("File size should be less than 1.5MB");
        setLoading(false);
        setFileList([]);
        return;
      } else {
        formData.append("file", file, file.name);
      }
    } else if (file.type.startsWith("image/")) {
      const options = {
        maxSizeMB: 0.7,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      formData.append("file", compressedFile, compressedFile.name);
    } else {
      toast.warning("Invalid file type");
      setLoading(false);
      return;
    }
    await axios
      .post(`/upload-file-so-approval/${id}/${tag}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast.success("File uploaded successfully");
        setUploadVisible(false);
        queryClient.invalidateQueries({ queryKey: ["so-approval-documents"] });
        queryClient.invalidateQueries({ queryKey: ["CHAT-so-approval-documents"] });
      })
      .catch((err) => {
        err.handleGlobally?.("Upload File");
      });
    setLoading(false);
  };

  async function onPaste() {
    try {
      const clipboardItems = await navigator.clipboard.read();
      if (clipboardItems.length === 0 || !clipboardItems[0].types.includes("image/png")) {
        toast.warning("No image found in clipboard");
        return;
      }
      const blob = await clipboardItems[0].getType("image/png");
      const file = new File([blob], "clipboard-image.png", { type: "image/png" });
      setFileList([file]);
    } catch (error) {
      toast.error("Browser does not support clipboard image pasting.");
    }
  }
  return (
    <>
      <div className="my-form-flex" style={{ gap: "30px" }}>
        <Button onClick={() => setUploadVisible(true)}>Upload File</Button>
      </div>
      <Modal
        open={uploadVisible}
        onCancel={() => {
          setUploadVisible(false);
        }}
        title="Upload File"
        onOk={() => {
          onSubmit();
        }}
        confirmLoading={loading}
      >
        <div className="my-form-flex" style={{ gap: "10px", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "100%" }}>
            <Upload.Dragger
              beforeUpload={beforeUpload}
              fileList={fileList}
              maxCount={1}
              onRemove={() => {
                setFileList([]);
              }}
              accept="image/*,application/pdf"
              type="drag"
            >
              <Button danger>Click to Upload</Button>
            </Upload.Dragger>
          </div>
          OR
          <Button type="dashed" danger onClick={onPaste}>
            Paste Image
          </Button>
        </div>
        <InputWithLabel label="Tag" divStyle={{ width: "100%" }}>
          <Select
            value={tag}
            onChange={(value) => {
              setTag(value);
            }}
            style={{ width: "100%" }}
            options={[
              { value: "screenshot", label: "screenshot" },
              { value: "artwork", label: "artwork" },
              { value: "quotation", label: "quotation" },
              { value: "other", label: "other" },
            ]}
          />
        </InputWithLabel>
      </Modal>
    </>
  );
};

interface I_ViewFileModalProps {
  document_id?: number;
  file_type?: string;
  created_by?: number;
  tag?: string;
  file_name?: string;
  chip_content?: React.ReactNode;
  chip_style?: React.CSSProperties;
  user?: I_AuthUser;
}
export const ViewFileModal: React.FC<I_ViewFileModalProps> = ({
  document_id,
  file_type,
  created_by,
  tag,
  file_name,
  chip_content,
  chip_style,
  user,
}) => {
  const [open, setOpen] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const queryClient = useQueryClient();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteFile = async () => {
    setDeleteLoading(true);
    await axios
      .delete("/delete-file-so-approval", {
        params: {
          document_id: document_id,
        },
      })
      .then(() => {
        toast.success("File deleted successfully");
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["so-approval-documents"] });
        queryClient.invalidateQueries({ queryKey: ["CHAT-so-approval-documents"] });
      })
      .catch((err) => {
        err.handleGlobally?.("Delete Document");
      });
    setDeleteLoading(false);
  };

  return (
    <>
      <div
        className="my-form-flex"
        style={{
          boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.75)",
          padding: "5px",
          borderRadius: "5px",
          cursor: "pointer",
          alignItems: "center",
          ...chip_style,
        }}
        onClick={() => {
          setOpen(true);
        }}
      >
        {chip_content ? (
          chip_content
        ) : (
          <>
            {file_type === "application/pdf" ? <FaRegFilePdf /> : <FaImage />}
            <div>{file_name}</div>
            <div style={{ display: "flex", gap: "10px", flexDirection: "column", alignItems: "flex-end" }}>
              <Tag color={"green"}>{tag}</Tag>
            </div>
          </>
        )}
      </div>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        closable={!deleteLoading}
        title={
          <>
            <Tag color="green">{tag}</Tag>
            <b>{file_name}</b>
          </>
        }
        footer={
          <>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              style={{ marginRight: "10px" }}
            >
              Close
            </Button>
            <Popconfirm
              title="Are you sure to delete this file?"
              onConfirm={() => {
                deleteFile();
              }}
              okButtonProps={{ loading: deleteLoading }}
              disabled={deleteLoading || user?.userId !== created_by}
            >
              <Button danger disabled={deleteLoading || user?.userId !== created_by}>
                Delete
              </Button>
            </Popconfirm>
          </>
        }
        width="900px"
      >
        <div style={{ height: "100%", position: "relative" }}>
          {file_type === "application/pdf" ? (
            <Document
              file={`${APP_BASE_URL}/get-sales-order-approval-document-file?document_id=${document_id}`}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  width={800}
                />
              ))}
            </Document>
          ) : (
            <Image
              src={`${APP_BASE_URL}/get-sales-order-approval-document-file?document_id=${document_id}`}
              alt={file_name}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>
      </Modal>
    </>
  );
};
